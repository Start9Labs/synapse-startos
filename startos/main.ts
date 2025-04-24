import { sdk } from './sdk'
import { T } from '@start9labs/start-sdk'
import { adminPort, homeserverPort, nginxPort } from './utils'
import { homeserverYaml } from './file-models/homeserver.yml'
import { homeserverLogConfig } from './file-models/homeserver.log.config'
import * as fs from 'node:fs/promises'

export const main = sdk.setupMain(async ({ effects, started }) => {
  /**
   * ======================== Setup (optional) ========================
   *
   * In this section, we fetch any resources or run any desired preliminary commands.
   */
  console.info('Starting Synapse!')

  // Merge to homeserver.yaml to enforce file model protections
  await homeserverYaml.merge(effects, {})
  await homeserverLogConfig.merge(effects, {})
  const subcontainer = await sdk.SubContainer.of(
    effects,
    { imageId: 'synapse' },
    sdk.Mounts.of().addVolume('main', null, '/data', false),
    'synapse',
  )
  await subcontainer
    .exec(['chown', '-R', '991:991', '/data'])
    .then((a) => a.throw())

  const smtp = await sdk.store.getOwn(effects, sdk.StorePath.smtp).const()
  const creds =
    smtp.selection === 'disabled'
      ? null
      : smtp.selection === 'custom'
        ? smtp.value
        : await sdk.getSystemSmtp(effects).const()

  if (creds) {
    const { server, port, from, login, password } = creds
    await homeserverYaml.merge(effects, {
      email: {
        enable_notifs: true,
        require_transport_security: true,
        notif_from:
          (smtp.selection === 'system' && smtp.value.customFrom) || from,
        smtp_host: server,
        smtp_port: port,
        smtp_user: login,
        smtp_pass: password || undefined,
      },
    })
  } else {
    await homeserverYaml.merge(effects, {
      email: null,
    })
  }

  // Read from homeserver.yaml with const() to ensure service restart if the file changes
  const config = await homeserverYaml.read.const(effects)

  // create and configure nginx container
  const nginxContainer = await sdk.SubContainer.of(
    effects,
    { imageId: 'nginx' },
    sdk.Mounts.of().addAssets('synapse-admin', '/var/www/html'),
    'nginx',
  )
  fs.writeFile(
    `${nginxContainer.rootfs}/etc/nginx/conf.d/default.conf`,
    `
server {
    listen       ${nginxPort};
    listen       [::]:${nginxPort};
    server_name  _;

    location = /.well-known/matrix/server {
        default_type application/json;
        return 200 '{ "m.server": "${config?.server_name}:443" }';
    }

    location ~* ^(\/_matrix|\/_synapse\/client|\/_synapse\/admin) {
        proxy_pass http://localhost:8008;
        client_max_body_size 50M; # TODO: make this configurable
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

    location / {
        try_files $uri $uri/ =404;
    }

    location = /config.json {
        default_type application/json;
        return 200 '{ "restrictBaseUrl": "https://${config?.server_name}" }';
    }

    error_page   500 502 503 504  /50x.html;
    location = /50x.html {
        root   /usr/share/nginx/html;
    }
}
`,
  )

  /**
   * ======================== Additional Health Checks (optional) ========================
   *
   * In this section, we define *additional* health checks beyond those included with each daemon (below).
   */
  const additionalChecks: T.HealthCheck[] = []

  /**
   * ======================== Daemons ========================
   *
   * In this section, we create one or more daemons that define the service runtime.
   *
   * Each daemon defines its own health check, which can optionally be exposed to the user.
   */
  return sdk.Daemons.of(effects, started, additionalChecks)
    .addDaemon('synapse', {
      subcontainer,
      command: ['/start.py'],
      ready: {
        display: 'Homeserver',
        gracePeriod: 10000,
        fn: () =>
          sdk.healthCheck.checkWebUrl(
            effects,
            `http://localhost:${homeserverPort}/health`,
            {
              successMessage: 'Your Synapse homeserver is ready',
              errorMessage: 'Your Synapse homeserver cannot be reached',
            },
          ),
      },
      requires: [],
    })
    .addDaemon('nginx', {
      subcontainer: nginxContainer,
      command: sdk.useEntrypoint(),
      ready: {
        display: 'Web Server',
        fn: () =>
          sdk.healthCheck.checkPortListening(effects, 80, {
            errorMessage: 'Web Server is not running',
            successMessage: 'Web Server is running',
          }),
      },
      requires: ['synapse'],
    })
})
