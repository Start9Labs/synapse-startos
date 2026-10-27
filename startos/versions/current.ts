import { VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '1.163.2:1',
  releaseNotes: {
    en_US:
      'Set Admin Password asks for the username of the administrator whose password it sets, and says when that username is new and will be created as an administrator. It never changes an account that is deactivated or not an administrator.',
    es_ES:
      '«Establecer contraseña de administrador» pide el nombre de usuario del administrador cuya contraseña establece, y avisa cuando ese nombre de usuario es nuevo y se creará como administrador. Nunca modifica una cuenta desactivada o que no sea de administrador.',
    de_DE:
      '„Administratorpasswort festlegen“ fragt nach dem Benutzernamen des Administrators, dessen Passwort festgelegt wird, und weist darauf hin, wenn dieser Benutzername neu ist und als Administrator angelegt wird. Ein deaktiviertes Konto oder ein Konto ohne Administratorrechte wird nie verändert.',
    pl_PL:
      '„Ustaw hasło administratora” pyta o nazwę użytkownika administratora, którego hasło ustawia, i informuje, gdy ta nazwa jest nowa i zostanie utworzona jako administrator. Nigdy nie zmienia konta dezaktywowanego ani konta, które nie jest administratorem.',
    fr_FR:
      "« Définir le mot de passe administrateur » demande le nom d'utilisateur de l'administrateur dont il définit le mot de passe, et signale quand ce nom est nouveau et sera créé en tant qu'administrateur. Il ne modifie jamais un compte désactivé ou qui n'est pas administrateur.",
  },
  migrations: {
    up: async ({ effects }) => {},
  },
})
