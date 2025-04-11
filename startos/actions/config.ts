import { homeserverYaml } from '../file-models/homeserver.yml'
import { sdk } from '../sdk'

const { InputSpec, Value, Variants, List } = sdk

export const inputSpec = InputSpec.of({
  enable_registration: Value.toggle({
    name: 'Enable Registration',
    description: `Allow outsiders to create their own accounts on your homeserver. This is not recommended, as it leaves your server vulnerable to attack. It is preferable for you to create accounts on their behalf using your server's admin portal.`,
    default: false,
  }),
  federation: Value.union(
    {
      name: 'Federation',
      default: 'disabled',
      description:
        'If enabled, users on your homeserver will be able to join rooms on other homeservers and vica versa. If disabled, users on your homeserver will only be able to interact with other users and rooms on your homeserver.',
    },
    Variants.of({
      disabled: { name: 'Disabled', spec: InputSpec.of({}) },
      enabled: {
        name: 'Enabled',
        spec: InputSpec.of({
          federation_domain_whitelist: Value.list(
            List.text(
              {
                name: 'Domain Whitelist (optional)',
                default: [],
                description:
                  'If you only want your server to federate with specific homeservers and reject all others, enter the server names here. If no domains are provided, your server will be capable of federating with all public Matrix servers',
              },
              {
                placeholder: 'matrix.start9labs.com',
              },
            ),
          ),
        }),
      },
    }),
  ),
})

export const config = sdk.Action.withInput(
  // id
  'config',

  // metadata
  async ({ effects }) => ({
    name: 'Config',
    description: 'Configure your Synapse homeserver.',
    warning: null,
    allowedStatuses: 'any',
    group: null,
    visibility: 'enabled',
  }),

  // form input specification
  inputSpec,

  // optionally pre-fill the input form
  async ({ effects }) => {
    const { enable_registration, listeners, federation_domain_whitelist } =
      (await homeserverYaml.read.const(effects))!

    return {
      enable_registration,
      federation: listeners[0].resources[0].names.includes('federation')
        ? {
            selection: 'enabled' as const,
            value: { federation_domain_whitelist },
          }
        : { selection: 'disabled' as const, value: {} },
    }
  },

  // the execution function
  async ({ effects, input }) => {
    const listeners = (await homeserverYaml.read.const(effects))?.listeners
    if (!listeners) throw 'Listeners missing from homeserver.yaml'

    listeners[0].resources[0].names =
      input.federation.selection === 'disabled'
        ? ['client']
        : ['client', 'federation']

    await homeserverYaml.merge(effects, {
      enable_registration: input.enable_registration,
      listeners,
      federation_domain_whitelist:
        input.federation.selection === 'disabled'
          ? []
          : input.federation.value.federation_domain_whitelist.length
            ? input.federation.value.federation_domain_whitelist
            : undefined,
    })
  },
)
