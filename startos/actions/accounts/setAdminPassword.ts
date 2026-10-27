import { utils } from '@start9labs/start-sdk'
import { homeserverYaml } from '../../fileModels/homeserver.yml'
import { storeJson } from '../../fileModels/store.json'
import { i18n } from '../../i18n'
import { sdk } from '../../sdk'
import { accountStanding } from '../../utils'

const { InputSpec, Value } = sdk

const usernamePattern = {
  regex: '^[a-z0-9._=/+-]+$',
  description: i18n(
    'Only lowercase letters, digits and . _ = - / +. Leave out the @ and the server name.',
  ),
}

const inputSpec = InputSpec.of({
  username: Value.text({
    name: i18n('Username'),
    description: i18n(
      'The administrator account to set the password for. If no account has this name, it is created as an administrator; an existing account that is not an active administrator is left unchanged.',
    ),
    warning: null,
    required: true,
    default: 'admin',
    placeholder: null,
    masked: false,
    patterns: [usernamePattern],
    inputmode: 'text',
  }),
})

export const setAdminPassword = sdk.Action.withInput(
  // id
  'set-admin-password',

  // metadata
  async ({ effects }) => ({
    name: i18n('Set Admin Password'),
    description: i18n(
      'Set the admin user password for your Synapse Matrix homeserver.',
    ),
    warning:
      (await storeJson.read((s) => s.adminPasswordSet).const(effects)) === false
        ? null
        : i18n(
            'This generates a new admin password and restarts your homeserver to apply it. The current admin password stops working, and everyone is disconnected until Synapse comes back up. The new password is shown once, when the action finishes.',
          ),
    allowedStatuses: 'any',
    group: i18n('Accounts'),
    visibility: 'enabled',
  }),

  // form input specification
  inputSpec,

  // optionally pre-fill the input form
  async () => storeJson.read((s) => ({ username: s.adminUsername })).once(),

  // the execution function
  async ({ effects, input }) => {
    if (!input.username) throw new Error(usernamePattern.description)

    const homeserver = await homeserverYaml
      .read((h) => ({
        user: `@${input.username}:${h.server_name}`,
        dbPassword: h.database.args.password,
      }))
      .once()
    if (!homeserver) throw new Error(i18n('homeserver.yaml not found'))
    const { user, dbPassword } = homeserver

    // A stopped database defers these checks to the apply-admin-password oneshot
    const standing =
      (await sdk.getStatus(effects).once())?.health.postgres?.result ===
      'success'
        ? await accountStanding(effects, dbPassword, user)
        : null
    if (standing === 'deactivated') {
      throw new Error(
        i18n(
          '${user} is deactivated. Choose an active administrator, or a new username to create one.',
          { user },
        ),
      )
    }
    if (standing === 'user') {
      throw new Error(
        i18n(
          '${user} is not an administrator. Choose an active administrator, or a new username to create one.',
          { user },
        ),
      )
    }

    const adminPassword = utils.getDefaultString({
      charset: 'a-z,A-Z,1-9,!,@,$,%,&,*',
      len: 22,
    })

    await storeJson.merge(effects, {
      adminUsername: input.username,
      pendingAdminPassword: adminPassword,
      adminPasswordSet: true,
    })
    await sdk.restart(effects)

    return {
      version: '1',
      title: i18n('Success'),
      message:
        standing === ''
          ? i18n(
              'No account is named ${user}, so it is created as a new administrator with the username and password below. Write them down or save them to a password manager.',
              { user },
            )
          : i18n(
              'Your admin username and password are below. Write them down or save them to a password manager.',
            ),
      result: {
        type: 'group',
        value: [
          {
            type: 'single',
            name: i18n('Username'),
            description: null,
            value: input.username,
            masked: false,
            copyable: true,
            qr: false,
            launchable: false,
          },
          {
            type: 'single',
            name: i18n('Password'),
            description: null,
            value: adminPassword,
            masked: true,
            copyable: true,
            qr: false,
            launchable: false,
          },
        ],
      },
    }
  },
)
