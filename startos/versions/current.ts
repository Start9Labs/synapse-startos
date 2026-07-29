import { VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '1.157.2:0',
  releaseNotes: {
    en_US: `Updates Synapse to 1.157.2 and the Ketesa admin dashboard to 1.4.0.

Synapse 1.157.2 is a security release fixing eleven advisories, six of them high severity. Upgrading is recommended, especially if your homeserver participates in open federation or has untrusted local users. Also included, from 1.157.0 and 1.157.1:

- Fixes bridges and other appservices no longer receiving ephemeral events, including the to-device messages that encryption relies on. This was a regression in 1.156.0.
- Fixes reactivating a deactivated and erased user not restoring their profile, which broke login, name changes and invitations.
- Fixes repeated deadlocks in Sliding Sync.

Ketesa 1.4.0 stops the login screen rewriting your server URL when \`wellKnownDiscovery\` is set to false, moves the user list filters behind a Filter button, and corrects the admin flag and user type shown for Matrix Authentication Service accounts.

Full release notes: https://github.com/element-hq/synapse/releases/tag/v1.157.2 and https://github.com/etkecc/ketesa/releases/tag/v1.4.0`,
    es_ES: `Actualiza Synapse a 1.157.2 y el panel de administración Ketesa a 1.4.0.

Synapse 1.157.2 es una versión de seguridad que corrige once avisos, seis de ellos de gravedad alta. Se recomienda actualizar, sobre todo si su servidor participa en la federación abierta o tiene usuarios locales no confiables. También se incluye, de 1.157.0 y 1.157.1:

- Corrige que los puentes y otros appservices dejaran de recibir eventos efímeros, incluidos los mensajes «to-device» de los que depende el cifrado. Era una regresión de 1.156.0.
- Corrige que reactivar a un usuario desactivado y borrado no restaurara su perfil, lo que rompía el inicio de sesión, los cambios de nombre y las invitaciones.
- Corrige bloqueos repetidos en Sliding Sync.

Ketesa 1.4.0 evita que la pantalla de inicio de sesión reescriba la URL de su servidor cuando \`wellKnownDiscovery\` está en false, traslada los filtros de la lista de usuarios a un botón «Filter» y corrige el indicador de administrador y el tipo de usuario mostrados para las cuentas de Matrix Authentication Service.

Notas de versión completas: https://github.com/element-hq/synapse/releases/tag/v1.157.2 y https://github.com/etkecc/ketesa/releases/tag/v1.4.0`,
    de_DE: `Aktualisiert Synapse auf 1.157.2 und das Ketesa-Admin-Dashboard auf 1.4.0.

Synapse 1.157.2 ist eine Sicherheitsversion, die elf Sicherheitshinweise behebt, sechs davon mit hohem Schweregrad. Ein Update wird empfohlen, insbesondere wenn Ihr Homeserver an der offenen Föderation teilnimmt oder nicht vertrauenswürdige lokale Benutzer hat. Ebenfalls enthalten, aus 1.157.0 und 1.157.1:

- Behebt, dass Bridges und andere Appservices keine ephemeren Ereignisse mehr erhielten, einschließlich der To-Device-Nachrichten, auf die die Verschlüsselung angewiesen ist. Dies war eine Regression in 1.156.0.
- Behebt, dass beim Reaktivieren eines deaktivierten und gelöschten Benutzers dessen Profil nicht wiederhergestellt wurde, wodurch Anmeldung, Namensänderungen und Einladungen nicht mehr funktionierten.
- Behebt wiederholte Deadlocks in Sliding Sync.

Ketesa 1.4.0 verhindert, dass die Anmeldeseite Ihre Server-URL umschreibt, wenn \`wellKnownDiscovery\` auf false steht, verlagert die Filter der Benutzerliste hinter eine Schaltfläche „Filter“ und korrigiert die Anzeige von Administratorkennzeichen und Benutzertyp für Konten des Matrix Authentication Service.

Vollständige Versionshinweise: https://github.com/element-hq/synapse/releases/tag/v1.157.2 und https://github.com/etkecc/ketesa/releases/tag/v1.4.0`,
    pl_PL: `Aktualizuje Synapse do 1.157.2, a panel administracyjny Ketesa do 1.4.0.

Synapse 1.157.2 to wydanie bezpieczeństwa naprawiające jedenaście zgłoszeń, w tym sześć o wysokiej istotności. Zalecana jest aktualizacja, zwłaszcza jeśli Twój serwer uczestniczy w otwartej federacji lub ma niezaufanych użytkowników lokalnych. Zawiera także zmiany z 1.157.0 i 1.157.1:

- Naprawia sytuację, w której mostki i inne appservices przestawały otrzymywać zdarzenia efemeryczne, w tym wiadomości to-device, na których opiera się szyfrowanie. Była to regresja z 1.156.0.
- Naprawia brak przywracania profilu po reaktywacji dezaktywowanego i wymazanego użytkownika, co psuło logowanie, zmiany nazwy i zaproszenia.
- Naprawia powtarzające się zakleszczenia w Sliding Sync.

Ketesa 1.4.0 nie przepisuje już adresu URL serwera na ekranie logowania, gdy \`wellKnownDiscovery\` ma wartość false, przenosi filtry listy użytkowników pod przycisk „Filter” oraz poprawia wyświetlanie oznaczenia administratora i typu użytkownika dla kont Matrix Authentication Service.

Pełne informacje o wydaniu: https://github.com/element-hq/synapse/releases/tag/v1.157.2 oraz https://github.com/etkecc/ketesa/releases/tag/v1.4.0`,
    fr_FR: `Met à jour Synapse vers 1.157.2 et le tableau de bord d'administration Ketesa vers 1.4.0.

Synapse 1.157.2 est une version de sécurité qui corrige onze bulletins, dont six de gravité élevée. La mise à jour est recommandée, en particulier si votre serveur participe à la fédération ouverte ou compte des utilisateurs locaux non fiables. Sont également inclus, depuis 1.157.0 et 1.157.1 :

- Corrige le fait que les passerelles et autres appservices ne recevaient plus les événements éphémères, y compris les messages « to-device » dont dépend le chiffrement. Il s'agissait d'une régression de 1.156.0.
- Corrige la réactivation d'un utilisateur désactivé et effacé qui ne restaurait pas son profil, ce qui cassait la connexion, les changements de nom et les invitations.
- Corrige des blocages répétés dans Sliding Sync.

Ketesa 1.4.0 empêche l'écran de connexion de réécrire l'URL de votre serveur lorsque \`wellKnownDiscovery\` vaut false, place les filtres de la liste des utilisateurs derrière un bouton « Filter » et corrige l'indicateur d'administrateur et le type d'utilisateur affichés pour les comptes Matrix Authentication Service.

Notes de version complètes : https://github.com/element-hq/synapse/releases/tag/v1.157.2 et https://github.com/etkecc/ketesa/releases/tag/v1.4.0`,
  },
  migrations: {},
})
