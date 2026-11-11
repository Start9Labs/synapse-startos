import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '1.165.0:0',
  releaseNotes: {
    en_US: `Updated Synapse to 1.165.0. Requires StartOS 0.4.2 or newer.

- Adds stable MatrixRTC transport discovery.
- Fixes missing room memberships during initial sync and event signature verification failures caused by server key expiry handling.
- Speeds up username availability checks.

Full notes: https://github.com/element-hq/synapse/blob/v1.165.0/CHANGES.md`,
    es_ES: `Actualiza Synapse a 1.165.0. Requiere StartOS 0.4.2 o posterior.

- Añade descubrimiento estable de transportes MatrixRTC.
- Corrige la ausencia de miembros de salas durante la sincronización inicial y los fallos de verificación de firmas de eventos causados por la gestión de la caducidad de claves del servidor.
- Acelera las comprobaciones de disponibilidad de nombres de usuario.

Notas completas: https://github.com/element-hq/synapse/blob/v1.165.0/CHANGES.md`,
    de_DE: `Aktualisiert Synapse auf 1.165.0. Erfordert StartOS 0.4.2 oder neuer.

- Fügt die stabile Erkennung von MatrixRTC-Transporten hinzu.
- Behebt fehlende Raummitgliedschaften bei der ersten Synchronisierung und Fehler bei der Ereignissignaturprüfung durch die Behandlung ablaufender Serverschlüssel.
- Beschleunigt die Prüfung verfügbarer Benutzernamen.

Vollständige Hinweise: https://github.com/element-hq/synapse/blob/v1.165.0/CHANGES.md`,
    pl_PL: `Aktualizuje Synapse do 1.165.0. Wymaga StartOS 0.4.2 lub nowszego.

- Dodaje stabilne wykrywanie transportów MatrixRTC.
- Naprawia brakujące członkostwa w pokojach podczas pierwszej synchronizacji oraz błędy weryfikacji podpisów zdarzeń spowodowane obsługą wygasania kluczy serwera.
- Przyspiesza sprawdzanie dostępności nazw użytkowników.

Pełne informacje: https://github.com/element-hq/synapse/blob/v1.165.0/CHANGES.md`,
    fr_FR: `Met à jour Synapse vers 1.165.0. Nécessite StartOS 0.4.2 ou ultérieur.

- Ajoute la découverte stable des transports MatrixRTC.
- Corrige les adhésions aux salons manquantes lors de la synchronisation initiale et les échecs de vérification des signatures d'événements dus à la gestion de l'expiration des clés du serveur.
- Accélère la vérification de disponibilité des noms d'utilisateur.

Notes complètes : https://github.com/element-hq/synapse/blob/v1.165.0/CHANGES.md`,
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
