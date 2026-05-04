import { utils } from '@start9labs/start-sdk'
import { homeserverYaml } from '../../fileModels/homeserver.yml'
import { i18n } from '../../i18n'
import { sdk } from '../../sdk'
import {
  checkPostgresReady,
  getPostgresEnv,
  getPostgresSub,
  homeserverPort,
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
    if (!postgresPassword) throw new Error('No Postgres password')

    const postgresSub = await getPostgresSub(effects, 'bootstrap-postgres')
    const synapseSub = await sdk.SubContainer.of(
      effects,
      { imageId: 'synapse' },
      mount,
      'bootstrap-synapse',
    )

    // Tight polling so this bootstrap completes within the action's RPC
    // timeout. The default trigger sleeps 30 s after seeing `loading`, which
    // adds tens of seconds of dead wait while postgres initializes and synapse
    // applies schema migrations.
    const fastTrigger = sdk.trigger.cooldownTrigger(1_000)

    await sdk.Daemons.of(effects)
      .addDaemon('postgres', {
        subcontainer: postgresSub,
        exec: {
          command: sdk.useEntrypoint(['-c', 'listen_addresses=127.0.0.1']),
          env: getPostgresEnv(postgresPassword),
        },
        ready: {
          display: null,
          trigger: fastTrigger,
          fn: () => checkPostgresReady(postgresSub),
        },
        requires: [],
      })
      .addDaemon('synapse', {
        subcontainer: synapseSub,
        exec: { command: ['/start.py'] },
        ready: {
          display: null,
          // Generous slack for slow disks: schema migration on a fresh
          // install reads/writes ~100 SQL deltas, which can take a while
          // on an HDD.
          gracePeriod: 60_000,
          trigger: fastTrigger,
          fn: () =>
            sdk.healthCheck.checkWebUrl(
              effects,
              `http://localhost:${homeserverPort}/health`,
              {
                successMessage: 'Synapse is ready',
                errorMessage: 'Synapse is not ready',
              },
            ),
        },
        requires: ['postgres'],
      })
      .addOneshot('register-admin', {
        subcontainer: synapseSub,
        exec: {
          command: [
            'register_new_matrix_user',
            '--config',
            '/data/homeserver.yaml',
            '--user',
            'admin',
            '--password',
            adminPassword,
            '--admin',
          ],
        },
        requires: ['synapse'],
      })
      .runUntilSuccess(300_000)

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
