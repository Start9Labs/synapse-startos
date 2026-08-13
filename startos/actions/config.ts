import {
  defaultLogLevel,
  homeserverLogConfig,
} from '../fileModels/homeserver.log.config'
import { homeserverYaml } from '../fileModels/homeserver.yml'
import { storeJson } from '../fileModels/store.json'
import { i18n } from '../i18n'
import { sdk } from '../sdk'

const { InputSpec, Value, Variants, List } = sdk

export const inputSpec = InputSpec.of({
  registration: Value.select({
    name: i18n('Registration'),
    description: i18n(
      'Who may create an account on your homeserver. Invite only lets people sign up with a registration token you hand out, which you create and revoke under Registration Tokens in the Admin Dashboard. Open means anyone on the internet who can reach your server can create an account, which is a standing invitation to spam and abuse.',
    ),
    default: 'disabled',
    values: {
      disabled: i18n('Disabled'),
      'invite-only': i18n('Invite Only'),
      open: i18n('Open'),
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
  large_rooms: Value.union({
    name: i18n('Large Room Protection'),
    default: 'unlimited',
    description: i18n(
      'Refuse to join rooms above a size your server can handle. Joining a very large room — a public one with tens of thousands of members — makes your homeserver download and keep its entire history, which on a home server can take hours and fill the disk. This limit applies only the first time anyone here joins a given room.',
    ),
    variants: Variants.of({
      unlimited: { name: i18n('Join Any Room'), spec: InputSpec.of({}) },
      limited: {
        name: i18n('Limit by Size'),
        spec: InputSpec.of({
          complexity: Value.number({
            name: i18n('Complexity Limit'),
            description: i18n(
              "A room's complexity is its number of state events divided by 500, so 1 is roughly a 500-event room and 20 is roughly a 10,000-event room. Synapse's own default is 1, which is strict enough to refuse many ordinary rooms — raise it until joins succeed. Server admins are exempt, so you can always join a room yourself and let everyone else in behind you.",
            ),
            required: true,
            default: 1,
            integer: false,
            step: 0.5,
            min: 0.5,
          }),
        }),
      },
    }),
  }),
  log_level: Value.select({
    name: i18n('Log Level'),
    description: i18n(
      'How much detail Synapse writes to its logs. Info records every request and is useful while setting things up; Warning is quieter and is what most servers should sit on day to day. Debug is very noisy and should only be turned on while chasing a specific problem.',
    ),
    default: defaultLogLevel,
    values: {
      DEBUG: i18n('Debug'),
      INFO: i18n('Info'),
      WARNING: i18n('Warning'),
      ERROR: i18n('Error'),
    },
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
    const logLevel =
      (await homeserverLogConfig.read((c) => c.root.level).const(effects)) ??
      defaultLogLevel
    const yaml = await homeserverYaml.read().const(effects)
    if (!yaml) {
      return { turn, log_level: logLevel }
    }
    const {
      enable_registration,
      listeners,
      federation_domain_whitelist,
      limit_remote_rooms,
      media_retention,
      max_upload_size,
      presence,
      registration_requires_token,
    } = yaml

    return {
      registration: !enable_registration
        ? ('disabled' as const)
        : registration_requires_token
          ? ('invite-only' as const)
          : ('open' as const),
      large_rooms: limit_remote_rooms.enabled
        ? {
            selection: 'limited' as const,
            value: { complexity: limit_remote_rooms.complexity },
          }
        : { selection: 'unlimited' as const, value: {} },
      log_level: logLevel,
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
    await homeserverLogConfig.merge(effects, {
      root: { level: input.log_level },
    })

    await homeserverYaml.merge(effects, {
      enable_registration: input.registration !== 'disabled',
      registration_requires_token: input.registration === 'invite-only',
      // Synapse refuses to start on open registration with no verification of
      // any kind; a token requirement counts, so only Open needs the override.
      enable_registration_without_verification: input.registration === 'open',
      limit_remote_rooms: {
        enabled: input.large_rooms.selection === 'limited',
        complexity:
          input.large_rooms.selection === 'limited'
            ? input.large_rooms.value.complexity
            : 1,
        // Without this an over-limit room is unjoinable by anyone here; with
        // it an admin can join first, after which the room is already known
        // and everyone else can follow.
        admins_can_join: true,
      },
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
