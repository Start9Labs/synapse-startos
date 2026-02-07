import { i18n } from '../i18n'
import { sdk } from '../sdk'
import { mount } from '../utils'

const { InputSpec, Value } = sdk

export const inputSpec = InputSpec.of({
  username: Value.dynamicText(async () => ({
    name: i18n('Username'),
    description:
      i18n('The localpart for the bot user (e.g. "mybot" creates @mybot:your.domain)'),
    required: true as const,
    default: null,
    placeholder: 'mybot',
    masked: false,
    disabled: i18n('Provided by the bridge service'),
  })),
  password: Value.dynamicText(async () => ({
    name: i18n('Password'),
    description: i18n('The password for the bot user'),
    required: true as const,
    default: null,
    placeholder: null,
    masked: true,
    disabled: i18n('Provided by the bot service'),
  })),
})

export const createBotUser = sdk.Action.withInput(
  'create-bot-user',

  async ({ effects }) => ({
    name: i18n('Create Bot User'),
    description: i18n('Create a new bot (non-admin) user account on the homeserver.'),
    warning: null,
    allowedStatuses: 'only-running',
    group: null,
    visibility: 'hidden' as const,
  }),

  inputSpec,

  async ({ effects }) => ({}),

  async ({ effects, input }) => {
    const { username, password } = input

    await sdk.SubContainer.withTemp(
      effects,
      { imageId: 'synapse' },
      mount,
      'create-bot-user',
      (subc) =>
        subc.execFail([
          'register_new_matrix_user',
          '--config',
          '/data/homeserver.yaml',
          '--user',
          username,
          '--password',
          password,
          '--no-admin',
        ]),
    )
  },
)
