import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '1.164.2:2',
  releaseNotes: {
    en_US: 'Connecting Coturn now requires Coturn 4.18.0:6 or later.',
    es_ES: 'Conectar Coturn ahora requiere Coturn 4.18.0:6 o posterior.',
    de_DE:
      'Die Verbindung mit Coturn erfordert jetzt Coturn 4.18.0:6 oder neuer.',
    pl_PL: 'Połączenie z Coturn wymaga teraz Coturn 4.18.0:6 lub nowszego.',
    fr_FR:
      'La connexion à Coturn nécessite désormais Coturn 4.18.0:6 ou ultérieur.',
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
