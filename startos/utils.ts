import { sdk } from './sdk'

export const homeserverPort = 8008
export const nginxPort = 80
export const adminPort = 8080

export const mountpoint = '/data'

export const mount = sdk.Mounts.of().mountVolume({
  volumeId: 'main',
  subpath: null,
  mountpoint,
  readonly: false,
})

export const configDefaults = {
  database: {
    args: {
      database: `${mountpoint}/homeserver.db`,
    },
    name: 'sqlite3',
  },
  email: null,
  enable_registration: false,
  enable_registration_without_verification: true,
  federation_certificate_verification_whitelist: [],
  federation_domain_whitelist: [],
  listeners: [
    {
      bind_addresses: ['::1', '127.0.0.1'],
      port: homeserverPort,
      resources: [{ compress: false, names: ['client'] }],
      tls: false,
      type: 'http',
      x_forwarded: true,
    },
  ],
  log_config: `${mountpoint}/homeserver.log.config`,
  media_store_path: `${mountpoint}/media_store`,
  pid_file: `${mountpoint}/homeserver.pid`,
  report_stats: false,
  signing_key_path: `${mountpoint}/homeserver.signing.key`,
  suppress_key_server_warning: true,
  trusted_key_servers: [{ server_name: 'matrix.org' }],
  // below need to be set manually
  server_name: '',
  public_baseurl: '',
  max_upload_size: '50M',
} as const
