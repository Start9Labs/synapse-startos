import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'
import { sdk } from '../sdk'

export const current = VersionInfo.of({
  version: '1.154.0:0',
  releaseNotes: {
    en_US: 'Bumps Synapse → 1.154.0.',
    es_ES: 'Actualiza Synapse → 1.154.0.',
    de_DE: 'Aktualisiert Synapse → 1.154.0.',
    pl_PL: 'Aktualizuje Synapse → 1.154.0.',
    fr_FR: 'Met à jour Synapse → 1.154.0.',
  },
  migrations: {
    up: async ({ effects }) => {
      // The "create-admin-user" action was removed; clear any outstanding
      // task pointing at it so users mid-setup don't see a broken task.
      await sdk.action.clearTask(effects, 'synapse:create-admin-user')
    },
    down: IMPOSSIBLE,
  },
})
