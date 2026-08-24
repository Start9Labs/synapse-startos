import { T } from '@start9labs/start-sdk'
import { homeserverYaml } from '../../fileModels/homeserver.yml'
import { i18n } from '../../i18n'
import { homeserverHostnames } from '../../interfaces'
import { sdk } from '../../sdk'
import { setAdminPassword } from '../accounts/setAdminPassword'

const { InputSpec, Value } = sdk

export const inputSpec = InputSpec.of({
  server_name: Value.dynamicSelect(async ({ effects }) =>
    getClearnetHostnames(effects),
  ),
})

export const setServerName = sdk.Action.withInput(
  // id
  'set-server-name',

  // metadata
  async () => ({
    name: i18n('Set Server Address/URL'),
    description: i18n(
      'Choose a permanent address/URL for your Synapse server.',
    ),
    warning: i18n(
      'This can never be changed. First add either a public domain or a private Tailscale HTTPS address on port 443 to the Homeserver interface.',
    ),
    allowedStatuses: 'only-stopped',
    group: i18n('Setup'),
    visibility: 'hidden',
  }),

  // form input specification
  inputSpec,

  // optionally pre-fill the input form
  async () => ({}),

  // the execution function
  async ({ effects, input }) => {
    const availableHostnames = await homeserverHostnames(effects)
    if (!availableHostnames.includes(input.server_name)) {
      throw new Error(
        i18n(
          'That address is no longer available on the Homeserver interface. Add it again, then reopen this task.',
        ),
      )
    }

    await homeserverYaml.merge(effects, {
      server_name: input.server_name,
      public_baseurl: `https://${input.server_name}`,
    })

    await sdk.action.createOwnTask(effects, setAdminPassword, 'critical', {
      reason: i18n(
        'Create a root admin user for your Synapse Matrix homeserver',
      ),
    })

    return {
      version: '1' as const,
      title: i18n('Success'),
      message: null,
      result: {
        type: 'single' as const,
        name: i18n('Address/URL'),
        description: null,
        value: `https://${input.server_name}`,
        masked: false,
        copyable: true,
        qr: true,
      },
    }
  },
)

async function getClearnetHostnames(effects: T.Effects): Promise<{
  name: string
  description?: string | null
  warning?: string | null
  default: string
  values: Record<string, string>
}> {
  const hostnames = await homeserverHostnames(effects)

  return {
    name: i18n('Address/URL'),
    description: i18n(
      'Your server address becomes the domain part of every user ID, for example @user:matrix.example.com. Public domains allow federation. Private Tailscale HTTPS addresses keep the homeserver available only to devices on your tailnet.',
    ),
    warning: null,
    values: hostnames.reduce(
      (obj: Record<string, string>, hostname: string) => ({
        ...obj,
        [hostname]: hostname,
      }),
      {} as Record<string, string>,
    ),
    default: hostnames[0] || '',
  }
}
