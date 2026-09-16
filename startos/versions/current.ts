import { VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '1.161.0:0',
  releaseNotes: {
    en_US: `Updated Synapse to 1.161.0.

- Fixes event persistence after temporary database outages, duplicate room-encryption events during room creation, and missing room topics after search index rebuilds.
- Adds an endpoint for retrieving individual delayed events.

MatrixRTC operators should add the new \`url\` setting while retaining the deprecated \`livekit_service_url\` setting for older clients.

Push notifications now reach a push gateway running on this server, such as the one in Element Web.

Full release notes: https://github.com/element-hq/synapse/releases/tag/v1.161.0`,
    es_ES: `Actualiza Synapse a la versión 1.161.0.

- Corrige la persistencia de eventos tras interrupciones temporales de la base de datos, los eventos duplicados de cifrado de salas durante su creación y los temas de salas ausentes tras reconstruir el índice de búsqueda.
- Añade un endpoint para obtener eventos retrasados individuales.

Los operadores de MatrixRTC deben añadir el nuevo ajuste \`url\` y conservar el ajuste obsoleto \`livekit_service_url\` para los clientes antiguos.

Las notificaciones push ahora llegan a una pasarela push que se ejecute en este servidor, como la de Element Web.

Notas de la versión completas: https://github.com/element-hq/synapse/releases/tag/v1.161.0`,
    de_DE: `Aktualisiert Synapse auf Version 1.161.0.

- Behebt die Ereignisspeicherung nach vorübergehenden Datenbankausfällen, doppelte Raumverschlüsselungsereignisse beim Erstellen von Räumen und fehlende Raumthemen nach dem Neuaufbau des Suchindexes.
- Fügt einen Endpunkt zum Abrufen einzelner verzögerter Ereignisse hinzu.

MatrixRTC-Betreiber sollten die neue Einstellung \`url\` hinzufügen und die veraltete Einstellung \`livekit_service_url\` für ältere Clients beibehalten.

Push-Benachrichtigungen erreichen jetzt ein Push-Gateway, das auf diesem Server läuft, etwa das von Element Web.

Vollständige Versionshinweise: https://github.com/element-hq/synapse/releases/tag/v1.161.0`,
    pl_PL: `Aktualizuje Synapse do wersji 1.161.0.

- Naprawia zapisywanie zdarzeń po tymczasowych awariach bazy danych, powielone zdarzenia szyfrowania podczas tworzenia pokojów oraz brakujące tematy pokojów po przebudowaniu indeksu wyszukiwania.
- Dodaje punkt końcowy do pobierania pojedynczych opóźnionych zdarzeń.

Operatorzy MatrixRTC powinni dodać nowe ustawienie \`url\`, zachowując przestarzałe ustawienie \`livekit_service_url\` dla starszych klientów.

Powiadomienia push docierają teraz do bramki push działającej na tym serwerze, na przykład tej w Element Web.

Pełne informacje o wydaniu: https://github.com/element-hq/synapse/releases/tag/v1.161.0`,
    fr_FR: `Met à jour Synapse vers la version 1.161.0.

- Corrige la persistance des événements après des interruptions temporaires de la base de données, les événements de chiffrement de salon dupliqués lors de la création d'un salon et les sujets de salon manquants après la reconstruction de l'index de recherche.
- Ajoute un point de terminaison permettant de récupérer individuellement les événements différés.

Les opérateurs MatrixRTC doivent ajouter le nouveau paramètre \`url\` tout en conservant le paramètre obsolète \`livekit_service_url\` pour les anciens clients.

Les notifications push atteignent désormais une passerelle push qui s'exécute sur ce serveur, comme celle d'Element Web.

Notes de version complètes : https://github.com/element-hq/synapse/releases/tag/v1.161.0`,
  },
  migrations: {},
})
