import { VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '1.158.0:1',
  releaseNotes: {
    en_US: `Adds a migration path for homeservers hosted elsewhere, plus call relay and two new configuration controls.

- New **Import Existing Homeserver** action adopts the identity, database and media of a Matrix homeserver you already run somewhere else. Its users keep their accounts, their logins and their history.
- New optional dependency on **Coturn** relays voice and video calls through NAT and restrictive firewalls. Turn it on under **Voice and Video Calls** in the Config action.
- Config gains a **Presence** toggle and a **Remote Media Retention** period, which caps the disk and backup growth caused by cached media from other homeservers.
- **Registration** is now three-way: Disabled, **Invite Only**, or Open. Invite Only lets people sign up with a registration token you create and revoke in the Admin Dashboard, which is the middle ground the old on/off switch never had.
- New **Large Room Protection** refuses joins to rooms bigger than your server can comfortably handle, the first thing that flattens a home homeserver.
- New **Log Level** setting. Logging was pinned to Info and rewritten on every start; Warning is much quieter for day-to-day running.
- The room summary API (MSC3266) is now enabled, which current-generation mobile clients require.
- Synapse now evicts caches before it can eat the box. The ceiling is derived from your server's RAM and sized to stay out of the way in normal use.`,
    es_ES: `Añade una ruta de migración para servidores alojados en otro sitio, además de retransmisión de llamadas y dos controles de configuración nuevos.

- La nueva acción **Importar servidor existente** adopta la identidad, la base de datos y los medios de un servidor Matrix que ya tenga en otro lugar. Sus usuarios conservan sus cuentas, sus sesiones y su historial.
- La nueva dependencia opcional de **Coturn** retransmite las llamadas de voz y vídeo a través de NAT y de cortafuegos restrictivos. Actívela en **Llamadas de voz y vídeo** dentro de la acción Configuración.
- Configuración incorpora un interruptor de **Presencia** y un periodo de **Retención de medios remotos**, que limita el crecimiento de disco y de copias de seguridad causado por los medios en caché de otros servidores.
- El **Registro** es ahora de tres estados: Deshabilitado, **Solo con invitación** o Abierto. «Solo con invitación» permite registrarse con un token que usted crea y revoca en el panel de administración: el término medio que el antiguo interruptor no ofrecía.
- La nueva **Protección frente a salas grandes** rechaza la entrada a salas mayores de lo que su servidor puede manejar con soltura, lo primero que tumba un servidor doméstico.
- Nueva opción de **Nivel de registro**. El registro estaba fijado en «Info» y se reescribía en cada arranque; «Advertencia» es mucho más silencioso para el día a día.
- Se habilita la API de resumen de salas (MSC3266), que requieren los clientes móviles de la generación actual.
- Synapse ahora purga sus cachés antes de poder comerse el servidor. El límite se deriva de la RAM de su máquina y está dimensionado para no estorbar en el uso normal.`,
    de_DE: `Ergänzt einen Migrationsweg für anderswo betriebene Homeserver sowie ein Anruf-Relay und zwei neue Konfigurationsregler.

- Die neue Aktion **Bestehenden Homeserver importieren** übernimmt Identität, Datenbank und Medien eines Matrix-Homeservers, den Sie bereits woanders betreiben. Dessen Nutzer behalten ihre Konten, ihre Anmeldungen und ihren Verlauf.
- Die neue optionale Abhängigkeit **Coturn** leitet Sprach- und Videoanrufe durch NAT und restriktive Firewalls. Einschalten unter **Sprach- und Videoanrufe** in der Aktion Konfiguration.
- Die Konfiguration erhält einen **Anwesenheit**-Schalter und eine **Aufbewahrung entfernter Medien**, die das durch zwischengespeicherte Medien anderer Homeserver verursachte Wachstum von Speicher und Backups begrenzt.
- Die **Registrierung** ist jetzt dreistufig: Deaktiviert, **Nur mit Einladung** oder Offen. „Nur mit Einladung“ lässt Personen sich mit einem Token anmelden, das Sie im Admin-Dashboard erstellen und widerrufen — der Mittelweg, den der alte Schalter nie bot.
- Der neue **Schutz vor großen Räumen** lehnt den Beitritt zu Räumen ab, die größer sind, als Ihr Server bequem verkraftet — der erste Grund, an dem ein Heim-Homeserver scheitert.
- Neue Einstellung **Protokollstufe**. Das Protokoll war auf „Info“ festgenagelt und wurde bei jedem Start überschrieben; „Warnung“ ist im Alltag deutlich ruhiger.
- Die Raumzusammenfassungs-API (MSC3266) ist nun aktiviert, die aktuelle mobile Clients voraussetzen.
- Synapse räumt seine Caches jetzt auf, bevor es den Server auffressen kann. Die Obergrenze wird aus dem Arbeitsspeicher Ihrer Maschine abgeleitet und ist so bemessen, dass sie im Normalbetrieb nicht stört.`,
    pl_PL: `Dodaje ścieżkę migracji dla serwerów prowadzonych gdzie indziej, a także przekazywanie połączeń i dwa nowe ustawienia konfiguracji.

- Nowa akcja **Importuj istniejący serwer** przejmuje tożsamość, bazę danych i media serwera Matrix, który już prowadzisz w innym miejscu. Jego użytkownicy zachowują konta, sesje i historię.
- Nowa opcjonalna zależność **Coturn** przekazuje połączenia głosowe i wideo przez NAT i restrykcyjne zapory. Włącz ją w **Połączenia głosowe i wideo** w akcji Konfiguracja.
- Konfiguracja zyskuje przełącznik **Obecność** oraz okres **Przechowywania mediów zdalnych**, który ogranicza przyrost miejsca na dysku i rozmiaru kopii zapasowych powodowany przez media z innych serwerów.
- **Rejestracja** ma teraz trzy stany: Wyłączona, **Tylko z zaproszeniem** lub Otwarta. „Tylko z zaproszeniem” pozwala rejestrować się za pomocą tokenu, który tworzysz i unieważniasz w panelu administracyjnym — to złoty środek, którego dawny przełącznik nie dawał.
- Nowa **Ochrona przed dużymi pokojami** odrzuca dołączanie do pokoi większych, niż serwer jest w stanie swobodnie obsłużyć — pierwszy problem, na którym przewraca się domowy serwer.
- Nowe ustawienie **Poziom logowania**. Logi były przypięte do „Info” i nadpisywane przy każdym starcie; „Ostrzeżenia” są znacznie cichsze na co dzień.
- Włączono API podsumowania pokoi (MSC3266), wymagane przez obecną generację klientów mobilnych.
- Synapse czyści teraz pamięci podręczne, zanim zdąży zająć całą maszynę. Limit wyliczany jest z ilości RAM Twojego serwera i dobrany tak, by nie przeszkadzać w normalnej pracy.`,
    fr_FR: `Ajoute un chemin de migration pour les serveurs hébergés ailleurs, ainsi que le relais d'appels et deux nouveaux réglages de configuration.

- La nouvelle action **Importer un serveur existant** reprend l'identité, la base de données et les médias d'un serveur Matrix que vous hébergez déjà ailleurs. Ses utilisateurs conservent leurs comptes, leurs sessions et leur historique.
- La nouvelle dépendance optionnelle **Coturn** relaie les appels audio et vidéo à travers le NAT et les pare-feu restrictifs. Activez-la dans **Appels audio et vidéo** de l'action Configuration.
- La configuration gagne un interrupteur **Présence** et une durée de **Rétention des médias distants**, qui limite la croissance du disque et des sauvegardes causée par les médias mis en cache depuis d'autres serveurs.
- L'**inscription** est désormais à trois états : Désactivée, **Sur invitation** ou Ouverte. « Sur invitation » permet de s'inscrire avec un jeton que vous créez et révoquez dans le tableau de bord d'administration — le juste milieu que l'ancien interrupteur n'offrait pas.
- La nouvelle **protection contre les grands salons** refuse de rejoindre des salons plus gros que ce que votre serveur encaisse confortablement, la première chose qui met à genoux un serveur domestique.
- Nouveau réglage **Niveau de journalisation**. Les journaux étaient figés sur « Info » et réécrits à chaque démarrage ; « Avertissement » est bien plus discret au quotidien.
- L'API de résumé de salon (MSC3266) est désormais activée ; les clients mobiles actuels en dépendent.
- Synapse purge désormais ses caches avant de pouvoir dévorer la machine. Le plafond est déduit de la RAM de votre serveur et dimensionné pour ne pas gêner en usage normal.`,
  },
  migrations: {},
})
