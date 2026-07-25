import { VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '1.156.0:4',
  releaseNotes: {
    en_US: `Updated Synapse to 1.156.0.

- Fixes a long-standing bug where a room's unread notification badge could stay permanently inflated, and a related inflation after purging a room's history.
- Fixes dehydrated devices being deleted when a user's device list was synced from Matrix Authentication Service, which broke offline key delivery.
- Fixes the Purge History admin API deleting local events even when delete_local_events was set to false.
- Fixes /sync briefly caching transient errors instead of retrying.
- Adds sticky events over Sliding Sync, and stabilizes sending ephemeral events to application services.

Full release notes: https://github.com/element-hq/synapse/releases/tag/v1.156.0`,
    es_ES: `Actualiza Synapse a 1.156.0.

- Corrige un error antiguo por el que el contador de notificaciones sin leer de una sala podía quedar permanentemente inflado, así como un aumento similar tras purgar el historial de una sala.
- Corrige la eliminación de los dispositivos deshidratados al sincronizar la lista de dispositivos de un usuario desde Matrix Authentication Service, lo que impedía la entrega de claves sin conexión.
- Corrige la API de administración «Purge History», que eliminaba eventos locales aunque delete_local_events estuviera desactivado.
- Corrige que /sync almacenara brevemente en caché errores transitorios en lugar de reintentar.
- Añade los eventos persistentes (sticky events) a Sliding Sync y estabiliza el envío de eventos efímeros a los servicios de aplicación.

Notas de la versión completas: https://github.com/element-hq/synapse/releases/tag/v1.156.0`,
    de_DE: `Aktualisiert Synapse auf 1.156.0.

- Behebt einen langjährigen Fehler, durch den die Benachrichtigungsanzahl eines Raums dauerhaft zu hoch bleiben konnte, sowie einen ähnlichen Fehler nach dem Bereinigen des Raumverlaufs.
- Behebt das Löschen dehydrierter Geräte beim Synchronisieren der Geräteliste eines Benutzers vom Matrix Authentication Service, was die Offline-Schlüsselzustellung unterbrach.
- Behebt, dass die Purge-History-Admin-API lokale Ereignisse selbst dann löschte, wenn delete_local_events deaktiviert war.
- Behebt, dass /sync vorübergehende Fehler kurzzeitig zwischenspeicherte, statt es erneut zu versuchen.
- Fügt Sticky Events über Sliding Sync hinzu und stabilisiert das Senden ephemerer Ereignisse an Application Services.

Vollständige Versionshinweise: https://github.com/element-hq/synapse/releases/tag/v1.156.0`,
    pl_PL: `Aktualizuje Synapse do 1.156.0.

- Naprawia długotrwały błąd, przez który licznik nieprzeczytanych powiadomień w pokoju mógł pozostać trwale zawyżony, oraz podobne zawyżenie po wyczyszczeniu historii pokoju.
- Naprawia usuwanie zdehydratyzowanych urządzeń podczas synchronizacji listy urządzeń użytkownika z Matrix Authentication Service, co uniemożliwiało dostarczanie kluczy w trybie offline.
- Naprawia administracyjne API Purge History, które usuwało zdarzenia lokalne nawet przy wyłączonym delete_local_events.
- Naprawia krótkotrwałe zapisywanie w pamięci podręcznej błędów przejściowych przez /sync zamiast ponowienia próby.
- Dodaje zdarzenia przypięte (sticky events) w Sliding Sync i stabilizuje wysyłanie zdarzeń efemerycznych do usług aplikacyjnych.

Pełne informacje o wydaniu: https://github.com/element-hq/synapse/releases/tag/v1.156.0`,
    fr_FR: `Met à jour Synapse vers 1.156.0.

- Corrige un bogue de longue date par lequel le compteur de notifications non lues d'un salon pouvait rester durablement gonflé, ainsi qu'un gonflement similaire après la purge de l'historique d'un salon.
- Corrige la suppression des appareils déshydratés lors de la synchronisation de la liste des appareils d'un utilisateur depuis Matrix Authentication Service, qui rompait la livraison des clés hors ligne.
- Corrige l'API d'administration « Purge History » qui supprimait des événements locaux même lorsque delete_local_events était désactivé.
- Corrige la mise en cache brève des erreurs transitoires par /sync au lieu d'une nouvelle tentative.
- Ajoute les événements persistants (sticky events) à Sliding Sync et stabilise l'envoi d'événements éphémères aux services applicatifs.

Notes de version complètes : https://github.com/element-hq/synapse/releases/tag/v1.156.0`,
  },
  migrations: {},
})
