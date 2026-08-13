import { homeserverYaml } from '../fileModels/homeserver.yml'
import { storeJson } from '../fileModels/store.json'
import { i18n } from '../i18n'
import { sdk } from '../sdk'

const { InputSpec, Value, Variants, List } = sdk

export const inputSpec = InputSpec.of({
  registration: Value.select({
    name: i18n('Registration'),
    description: i18n(
      "Allow outsiders to create their own accounts on your homeserver. This is not recommended, as it leaves your server vulnerable to attack. It is preferable for you to create accounts on their behalf using your server's admin portal.",
    ),
    default: 'disabled',
    values: {
      disabled: i18n('Disabled'),
      enabled: i18n('Enabled'),
    },
  }),
  federation: Value.union({
    name: i18n('Federation'),
    default: 'disabled',
    description: i18n(
      'If enabled, users on your homeserver will be able to join rooms on other homeservers and vica versa. If disabled, users on your homeserver will only be able to interact with other users and rooms on your homeserver.',
    ),
    variants: Variants.of({
      disabled: { name: i18n('Disabled'), spec: InputSpec.of({}) },
      enabled: {
        name: i18n('Enabled'),
        spec: InputSpec.of({
          federation_domain_whitelist: Value.list(
            List.text(
              {
                name: i18n('Domain Whitelist (optional)'),
                default: [],
                description: i18n(
                  'If you only want your server to federate with specific homeservers and reject all others, enter the server addresses/domains here. If no domains are provided, your server will be capable of federating with all public Matrix servers',
                ),
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
  turn: Value.toggle({
    name: i18n('Voice and Video Calls'),
    description: i18n(
      'Relay calls through the Coturn service so they connect when both parties are behind NAT or a restrictive firewall. Requires Coturn to be installed and running with a public domain of its own; until it is, calls fall back to a direct connection.',
    ),
    default: false,
  }),
  presence: Value.toggle({
    name: i18n('Presence'),
    description: i18n(
      'Share online/offline status and "last seen" times between users, including with users on other homeservers. Turning this off reduces CPU, database, and federation traffic.',
    ),
    default: true,
  }),
  max_upload_size: Value.number({
    name: i18n('Max Upload Size'),
    description: i18n(
      'The maximum file size that is permitted to be uploaded by users to your homeserver.',
    ),
    required: true,
    default: 50,
    units: i18n('MB'),
    integer: true,
    min: 1,
    max: 2000,
  }),
  remote_media_lifetime: Value.number({
    name: i18n('Remote Media Retention'),
    description: i18n(
      'How long to keep a cached copy of media uploaded to other homeservers. Purged files are re-downloaded on demand, so the only cost is a little bandwidth. Leave empty to keep them forever, which is the default and can grow your disk usage and your backups without limit.',
    ),
    required: false,
    default: null,
    units: i18n('days'),
    integer: true,
    min: 1,
  }),
})

export const config = sdk.Action.withInput(
  // id
  'config',

  // metadata
  async ({ effects }) => ({
    name: i18n('Config'),
    description: i18n('Configure your Synapse homeserver.'),
    warning: null,
    allowedStatuses: 'any',
    group: null,
    visibility: 'enabled',
  }),

  // form input specification
  inputSpec,

  // optionally pre-fill the input form
  async ({ effects }) => {
    const turn = (await storeJson.read((s) => s.turn).const(effects)) ?? false
    const yaml = await homeserverYaml.read().const(effects)
    if (!yaml) {
      return { turn }
    }
    const {
      enable_registration,
      listeners,
      federation_domain_whitelist,
      media_retention,
      max_upload_size,
      presence,
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
      turn,
      presence: presence.enabled,
      max_upload_size: toMB(max_upload_size),
      remote_media_lifetime: toDays(media_retention?.remote_media_lifetime),
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

    // `main` reads this, resolves the Coturn endpoint and renders the turn_*
    // keys, so nothing here writes them directly.
    await storeJson.merge(effects, { turn: input.turn })

    await homeserverYaml.merge(effects, {
      enable_registration: input.registration === 'enabled',
      listeners,
      federation_domain_whitelist:
        input.federation.selection === 'disabled'
          ? []
          : input.federation.value.federation_domain_whitelist.length
            ? input.federation.value.federation_domain_whitelist
            : undefined,
      presence: { enabled: input.presence },
      max_upload_size: `${input.max_upload_size}M`,
      media_retention: input.remote_media_lifetime
        ? { remote_media_lifetime: `${input.remote_media_lifetime}d` }
        : undefined,
    })
  },
)

// Only the suffixes that divide evenly into whole days survive the round trip;
// anything else a power user hand-wrote reads back as "keep forever".
function toDays(remote_media_lifetime: string | undefined): number | null {
  const value = Number(remote_media_lifetime?.slice(0, -1))
  if (!value) return null

  switch (remote_media_lifetime?.at(-1)) {
    case 'd':
      return value
    case 'w':
      return value * 7
    case 'y':
      return value * 365
    default:
      return null
  }
}

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
