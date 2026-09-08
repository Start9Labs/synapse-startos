import { VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '1.160.0:1',
  releaseNotes: {
    en_US: `Updated the Ketesa admin dashboard to 1.5.0.

- Room deletion now offers controls to purge all room data and to force a purge when local users remain in the room.
- Media downloads no longer fail because of a malformed URL.

Full release notes: https://github.com/etkecc/ketesa/releases/tag/v1.5.0`,
    es_ES: `Actualiza el panel de administración Ketesa a la versión 1.5.0.

- La eliminación de salas ahora ofrece controles para purgar todos sus datos y forzar la purga cuando aún hay usuarios locales en la sala.
- Las descargas multimedia ya no fallan debido a una URL mal formada.

Notas de la versión completas: https://github.com/etkecc/ketesa/releases/tag/v1.5.0`,
    de_DE: `Aktualisiert das Ketesa-Admin-Dashboard auf Version 1.5.0.

- Beim Löschen von Räumen kann nun festgelegt werden, ob sämtliche Raumdaten gelöscht werden und ob die Löschung erzwungen wird, wenn sich noch lokale Benutzer im Raum befinden.
- Medien-Downloads schlagen nicht mehr aufgrund einer fehlerhaften URL fehl.

Vollständige Versionshinweise: https://github.com/etkecc/ketesa/releases/tag/v1.5.0`,
    pl_PL: `Aktualizuje panel administracyjny Ketesa do wersji 1.5.0.

- Usuwanie pokoju udostępnia teraz opcje wyczyszczenia wszystkich jego danych oraz wymuszenia czyszczenia, gdy w pokoju nadal znajdują się lokalni użytkownicy.
- Pobieranie multimediów nie kończy się już niepowodzeniem z powodu nieprawidłowego adresu URL.

Pełne informacje o wydaniu: https://github.com/etkecc/ketesa/releases/tag/v1.5.0`,
    fr_FR: `Met à jour le tableau de bord d'administration Ketesa vers la version 1.5.0.

- La suppression d'un salon permet désormais de purger toutes ses données et de forcer la purge lorsque des utilisateurs locaux sont encore présents.
- Le téléchargement de médias n'échoue plus à cause d'une URL mal formée.

Notes de version complètes : https://github.com/etkecc/ketesa/releases/tag/v1.5.0`,
  },
  migrations: {},
})
