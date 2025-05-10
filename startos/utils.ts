import { sdk } from './sdk'

export const homeserverPort = 8008
export const nginxPort = 80
export const adminPort = 8080

export const mount = sdk.Mounts.of().mountVolume({
  volumeId: 'main',
  subpath: null,
  mountpoint: '/data',
  readonly: false,
})

export const configDefaults = {
  database: {
    args: {
      database: '/data/homeserver.db' as const,
    },
    name: 'sqlite3' as const,
  },
  email: null,
  enable_registration: false,
  enable_registration_without_verification: true,
  // federation_certificate_verification_whitelist: [],
  // federation_domain_whitelist: [],
  listeners: [
    {
      bind_addresses: ['::1', '127.0.0.1'],
      port: homeserverPort,
      resources: [{ compress: false, names: ['client', 'federation'] }],
      tls: false,
      type: 'http',
      x_forwarded: true,
    },
  ] as const,
  log_config: '/data/homeserver.log.config' as const,
  media_store_path: '/data/media_store' as const,
  pid_file: '/data/homeserver.pid' as const,
  report_stats: false,
  signing_key_path: '/data/homeserver.signing.key' as const,
  suppress_key_server_warning: true,
  trusted_key_servers: [{ server_name: 'matrix.org' }],
  // below need to be set manually
  server_name: '',
  public_baseurl: '',
}
