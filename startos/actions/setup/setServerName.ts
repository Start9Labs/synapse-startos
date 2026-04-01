import { Effects } from '@start9labs/start-sdk/base/lib/Effects'
import { homeserverYaml } from '../../fileModels/homeserver.yml'
import { i18n } from '../../i18n'
import { sdk } from '../../sdk'
import { createAdminUser } from './createAdminUser'

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
      'This can never be changed. You must first add a public domain to the Homeserver interface.',
    ),
    allowedStatuses: 'only-stopped',
    group: null,
    visibility: 'hidden',
  }),

  // form input specification
  inputSpec,

  // optionally pre-fill the input form
  async () => ({}),

  // the execution function
  async ({ effects, input }) => {
    await homeserverYaml.merge(effects, {
      server_name: input.server_name,
      public_baseurl: `https://${input.server_name}`,
    })

    await sdk.action.createOwnTask(effects, createAdminUser, 'critical', {
      reason: i18n(
        'Create a root admin user for your Synapse Matrix homeserver',
      ),
    })
  },
)

async function getClearnetHostnames(effects: Effects): Promise<{
  name: string
  description?: string | null
  warning?: string | null
  default: string
  values: Record<string, string>
}> {
  const hostnames =
    (await sdk.serviceInterface
      .getOwn(effects, 'homeserver', (i) =>
        i?.addressInfo?.hostnames
          .filter(
            (h) =>
              h.metadata.kind === 'public-domain' ||
              h.metadata.kind === 'private-domain',
          )
          .map((h) => h.hostname),
      )
      .once()) || []

  return {
    name: i18n('Address/URL'),
    description: i18n(
      'Your server address/URL determines the "domain" part of user-ids for users on your server. For example, @user:my.domain.name, where "my.domain.com" is the addres/url. It also determines how other matrix servers will reach yours if you choose to enable federation.',
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
