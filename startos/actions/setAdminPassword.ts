import { utils } from '@start9labs/start-sdk'
import { storeJson } from '../fileModels/store.json'
import { i18n } from '../i18n'
import { sdk } from '../sdk'

export const setAdminPassword = sdk.Action.withoutInput(
  // id
  'set-admin-password',

  // metadata
  async () => ({
    name: i18n('Set Admin Password'),
    description: i18n(
      'Set the admin user password for your Synapse Matrix homeserver.',
    ),
    warning: null,
    allowedStatuses: 'any',
    group: null,
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
