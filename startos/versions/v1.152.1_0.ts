import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'
import { sdk } from '../sdk'

export const v_1_152_1_0 = VersionInfo.of({
  version: '1.152.1:0',
  releaseNotes: {
    en_US:
      'Update Synapse to 1.152.1. Replace separate "Create Admin User" and "Reset Admin Password" actions with a single "Set Admin Password" action; the password is applied during the next service start. Fix postgres health check getting stuck on first install.',
    es_ES:
      'Actualiza Synapse a 1.152.1. Reemplaza las acciones independientes "Crear usuario administrador" y "Restablecer contraseña de administrador" por una única acción "Establecer contraseña de administrador"; la contraseña se aplica en el siguiente arranque del servicio. Corrige el bloqueo de la verificación de estado de postgres en la primera instalación.',
    de_DE:
      'Aktualisiert Synapse auf 1.152.1. Ersetzt die getrennten Aktionen „Admin-Benutzer erstellen" und „Admin-Passwort zurücksetzen" durch eine einzige Aktion „Admin-Passwort festlegen"; das Passwort wird beim nächsten Servicestart angewendet. Behebt das Hängenbleiben der Postgres-Health-Prüfung bei Erstinstallationen.',
    pl_PL:
      'Aktualizuje Synapse do 1.152.1. Zastępuje oddzielne akcje „Utwórz użytkownika administratora" i „Zresetuj hasło administratora" jedną akcją „Ustaw hasło administratora"; hasło jest stosowane przy następnym uruchomieniu usługi. Naprawia zacinanie się sprawdzania stanu postgresa przy pierwszej instalacji.',
    fr_FR:
      "Met à jour Synapse vers 1.152.1. Remplace les actions distinctes « Créer un utilisateur administrateur » et « Réinitialiser le mot de passe administrateur » par une seule action « Définir le mot de passe administrateur » ; le mot de passe est appliqué au prochain démarrage du service. Corrige le blocage du contrôle d'intégrité de postgres lors de la première installation.",
  },
  migrations: {
    up: async ({ effects }) => {
      // The "create-admin-user" action was removed; clear any outstanding
      // task pointing at it so users mid-setup don't see a broken task.
      await sdk.action.clearTask(effects, 'synapse:create-admin-user')
    },
    down: IMPOSSIBLE,
  },
})
