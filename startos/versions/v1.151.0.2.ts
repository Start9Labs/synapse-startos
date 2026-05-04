import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'

export const v_1_151_0_2 = VersionInfo.of({
  version: '1.151.0:2',
  releaseNotes: {
    en_US:
      'Fix "Create Admin User" action timing out with "User ID already taken" on fresh installs.',
    es_ES:
      'Corrige el tiempo de espera de la acción "Crear usuario administrador" con "ID de usuario ya en uso" en instalaciones nuevas.',
    de_DE:
      'Behebt einen Fehler, bei dem die Aktion "Admin-Benutzer erstellen" bei Neuinstallationen mit "User ID already taken" abbricht.',
    pl_PL:
      'Naprawia błąd przekroczenia limitu czasu akcji "Utwórz użytkownika administratora" z komunikatem "User ID already taken" przy nowych instalacjach.',
    fr_FR:
      'Corrige l\'expiration de l\'action « Créer un utilisateur administrateur » avec « User ID already taken » lors des installations neuves.',
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
