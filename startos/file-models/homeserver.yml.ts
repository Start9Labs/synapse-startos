import { matches, FileHelper } from '@start9labs/start-sdk'
import { configDefaults } from '../utils'

const { object, string, literal, boolean, arrayOf, array, anyOf, natural } =
  matches

const {
  enable_registration,
  enable_registration_without_verification,
  email,
  listeners,
  log_config,
  media_store_path,
  pid_file,
  report_stats,
  suppress_key_server_warning,
} = configDefaults
const { bind_addresses, port, resources, tls, type, x_forwarded } = listeners[0]
const resource = resources[0]

const shape = object({
  database: object({
    args: object({
      database: literal('/data/homeserver.db').onMismatch(
        '/data/homeserver.db',
      ),
    }),
    name: literal('sqlite3').onMismatch('sqlite3'),
  }),
  email: object({
    enable_notifs: literal(true),
    notif_from: string,
    require_transport_security: literal(true),
    smtp_host: string,
    smtp_pass: string,
    smtp_port: natural,
    smtp_user: string,
  })
    .nullable()
    .onMismatch(email),
  enable_registration: boolean.onMismatch(enable_registration),
  enable_registration_without_verification: boolean.onMismatch(
    enable_registration_without_verification,
  ),
  federation_certificate_verification_whitelist: arrayOf(string),
  federation_domain_whitelist: arrayOf(string).optional(),
  listeners: array(
    object({
      bind_addresses: arrayOf(string).onMismatch(bind_addresses), // @TODO enforce contents
      port: literal(port).onMismatch(port),
      resources: array(
        object({
          compress: boolean.onMismatch(resource.compress),
          names: arrayOf(
            anyOf(literal('client'), literal('federation')),
          ).onMismatch(resource.names),
        }),
      ),
      tls: literal(tls).onMismatch(tls),
      type: literal(type).onMismatch(type),
      x_forwarded: literal(x_forwarded).onMismatch(x_forwarded),
    }),
  ).onMismatch(listeners),
  log_config: literal(log_config).onMismatch(log_config),
  media_store_path: literal(media_store_path).onMismatch(media_store_path),
  pid_file: literal(pid_file).onMismatch(pid_file),
  report_stats: boolean.onMismatch(report_stats),
  signing_key_path: string,
  suppress_key_server_warning: boolean.onMismatch(suppress_key_server_warning),
  trusted_key_servers: arrayOf(object({ server_name: string })),
  // below need to be set manually
  server_name: string,
  public_baseurl: string,
  // below are set automatically
  form_secret: string,
  macaroon_secret_key: string,
  registration_shared_secret: string,
})

export type HomeserverYaml = typeof shape._TYPE

export const homeserverYaml = FileHelper.yaml(
  '/media/startos/volumes/main/homeserver.yaml',
  shape,
)
