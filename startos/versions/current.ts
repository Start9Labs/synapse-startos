import { VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '1.163.0:1',
  releaseNotes: {
    en_US: 'Performance improvement',
    es_ES: 'Mejora de rendimiento',
    de_DE: 'Leistungsverbesserung',
    pl_PL: 'Poprawa wydajności',
    fr_FR: 'Amélioration des performances',
  },
  migrations: {
    up: async ({ effects }) => {},
  },
})
