import { writeFile } from 'fs/promises'
import { homeserverYaml } from './fileModels/homeserver.yml'
import { storeJson } from './fileModels/store.json'
import { i18n } from './i18n'
import { sdk } from './sdk'
import {
  adminPort,
  checkPostgresReady,
  getPostgresEnv,
  getPostgresSub,
  homeserverPort,
  mount,
  nginxPort,
} from './utils'

export const main = sdk.setupMain(async ({ effects }) => {
  /**
   * ======================== Setup (optional) ========================
   *
   * In this section, we fetch any resources or run any desired preliminary commands.
   */
  console.info(i18n('Starting Synapse!'))

  // Read from homeserver.yaml with const() to ensure service restart if the file changes
  const config = await homeserverYaml.read().const(effects)
  if (!config) {
    throw new Error(i18n('homeserver.yaml not found'))
  }

  await storeJson.merge(effects, { serverStarted: true })

  const smtp = await storeJson.read((s) => s.smtp).const(effects)
  if (smtp && smtp.selection !== 'disabled') {
    if (smtp.selection === 'system') {
      const creds = await sdk.getSystemSmtp(effects).const()
      if (creds) {
        await homeserverYaml.merge(effects, {
          email: {
            enable_notifs: true,
            require_transport_security: true,
            notif_from: smtp.value.customFrom || creds.from,
            smtp_host: creds.host,
            smtp_port: creds.port,
            smtp_user: creds.username,
            smtp_pass: creds.password || undefined,
          },
        })
      }
    } else {
      const p = smtp.value.provider.value
      await homeserverYaml.merge(effects, {
        email: {
          enable_notifs: true,
          require_transport_security: true,
          notif_from: p.from,
          smtp_host: p.host,
          smtp_port: Number(p.security.value.port),
          smtp_user: p.username,
          smtp_pass: p.password || undefined,
        },
      })
    }
  }

  // create and configure nginx container
  const nginxSub = await sdk.SubContainer.of(
    effects,
    { imageId: 'nginx' },
    sdk.Mounts.of().mountAssets({
      subpath: 'synapse-admin',
      mountpoint: '/var/www/html',
    }),
    'nginx',
  )

  await writeFile(
    `${nginxSub.rootfs}/etc/nginx/conf.d/default.conf`,
    `server {
    listen ${nginxPort} default_server;
    listen [::]:${nginxPort} default_server;
    server_name  _;

    location = /.well-known/matrix/server {
        default_type application/json;
        return 200 '{ "m.server": "${config.server_name}:443" }';
    }

    location = /.well-known/matrix/client {
        default_type application/json;
        return 200 '{ "m.homeserver": { "base_url": "https://${config.server_name}" } }';
    }

    location / {
        proxy_pass http://localhost:8008;
    }

    location ~* ^(\/_matrix|\/_synapse\/client|\/_synapse\/admin) {
        proxy_pass http://localhost:8008;
        client_max_body_size ${config.max_upload_size};
    }

    error_page   500 502 503 504  /50x.html;
    location = /50x.html {
        root   /usr/share/nginx/html;
    }
}

server {
    listen       ${adminPort};
    listen       [::]:${adminPort};
    server_name  _;

    root /var/www/html;
    index index.html index.htm;

    location = /config.json {
        default_type application/json;
        return 200 '{ "restrictBaseUrl": "https://$http_host" }';
    }

    location = /.well-known/matrix/client {
        default_type application/json;
        return 200 '{ "m.homeserver": { "base_url": "https://$http_host" } }';
    }

    location ~* ^(\/_matrix|\/_synapse) {
        proxy_pass http://localhost:${homeserverPort};
        client_max_body_size ${config.max_upload_size};
    }

    location / {
        try_files $uri $uri/ =404;
    }

    error_page   500 502 503 504  /50x.html;
    location = /50x.html {
        root   /usr/share/nginx/html;
    }
}`,
  )

  /**
   * ======================== Daemons ========================
   *
   * In this section, we create one or more daemons that define the service runtime.
   *
   * Each daemon defines its own health check, which can optionally be exposed to the user.
   */

  const synapseSub = await sdk.SubContainer.of(
    effects,
    { imageId: 'synapse' },
    mount,
    'synapse-sub',
  )

  const postgresSub = await getPostgresSub(effects, 'postgres-sub')

  return sdk.Daemons.of(effects)
    .addOneshot('chown', {
      subcontainer: synapseSub,
      exec: { command: ['chown', '-R', '991:991', '/data'] },
      requires: [],
    })
    .addDaemon('postgres', {
      subcontainer: postgresSub,
      exec: {
        command: sdk.useEntrypoint(['-c', 'listen_addresses=127.0.0.1']),
        env: getPostgresEnv(config.database.args.password),
      },
      ready: {
        display: i18n('Database'),
        fn: () => checkPostgresReady(postgresSub),
      },
      requires: [],
    })
    .addDaemon('synapse', {
      subcontainer: synapseSub,
      exec: { command: ['/start.py'] },
      ready: {
        display: i18n('Homeserver'),
        gracePeriod: 15000,
        fn: () =>
          sdk.healthCheck.checkWebUrl(
            effects,
            `http://localhost:${homeserverPort}/health`,
            {
              successMessage: i18n('Your Synapse homeserver is ready'),
              errorMessage: i18n('Your Synapse homeserver cannot be reached'),
            },
          ),
      },
      requires: ['chown', 'postgres'],
    })
    .addDaemon('nginx', {
      subcontainer: nginxSub,
      exec: { command: sdk.useEntrypoint() },
      ready: {
        display: null,
        fn: () =>
          sdk.healthCheck.checkPortListening(effects, nginxPort, {
            errorMessage: i18n('Web Server is not running'),
            successMessage: i18n('Web Server is running'),
          }),
      },
      requires: ['synapse'],
    })
    .addHealthCheck('admin-interface', {
      ready: {
        display: i18n('Admin Dashboard'),
        fn: () =>
          sdk.healthCheck.checkWebUrl(
            effects,
            `http://localhost:${adminPort}`,
            {
              successMessage: i18n('Running'),
              errorMessage: i18n('Unreachable'),
            },
          ),
      },
      requires: ['nginx'],
    })
})
