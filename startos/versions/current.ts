import { VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '1.158.0:0',
  releaseNotes: {
    en_US: `Updates Synapse to 1.158.0.

- New rooms are now created with room version 11 by default, in line with Matrix v1.14.
- Thumbnails can now be animated, opted into per request with the \`animated\` query parameter.
- Fixes intermittent failures when creating rooms or sending third-party (3pid) invitations over federation in version 12 rooms.
- Fixes the homeserver not shutting down cleanly.

Full release notes: https://github.com/element-hq/synapse/blob/release-v1.158/CHANGES.md`,
    es_ES: `Actualiza Synapse a 1.158.0.

- Las salas nuevas se crean ahora con la versión de sala 11 de forma predeterminada, en línea con Matrix v1.14.
- Las miniaturas pueden ser animadas, activándose en cada petición con el parámetro de consulta \`animated\`.
- Corrige fallos intermitentes al crear salas o al enviar invitaciones de terceros (3pid) por federación en salas de versión 12.
- Corrige que el homeserver no se apagara limpiamente.

Notas de versión completas: https://github.com/element-hq/synapse/blob/release-v1.158/CHANGES.md`,
    de_DE: `Aktualisiert Synapse auf 1.158.0.

- Neue Räume werden jetzt standardmäßig mit Raumversion 11 erstellt, passend zu Matrix v1.14.
- Vorschaubilder können nun animiert sein; dies wird pro Anfrage über den Abfrageparameter \`animated\` aktiviert.
- Behebt sporadische Fehler beim Erstellen von Räumen und beim Versenden von Drittanbieter-Einladungen (3pid) über die Föderation in Räumen der Version 12.
- Behebt, dass der Homeserver nicht sauber heruntergefahren wurde.

Vollständige Versionshinweise: https://github.com/element-hq/synapse/blob/release-v1.158/CHANGES.md`,
    pl_PL: `Aktualizuje Synapse do 1.158.0.

- Nowe pokoje są domyślnie tworzone w wersji 11, zgodnie z Matrix v1.14.
- Miniatury mogą być animowane — włącza się to dla pojedynczego żądania parametrem zapytania \`animated\`.
- Naprawia sporadyczne błędy przy tworzeniu pokoi oraz przy wysyłaniu zaproszeń third-party (3pid) przez federację w pokojach w wersji 12.
- Naprawia brak czystego zamykania serwera.

Pełne informacje o wydaniu: https://github.com/element-hq/synapse/blob/release-v1.158/CHANGES.md`,
    fr_FR: `Met à jour Synapse vers 1.158.0.

- Les nouveaux salons sont désormais créés en version de salon 11 par défaut, conformément à Matrix v1.14.
- Les vignettes peuvent être animées, à activer requête par requête via le paramètre \`animated\`.
- Corrige des échecs intermittents lors de la création de salons et de l'envoi d'invitations tierces (3pid) via la fédération dans les salons de version 12.
- Corrige l'arrêt non propre du homeserver.

Notes de version complètes : https://github.com/element-hq/synapse/blob/release-v1.158/CHANGES.md`,
  },
  migrations: {},
})
