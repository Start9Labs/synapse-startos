import { VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '1.162.0:2',
  releaseNotes: {
    en_US: `- Import Existing Homeserver accepts a homeserver.yaml whose \`old_signing_keys\` is empty, and names the setting at fault when it rejects a file.
- On an imported homeserver, Set Admin Password sets the password of \`@admin\`, creating that account if there is none.
- The Set Server Address/URL task points you to Import Existing Homeserver if you are moving a homeserver here.
- Register Appservice: leave Appservice URL empty for a bot that only sends messages. Appservice IDs use letters, digits, dots, dashes and underscores only.`,
    es_ES: `- Importar servidor existente acepta un homeserver.yaml cuyo \`old_signing_keys\` está vacío e indica qué ajuste falla cuando rechaza un archivo.
- En un servidor importado, Set Admin Password establece la contraseña de \`@admin\` y crea esa cuenta si no existe.
- La tarea Establecer dirección/URL del servidor le indica Importar servidor existente si está trasladando aquí un servidor.
- Registrar servicio de aplicación: deje vacía la URL del servicio de aplicación para un bot que solo envía mensajes. Los identificadores solo admiten letras, dígitos, puntos, guiones y guiones bajos.`,
    de_DE: `- „Bestehenden Homeserver importieren“ akzeptiert eine homeserver.yaml mit leerem \`old_signing_keys\` und nennt die betroffene Einstellung, wenn es eine Datei ablehnt.
- Auf einem importierten Homeserver setzt „Set Admin Password“ das Passwort von \`@admin\` und legt dieses Konto an, falls es fehlt.
- Die Aufgabe „Serveradresse/URL festlegen“ verweist auf „Bestehenden Homeserver importieren“, wenn Sie einen Homeserver hierher umziehen.
- „Appservice registrieren“: Lassen Sie die Appservice-URL für einen Bot leer, der nur Nachrichten sendet. Appservice-IDs bestehen nur aus Buchstaben, Ziffern, Punkten, Binde- und Unterstrichen.`,
    pl_PL: `- „Importuj istniejący serwer” akceptuje homeserver.yaml z pustym \`old_signing_keys\` i wskazuje błędne ustawienie, gdy odrzuca plik.
- Na zaimportowanym serwerze „Set Admin Password” ustawia hasło konta \`@admin\`, tworząc je, jeśli nie istnieje.
- Zadanie „Ustaw adres/URL serwera” wskazuje „Importuj istniejący serwer”, jeśli przenosisz tu serwer.
- „Zarejestruj usługę aplikacji”: zostaw pusty URL usługi aplikacji dla bota, który tylko wysyła wiadomości. Identyfikatory usług mogą zawierać tylko litery, cyfry, kropki, myślniki i podkreślenia.`,
    fr_FR: `- Importer un serveur existant accepte un homeserver.yaml dont \`old_signing_keys\` est vide, et nomme le réglage en cause lorsqu'il refuse un fichier.
- Sur un serveur importé, Set Admin Password définit le mot de passe de \`@admin\` et crée ce compte s'il n'existe pas.
- La tâche Définir l'adresse/URL du serveur vous oriente vers Importer un serveur existant si vous migrez un serveur ici.
- Enregistrer le service d'application : laissez l'URL du service d'application vide pour un bot qui ne fait qu'envoyer des messages. Les identifiants n'utilisent que des lettres, chiffres, points, tirets et traits de soulignement.`,
  },
  migrations: {},
})
