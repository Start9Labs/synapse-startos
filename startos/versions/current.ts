import { VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '1.159.0:1',
  releaseNotes: {
    en_US: `Updated the StartOS wrapper for Synapse 1.159.0.

- **Private Tailnet setup now works entirely through the UI.** After serving the Homeserver interface through Tailscale as private HTTPS on port 443, its MagicDNS address appears in the permanent server-address task. The task rejects stale addresses and returns the exact Element homeserver URL.

- **Photos taken in some phone camera modes now get thumbnails.** An MPO image — what a phone writes when it captures depth or several exposures at once — previously failed to thumbnail at all, and an animation Synapse could not decode did the same. Both now produce a still thumbnail.
- **Synapse's log lines appear as they happen**, rather than arriving in bursts once its output buffer fills.
- Database connections left idle inside a transaction are closed after thirty minutes, so a stuck connection no longer holds locks or blocks routine cleanup.

Full release notes: https://github.com/element-hq/synapse/blob/release-v1.159/CHANGES.md`,
    es_ES: `Actualiza el paquete StartOS de Synapse 1.159.0.

- **La configuración privada por Tailnet ahora se completa desde la interfaz.** Después de publicar la interfaz Servidor mediante Tailscale como HTTPS privado en el puerto 443, su dirección MagicDNS aparece en la tarea de dirección permanente. La tarea rechaza direcciones obsoletas y devuelve la URL exacta para Element.

- **Las fotos tomadas en algunos modos de cámara ya obtienen miniatura.** Una imagen MPO —lo que escribe un teléfono cuando captura profundidad o varias exposiciones a la vez— no llegaba a tener miniatura, y lo mismo ocurría con una animación que Synapse no pudiera decodificar. Ahora ambas producen una miniatura fija.
- **Las líneas de registro de Synapse aparecen en el momento**, en lugar de llegar a ráfagas cuando se llena su búfer de salida.
- Las conexiones a la base de datos que quedan inactivas dentro de una transacción se cierran a los treinta minutos, de modo que una conexión atascada ya no retiene bloqueos ni impide la limpieza rutinaria.

Notas de la versión completas: https://github.com/element-hq/synapse/blob/release-v1.159/CHANGES.md`,
    de_DE: `Aktualisiert das StartOS-Paket für Synapse 1.159.0.

- **Die private Tailnet-Einrichtung funktioniert jetzt vollständig über die Oberfläche.** Nachdem die Homeserver-Schnittstelle über Tailscale als privates HTTPS auf Port 443 veröffentlicht wurde, erscheint ihre MagicDNS-Adresse in der Aufgabe für die permanente Serveradresse. Die Aufgabe lehnt veraltete Adressen ab und gibt die genaue Element-Homeserver-URL zurück.

- **Fotos aus bestimmten Kameramodi erhalten jetzt Vorschaubilder.** Ein MPO-Bild — was ein Telefon schreibt, wenn es Tiefe oder mehrere Belichtungen zugleich aufnimmt — bekam bisher gar kein Vorschaubild, ebenso wenig eine Animation, die Synapse nicht dekodieren konnte. Beide liefern nun ein unbewegtes Vorschaubild.
- **Die Logzeilen von Synapse erscheinen sofort**, statt schubweise einzutreffen, sobald sich der Ausgabepuffer füllt.
- Datenbankverbindungen, die innerhalb einer Transaktion untätig bleiben, werden nach dreißig Minuten geschlossen, sodass eine hängende Verbindung keine Sperren mehr hält und die routinemäßige Bereinigung nicht blockiert.

Vollständige Versionshinweise: https://github.com/element-hq/synapse/blob/release-v1.159/CHANGES.md`,
    pl_PL: `Aktualizuje pakiet StartOS dla Synapse 1.159.0.

- **Prywatną konfigurację Tailnet można teraz wykonać w całości w interfejsie.** Po udostępnieniu interfejsu Homeserver przez Tailscale jako prywatnego HTTPS na porcie 443 jego adres MagicDNS pojawia się w zadaniu stałego adresu serwera. Zadanie odrzuca nieaktualne adresy i zwraca dokładny adres serwera dla Element.

- **Zdjęcia z niektórych trybów aparatu wreszcie dostają miniatury.** Obraz MPO — taki, jaki telefon zapisuje przy rejestrowaniu głębi lub kilku ekspozycji naraz — w ogóle nie doczekiwał się miniatury, podobnie jak animacja, której Synapse nie potrafił zdekodować. Teraz oba dają nieruchomą miniaturę.
- **Wiersze dziennika Synapse pojawiają się na bieżąco**, zamiast przychodzić partiami po zapełnieniu bufora wyjścia.
- Połączenia z bazą danych bezczynne wewnątrz transakcji są zamykane po trzydziestu minutach, więc zablokowane połączenie nie trzyma już blokad ani nie wstrzymuje rutynowego sprzątania.

Pełne informacje o wydaniu: https://github.com/element-hq/synapse/blob/release-v1.159/CHANGES.md`,
    fr_FR: `Met à jour le paquet StartOS de Synapse 1.159.0.

- **La configuration Tailnet privée fonctionne maintenant entièrement dans l'interface.** Après avoir publié l'interface Homeserver avec Tailscale en HTTPS privé sur le port 443, son adresse MagicDNS apparaît dans la tâche d'adresse permanente. La tâche refuse les adresses obsolètes et renvoie l'URL exacte du serveur pour Element.

- **Les photos prises dans certains modes de l'appareil obtiennent enfin une miniature.** Une image MPO — ce qu'un téléphone écrit lorsqu'il capture la profondeur ou plusieurs expositions à la fois — n'en obtenait aucune, pas plus qu'une animation que Synapse ne parvenait pas à décoder. Les deux produisent désormais une miniature fixe.
- **Les lignes de journal de Synapse apparaissent au fil de l'eau**, au lieu d'arriver par salves une fois sa mémoire tampon de sortie remplie.
- Les connexions à la base de données restées inactives à l'intérieur d'une transaction sont fermées au bout de trente minutes : une connexion bloquée ne retient donc plus de verrous et n'empêche plus le nettoyage courant.

Notes de version complètes : https://github.com/element-hq/synapse/blob/release-v1.159/CHANGES.md`,
  },
  migrations: {},
})
