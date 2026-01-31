import { i18n } from '../i18n'
import { sdk } from '../sdk'
import { utils } from '@start9labs/start-sdk'
import { mount } from '../utils'
import { storeJson } from '../fileModels/store.json'

const randomPassword = {
  charset: 'a-z,A-Z,1-9,!,@,$,%,&,*',
  len: 22,
}

export const resetAdmin = sdk.Action.withoutInput(
  // id
  'reset-admin',

  // metadata
  async ({ effects }) => {
    const adminUserCreated = await storeJson
      .read((s) => s.adminUserCreated)
      .const(effects)

    return {
      name: adminUserCreated ? i18n('Reset Admin Password') : i18n('Create Admin User'),
      description: adminUserCreated
        ? i18n('Reset your admin user password')
        : i18n('Create your admin user and password'),
      warning: null,
      allowedStatuses: adminUserCreated ? 'only-stopped' : 'only-running',
      group: null,
      visibility: 'enabled',
    }
  },

  // the execution function
  async ({ effects }) => {
    const username = 'admin'
    const password = utils.getDefaultString(randomPassword)

    const adminUserCreated = await storeJson
      .read((s) => s.adminUserCreated)
      .once()

    if (adminUserCreated) {
      const passwordHash = await sdk.SubContainer.withTemp(
        effects,
        { imageId: 'synapse' },
        mount,
        'get-password-hash',
        async (subc) =>
          (
            await subc.execFail([
              'hash_password',
              '-p',
              password,
              '-c',
              '/data/homeserver.yaml',
            ])
          ).stdout,
      )

      await sdk.SubContainer.withTemp(
        effects,
        { imageId: 'sqlite3' },
        mount,
        'save-password-hash',
        (subc) =>
          subc.execFail([
            'sqlite3',
            '/data/homeserver.db',
            `UPDATE users SET password_hash = '${passwordHash.toString().trim()}' WHERE name = (SELECT name FROM users ORDER BY creation_ts ASC LIMIT 1)`,
          ]),
      )
    } else {
      await sdk.SubContainer.withTemp(
        effects,
        { imageId: 'synapse' },
        mount,
        'set-admin-pass',
        (subc) =>
          subc.execFail([
            'register_new_matrix_user',
            '--config',
            '/data/homeserver.yaml',
            '--user',
            username,
            '--password',
            password,
            '--admin',
          ]),
      )
      await storeJson.merge(effects, { adminUserCreated: true })
    }

    return {
      version: '1',
      title: i18n('Success'),
      message: i18n('Your admin user credentials are below'),
      result: {
        type: 'group',
        value: [
          {
            type: 'single',
            name: i18n('Username'),
            description: null,
            value: username,
            masked: false,
            copyable: true,
            qr: false,
          },
          {
            type: 'single',
            name: i18n('Password'),
            description: null,
            value: password,
            masked: true,
            copyable: true,
            qr: false,
          },
        ],
      },
    }
  },
)
