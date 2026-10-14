import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'
import { homeserverYaml } from '../fileModels/homeserver.yml'
import { hasInvalidProfilePrivacy } from '../utils'

export const current = VersionInfo.of({
  version: '1.163.0:0',
  releaseNotes: {
    en_US: `Updated Synapse to 1.163.0. Fixes missing read receipts sent to bridges, incorrect notification badge counts, and missing room membership events during sync.

Shared-room profile restrictions now require sign-in. On update, a restriction previously enabled without sign-in is removed to preserve its actual behaviour and prevent startup failure. To enforce it, enable both profile settings in Discoverability. Invalid combinations are now rejected by that action. The obsolete room-summary feature flag is also removed; the API remains available.

Full release notes: https://github.com/element-hq/synapse/blob/v1.163.0/CHANGES.md`,
    es_ES: `Actualiza Synapse a 1.163.0. Corrige las confirmaciones de lectura que no se enviaban a los puentes, los contadores de notificaciones incorrectos y los eventos de pertenencia a salas que faltaban durante la sincronización.

Las restricciones de perfiles a salas compartidas ahora requieren iniciar sesión. Al actualizar, se elimina una restricción activada sin ese requisito para conservar su comportamiento real y evitar fallos de inicio. Para aplicarla, active ambos ajustes de perfiles en Descubribilidad. Esa acción ahora rechaza las combinaciones inválidas. También se elimina la opción obsoleta de resumen de salas; la API sigue disponible.

Notas de la versión completas: https://github.com/element-hq/synapse/blob/v1.163.0/CHANGES.md`,
    de_DE: `Aktualisiert Synapse auf 1.163.0. Behebt fehlende Lesebestätigungen an Bridges, falsche Benachrichtigungszähler und fehlende Raum-Mitgliedschaftsereignisse bei der Synchronisierung.

Profilbeschränkungen auf gemeinsame Räume erfordern jetzt eine Anmeldung. Beim Update wird eine zuvor ohne Anmeldepflicht aktivierte Beschränkung entfernt, um ihr tatsächliches Verhalten beizubehalten und Startfehler zu verhindern. Zum Erzwingen der Beschränkung beide Profileinstellungen unter Auffindbarkeit aktivieren. Diese Aktion lehnt ungültige Kombinationen jetzt ab. Das veraltete Raumübersichts-Feature-Flag wird ebenfalls entfernt; die API bleibt verfügbar.

Vollständige Versionshinweise: https://github.com/element-hq/synapse/blob/v1.163.0/CHANGES.md`,
    pl_PL: `Aktualizuje Synapse do 1.163.0. Naprawia brak potwierdzeń odczytu wysyłanych do mostków, błędne liczniki powiadomień oraz brakujące zdarzenia członkostwa w pokojach podczas synchronizacji.

Ograniczenie profili do wspólnych pokoi wymaga teraz logowania. Przy aktualizacji ograniczenie włączone bez wymogu logowania zostaje usunięte, aby zachować jego faktyczne działanie i zapobiec błędowi uruchomienia. Aby je egzekwować, włącz oba ustawienia profili w Wykrywalności. Ta akcja odrzuca teraz nieprawidłowe kombinacje. Usuwana jest też przestarzała flaga podsumowania pokoju; API pozostaje dostępne.

Pełne informacje o wydaniu: https://github.com/element-hq/synapse/blob/v1.163.0/CHANGES.md`,
    fr_FR: `Met à jour Synapse vers 1.163.0. Corrige les accusés de lecture manquants envoyés aux passerelles, les compteurs de notifications incorrects et les événements d'appartenance aux salons manquants pendant la synchronisation.

La restriction des profils aux salons partagés exige désormais une connexion. Lors de la mise à jour, une restriction activée sans cette exigence est supprimée pour préserver son comportement réel et éviter un échec au démarrage. Pour l'appliquer, activez les deux réglages de profils dans Visibilité. Cette action rejette désormais les combinaisons invalides. L'option obsolète de résumé des salons est également supprimée ; l'API reste disponible.

Notes de version complètes : https://github.com/element-hq/synapse/blob/v1.163.0/CHANGES.md`,
  },
  migrations: {
    up: async ({ effects }) => {
      await homeserverYaml.update(effects, (config) => {
        if (!config) return null
        return {
          ...config,
          experimental_features: {
            ...config.experimental_features,
            msc3266_enabled: undefined,
          },
          ...(hasInvalidProfilePrivacy(config)
            ? { limit_profile_requests_to_users_who_share_rooms: undefined }
            : {}),
        }
      })
    },
    down: IMPOSSIBLE,
  },
})
