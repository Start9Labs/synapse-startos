import { VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '1.164.0:0',
  releaseNotes: {
    en_US: `Updated Synapse to 1.164.0 and Ketesa to 1.5.2.

- Supports Matrix 1.16/1.17 and stable state-after sync; fixes Sliding Sync treating profile changes as new room joins.
- Stops unnecessary event queueing for appservices with no URL, including double-puppeting registrations.
- Email token requests now hide whether an address has an account by default. Legacy mention push rules are disabled by default; clients should use explicit mentions.
- On an existing database with unfinished legacy event-edge cleanup, the first start completes that work before serving requests and may take longer. Synapse handles the database upgrade itself.
- Ketesa fixes OAuth/MAS logout, token refresh and access-token login detection.
- Removed the Force-Purge Room action. To delete a room that will not delete normally, turn on "Force purge even if local users are still in the room" when deleting it from the Admin Dashboard.

Full notes: https://github.com/element-hq/synapse/blob/v1.164.0/CHANGES.md and https://github.com/etkecc/ketesa/releases/tag/v1.5.2`,
    es_ES: `Actualiza Synapse a 1.164.0 y Ketesa a 1.5.2.

- Admite Matrix 1.16/1.17 y la sincronización estable del estado posterior; corrige que Sliding Sync tratara los cambios de perfil como nuevas entradas en salas.
- Evita encolar eventos innecesariamente para appservices sin URL, incluidos los registros de doble suplantación.
- Las solicitudes de tokens por correo ocultan por defecto si una dirección tiene cuenta. Las reglas antiguas de notificación de menciones se desactivan por defecto; los clientes deben usar menciones explícitas.
- Si una base de datos existente tiene pendiente la limpieza antigua de relaciones entre eventos, el primer inicio la completa antes de atender solicitudes y puede tardar más. Synapse gestiona la actualización de la base de datos.
- Ketesa corrige el cierre de sesión OAuth/MAS, la renovación de tokens y la detección del inicio de sesión con token de acceso.
- Se elimina la acción «Purgar sala a la fuerza». Para eliminar una sala que no se elimina de la forma normal, active "Force purge even if local users are still in the room" al eliminarla desde el Panel de administración.

Notas completas: https://github.com/element-hq/synapse/blob/v1.164.0/CHANGES.md y https://github.com/etkecc/ketesa/releases/tag/v1.5.2`,
    de_DE: `Aktualisiert Synapse auf 1.164.0 und Ketesa auf 1.5.2.

- Unterstützt Matrix 1.16/1.17 und die stabile Synchronisierung des nachgelagerten Zustands; behebt, dass Sliding Sync Profiländerungen als neue Raumbeitritte behandelt.
- Vermeidet unnötige Ereigniswarteschlangen für Appservices ohne URL, einschließlich Double-Puppeting-Registrierungen.
- E-Mail-Token-Anfragen verbergen standardmäßig, ob eine Adresse ein Konto hat. Alte Push-Regeln für Erwähnungen sind standardmäßig deaktiviert; Clients sollten explizite Erwähnungen verwenden.
- Bei einer bestehenden Datenbank mit ausstehender Bereinigung alter Ereignisverknüpfungen schließt der erste Start diese Arbeit vor der Annahme von Anfragen ab und kann länger dauern. Synapse übernimmt das Datenbank-Upgrade selbst.
- Ketesa korrigiert OAuth/MAS-Abmeldung, Token-Erneuerung und die Erkennung von Anmeldungen per Zugriffstoken.
- Die Aktion „Raum zwangsweise löschen“ entfällt. Um einen Raum zu löschen, der sich nicht normal löschen lässt, aktivieren Sie beim Löschen im Admin-Dashboard "Force purge even if local users are still in the room".

Vollständige Hinweise: https://github.com/element-hq/synapse/blob/v1.164.0/CHANGES.md und https://github.com/etkecc/ketesa/releases/tag/v1.5.2`,
    pl_PL: `Aktualizuje Synapse do 1.164.0 i Ketesa do 1.5.2.

- Obsługuje Matrix 1.16/1.17 i stabilną synchronizację stanu po zdarzeniach; naprawia traktowanie zmian profilu przez Sliding Sync jako nowych dołączeń do pokoi.
- Eliminuje zbędne kolejkowanie zdarzeń dla appservices bez adresu URL, w tym rejestracji double-puppeting.
- Żądania tokenów e-mail domyślnie ukrywają, czy adres ma konto. Starsze reguły powiadomień o wzmiankach są domyślnie wyłączone; klienci powinni używać jawnych wzmianek.
- Jeśli istniejąca baza danych ma niezakończone porządkowanie dawnych powiązań zdarzeń, pierwszy start kończy je przed obsługą żądań i może potrwać dłużej. Synapse sam aktualizuje bazę danych.
- Ketesa naprawia wylogowanie OAuth/MAS, odświeżanie tokenów i rozpoznawanie logowania tokenem dostępu.
- Usunięto akcję „Wymuś usunięcie pokoju”. Aby usunąć pokój, którego nie da się usunąć zwykłym sposobem, włącz "Force purge even if local users are still in the room" podczas usuwania go w Panelu administratora.

Pełne informacje: https://github.com/element-hq/synapse/blob/v1.164.0/CHANGES.md oraz https://github.com/etkecc/ketesa/releases/tag/v1.5.2`,
    fr_FR: `Met à jour Synapse vers 1.164.0 et Ketesa vers 1.5.2.

- Prend en charge Matrix 1.16/1.17 et la synchronisation stable de l'état après les événements ; corrige Sliding Sync qui traitait les changements de profil comme de nouvelles adhésions aux salons.
- Évite la mise en file inutile d'événements pour les appservices sans URL, notamment les inscriptions de double-puppeting.
- Les demandes de jetons par e-mail masquent désormais par défaut si une adresse possède un compte. Les anciennes règles de notification des mentions sont désactivées par défaut ; les clients doivent utiliser les mentions explicites.
- Si une base existante présente un nettoyage inachevé des anciennes relations entre événements, le premier démarrage le termine avant de servir les requêtes et peut durer plus longtemps. Synapse gère lui-même la mise à niveau de la base.
- Ketesa corrige la déconnexion OAuth/MAS, le renouvellement des jetons et la détection des connexions par jeton d'accès.
- L'action « Purger le salon de force » est supprimée. Pour supprimer un salon qui refuse de l'être normalement, activez "Force purge even if local users are still in the room" lors de sa suppression depuis le Tableau de bord administrateur.

Notes complètes : https://github.com/element-hq/synapse/blob/v1.164.0/CHANGES.md et https://github.com/etkecc/ketesa/releases/tag/v1.5.2`,
  },
  migrations: {
    up: async ({ effects }) => {},
  },
})
