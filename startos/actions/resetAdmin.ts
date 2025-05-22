import { sdk } from '../sdk'
import { utils } from '@start9labs/start-sdk'
import { mount } from '../utils'
import { store } from '../fileModels/store.json'

export const resetAdmin = sdk.Action.withoutInput(
  // id
  'reset-admin',

  // metadata
  async ({ effects }) => {
    const adminUserCreated = await store
      .read((s) => s.adminUserCreated)
      .const(effects)

    return {
      name: adminUserCreated ? 'Reset Admin Password' : 'Create Admin User',
      description: adminUserCreated
        ? 'Reset your admin user password'
        : 'Create your admin user and password',
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

    const adminUserCreated = await store.read((s) => s.adminUserCreated).once()

    if (adminUserCreated) {
      await sdk.SubContainer.withTemp(
        effects,
        { imageId: 'synapse' },
        mount,
        'update-admin-pass',
        async (subc) => {
          const passwordHash = (
            await subc.execFail([
              'hash_password',
              '-p',
              password,
              '-c',
              '/data/homeserver.yaml',
            ])
          ).stdout
          await subc.execFail([
            'sqlite3',
            '/data/homeserver.db',
            `UPDATE users SET password_hash='${passwordHash}' WHERE name='${username}')`,
          ])
        },
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
      await store.merge(effects, { adminUserCreated: true })
    }

    return {
      version: '1',
      title: 'Success',
      message: 'Your admin user credentials are below',
      result: {
        type: 'group',
        value: [
          {
            type: 'single',
            name: 'Username',
            description: null,
            value: username,
            masked: true,
            copyable: true,
            qr: false,
          },
          {
            type: 'single',
            name: 'Password',
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

const randomPassword = {
  charset: 'a-z,A-Z,1-9,!,@,$,%,&,*',
  len: 22,
}
