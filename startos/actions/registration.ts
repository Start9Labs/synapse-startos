import { homeserverYaml } from '../fileModels/homeserver.yml'
import { i18n } from '../i18n'
import { sdk } from '../sdk'

const { InputSpec, Value, List } = sdk

export const inputSpec = InputSpec.of({
  mode: Value.select({
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
  auto_join_rooms: Value.list(
    List.text(
      {
        name: i18n('Rooms to Join Automatically'),
        default: [],
        description: i18n(
          'Rooms every new account is put into as soon as it is created — a welcome room, an announcements room. Give the full alias including your server, such as #welcome:matrix.example.com. A room named here that does not exist yet is created by the first person to sign up.',
        ),
      },
      {
        placeholder: '#welcome:matrix.example.com',
        patterns: [
          {
            regex: '^#[^:\\s]+:[^:\\s]+$',
            description: i18n(
              'Must be a full room alias: a #, a name, a colon, then a server — for example #welcome:matrix.example.com. Synapse refuses to start if this is malformed.',
            ),
          },
        ],
      },
    ),
  ),
  allow_guest_access: Value.toggle({
    name: i18n('Guest Access'),
    description: i18n(
      'Let people look around without an account at all. Guests get a temporary account with no password, which they cannot recover and you cannot easily moderate. Off is the right answer for almost every server.',
    ),
    default: false,
  }),
})

export const registration = sdk.Action.withInput(
  // id
  'registration',

  // metadata
  async () => ({
    name: i18n('Registration'),
    description: i18n(
      'Who may create an account here, what rooms they land in, and whether people without an account may look around.',
    ),
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
    if (!yaml) return {}

    return {
      mode: !yaml.enable_registration
        ? ('disabled' as const)
        : yaml.registration_requires_token
          ? ('invite-only' as const)
          : ('open' as const),
      auto_join_rooms: yaml.auto_join_rooms,
      allow_guest_access: yaml.allow_guest_access,
    }
  },

  // the execution function
  async ({ effects, input }) => {
    await homeserverYaml.merge(effects, {
      enable_registration: input.mode !== 'disabled',
      registration_requires_token: input.mode === 'invite-only',
      // Synapse refuses to start on open registration with no verification of
      // any kind; a token requirement counts, so only Open needs the override.
      enable_registration_without_verification: input.mode === 'open',
      auto_join_rooms: input.auto_join_rooms,
      allow_guest_access: input.allow_guest_access,
    })
  },
)
