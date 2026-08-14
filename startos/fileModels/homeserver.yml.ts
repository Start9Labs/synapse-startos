import { FileHelper, z } from '@start9labs/start-sdk'
import { totalmem } from 'os'
import { sdk } from '../sdk'
import {
  homeserverPort,
  placeholderServerName,
  postgresDb,
  postgresUser,
} from '../utils'

// shared constants
const defaultMaxUpload = '50M'

// extracted defaults
const dbDefault = {
  args: {
    user: postgresUser,
    password: '',
    database: postgresDb,
    host: '127.0.0.1' as const,
  },
  name: 'psycopg2' as const,
}
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
      .object({
        user: z.literal(postgresUser).catch(postgresUser),
        password: z.string().catch(''),
        database: z.literal(postgresDb).catch(postgresDb),
        host: z.literal('127.0.0.1').catch('127.0.0.1'),
      })
      .catch(dbDefault.args),
    name: z.literal('psycopg2').catch('psycopg2' as const),
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

// Autotuning evicts on the whole Synapse process's allocated memory, not on
// cache size, so this is an out-of-memory guard rather than a performance knob.
// It has to clear ordinary use — a real ten-user homeserver holds ~815 MiB, and
// the upstream playbook's memtotal/16 target sits below that on an 8 GiB box —
// while staying low enough to still catch runaway growth on a large one, where
// a pure fraction of RAM would put the threshold out of reach. Hence a floor
// and the playbook's own ceiling rather than its divisor.
const maxCacheBytes = Math.min(
  Math.max(totalmem() / 4, 1024 ** 3),
  2 * 1024 ** 3,
)
const mib = (bytes: number) => `${Math.round(bytes / 1024 ** 2)}M`

const cacheAutotuningDefault = {
  max_cache_memory_usage: mib(maxCacheBytes),
  target_cache_memory_usage: mib(maxCacheBytes / 2),
  min_cache_ttl: '5m',
}
const cacheAutotuningShape = z
  .object({
    max_cache_memory_usage: z
      .string()
      .catch(cacheAutotuningDefault.max_cache_memory_usage),
    target_cache_memory_usage: z
      .string()
      .catch(cacheAutotuningDefault.target_cache_memory_usage),
    min_cache_ttl: z.string().catch(cacheAutotuningDefault.min_cache_ttl),
  })
  .catch(cacheAutotuningDefault)

const listenerShape = z
  .object({
    bind_addresses: z.array(z.string()).catch(listenerDefault.bind_addresses),
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

  // set by synapse generate, or carried over by the import action
  signing_key_path: z.string(),
  form_secret: z.string().optional(),
  macaroon_secret_key: z.string().optional(),
  registration_shared_secret: z.string().optional(),
  old_signing_keys: z
    .record(z.string(), z.object({ key: z.string(), expired_ts: z.number() }))
    .optional(),

  // set by actions
  server_name: z.string(),
  public_baseurl: z.string().catch(`https://${placeholderServerName}`),

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
  // Rendered by `main` from the coturn dependency; absent when it can't be
  // resolved, which Synapse reads as "advertise no relay".
  turn_uris: z.array(z.string()).optional().catch(undefined),
  turn_shared_secret: z.string().optional().catch(undefined),
  turn_allow_guests: z.boolean().optional().catch(undefined),
  enable_registration: z.boolean().catch(false),
  // Synapse refuses to start with registration on and no verification of any
  // kind, so this tracks the registration mode rather than sitting permanently
  // true: a token requirement satisfies the same check.
  enable_registration_without_verification: z.boolean().catch(false),
  registration_requires_token: z.boolean().catch(false),
  // Room summary API. Element X cannot talk to a homeserver without it and the
  // upstream playbook enables it by default, so it isn't worth a user choice —
  // though a hand-set `false` is still honoured.
  experimental_features: z
    .object({ msc3266_enabled: z.boolean().catch(true) })
    .catch({ msc3266_enabled: true }),
  caches: z
    .object({ cache_autotuning: cacheAutotuningShape })
    .catch({ cache_autotuning: cacheAutotuningDefault }),
  limit_remote_rooms: z
    .object({
      enabled: z.boolean().catch(false),
      complexity: z.number().catch(1),
      admins_can_join: z.boolean().catch(true),
    })
    .catch({ enabled: false, complexity: 1, admins_can_join: true }),
  federation_certificate_verification_whitelist: z.array(z.string()).catch([]),
  federation_domain_whitelist: z.array(z.string()).optional(),
  presence: z.object({ enabled: z.boolean().catch(true) }).catch({
    enabled: true,
  }),
  // Absent means "keep remote media forever", which is Synapse's default.
  media_retention: z
    .object({ remote_media_lifetime: z.string() })
    .optional()
    .catch(undefined),
  trusted_key_servers: z.array(z.object({ server_name: z.string() })).catch([]),
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

export const homeserverYaml = FileHelper.yaml(
  {
    base: sdk.volumes.main,
    subpath: 'homeserver.yaml',
  },
  shape,
)
