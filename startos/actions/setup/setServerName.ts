import { homeserverYaml } from '../../fileModels/homeserver.yml'
import { i18n } from '../../i18n'
import { homeserverHostnames } from '../../interfaces'
import { sdk } from '../../sdk'
import { placeholderServerName } from '../../utils'
import { setAdminPassword } from '../accounts/setAdminPassword'

const { InputSpec, Value } = sdk

export const serverName = homeserverYaml.read((h) =>
  h.server_name === placeholderServerName ? null : h.server_name,
)

export const inputSpec = InputSpec.of({
  server_name: Value.dynamicSelect(async ({ effects }) => ({
    name: i18n('Address/URL'),
    description: i18n(
      'The domain part of every user ID on your server: choosing matrix.example.com makes your users @name:matrix.example.com. Other Matrix servers also use it to reach yours if you enable federation.',
    ),
    values: Object.fromEntries(
      ((await homeserverHostnames(effects).once()) ?? []).map((h) => [h, h]),
    ),
    default: null,
  })),
})

export const setServerName = sdk.Action.withInput(
  // id
  'set-server-name',

  // metadata
  async ({ effects }) => {
    const name = await serverName.const(effects)
    return {
      name: i18n('Set Server Address/URL'),
      description: i18n(
        'Choose a permanent address/URL for your Synapse server.',
      ),
      warning: name
        ? i18n(
            'This server is ${name}, which can never change. If it is missing from the list, add it back to the Homeserver interface.',
            { name },
          )
        : i18n(
            'This can never be changed, and once it is set an existing homeserver can no longer be imported here. You must first add a public domain to the Homeserver interface.',
          ),
      allowedStatuses: 'only-stopped',
      group: i18n('Setup'),
      visibility: 'hidden',
    }
  },

  // form input specification
  inputSpec,

  // optionally pre-fill the input form
  async () => ({}),

  // the execution function
  async ({ effects, input }) => {
    const name = await serverName.once()
    if (name) {
      if (name === input.server_name) return
      throw new Error(
        i18n(
          'This server is ${name}, which can never change. Add it back to the Homeserver interface instead.',
          { name },
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
  },
)
