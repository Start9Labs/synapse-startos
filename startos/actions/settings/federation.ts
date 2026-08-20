import { homeserverYaml } from '../../fileModels/homeserver.yml'
import { i18n } from '../../i18n'
import { sdk } from '../../sdk'

const { InputSpec, Value, Variants, List } = sdk

export const inputSpec = InputSpec.of({
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
})

export const federation = sdk.Action.withInput(
  // id
  'federation',

  // metadata
  async () => ({
    name: i18n('Federation'),
    description: i18n(
      'Which other homeservers yours will talk to, and how much history it will pull in when someone here joins a room elsewhere.',
    ),
    warning: null,
    allowedStatuses: 'any',
    group: i18n('Settings'),
    visibility: 'enabled',
  }),

  // form input specification
  inputSpec,

  // optionally pre-fill the input form
  async ({ effects }) => {
    const yaml = await homeserverYaml.read().const(effects)
    if (!yaml) return {}

    const { listeners, federation_domain_whitelist, limit_remote_rooms } = yaml

    return {
      federation: listeners[0].resources[0].names.includes('federation')
        ? {
            selection: 'enabled' as const,
            value: { federation_domain_whitelist },
          }
        : { selection: 'disabled' as const, value: {} },
      large_rooms: limit_remote_rooms.enabled
        ? {
            selection: 'limited' as const,
            value: { complexity: limit_remote_rooms.complexity },
          }
        : { selection: 'unlimited' as const, value: {} },
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

    await homeserverYaml.merge(effects, {
      listeners,
      federation_domain_whitelist:
        input.federation.selection === 'disabled'
          ? []
          : input.federation.value.federation_domain_whitelist.length
            ? input.federation.value.federation_domain_whitelist
            : undefined,
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
    })
  },
)
