import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '1.166.0:0',
  releaseNotes: {
    en_US: `Updated Synapse to 1.166.0.

- Fixes remote media downloads that could fail over federation, and stops failed media downloads and URL previews from leaving empty files behind.
- Fixes rooms missing from sync and errors when leaving, inviting, banning or kicking in some rooms the server is not in.

Full notes: https://github.com/element-hq/synapse/blob/v1.166.0/CHANGES.md`,
    es_ES: `Actualiza Synapse a 1.166.0.

- Corrige descargas de medios remotos que podían fallar a través de la federación y evita que las descargas de medios y vistas previas de URL fallidas dejen archivos vacíos.
- Corrige salas ausentes en la sincronización y errores al salir, invitar, vetar o expulsar en algunas salas en las que el servidor no participa.

Notas completas: https://github.com/element-hq/synapse/blob/v1.166.0/CHANGES.md`,
    de_DE: `Aktualisiert Synapse auf 1.166.0.

- Behebt Downloads entfernter Medien, die über die Föderation fehlschlagen konnten, und verhindert, dass fehlgeschlagene Mediendownloads und URL-Vorschauen leere Dateien hinterlassen.
- Behebt fehlende Räume bei der Synchronisierung sowie Fehler beim Verlassen, Einladen, Sperren oder Entfernen in manchen Räumen, in denen der Server nicht Mitglied ist.

Vollständige Hinweise: https://github.com/element-hq/synapse/blob/v1.166.0/CHANGES.md`,
    pl_PL: `Aktualizuje Synapse do 1.166.0.

- Naprawia pobieranie zdalnych multimediów, które mogło kończyć się niepowodzeniem przez federację, i zapobiega pozostawianiu pustych plików przez nieudane pobrania multimediów i podglądy adresów URL.
- Naprawia brakujące pokoje podczas synchronizacji oraz błędy przy opuszczaniu, zapraszaniu, banowaniu lub wyrzucaniu w niektórych pokojach, w których serwer nie uczestniczy.

Pełne informacje: https://github.com/element-hq/synapse/blob/v1.166.0/CHANGES.md`,
    fr_FR: `Met à jour Synapse vers 1.166.0.

- Corrige les téléchargements de médias distants qui pouvaient échouer via la fédération, et empêche les téléchargements de médias et aperçus d'URL échoués de laisser des fichiers vides.
- Corrige des salons absents de la synchronisation et des erreurs lors du départ, de l'invitation, du bannissement ou de l'expulsion dans certains salons dont le serveur ne fait pas partie.

Notes complètes : https://github.com/element-hq/synapse/blob/v1.166.0/CHANGES.md`,
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
