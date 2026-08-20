import { utils } from '@start9labs/start-sdk'
import { storeJson } from '../../fileModels/store.json'
import { i18n } from '../../i18n'
import { sdk } from '../../sdk'

export const setAdminPassword = sdk.Action.withoutInput(
  // id
  'set-admin-password',

  // metadata
  async () => ({
    name: i18n('Set Admin Password'),
    description: i18n(
      'Set the admin user password for your Synapse Matrix homeserver.',
    ),
    warning: i18n(
      'This generates a new admin password and restarts your homeserver to apply it. The current admin password stops working, and everyone is disconnected until Synapse comes back up. The new password is shown once, when the action finishes.',
    ),
    allowedStatuses: 'any',
    group: i18n('Accounts'),
    visibility: 'enabled',
  }),

  // the execution function
  async ({ effects }) => {
    const adminPassword = utils.getDefaultString({
      charset: 'a-z,A-Z,1-9,!,@,$,%,&,*',
      len: 22,
    })

    await storeJson.merge(effects, { pendingAdminPassword: adminPassword })
    await sdk.restart(effects)

    return {
      version: '1',
      title: i18n('Success'),
      message: i18n(
        'Your admin username and password are below. Write them down or save them to a password manager.',
      ),
      result: {
        type: 'group',
        value: [
          {
            type: 'single',
            name: i18n('Username'),
            description: null,
            value: 'admin',
            masked: false,
            copyable: true,
            qr: false,
          },
          {
            type: 'single',
            name: i18n('Password'),
            description: null,
            value: adminPassword,
            masked: true,
            copyable: true,
            qr: false,
          },
        ],
      },
    }
  },
)
