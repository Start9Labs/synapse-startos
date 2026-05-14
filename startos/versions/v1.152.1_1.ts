import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'
import { sdk } from '../sdk'

export const v_1_152_1_1 = VersionInfo.of({
  version: '1.152.1:1',
  releaseNotes: {
    en_US: `**Bumps**

- @start9labs/start-sdk 1.3.3 → 1.5.1
- Ketesa (Synapse admin dashboard) 1.2.0 → 1.2.1

**Internal**

- Refresh repo docs to the four-file template.`,
    es_ES: `**Actualizaciones**

- @start9labs/start-sdk 1.3.3 → 1.5.1
- Ketesa (panel de administración de Synapse) 1.2.0 → 1.2.1

**Interno**

- Documentación del repositorio actualizada a la plantilla de cuatro archivos.`,
    de_DE: `**Aktualisierungen**

- @start9labs/start-sdk 1.3.3 → 1.5.1
- Ketesa (Synapse-Admin-Oberfläche) 1.2.0 → 1.2.1

**Intern**

- Repo-Dokumentation auf die Vier-Dateien-Vorlage umgestellt.`,
    pl_PL: `**Aktualizacje**

- @start9labs/start-sdk 1.3.3 → 1.5.1
- Ketesa (panel administracyjny Synapse) 1.2.0 → 1.2.1

**Wewnętrzne**

- Dokumentacja repozytorium zaktualizowana do szablonu czterech plików.`,
    fr_FR: `**Mises à jour**

- @start9labs/start-sdk 1.3.3 → 1.5.1
- Ketesa (tableau d'administration Synapse) 1.2.0 → 1.2.1

**Interne**

- Documentation du dépôt alignée sur le modèle à quatre fichiers.`,
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
