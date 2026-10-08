import { VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '1.162.0:1',
  releaseNotes: {
    en_US: `Updated Synapse to 1.162.0 and Ketesa to 1.5.1.

- New rooms use room version 12 by default.
- Configure profile-lookup throttling in Rate Limits → Custom.
- Improved federated invitations and faster recursive relation queries in large rooms.

[Synapse release notes](https://github.com/element-hq/synapse/releases/tag/v1.162.0) · [Ketesa release notes](https://github.com/etkecc/ketesa/releases/tag/v1.5.1)

- Set Admin Password asks for confirmation only when it replaces an existing admin password.
- Delete Appservice starts with no appservice selected.
- Log Level, Registration, Federation, Large Room Protection, Thumbnails, Rate Limits and Discoverability describe what each of their options does.
- If your server's domain is removed from the Homeserver interface, Synapse asks for it again and won't start until that same domain is added back.`,
    es_ES: `Synapse actualizado a 1.162.0 y Ketesa a 1.5.1.

- Las salas nuevas usan la versión de sala 12 de forma predeterminada.
- Configure los límites de consultas de perfiles en Límites de velocidad → Personalizado.
- Mejoras en las invitaciones federadas y consultas recursivas de relaciones más rápidas en salas grandes.

[Notas de Synapse](https://github.com/element-hq/synapse/releases/tag/v1.162.0) · [Notas de Ketesa](https://github.com/etkecc/ketesa/releases/tag/v1.5.1)

- Set Admin Password pide confirmación solo cuando sustituye una contraseña de administrador existente.
- Eliminar servicio de aplicación empieza sin ningún servicio de aplicación seleccionado.
- Nivel de registro, Registro, Federación, Protección frente a salas grandes, Miniaturas, Límites de frecuencia y Visibilidad describen qué hace cada una de sus opciones.
- Si el dominio de su servidor se elimina de la interfaz Servidor, Synapse lo vuelve a pedir y no arranca hasta que se añada de nuevo ese mismo dominio.`,
    de_DE: `Synapse auf 1.162.0 und Ketesa auf 1.5.1 aktualisiert.

- Neue Räume verwenden standardmäßig Raumversion 12.
- Profilabfragen lassen sich unter Ratenlimits → Benutzerdefiniert begrenzen.
- Verbesserte föderierte Einladungen und schnellere rekursive Relationsabfragen in großen Räumen.

[Synapse-Versionshinweise](https://github.com/element-hq/synapse/releases/tag/v1.162.0) · [Ketesa-Versionshinweise](https://github.com/etkecc/ketesa/releases/tag/v1.5.1)

- „Set Admin Password“ fragt nur dann nach einer Bestätigung, wenn es ein vorhandenes Admin-Passwort ersetzt.
- „Appservice löschen“ beginnt ohne ausgewählten Appservice.
- Protokollstufe, Registrierung, Föderation, Schutz vor großen Räumen, Vorschaubilder, Ratenbegrenzungen und Auffindbarkeit beschreiben, was jede ihrer Optionen bewirkt.
- Wird die Domain Ihres Servers von der Homeserver-Schnittstelle entfernt, fragt Synapse erneut danach und startet erst, wenn genau diese Domain wieder hinzugefügt ist.`,
    pl_PL: `Zaktualizowano Synapse do 1.162.0 i Ketesa do 1.5.1.

- Nowe pokoje domyślnie używają wersji pokoju 12.
- Limity zapytań o profile można ustawić w Limity szybkości → Niestandardowe.
- Ulepszono zaproszenia federacyjne i przyspieszono rekurencyjne zapytania o relacje w dużych pokojach.

[Informacje o wydaniu Synapse](https://github.com/element-hq/synapse/releases/tag/v1.162.0) · [Informacje o wydaniu Ketesa](https://github.com/etkecc/ketesa/releases/tag/v1.5.1)

- „Set Admin Password” prosi o potwierdzenie tylko wtedy, gdy zastępuje istniejące hasło administratora.
- „Usuń usługę aplikacji” zaczyna bez wybranej usługi aplikacji.
- Poziom logowania, Rejestracja, Federacja, Ochrona przed dużymi pokojami, Miniatury, Limity częstotliwości i Wykrywalność opisują, co robi każda z ich opcji.
- Jeśli domena Twojego serwera zostanie usunięta z interfejsu Serwer, Synapse poprosi o nią ponownie i nie uruchomi się, dopóki ta sama domena nie zostanie dodana z powrotem.`,
    fr_FR: `Synapse mis à jour vers 1.162.0 et Ketesa vers 1.5.1.

- Les nouveaux salons utilisent par défaut la version de salon 12.
- Configurez la limitation des consultations de profils dans Limites de débit → Personnalisé.
- Amélioration des invitations fédérées et accélération des requêtes récursives de relations dans les grands salons.

[Notes de Synapse](https://github.com/element-hq/synapse/releases/tag/v1.162.0) · [Notes de Ketesa](https://github.com/etkecc/ketesa/releases/tag/v1.5.1)

- Set Admin Password ne demande une confirmation que lorsqu'il remplace un mot de passe administrateur existant.
- Supprimer le service d'application démarre sans aucun service d'application sélectionné.
- Niveau de journalisation, Inscription, Fédération, Protection contre les grands salons, Miniatures, Limites de débit et Visibilité décrivent ce que fait chacune de leurs options.
- Si le domaine de votre serveur est retiré de l'interface Serveur, Synapse le redemande et ne démarre pas tant que ce même domaine n'est pas rajouté.`,
  },
  migrations: {},
})
