import { FileHelper, z } from '@start9labs/start-sdk'
import { sdk } from '../sdk'

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

const shape = z.any().transform(() => staticConfig)

export type HomeserverLogConfig = typeof staticConfig

export const homeserverLogConfig = FileHelper.yaml(
  {
    base: sdk.volumes.main,
    subpath: 'homeserver.log.config',
  },
  shape,
)
