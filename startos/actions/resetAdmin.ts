import { utils } from '@start9labs/start-sdk'
import { homeserverYaml } from '../fileModels/homeserver.yml'
import { i18n } from '../i18n'
import { sdk } from '../sdk'
import { mount, postgresDb, postgresUser } from '../utils'

export const resetAdmin = sdk.Action.withoutInput(
  // id
  'reset-admin',

  // metadata
  async () => ({
    name: i18n('Reset Admin Password'),
    description: i18n('Reset your admin user password'),
    warning: null,
    allowedStatuses: 'only-running',
    group: null,
    visibility: 'enabled',
  }),

  // the execution function
  async ({ effects }) => {
    const password = utils.getDefaultString({
      charset: 'a-z,A-Z,1-9,!,@,$,%,&,*',
      len: 22,
    })

    const config = await homeserverYaml.read().once()
    if (!config) throw new Error('homeserver.yaml not found')

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

    const hash = sqlLiteral(passwordHash.toString().trim())
    await sdk.SubContainer.withTemp(
      effects,
      { imageId: 'postgres' },
      sdk.Mounts.of(),
      'save-password-hash',
      (subc) =>
        subc.execFail(
          [
            'psql',
            '-h',
            '127.0.0.1',
            '-U',
            postgresUser,
            '-d',
            postgresDb,
            '-c',
            `UPDATE users SET password_hash = '${hash}' WHERE name = (SELECT name FROM users ORDER BY creation_ts ASC LIMIT 1)`,
          ],
          {
            env: {
              PGPASSWORD: config.database.args.password,
            },
          },
        ),
    )

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
            value: 'admin',
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

function sqlLiteral(s: string): string {
  return s.replace(/'/g, "''")
}
