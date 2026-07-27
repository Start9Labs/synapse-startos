import { T } from '@start9labs/start-sdk'
import { writeFile } from 'fs/promises'
import { homeserverYaml } from './fileModels/homeserver.yml'
import { storeJson } from './fileModels/store.json'
import { i18n } from './i18n'
import { sdk } from './sdk'
import {
  adminPort,
  homeserverPort,
  mount,
  nginxPort,
  postgresDb,
  postgresUser,
} from './utils'

export const main = sdk.setupMain(async ({ effects }) => {
  /**
   * ======================== Setup (optional) ========================
   *
   * In this section, we fetch any resources or run any desired preliminary commands.
   */
  console.info(i18n('Starting Synapse!'))

  // Watched scoped rather than whole-store: the apply-admin-password oneshot
  // below clears pendingAdminPassword, which a whole-store watch would treat
  // as a change and restart on.
  const smtp = await storeJson.read((s) => s.smtp).const(effects)
  if (!smtp) {
    throw new Error('store.json not found')
  }

  let smtpCredentials: T.SmtpValue | null = null
  if (smtp.selection === 'system') {
    smtpCredentials = await sdk.getSystemSmtp(effects).const()
    const customFrom = smtp.value.customFrom
    if (smtpCredentials && customFrom) smtpCredentials.from = customFrom
  } else if (smtp.selection === 'custom') {
    const { from, host, security, username, password } =
      smtp.value.provider.value
    smtpCredentials = {
      from,
      host,
      port: Number(security.value.port),
      username,
      password,
      security: security.selection === 'tls' ? 'tls' : 'starttls',
    }
  }

  await homeserverYaml.merge(effects, {
    email: smtpCredentials && {
      enable_notifs: true,
      require_transport_security: true,
      notif_from: smtpCredentials.from,
      smtp_host: smtpCredentials.host,
      smtp_port: smtpCredentials.port,
      smtp_user: smtpCredentials.username,
      smtp_pass: smtpCredentials.password || undefined,
    },
  })

  // Read from homeserver.yaml with const() to ensure service restart if the file changes
  const config = await homeserverYaml.read().const(effects)
  if (!config) {
    throw new Error('homeserver.yaml not found')
  }

  const pendingAdminPassword = await storeJson
    .read((s) => s.pendingAdminPassword)
    .once()

  // create and configure nginx container
  const nginxSub = sdk.SubContainer.of(
    effects,
    { imageId: 'nginx' },
    sdk.Mounts.of().mountAssets({
      subpath: 'synapse-admin',
      mountpoint: '/var/www/html',
    }),
    'nginx',
  )

  const nginxRootfs = await nginxSub.rootfs
  await writeFile(
    `${nginxRootfs}/etc/nginx/conf.d/default.conf`,
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

  const synapseSub = sdk.SubContainer.of(
    effects,
    { imageId: 'synapse' },
    mount,
    'synapse-sub',
  )

  const postgresSub = sdk.SubContainer.of(
    effects,
    { imageId: 'postgres' },
    sdk.Mounts.of().mountVolume({
      volumeId: 'db',
      subpath: null,
      mountpoint: '/var/lib/postgresql',
      readonly: false,
    }),
    'postgres-sub',
  )

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
        env: {
          POSTGRES_USER: postgresUser,
          POSTGRES_PASSWORD: config.database.args.password,
          POSTGRES_DB: postgresDb,
          POSTGRES_INITDB_ARGS: '--encoding=UTF8 --locale=C',
        },
      },
      ready: {
        display: i18n('Database'),
        fn: async () => {
          const { exitCode } = await postgresSub.exec([
            'pg_isready',
            '-U',
            postgresUser,
            '-d',
            postgresDb,
            '-h',
            '127.0.0.1',
          ])
          if (exitCode !== 0) {
            return {
              result: 'loading' as const,
              message: i18n('Initializing Postgres'),
            }
          }
          return { result: 'success' as const, message: null }
        },
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
    .addOneshot('apply-admin-password', {
      subcontainer: synapseSub,
      exec: {
        fn: async (subc) => {
          if (!pendingAdminPassword) return null

          const PGPASSWORD = config.database.args.password
          const userCount = parseInt(
            (
              await sdk.SubContainer.withTemp(
                effects,
                { imageId: 'postgres' },
                sdk.Mounts.of(),
                'count-users',
                (psql) =>
                  psql.execFail(
                    [
                      'psql',
                      '-h',
                      '127.0.0.1',
                      '-U',
                      postgresUser,
                      '-d',
                      postgresDb,
                      '-tAc',
                      'SELECT COUNT(*) FROM users',
                    ],
                    { env: { PGPASSWORD } },
                  ),
              )
            ).stdout
              .toString()
              .trim(),
            10,
          )

          if (userCount > 0) {
            const hash = (
              await subc.execFail([
                'hash_password',
                '-p',
                pendingAdminPassword,
                '-c',
                '/data/homeserver.yaml',
              ])
            ).stdout
              .toString()
              .trim()
            await sdk.SubContainer.withTemp(
              effects,
              { imageId: 'postgres' },
              sdk.Mounts.of(),
              'apply-admin-password-update',
              (psql) =>
                psql.execFail(
                  [
                    'psql',
                    '-h',
                    '127.0.0.1',
                    '-U',
                    postgresUser,
                    '-d',
                    postgresDb,
                    '-c',
                    `UPDATE users SET password_hash = '${sqlLiteral(hash)}' WHERE name = (SELECT name FROM users ORDER BY creation_ts ASC LIMIT 1)`,
                  ],
                  { env: { PGPASSWORD } },
                ),
            )
          } else {
            await subc.execFail([
              'register_new_matrix_user',
              '--config',
              '/data/homeserver.yaml',
              '--user',
              'admin',
              '--password',
              pendingAdminPassword,
              '--admin',
            ])
          }

          await storeJson.merge(effects, { pendingAdminPassword: null })
          return null
        },
      },
      requires: ['synapse'],
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
      requires: ['synapse', 'apply-admin-password'],
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

function sqlLiteral(s: string): string {
  return s.replace(/'/g, "''")
}
