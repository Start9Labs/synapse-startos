import { VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '1.159.0:0',
  releaseNotes: {
    en_US: `Updated Synapse to 1.159.0, a small maintenance release.

- **Photos taken in some phone camera modes now get thumbnails.** An MPO image — what a phone writes when it captures depth or several exposures at once — previously failed to thumbnail at all, and an animation Synapse could not decode did the same. Both now produce a still thumbnail.
- **Synapse's log lines appear as they happen**, rather than arriving in bursts once its output buffer fills.
- Database connections left idle inside a transaction are closed after thirty minutes, so a stuck connection no longer holds locks or blocks routine cleanup.

Full release notes: https://github.com/element-hq/synapse/blob/release-v1.159/CHANGES.md`,
    es_ES: `Actualiza Synapse a 1.159.0, una versión de mantenimiento menor.

- **Las fotos tomadas en algunos modos de cámara ya obtienen miniatura.** Una imagen MPO —lo que escribe un teléfono cuando captura profundidad o varias exposiciones a la vez— no llegaba a tener miniatura, y lo mismo ocurría con una animación que Synapse no pudiera decodificar. Ahora ambas producen una miniatura fija.
- **Las líneas de registro de Synapse aparecen en el momento**, en lugar de llegar a ráfagas cuando se llena su búfer de salida.
- Las conexiones a la base de datos que quedan inactivas dentro de una transacción se cierran a los treinta minutos, de modo que una conexión atascada ya no retiene bloqueos ni impide la limpieza rutinaria.

Notas de la versión completas: https://github.com/element-hq/synapse/blob/release-v1.159/CHANGES.md`,
    de_DE: `Aktualisiert Synapse auf 1.159.0, eine kleine Wartungsversion.

- **Fotos aus bestimmten Kameramodi erhalten jetzt Vorschaubilder.** Ein MPO-Bild — was ein Telefon schreibt, wenn es Tiefe oder mehrere Belichtungen zugleich aufnimmt — bekam bisher gar kein Vorschaubild, ebenso wenig eine Animation, die Synapse nicht dekodieren konnte. Beide liefern nun ein unbewegtes Vorschaubild.
- **Die Logzeilen von Synapse erscheinen sofort**, statt schubweise einzutreffen, sobald sich der Ausgabepuffer füllt.
- Datenbankverbindungen, die innerhalb einer Transaktion untätig bleiben, werden nach dreißig Minuten geschlossen, sodass eine hängende Verbindung keine Sperren mehr hält und die routinemäßige Bereinigung nicht blockiert.

Vollständige Versionshinweise: https://github.com/element-hq/synapse/blob/release-v1.159/CHANGES.md`,
    pl_PL: `Aktualizuje Synapse do 1.159.0, niewielkie wydanie konserwacyjne.

- **Zdjęcia z niektórych trybów aparatu wreszcie dostają miniatury.** Obraz MPO — taki, jaki telefon zapisuje przy rejestrowaniu głębi lub kilku ekspozycji naraz — w ogóle nie doczekiwał się miniatury, podobnie jak animacja, której Synapse nie potrafił zdekodować. Teraz oba dają nieruchomą miniaturę.
- **Wiersze dziennika Synapse pojawiają się na bieżąco**, zamiast przychodzić partiami po zapełnieniu bufora wyjścia.
- Połączenia z bazą danych bezczynne wewnątrz transakcji są zamykane po trzydziestu minutach, więc zablokowane połączenie nie trzyma już blokad ani nie wstrzymuje rutynowego sprzątania.

Pełne informacje o wydaniu: https://github.com/element-hq/synapse/blob/release-v1.159/CHANGES.md`,
    fr_FR: `Met à jour Synapse vers 1.159.0, une petite version de maintenance.

- **Les photos prises dans certains modes de l'appareil obtiennent enfin une miniature.** Une image MPO — ce qu'un téléphone écrit lorsqu'il capture la profondeur ou plusieurs expositions à la fois — n'en obtenait aucune, pas plus qu'une animation que Synapse ne parvenait pas à décoder. Les deux produisent désormais une miniature fixe.
- **Les lignes de journal de Synapse apparaissent au fil de l'eau**, au lieu d'arriver par salves une fois sa mémoire tampon de sortie remplie.
- Les connexions à la base de données restées inactives à l'intérieur d'une transaction sont fermées au bout de trente minutes : une connexion bloquée ne retient donc plus de verrous et n'empêche plus le nettoyage courant.

Notes de version complètes : https://github.com/element-hq/synapse/blob/release-v1.159/CHANGES.md`,
  },
  migrations: {},
})
