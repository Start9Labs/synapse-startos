import { sdk } from '../sdk'
import { utils } from '@start9labs/start-sdk'
import { mount } from '../utils'

export const resetAdmin = sdk.Action.withoutInput(
  // id
  'reset-admin',

  // metadata
  async ({ effects }) => {
    const adminUserCreated = await sdk.store
      .getOwn(effects, sdk.StorePath.adminUserCreated)
      .const()

    return {
      name: adminUserCreated ? 'Reset Admin Password' : 'Create Admin User',
      description: adminUserCreated
        ? 'Reset your admin user password'
        : 'Create your admin user and password',
      warning: null,
      allowedStatuses: 'any',
      group: null,
      visibility: 'enabled',
    }
  },

  // the execution function
  async ({ effects }) => {
    const password = utils.getDefaultString(randomPassword)

    const adminUserCreated = await sdk.store
      .getOwn(effects, sdk.StorePath.adminUserCreated)
      .const()

    if (adminUserCreated) {
      const passwordHash = (
        await sdk.runCommand(
          effects,
          { imageId: 'synapse' },
          ['hash_password', '-p', password, '-c', '/data/homeserver.yaml'],
          { mounts: sdk.Mounts.of() },
          'update-admin-pass',
        )
      ).stdout

      await sdk.runCommand(
        effects,
        { imageId: 'synapse' },
        [
          'sqlite3',
          '/data/homeserver.db',
          `UPDATE users SET password_hash='${passwordHash}' WHERE name='admin')`,
        ],
        { mounts: mount },
        'update-admin-pass',
      )
    } else {
      await sdk.runCommand(
        effects,
        { imageId: 'synapse' },
        [
          'register_new_matrix_user',
          '--config',
          '/data/homeserver.yaml',
          '--user',
          'admin',
          '--password',
          password,
          '--admin',
        ],
        { mounts: mount },
        'set-admin-pass',
      )
      await sdk.store.setOwn(effects, sdk.StorePath.adminUserCreated, true)
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
            value: password,
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
