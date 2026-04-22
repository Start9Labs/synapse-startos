import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const v_1_151_0_0 = VersionInfo.of({
  version: '1.151.0:0',
  releaseNotes: {
    en_US: 'Update Synapse to 1.151.0 and synapse-admin (now Ketesa) to 1.2.0',
    es_ES:
      'Actualización de Synapse a 1.151.0 y synapse-admin (ahora Ketesa) a 1.2.0',
    de_DE:
      'Update von Synapse auf 1.151.0 und synapse-admin (jetzt Ketesa) auf 1.2.0',
    pl_PL:
      'Aktualizacja Synapse do 1.151.0 oraz synapse-admin (teraz Ketesa) do 1.2.0',
    fr_FR:
      'Mise à jour de Synapse vers 1.151.0 et de synapse-admin (désormais Ketesa) vers 1.2.0',
  },
  migrations: {
    up: async () => {},
    down: IMPOSSIBLE,
  },
})
