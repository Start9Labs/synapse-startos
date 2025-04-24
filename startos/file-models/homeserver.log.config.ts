import { matches, FileHelper } from '@start9labs/start-sdk'
import { configDefaults } from '../utils'

const { object, literal, tuple } = matches

const staticConfig = {
  version: 1,
  formatters: {
    fmt: {
      format:
        '%(asctime)s - %(name)s - %(lineno)d - %(levelname)s - %(request)s- %(message)s',
    },
  },
  filters: {
    context: {
      '()': 'synapse.logging.context.LoggingContextFilter',
      request: '',
    },
  },
  handlers: {
    console: {
      class: 'logging.StreamHandler',
      formatter: 'fmt',
      filters: ['context'] as const,
    },
    file: {
      class: 'logging.handlers.RotatingFileHandler',
      formatter: 'fmt',
      filename: '/data/homeserver.log',
      maxBytes: 100000000,
      backupCount: 3,
      filters: ['context'] as const,
      encoding: 'utf8',
    },
  },
  root: {
    level: 'INFO',
    handlers: ['console', 'file'] as const,
  },
  loggers: {
    synapse: { level: 'INFO' },
    'synapse.storage.SQL': { level: 'INFO' },
  },
}

const shape = object({
  version: literal(staticConfig.version),
  formatters: object({
    fmt: object({
      format: literal(staticConfig.formatters.fmt.format),
    }),
  }),
  filters: object({
    context: object({
      '()': literal(staticConfig.filters.context['()']),
      request: literal(staticConfig.filters.context.request),
    }),
  }),
  handlers: object({
    console: object({
      class: literal(staticConfig.handlers.console.class),
      formatter: literal(staticConfig.handlers.console.formatter),
      filters: tuple(
        ...staticConfig.handlers.console.filters.map(literal),
      ) as matches.Validator<
        unknown,
        typeof staticConfig.handlers.console.filters
      >,
    }),
    file: object({
      class: literal(staticConfig.handlers.file.class),
      formatter: literal(staticConfig.handlers.file.formatter),
      filename: literal(staticConfig.handlers.file.filename),
      maxBytes: literal(staticConfig.handlers.file.maxBytes),
      backupCount: literal(staticConfig.handlers.file.backupCount),
      filters: tuple(
        ...staticConfig.handlers.file.filters.map(literal),
      ) as matches.Validator<
        unknown,
        typeof staticConfig.handlers.file.filters
      >,
      encoding: literal(staticConfig.handlers.file.encoding),
    }),
  }),
  root: object({
    level: literal(staticConfig.root.level),
    handlers: tuple(
      ...staticConfig.root.handlers.map(literal),
    ) as matches.Validator<unknown, typeof staticConfig.root.handlers>,
  }),
  loggers: object({
    synapse: object({
      level: literal(staticConfig.loggers.synapse.level),
    }),
    'synapse.storage.SQL': object({
      level: literal(staticConfig.loggers['synapse.storage.SQL'].level),
    }),
  }),
}).onMismatch(staticConfig)

export type HomeserverLogConfig = typeof shape._TYPE

export const homeserverLogConfig = FileHelper.yaml(
  '/media/startos/volumes/main/homeserver.log.config',
  shape.withMismatch((_) => shape.unsafeCast({})),
)
