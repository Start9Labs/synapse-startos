import { VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '1.157.1:0',
  releaseNotes: {
    en_US: `Updated Synapse to 1.157.1 and the Ketesa admin dashboard to 1.4.0.

Synapse:
- Fixes a 1.156.0 regression where application services using the legacy ephemeral-events registration flag stopped receiving ephemeral events, including the to-device messages used for encryption.
- Fixes reactivating a deactivated-and-erased user not restoring their profile, which had broken login, display-name changes, and invitations.
- Adds an exclude_rooms_from_presence option and new presence-tuning settings, and tightens Sliding Sync locking to prevent repeated deadlocks.
- Removes experimental MSC3861 auth delegation in favor of the stable Matrix Authentication Service integration.
- 1.157.1 fixes a config regression that rejected falsy experimental_features values.

Ketesa:
- The login and discovery screens now honor wellKnownDiscovery: false and no longer rewrite the server URL you enter.
- User-list filters moved behind a Filter button for a tidier toolbar, and Matrix Authentication Service mode now shows the admin flag and user type correctly.

Full release notes: https://github.com/element-hq/synapse/releases/tag/v1.157.1 and https://github.com/etkecc/ketesa/releases/tag/v1.4.0`,
    es_ES: `Actualiza Synapse a 1.157.1 y el panel de administración Ketesa a 1.4.0.

Synapse:
- Corrige una regresión de la versión 1.156.0 por la que los servicios de aplicación que usaban el antiguo indicador de registro de eventos efímeros dejaban de recibirlos, incluidos los mensajes «to-device» usados para el cifrado.
- Corrige que reactivar a un usuario desactivado y borrado no restaurara su perfil, lo que había roto el inicio de sesión, los cambios de nombre y las invitaciones.
- Añade la opción exclude_rooms_from_presence y nuevos ajustes de presencia, y refuerza el bloqueo de Sliding Sync para evitar bloqueos repetidos.
- Elimina la delegación de autenticación experimental MSC3861 en favor de la integración estable con Matrix Authentication Service.
- La versión 1.157.1 corrige una regresión de configuración que rechazaba los valores «falsy» de experimental_features.

Ketesa:
- Las pantallas de inicio de sesión y descubrimiento ahora respetan wellKnownDiscovery: false y ya no reescriben la URL del servidor que introduces.
- Los filtros de la lista de usuarios se han movido tras un botón «Filtrar» para una barra de herramientas más despejada, y el modo Matrix Authentication Service ahora muestra correctamente el indicador de administrador y el tipo de usuario.

Notas de la versión completas: https://github.com/element-hq/synapse/releases/tag/v1.157.1 y https://github.com/etkecc/ketesa/releases/tag/v1.4.0`,
    de_DE: `Aktualisiert Synapse auf 1.157.1 und das Ketesa-Administrationsdashboard auf 1.4.0.

Synapse:
- Behebt eine Regression aus 1.156.0, durch die Application Services, die das alte Registrierungs-Flag für ephemere Ereignisse nutzten, keine ephemeren Ereignisse mehr erhielten – einschließlich der für die Verschlüsselung verwendeten To-Device-Nachrichten.
- Behebt, dass beim Reaktivieren eines deaktivierten und gelöschten Benutzers dessen Profil nicht wiederhergestellt wurde, was Anmeldung, Namensänderungen und Einladungen unterbrach.
- Fügt die Option exclude_rooms_from_presence sowie neue Einstellungen zur Feinabstimmung der Präsenz hinzu und verschärft die Sperren in Sliding Sync, um wiederholte Deadlocks zu verhindern.
- Entfernt die experimentelle MSC3861-Auth-Delegation zugunsten der stabilen Integration mit dem Matrix Authentication Service.
- 1.157.1 behebt eine Konfigurationsregression, die „falsy“-Werte von experimental_features ablehnte.

Ketesa:
- Die Anmelde- und Discovery-Bildschirme berücksichtigen nun wellKnownDiscovery: false und schreiben die von dir eingegebene Server-URL nicht mehr um.
- Die Filter der Benutzerliste sind hinter einen „Filter“-Button gewandert, was die Symbolleiste übersichtlicher macht, und der Matrix-Authentication-Service-Modus zeigt Administrator-Flag und Benutzertyp nun korrekt an.

Vollständige Versionshinweise: https://github.com/element-hq/synapse/releases/tag/v1.157.1 und https://github.com/etkecc/ketesa/releases/tag/v1.4.0`,
    pl_PL: `Aktualizuje Synapse do 1.157.1 oraz panel administracyjny Ketesa do 1.4.0.

Synapse:
- Naprawia regresję z wersji 1.156.0, przez którą usługi aplikacyjne korzystające ze starej flagi rejestracji zdarzeń efemerycznych przestawały je otrzymywać, w tym wiadomości „to-device” używane do szyfrowania.
- Naprawia sytuację, w której ponowna aktywacja dezaktywowanego i wymazanego użytkownika nie przywracała jego profilu, co uniemożliwiało logowanie, zmianę nazwy i wysyłanie zaproszeń.
- Dodaje opcję exclude_rooms_from_presence oraz nowe ustawienia dostrajania obecności, a także wzmacnia blokady w Sliding Sync, aby zapobiec powtarzającym się zakleszczeniom.
- Usuwa eksperymentalną delegację uwierzytelniania MSC3861 na rzecz stabilnej integracji z Matrix Authentication Service.
- Wersja 1.157.1 naprawia regresję konfiguracji, która odrzucała „fałszywe” wartości experimental_features.

Ketesa:
- Ekrany logowania i wykrywania respektują teraz wellKnownDiscovery: false i nie przepisują już wpisanego adresu URL serwera.
- Filtry listy użytkowników przeniesiono za przycisk „Filtruj”, dzięki czemu pasek narzędzi jest bardziej przejrzysty, a tryb Matrix Authentication Service poprawnie pokazuje flagę administratora i typ użytkownika.

Pełne informacje o wydaniu: https://github.com/element-hq/synapse/releases/tag/v1.157.1 oraz https://github.com/etkecc/ketesa/releases/tag/v1.4.0`,
    fr_FR: `Met à jour Synapse vers 1.157.1 et le tableau de bord d'administration Ketesa vers 1.4.0.

Synapse :
- Corrige une régression de la version 1.156.0 par laquelle les services applicatifs utilisant l'ancien indicateur d'enregistrement des événements éphémères cessaient d'en recevoir, y compris les messages « to-device » utilisés pour le chiffrement.
- Corrige le fait que la réactivation d'un utilisateur désactivé et effacé ne restaurait pas son profil, ce qui avait rompu la connexion, les changements de nom et les invitations.
- Ajoute une option exclude_rooms_from_presence et de nouveaux réglages d'ajustement de la présence, et renforce le verrouillage de Sliding Sync pour éviter les interblocages répétés.
- Supprime la délégation d'authentification expérimentale MSC3861 au profit de l'intégration stable avec Matrix Authentication Service.
- La version 1.157.1 corrige une régression de configuration qui rejetait les valeurs « falsy » d'experimental_features.

Ketesa :
- Les écrans de connexion et de découverte respectent désormais wellKnownDiscovery: false et ne réécrivent plus l'URL du serveur que vous saisissez.
- Les filtres de la liste des utilisateurs ont été déplacés derrière un bouton « Filtrer » pour une barre d'outils plus épurée, et le mode Matrix Authentication Service affiche désormais correctement l'indicateur d'administrateur et le type d'utilisateur.

Notes de version complètes : https://github.com/element-hq/synapse/releases/tag/v1.157.1 et https://github.com/etkecc/ketesa/releases/tag/v1.4.0`,
  },
  migrations: {},
})
