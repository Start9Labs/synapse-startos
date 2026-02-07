import { Effects } from '@start9labs/start-sdk/base/lib/Effects'
import { i18n } from '../i18n'
import { sdk } from '../sdk'
import { homeserverYaml } from '../fileModels/homeserver.yml'
import { storeJson } from '../fileModels/store.json'

const { InputSpec, Value, Variants } = sdk

const name = i18n('Address/URL')
const description =
  i18n('Your server address/url determines the "domain" part of user-ids for users on your server. For example, @user:my.domain.name, where "my.domain.com" is the addres/url. It also determines how other matrix servers will reach yours if you choose to enable federation.')
const warning =
  i18n('Tor (.onion) servers can only federate with other .onion servers AND require clients to be configured for Tor.')

export const inputSpec = InputSpec.of({
  network: Value.union({
    name: i18n('Network'),
    default: 'clearnet',
    description: i18n('Choose whether your server will be hosted on clearnet (recommended) or Tor. IMPORTANT: Tor (.onion) servers can only federate with other .onion servers AND require clients to be configured for Tor.'),
    variants: Variants.of({
      clearnet: {
        name: i18n('Clearnet'),
        spec: InputSpec.of({
          server_name: Value.dynamicSelect(async ({ effects }) =>
            getSynapseInterfaceHostnames(effects, 'clearnet'),
          ),
        }),
      },
      tor: {
        name: i18n('Tor'),
        spec: InputSpec.of({
          server_name: Value.dynamicSelect(async ({ effects }) =>
            getSynapseInterfaceHostnames(effects, 'tor'),
          ),
        }),
      },
    }),
  }),
})

export const setServerName = sdk.Action.withInput(
  // id
  'set-server-name',

  // metadata
  async ({ effects }) => {
    return {
      name: i18n('Set Server Address/URL'),
      description:
        i18n('Choose a permanent address/URL for your Synapse server. After you start your server for the first time, this can never be changed.'),
      warning: i18n('This can never be changed after you start your server'),
      allowedStatuses: 'only-stopped',
      group: null,
      visibility: (await storeJson.read((s) => s.serverStarted).const(effects))
        ? 'hidden'
        : 'enabled',
    }
  },

  // form input specification
  inputSpec,

  // optionally pre-fill the input form
  async ({ effects }) => {},

  // the execution function
  async ({ effects, input }) => {
    const server_name = input.network.value.server_name

    await homeserverYaml.merge(effects, {
      server_name,
      public_baseurl:
        input.network.selection === 'clearnet'
          ? `https://${server_name}`
          : `http://${server_name}`,
    })
  },
)

export async function getSynapseInterfaceHostnames(
  effects: Effects,
  type: 'clearnet' | 'tor',
): Promise<{
  name: string
  description?: string | null
  warning?: string | null
  default: string
  values: Record<string, string>
}> {
  let hostnames =
    (await sdk.serviceInterface
      .getOwn(effects, 'homeserver', (i) =>
        i?.addressInfo?.hostnames
          .filter((h) =>
            type === 'tor'
              ? h.kind === 'onion'
              : h.kind === 'ip' && h.hostname.kind === 'domain',
          )
          .map((h) => h.hostname.value),
      )
      .once()) || []

  return {
    name,
    description,
    warning: type === 'tor' ? warning : null,
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
