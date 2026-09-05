import { VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '1.160.0:0',
  releaseNotes: {
    en_US: `Updated Synapse to 1.160.0.

- Fixes a failure that could stop presence, to-device messages, and other updates from reaching clients after a request was cancelled.
- Transparent WebP images now keep their transparency in thumbnails.
- Device-list federation uses less database CPU, and Rust dependency updates address three security advisories.

Full release notes: https://github.com/element-hq/synapse/blob/release-v1.160/CHANGES.md`,
    es_ES: `Actualiza Synapse a 1.160.0.

- Corrige un fallo por el que la presencia, los mensajes «to-device» y otras actualizaciones podían dejar de llegar a los clientes tras cancelar una solicitud.
- Las imágenes WebP transparentes ahora conservan su transparencia en las miniaturas.
- La federación de listas de dispositivos usa menos CPU de la base de datos, y las actualizaciones de dependencias de Rust corrigen tres avisos de seguridad.

Notas de la versión completas: https://github.com/element-hq/synapse/blob/release-v1.160/CHANGES.md`,
    de_DE: `Aktualisiert Synapse auf 1.160.0.

- Behebt einen Fehler, durch den Anwesenheitsstatus, To-Device-Nachrichten und andere Aktualisierungen nach dem Abbruch einer Anfrage nicht mehr bei Clients ankamen.
- Transparente WebP-Bilder behalten nun ihre Transparenz in Vorschaubildern.
- Die Föderation von Gerätelisten benötigt weniger Datenbank-CPU; Aktualisierungen von Rust-Abhängigkeiten beheben drei Sicherheitshinweise.

Vollständige Versionshinweise: https://github.com/element-hq/synapse/blob/release-v1.160/CHANGES.md`,
    pl_PL: `Aktualizuje Synapse do 1.160.0.

- Naprawia błąd, przez który obecność, wiadomości to-device i inne aktualizacje mogły przestać docierać do klientów po anulowaniu żądania.
- Przezroczyste obrazy WebP zachowują teraz przezroczystość w miniaturach.
- Federacja list urządzeń zużywa mniej mocy procesora bazy danych, a aktualizacje zależności Rust usuwają trzy podatności bezpieczeństwa.

Pełne informacje o wydaniu: https://github.com/element-hq/synapse/blob/release-v1.160/CHANGES.md`,
    fr_FR: `Met à jour Synapse vers 1.160.0.

- Corrige un problème qui pouvait empêcher la présence, les messages « to-device » et d'autres mises à jour d'atteindre les clients après l'annulation d'une requête.
- Les images WebP transparentes conservent désormais leur transparence dans les miniatures.
- La fédération des listes d'appareils utilise moins de ressources processeur pour la base de données, et les mises à jour des dépendances Rust corrigent trois avis de sécurité.

Notes de version complètes : https://github.com/element-hq/synapse/blob/release-v1.160/CHANGES.md`,
  },
  migrations: {},
})
