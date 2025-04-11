import { sdk } from './sdk'

export const homeserverPort = 8008
export const adminPort = 8080

export const mount = sdk.Mounts.of().addVolume('main', null, '/data', false)

export type Config = {
  database: {
    args: {
      database: '/data/homeserver.db'
    }
    name: 'sqlite3'
  }
  email: {
    enable_notifs: true
    notif_from: string
    require_transport_security: true
    smtp_host: string
    smtp_pass: string
    smtp_port: number
    smtp_user: string
  } | null
  enable_registration: boolean
  enable_registration_without_verification: boolean
  federation_certificate_verification_whitelist: string[]
  federation_domain_whitelist?: string[]
  listeners: [
    {
      bind_addresses: ['::1', '127.0.0.1']
      port: 8008
      resources: [{ compress: false; names: Array<'client' | 'federation'> }]
      tls: false
      type: 'http'
      x_forwarded: true
    },
  ]
  log_config: '/data/homeserver.log.config'
  media_store_path: '/data/media_store'
  pid_file: '/data/homeserver.pid'
  report_stats: boolean
  signing_key_path: '/data/homeserver.signing.key'
  suppress_key_server_warning: boolean
  trusted_key_servers: {
    server_name: string
  }[]
  // below need to be set manually
  server_name: string
  public_baseurl: string
  // below are set automatically
  form_secret: string
  macaroon_secret_key: string
  registration_shared_secret: string
}

export const configDefaults: Config = {
  database: {
    args: {
      database: '/data/homeserver.db' as const,
    },
    name: 'sqlite3' as const,
  },
  email: null,
  enable_registration: false,
  enable_registration_without_verification: true,
  federation_certificate_verification_whitelist: [],
  federation_domain_whitelist: [],
  listeners: [
    {
      bind_addresses: ['::1', '127.0.0.1'],
      port: 8008,
      resources: [{ compress: false, names: ['client'] }],
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
  // below are set automatically
  form_secret: '',
  macaroon_secret_key: '',
  registration_shared_secret: '',
}
