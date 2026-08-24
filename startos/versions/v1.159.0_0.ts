import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const v_1_159_0_0 = VersionInfo.of({
  version: '1.159.0:0',
  releaseNotes: {
    en_US: 'Updated Synapse to 1.159.0.',
    es_ES: 'Actualiza Synapse a 1.159.0.',
    de_DE: 'Aktualisiert Synapse auf 1.159.0.',
    pl_PL: 'Aktualizuje Synapse do 1.159.0.',
    fr_FR: 'Met à jour Synapse vers 1.159.0.',
  },
  migrations: {
    up: async () => {},
    down: IMPOSSIBLE,
  },
})
