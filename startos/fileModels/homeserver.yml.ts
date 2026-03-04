import { FileHelper, z } from '@start9labs/start-sdk'
import { sdk } from '../sdk'
import { configDefaults } from '../utils'

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
  max_upload_size,
} = configDefaults
const { bind_addresses, port, resources, tls, type, x_forwarded } = listeners[0]
const resource = resources[0]

const shape = z.object({
  database: z
    .object({
      args: z
        .object({
          database: z.string().catch('/data/homeserver.db'),
        })
        .catch({ database: '/data/homeserver.db' }),
      name: z.string().catch('sqlite3'),
    })
    .catch({ args: { database: '/data/homeserver.db' }, name: 'sqlite3' }),
  email: z
    .object({
      enable_notifs: z.literal(true),
      notif_from: z.string(),
      require_transport_security: z.literal(true),
      smtp_host: z.string(),
      smtp_pass: z.string().optional(),
      smtp_port: z.number(),
      smtp_user: z.string(),
    })
    .nullable()
    .catch(email),
  enable_registration: z.boolean().catch(enable_registration),
  enable_registration_without_verification: z.boolean().catch(
    enable_registration_without_verification,
  ),
  federation_certificate_verification_whitelist: z
    .array(z.string())
    .catch([]),
  federation_domain_whitelist: z.array(z.string()).optional(),
  listeners: z
    .array(
      z.object({
        bind_addresses: z.array(z.string()).catch([...bind_addresses]),
        port: z.number().catch(port),
        resources: z.array(
          z.object({
            compress: z.boolean().catch(resource.compress),
            names: z
              .array(z.enum(['client', 'federation']))
              .catch(resource.names as any),
          }),
        ),
        tls: z.boolean().catch(tls),
        type: z.string().catch(type),
        x_forwarded: z.boolean().catch(x_forwarded),
      }),
    )
    .catch(listeners as any),
  log_config: z.string().catch(log_config),
  media_store_path: z.string().catch(media_store_path),
  pid_file: z.string().catch(pid_file),
  report_stats: z.boolean().catch(report_stats),
  signing_key_path: z.string(),
  suppress_key_server_warning: z.boolean().catch(suppress_key_server_warning),
  trusted_key_servers: z
    .array(z.object({ server_name: z.string() }))
    .catch([]),
  // below need to be set manually
  server_name: z.string(),
  public_baseurl: z.string(),
  // below are set automatically
  form_secret: z.string().optional(),
  macaroon_secret_key: z.string().optional(),
  registration_shared_secret: z.string().optional(),
  max_upload_size: z
    .string()
    .transform((s) =>
      ['B', 'K', 'M', 'G'].includes(s.at(-1) || '') &&
      typeof Number(s.slice(0, -1)) === 'number'
        ? s
        : max_upload_size,
    )
    .catch(max_upload_size),
  app_service_config_files: z.array(z.string()).catch([]),
})

export type HomeserverYaml = z.infer<typeof shape>

export const homeserverYaml = FileHelper.yaml(
  {
    base: sdk.volumes.main,
    subpath: 'homeserver.yaml',
  },
  shape,
)
