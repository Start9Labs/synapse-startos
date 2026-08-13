import { VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '1.158.0:1',
  releaseNotes: {
    en_US: `Adds a migration path for homeservers hosted elsewhere, plus call relay and two new configuration controls.

- New **Import Existing Homeserver** action adopts the identity, database and media of a Matrix homeserver you already run somewhere else. Its users keep their accounts, their logins and their history.
- New optional dependency on **Coturn** relays voice and video calls through NAT and restrictive firewalls. Turn it on under **Voice and Video Calls** in the Config action.
- Config gains a **Presence** toggle and a **Remote Media Retention** period, which caps the disk and backup growth caused by cached media from other homeservers.`,
    es_ES: `Añade una ruta de migración para servidores alojados en otro sitio, además de retransmisión de llamadas y dos controles de configuración nuevos.

- La nueva acción **Importar servidor existente** adopta la identidad, la base de datos y los medios de un servidor Matrix que ya tenga en otro lugar. Sus usuarios conservan sus cuentas, sus sesiones y su historial.
- La nueva dependencia opcional de **Coturn** retransmite las llamadas de voz y vídeo a través de NAT y de cortafuegos restrictivos. Actívela en **Llamadas de voz y vídeo** dentro de la acción Configuración.
- Configuración incorpora un interruptor de **Presencia** y un periodo de **Retención de medios remotos**, que limita el crecimiento de disco y de copias de seguridad causado por los medios en caché de otros servidores.`,
    de_DE: `Ergänzt einen Migrationsweg für anderswo betriebene Homeserver sowie ein Anruf-Relay und zwei neue Konfigurationsregler.

- Die neue Aktion **Bestehenden Homeserver importieren** übernimmt Identität, Datenbank und Medien eines Matrix-Homeservers, den Sie bereits woanders betreiben. Dessen Nutzer behalten ihre Konten, ihre Anmeldungen und ihren Verlauf.
- Die neue optionale Abhängigkeit **Coturn** leitet Sprach- und Videoanrufe durch NAT und restriktive Firewalls. Einschalten unter **Sprach- und Videoanrufe** in der Aktion Konfiguration.
- Die Konfiguration erhält einen **Anwesenheit**-Schalter und eine **Aufbewahrung entfernter Medien**, die das durch zwischengespeicherte Medien anderer Homeserver verursachte Wachstum von Speicher und Backups begrenzt.`,
    pl_PL: `Dodaje ścieżkę migracji dla serwerów prowadzonych gdzie indziej, a także przekazywanie połączeń i dwa nowe ustawienia konfiguracji.

- Nowa akcja **Importuj istniejący serwer** przejmuje tożsamość, bazę danych i media serwera Matrix, który już prowadzisz w innym miejscu. Jego użytkownicy zachowują konta, sesje i historię.
- Nowa opcjonalna zależność **Coturn** przekazuje połączenia głosowe i wideo przez NAT i restrykcyjne zapory. Włącz ją w **Połączenia głosowe i wideo** w akcji Konfiguracja.
- Konfiguracja zyskuje przełącznik **Obecność** oraz okres **Przechowywania mediów zdalnych**, który ogranicza przyrost miejsca na dysku i rozmiaru kopii zapasowych powodowany przez media z innych serwerów.`,
    fr_FR: `Ajoute un chemin de migration pour les serveurs hébergés ailleurs, ainsi que le relais d'appels et deux nouveaux réglages de configuration.

- La nouvelle action **Importer un serveur existant** reprend l'identité, la base de données et les médias d'un serveur Matrix que vous hébergez déjà ailleurs. Ses utilisateurs conservent leurs comptes, leurs sessions et leur historique.
- La nouvelle dépendance optionnelle **Coturn** relaie les appels audio et vidéo à travers le NAT et les pare-feu restrictifs. Activez-la dans **Appels audio et vidéo** de l'action Configuration.
- La configuration gagne un interrupteur **Présence** et une durée de **Rétention des médias distants**, qui limite la croissance du disque et des sauvegardes causée par les médias mis en cache depuis d'autres serveurs.`,
  },
  migrations: {},
})
