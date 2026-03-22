import { FileHelper, z } from '@start9labs/start-sdk'
import { sdk } from '../sdk'
import { homeserverPort } from '../utils'

// shared constants
const dbPath = '/data/homeserver.db'
const defaultMaxUpload = '50M'

// extracted defaults
const dbDefault = { args: { database: dbPath }, name: 'sqlite3' }
const resourceDefault = {
  compress: false,
  names: ['client'] as ('client' | 'federation')[],
}
const listenerDefault = {
  bind_addresses: ['::1', '127.0.0.1'],
  port: homeserverPort,
  resources: [resourceDefault],
  tls: false,
  type: 'http',
  x_forwarded: true,
}

// extracted shapes
const dbShape = z
  .object({
    args: z
      .object({ database: z.string().catch(dbPath) })
      .catch(dbDefault.args),
    name: z.string().catch(dbDefault.name),
  })
  .catch(dbDefault)

const resourceShape = z
  .object({
    compress: z.boolean().catch(resourceDefault.compress),
    names: z
      .array(z.enum(['client', 'federation']))
      .catch(resourceDefault.names),
  })
  .catch(resourceDefault)

const listenerShape = z
  .object({
    bind_addresses: z
      .array(z.string())
      .catch(listenerDefault.bind_addresses),
    port: z.number().catch(listenerDefault.port),
    resources: z.array(resourceShape).catch(listenerDefault.resources),
    tls: z.boolean().catch(listenerDefault.tls),
    type: z.string().catch(listenerDefault.type),
    x_forwarded: z.boolean().catch(listenerDefault.x_forwarded),
  })
  .catch(listenerDefault)

const shape = z.object({
  // enforced
  database: dbShape,
  listeners: z.array(listenerShape).catch([listenerDefault]),
  log_config: z.string().catch('/data/homeserver.log.config'),
  media_store_path: z.string().catch('/data/media_store'),
  pid_file: z.string().catch('/data/homeserver.pid'),
  report_stats: z.boolean().catch(false),
  suppress_key_server_warning: z.boolean().catch(true),

  // set by synapse generate
  signing_key_path: z.string(),
  form_secret: z.string().optional(),
  macaroon_secret_key: z.string().optional(),
  registration_shared_secret: z.string().optional(),

  // set by actions
  server_name: z.string(),
  public_baseurl: z.string().catch('https://placeholder.com'),

  // configurable
  email: z
    .object({
      // enforced
      enable_notifs: z.literal(true),
      require_transport_security: z.literal(true),
      // set by SMTP config
      notif_from: z.string(),
      smtp_host: z.string(),
      smtp_pass: z.string().optional(),
      smtp_port: z.number(),
      smtp_user: z.string(),
    })
    .nullable()
    .catch(null),
  enable_registration: z.boolean().catch(false),
  enable_registration_without_verification: z.boolean().catch(true),
  federation_certificate_verification_whitelist: z
    .array(z.string())
    .catch([]),
  federation_domain_whitelist: z.array(z.string()).optional(),
  trusted_key_servers: z
    .array(z.object({ server_name: z.string() }))
    .catch([]),
  max_upload_size: z
    .string()
    .transform((s) =>
      ['B', 'K', 'M', 'G'].includes(s.at(-1) || '') &&
      typeof Number(s.slice(0, -1)) === 'number'
        ? s
        : defaultMaxUpload,
    )
    .catch(defaultMaxUpload),
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
