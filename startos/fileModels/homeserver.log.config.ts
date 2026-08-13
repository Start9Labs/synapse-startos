import { FileHelper, z } from '@start9labs/start-sdk'
import { sdk } from '../sdk'

export const logLevels = ['DEBUG', 'INFO', 'WARNING', 'ERROR'] as const
export type LogLevel = (typeof logLevels)[number]
export const defaultLogLevel: LogLevel = 'INFO'

const staticConfig = (level: LogLevel) => ({
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
    level,
    handlers: ['console', 'file'] as const,
  },
  loggers: {
    synapse: { level },
    'synapse.storage.SQL': { level },
  },
})

// Everything but the level is rebuilt from scratch on every read, so a
// hand-edit to this file does not survive the way one to homeserver.yaml does.
// The level is carried back through so the Config action's choice sticks.
const shape = z.any().transform((a) => {
  const level = logLevels.find((l) => l === a?.root?.level) ?? defaultLogLevel
  return staticConfig(level)
})

export type HomeserverLogConfig = ReturnType<typeof staticConfig>

export const homeserverLogConfig = FileHelper.yaml(
  {
    base: sdk.volumes.main,
    subpath: 'homeserver.log.config',
  },
  shape,
)
