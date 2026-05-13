import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'
import { sdk } from '../sdk'

export const v_1_152_1_1 = VersionInfo.of({
  version: '1.152.1:1',
  releaseNotes: {
    en_US: `**Bumps**

- Synapse Admin (Ketesa) v1.2.0 → v1.2.1
- @start9labs/start-sdk 1.3.3 → 1.5.0`,
    es_ES: `**Actualizaciones**

- Synapse Admin (Ketesa) v1.2.0 → v1.2.1
- @start9labs/start-sdk 1.3.3 → 1.5.0`,
    de_DE: `**Aktualisierungen**

- Synapse Admin (Ketesa) v1.2.0 → v1.2.1
- @start9labs/start-sdk 1.3.3 → 1.5.0`,
    pl_PL: `**Aktualizacje**

- Synapse Admin (Ketesa) v1.2.0 → v1.2.1
- @start9labs/start-sdk 1.3.3 → 1.5.0`,
    fr_FR: `**Mises à jour**

- Synapse Admin (Ketesa) v1.2.0 → v1.2.1
- @start9labs/start-sdk 1.3.3 → 1.5.0`,
  },
  migrations: {
    up: async ({ effects }) => {
      await sdk.action.clearTask(effects, 'synapse:create-admin-user')
    },
    down: IMPOSSIBLE,
  },
})
