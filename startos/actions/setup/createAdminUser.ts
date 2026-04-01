import { utils } from '@start9labs/start-sdk'
import { homeserverYaml } from '../../fileModels/homeserver.yml'
import { i18n } from '../../i18n'
import { sdk } from '../../sdk'
import {
  checkPostgresReady,
  getPostgresEnv,
  getPostgresSub,
  mount,
} from '../../utils'

export const createAdminUser = sdk.Action.withoutInput(
  // id
  'create-admin-user',

  // metadata
  async () => ({
    name: i18n('Create Admin User'),
    description: i18n(
      'Create the admin user for your Synapse homeserver and display the credentials.',
    ),
    warning: null,
    allowedStatuses: 'only-stopped',
    group: null,
    visibility: 'hidden',
  }),

  // the execution function
  async ({ effects }) => {
    const adminPassword = utils.getDefaultString({
      charset: 'a-z,A-Z,1-9,!,@,$,%,&,*',
      len: 22,
    })

    const postgresPassword = await homeserverYaml
      .read((c) => c.database.args.password)
      .once()
    if (!postgresPassword) {
      throw new Error('No Postgres password')
    }

    const postgresSub = await getPostgresSub(effects, 'bootstrap-postgres')

    const synapseSub = await sdk.SubContainer.of(
      effects,
      { imageId: 'synapse' },
      mount,
      'bootstrap-synapse',
    )

    await sdk.Daemons.of(effects)
      .addDaemon('postgres', {
        subcontainer: postgresSub,
        exec: {
          command: sdk.useEntrypoint(['-c', 'listen_addresses=127.0.0.1']),
          env: getPostgresEnv(postgresPassword),
        },
        ready: {
          display: null,
          fn: () => checkPostgresReady(postgresSub),
        },
        requires: [],
      })
      .addDaemon('synapse', {
        subcontainer: synapseSub,
        exec: { command: ['/start.py'] },
        ready: {
          display: null,
          fn: async () => {
            const { exitCode } = await synapseSub.exec([
              'register_new_matrix_user',
              '--config',
              '/data/homeserver.yaml',
              '--user',
              'admin',
              '--password',
              adminPassword,
              '--admin',
            ])
            if (exitCode !== 0) {
              return { result: 'loading', message: null }
            }
            return { result: 'success', message: null }
          },
        },
        requires: ['postgres'],
      })
      .runUntilSuccess(59_000)

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
