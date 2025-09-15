import { homeserverYaml } from '../fileModels/homeserver.yml'
import { store } from '../fileModels/store.json'
import { sdk } from '../sdk'

const { InputSpec, Value, Variants, List } = sdk

export const inputSpec = InputSpec.of({
  registration: Value.select({
    name: 'Registration',
    description: `Allow outsiders to create their own accounts on your homeserver. This is not recommended, as it leaves your server vulnerable to attack. It is preferable for you to create accounts on their behalf using your server's admin portal.`,
    default: 'disabled',
    values: {
      disabled: 'Disabled',
      enabled: 'Enabled',
    },
  }),
  federation: Value.union({
    name: 'Federation',
    default: 'disabled',
    description:
      'If enabled, users on your homeserver will be able to join rooms on other homeservers and vica versa. If disabled, users on your homeserver will only be able to interact with other users and rooms on your homeserver.',
    variants: Variants.of({
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
                  'If you only want your server to federate with specific homeservers and reject all others, enter the server addresses/domains here. If no domains are provided, your server will be capable of federating with all public Matrix servers',
              },
              {
                placeholder: 'matrix.start9labs.com',
              },
            ),
          ),
        }),
      },
    }),
  }),
  max_upload_size: Value.number({
    name: 'Max Upload Size',
    description:
      'The maximum file size that is permitted to be uploaded by users to your homeserver.',
    required: true,
    default: 50,
    units: 'MB',
    integer: true,
    min: 1,
    max: 2000,
  }),
  smtp: sdk.inputSpecConstants.smtpInputSpec,
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
    const yaml = await homeserverYaml.read().const(effects)
    if (!yaml) {
      return {}
    }
    const {
      enable_registration,
      listeners,
      federation_domain_whitelist,
      max_upload_size,
    } = yaml

    return {
      registration: enable_registration
        ? ('enabled' as const)
        : ('disabled' as const),
      federation: listeners[0].resources[0].names.includes('federation')
        ? {
            selection: 'enabled' as const,
            value: { federation_domain_whitelist },
          }
        : { selection: 'disabled' as const, value: {} },
      max_upload_size: toMB(max_upload_size),
      smtp: (await store.read((s) => s.smtp).const(effects)) || undefined,
    }
  },

  // the execution function
  async ({ effects, input }) => {
    const listeners = await homeserverYaml
      .read((h) => h.listeners)
      .const(effects)
    if (!listeners) {
      throw 'Listeners missing from homeserver.yaml'
    }

    listeners[0].resources[0].names =
      input.federation.selection === 'disabled'
        ? ['client']
        : ['client', 'federation']

    await store.merge(effects, { smtp: input.smtp })

    await homeserverYaml.merge(effects, {
      enable_registration: input.registration === 'enabled',
      listeners,
      federation_domain_whitelist:
        input.federation.selection === 'disabled'
          ? []
          : input.federation.value.federation_domain_whitelist.length
            ? input.federation.value.federation_domain_whitelist
            : undefined,
      max_upload_size: `${input.max_upload_size}M`,
    })
  },
)

function toMB(max_upload_size: string): number {
  const unit = max_upload_size.at(-1)
  const value = Number(max_upload_size.slice(0, -1))

  switch (unit) {
    case 'M':
      return value
    case 'G':
      return value / 1000
    default:
      return 1
  }
}
