import { VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '1.164.2:0',
  releaseNotes: {
    en_US:
      'Updated Synapse to 1.164.2. Restores the unstable /auth_metadata endpoint so Element X clients can refresh access tokens after upgrading from Synapse 1.162 or earlier. Full notes: https://github.com/element-hq/synapse/blob/v1.164.2/CHANGES.md',
    es_ES:
      'Actualiza Synapse a 1.164.2. Restaura el endpoint inestable /auth_metadata para que los clientes Element X puedan renovar los tokens de acceso tras actualizar desde Synapse 1.162 o anterior. Notas completas: https://github.com/element-hq/synapse/blob/v1.164.2/CHANGES.md',
    de_DE:
      'Aktualisiert Synapse auf 1.164.2. Stellt den instabilen Endpunkt /auth_metadata wieder her, damit Element-X-Clients nach einem Upgrade von Synapse 1.162 oder älter ihre Zugriffstokens erneuern können. Vollständige Hinweise: https://github.com/element-hq/synapse/blob/v1.164.2/CHANGES.md',
    pl_PL:
      'Aktualizuje Synapse do 1.164.2. Przywraca niestabilny endpoint /auth_metadata, aby klienci Element X mogli odświeżać tokeny dostępu po aktualizacji z Synapse 1.162 lub starszego. Pełne informacje: https://github.com/element-hq/synapse/blob/v1.164.2/CHANGES.md',
    fr_FR:
      'Met à jour Synapse vers 1.164.2. Rétablit le point de terminaison instable /auth_metadata pour permettre aux clients Element X de renouveler leurs jetons d’accès après une mise à niveau depuis Synapse 1.162 ou une version antérieure. Notes complètes : https://github.com/element-hq/synapse/blob/v1.164.2/CHANGES.md',
  },
  migrations: {
    up: async ({ effects }) => {},
  },
})
