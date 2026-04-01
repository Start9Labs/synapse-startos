import { i18n } from '../i18n'
import { sdk } from '../sdk'
import { homeserverPort } from '../utils'

const { InputSpec, Value } = sdk

const inputSpec = InputSpec.of({
  username: Value.text({
    name: i18n('Username'),
    description: null,
    warning: null,
    required: true,
    default: null,
    placeholder: 'admin',
    masked: false,
    patterns: [],
    inputmode: 'text',
  }),
  password: Value.text({
    name: i18n('Password'),
    description: null,
    warning: null,
    required: true,
    default: null,
    placeholder: null,
    masked: true,
    patterns: [],
    inputmode: 'text',
  }),
})

export const getAccessToken = sdk.Action.withInput(
  // id
  'get-access-token',

  // metadata
  async () => ({
    name: i18n('Get Access Token'),
    description: i18n(
      'Get a Matrix access token for a user by providing their username and password.',
    ),
    warning: null,
    allowedStatuses: 'only-running',
    group: null,
    visibility: 'enabled',
  }),

  // form input specification
  inputSpec,

  // optionally pre-fill the input form
  async () => ({}),

  // the execution function
  async ({ input }) => {
    const res = await fetch(`http://localhost:${homeserverPort}/_matrix/client/v3/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'm.login.password',
        identifier: {
          type: 'm.id.user',
          user: input.username,
        },
        password: input.password,
      }),
    })

    const body = await res.json()

    if (!res.ok) {
      throw new Error(body.error || 'Login failed')
    }

    return {
      version: '1',
      title: i18n('Success'),
      message: null,
      result: {
        type: 'single',
        name: i18n('Access Token'),
        description: null,
        value: body.access_token,
        masked: true,
        copyable: true,
        qr: false,
      },
    }
  },
)
