import { VersionInfo } from '@start9labs/start-sdk'
import { homeserverYaml } from '../fileModels/homeserver.yml'
import {
  discoverabilitySettings,
  matchesDiscoverabilitySettings,
} from '../utils'

export const current = VersionInfo.of({
  version: '1.164.2:1',
  releaseNotes: {
    en_US:
      'Public Discoverability now lets room moderators publish rooms to the room list; Custom adds a publishing toggle. Existing Public and Private selections are preserved on update, and custom publication rules are left unchanged. Routine proxy request and database checkpoint logs are suppressed. New installs default to Warning logs; existing log levels are kept. Requires StartOS 0.4.1 or later.',
    es_ES:
      'El ajuste Público de Descubribilidad permite ahora que los moderadores publiquen salas en la lista; Personalizado añade un interruptor de publicación. Al actualizar se conservan las selecciones Público y Privado, y las reglas de publicación personalizadas no cambian. Se suprimen los registros rutinarios de solicitudes del proxy y de puntos de control de la base de datos. Las instalaciones nuevas usan el nivel Advertencia; se conserva el nivel existente. Requiere StartOS 0.4.1 o posterior.',
    de_DE:
      'Die öffentliche Auffindbarkeit erlaubt Raummoderatoren jetzt, Räume in der Raumliste zu veröffentlichen; Benutzerdefiniert bietet einen Veröffentlichungsschalter. Bestehende öffentliche und private Voreinstellungen bleiben beim Update erhalten, eigene Veröffentlichungsregeln unverändert. Routinemeldungen zu Proxy-Anfragen und Datenbank-Checkpoints entfallen. Neue Installationen protokollieren standardmäßig Warnungen; bestehende Protokollstufen bleiben erhalten. Erfordert StartOS 0.4.1 oder neuer.',
    pl_PL:
      'Publiczna wykrywalność pozwala teraz moderatorom publikować pokoje na liście; tryb Własny dodaje przełącznik publikowania. Podczas aktualizacji zachowywane są ustawienia Publiczny i Prywatny, a własne reguły publikowania pozostają bez zmian. Rutynowe wpisy o żądaniach proxy i punktach kontrolnych bazy danych są pomijane. Nowe instalacje domyślnie zapisują ostrzeżenia; dotychczasowe poziomy logowania są zachowywane. Wymaga StartOS 0.4.1 lub nowszego.',
    fr_FR:
      'La visibilité Publique permet désormais aux modérateurs de publier leurs salons dans la liste ; Personnalisé ajoute un interrupteur de publication. Les préréglages Public et Privé existants sont conservés lors de la mise à jour, et les règles de publication personnalisées restent inchangées. Les journaux courants des requêtes du proxy et des points de contrôle de la base sont supprimés. Les nouvelles installations utilisent le niveau Avertissement ; les niveaux existants sont conservés. Nécessite StartOS 0.4.1 ou ultérieur.',
  },
  migrations: {
    up: async ({ effects }) => {
      await homeserverYaml.update(effects, (config) => {
        if (!config || config.room_list_publication_rules !== undefined)
          return null
        for (const settings of Object.values(discoverabilitySettings)) {
          const { room_list_publication_rules, ...previousSettings } = settings
          if (matchesDiscoverabilitySettings(config, previousSettings)) {
            return { ...config, room_list_publication_rules }
          }
        }
        return null
      })
    },
  },
})
