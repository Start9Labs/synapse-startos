import { VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '1.158.0:2',
  releaseNotes: {
    en_US: `Splits the settings into clearer actions and improves how images reach your users.

- **Media** is a new action, holding the upload limit, the new image and thumbnail settings, and how long other servers' files are kept. **Federation** is a new action too, holding federation, the domain whitelist and large-room protection. Both were previously buried in Config.
- **Images from modern phone cameras now get thumbnails.** Synapse refuses to thumbnail anything above roughly 32 megapixels, which current phones exceed in their ordinary mode — the picture then arrives as a full-size download or not at all. This raises the limit to roughly 64 megapixels.
- **Thumbnails are prepared at sizes a modern phone screen can use.** Synapse's largest was 800x600, which a high-density display upscales into something soft; two larger sizes are now generated as well. Set **Thumbnails** back to Standard in the Media action if you would rather save the disk space.
- **Sync responses are cached for five minutes rather than two**, which spares the server repeated work from phones that keep dropping and re-establishing their connection.
- **Rate Limits** gains a per-person speed limit for downloading files from other servers, so one person working through a photo-heavy backlog no longer competes with everyone else.
- **Set Admin Password now asks for confirmation.** It generates a new password and restarts the homeserver, which is not what you want from a single stray click.`,
    es_ES: `Divide los ajustes en acciones más claras y mejora cómo llegan las imágenes a sus usuarios.

- **Multimedia** es una acción nueva, con el límite de subida, los nuevos ajustes de imágenes y miniaturas, y cuánto tiempo se conservan los archivos de otros servidores. **Federación** también es una acción nueva, con la federación, la lista blanca de dominios y la protección frente a salas grandes. Antes ambas estaban enterradas en Configuración.
- **Las imágenes de las cámaras de los teléfonos actuales ya reciben miniatura.** Synapse se niega a generar miniaturas por encima de unos 32 megapíxeles, cifra que los teléfonos actuales superan en su modo normal: la imagen llega entonces como descarga a tamaño completo, o no llega. Ahora el límite sube a unos 64 megapíxeles.
- **Las miniaturas se preparan en tamaños que una pantalla de teléfono actual puede aprovechar.** La mayor de Synapse era de 800x600, que una pantalla de alta densidad amplía hasta verse borrosa; ahora se generan además dos tamaños mayores. Ponga **Miniaturas** en Estándar dentro de la acción Multimedia si prefiere ahorrar espacio en disco.
- **Las respuestas de sincronización se guardan en caché cinco minutos en lugar de dos**, lo que ahorra al servidor trabajo repetido de los teléfonos que pierden y rehacen la conexión constantemente.
- **Límites de frecuencia** incorpora un límite de velocidad por persona para descargar archivos de otros servidores, de modo que quien recorra un historial lleno de fotos ya no compite con los demás.
- **Establecer contraseña de administrador ahora pide confirmación.** Genera una contraseña nueva y reinicia el servidor, que no es lo que uno espera de un clic accidental.`,
    de_DE: `Teilt die Einstellungen in klarere Aktionen auf und verbessert, wie Bilder bei Ihren Nutzern ankommen.

- **Medien** ist eine neue Aktion mit dem Upload-Limit, den neuen Bild- und Vorschaubild-Einstellungen und der Aufbewahrungsdauer für Dateien anderer Server. **Föderation** ist ebenfalls neu und enthält Föderation, Domain-Whitelist und den Schutz vor großen Räumen. Beide steckten zuvor in der Konfiguration.
- **Bilder aktueller Handykameras erhalten jetzt Vorschaubilder.** Synapse erzeugt oberhalb von rund 32 Megapixeln keine mehr — ein Wert, den heutige Telefone im Normalmodus überschreiten; das Bild kommt dann als Download in voller Größe an oder gar nicht. Die Grenze steigt auf rund 64 Megapixel.
- **Vorschaubilder entstehen in Größen, die ein modernes Handydisplay nutzen kann.** Synapses größte war 800x600, die ein hochauflösendes Display unscharf hochskaliert; zwei größere Formate kommen hinzu. Stellen Sie **Vorschaubilder** in der Aktion Medien auf Standard zurück, wenn Ihnen der Speicherplatz wichtiger ist.
- **Sync-Antworten werden fünf statt zwei Minuten zwischengespeichert**, was dem Server wiederholte Arbeit durch Telefone erspart, die ihre Verbindung ständig verlieren und neu aufbauen.
- **Ratenbegrenzungen** erhält ein Tempolimit pro Person für das Herunterladen von Dateien anderer Server, sodass jemand, der einen fotolastigen Verlauf durchgeht, nicht mehr mit allen anderen konkurriert.
- **Administratorpasswort setzen fragt jetzt nach.** Die Aktion erzeugt ein neues Passwort und startet den Homeserver neu — nichts, was man sich von einem versehentlichen Klick wünscht.`,
    pl_PL: `Dzieli ustawienia na czytelniejsze akcje i poprawia sposób, w jaki obrazy docierają do użytkowników.

- **Multimedia** to nowa akcja zawierająca limit wysyłania, nowe ustawienia obrazów i miniatur oraz czas przechowywania plików z innych serwerów. **Federacja** to również nowa akcja: federacja, biała lista domen i ochrona przed dużymi pokojami. Obie były wcześniej ukryte w Konfiguracji.
- **Zdjęcia z aparatów współczesnych telefonów wreszcie dostają miniatury.** Synapse odmawia tworzenia miniatur powyżej mniej więcej 32 megapikseli, co obecne telefony przekraczają w zwykłym trybie — obraz przychodzi wtedy jako pełne pobranie albo wcale. Limit rośnie do około 64 megapikseli.
- **Miniatury powstają w rozmiarach, z których potrafi skorzystać współczesny ekran telefonu.** Największa w Synapse miała 800x600, co ekran o dużej gęstości pikseli powiększa do nieostrego obrazu; teraz powstają też dwa większe rozmiary. Ustaw **Miniatury** z powrotem na Standardowe w akcji Multimedia, jeśli wolisz oszczędzić miejsce na dysku.
- **Odpowiedzi synchronizacji są buforowane przez pięć minut zamiast dwóch**, co oszczędza serwerowi powtarzanej pracy przy telefonach stale tracących i wznawiających połączenie.
- **Limity częstotliwości** zyskują limit prędkości pobierania plików z innych serwerów, liczony osobno dla każdej osoby, więc ktoś przeglądający historię pełną zdjęć nie konkuruje już z resztą.
- **Ustawienie hasła administratora prosi teraz o potwierdzenie.** Akcja generuje nowe hasło i restartuje serwer, a tego nie chce się po przypadkowym kliknięciu.`,
    fr_FR: `Répartit les réglages en actions plus lisibles et améliore la façon dont les images parviennent à vos utilisateurs.

- **Médias** est une nouvelle action : limite de téléversement, nouveaux réglages d'images et de miniatures, et durée de conservation des fichiers des autres serveurs. **Fédération** est également nouvelle : fédération, liste blanche de domaines et protection contre les grands salons. Les deux étaient auparavant noyées dans Configuration.
- **Les photos des appareils des téléphones actuels obtiennent enfin une miniature.** Synapse refuse d'en produire au-delà d'environ 32 mégapixels, seuil que les téléphones d'aujourd'hui dépassent en mode ordinaire : l'image arrive alors en téléchargement pleine taille, ou pas du tout. La limite passe à environ 64 mégapixels.
- **Les miniatures sont préparées dans des tailles exploitables par un écran de téléphone moderne.** La plus grande de Synapse était 800x600, qu'un écran haute densité agrandit jusqu'au flou ; deux tailles supérieures sont désormais produites. Remettez **Miniatures** sur Standard dans l'action Médias si vous préférez économiser l'espace disque.
- **Les réponses de synchronisation sont mises en cache cinq minutes au lieu de deux**, ce qui épargne au serveur le travail répété des téléphones qui perdent et rétablissent sans cesse leur connexion.
- **Limites de débit** gagne une limite de vitesse par personne pour le téléchargement des fichiers des autres serveurs : quelqu'un qui parcourt un historique riche en photos ne concurrence plus tout le monde.
- **Définir le mot de passe administrateur demande désormais confirmation.** L'action génère un nouveau mot de passe et redémarre le serveur, ce qu'on ne souhaite pas d'un clic malencontreux.`,
  },
  migrations: {},
})
