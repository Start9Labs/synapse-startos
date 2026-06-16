import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'
import { sdk } from '../sdk'

export const current = VersionInfo.of({
  version: '1.155.0:0',
  releaseNotes: {
    en_US: `Updated Synapse to 1.155.0.

- Bugfix: limit to-device EDU size to keep outgoing federation from stalling.
- Bugfix: work around a failure when joining restricted rooms that need a remote join.
- Bugfix: Sliding Sync now returns updated room subscriptions immediately.
- Note: this is the last Synapse release to ship Debian 12 Bookworm packages (does not affect this StartOS package).

Full notes: https://github.com/element-hq/synapse/releases/tag/v1.155.0`,
    es_ES: `Synapse actualizado a 1.155.0.

- Corrección: limita el tamaño de los EDU to-device para evitar que se detenga la federación saliente.
- Corrección: soluciona un fallo al unirse a salas restringidas que requieren una unión remota.
- Corrección: Sliding Sync ahora devuelve de inmediato las suscripciones de sala actualizadas.
- Nota: esta es la última versión de Synapse que incluye paquetes de Debian 12 Bookworm (no afecta a este paquete de StartOS).

Notas completas: https://github.com/element-hq/synapse/releases/tag/v1.155.0`,
    de_DE: `Synapse auf 1.155.0 aktualisiert.

- Fehlerbehebung: begrenzt die Größe von to-device-EDUs, damit die ausgehende Föderation nicht ins Stocken gerät.
- Fehlerbehebung: umgeht einen Fehler beim Betreten eingeschränkter Räume, die einen Remote-Beitritt erfordern.
- Fehlerbehebung: Sliding Sync liefert geänderte Raum-Abonnements jetzt sofort.
- Hinweis: Dies ist die letzte Synapse-Version mit Debian-12-Bookworm-Paketen (betrifft dieses StartOS-Paket nicht).

Vollständige Hinweise: https://github.com/element-hq/synapse/releases/tag/v1.155.0`,
    pl_PL: `Zaktualizowano Synapse do 1.155.0.

- Poprawka: ogranicza rozmiar EDU to-device, aby nie blokować wychodzącej federacji.
- Poprawka: obchodzi błąd przy dołączaniu do ograniczonych pokoi wymagających zdalnego dołączenia.
- Poprawka: Sliding Sync natychmiast zwraca zaktualizowane subskrypcje pokoi.
- Uwaga: to ostatnie wydanie Synapse z pakietami Debian 12 Bookworm (nie dotyczy tego pakietu StartOS).

Pełne informacje: https://github.com/element-hq/synapse/releases/tag/v1.155.0`,
    fr_FR: `Synapse mis à jour vers 1.155.0.

- Correctif : limite la taille des EDU to-device pour éviter que la fédération sortante ne se bloque.
- Correctif : contourne un échec lors de la jonction de salons restreints nécessitant une jonction distante.
- Correctif : Sliding Sync renvoie désormais immédiatement les abonnements de salon mis à jour.
- Note : il s'agit de la dernière version de Synapse à fournir des paquets Debian 12 Bookworm (sans incidence sur ce paquet StartOS).

Notes complètes : https://github.com/element-hq/synapse/releases/tag/v1.155.0`,
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
