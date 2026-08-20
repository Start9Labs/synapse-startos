import {
  defaultLogLevel,
  homeserverLogConfig,
} from '../../fileModels/homeserver.log.config'
import { homeserverYaml } from '../../fileModels/homeserver.yml'
import { storeJson } from '../../fileModels/store.json'
import { i18n } from '../../i18n'
import { sdk } from '../../sdk'

const { InputSpec, Value } = sdk

export const inputSpec = InputSpec.of({
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
  url_previews: Value.toggle({
    name: i18n('Link Previews'),
    description: i18n(
      'Show a title, summary and thumbnail under links posted in chat. Your server fetches the page to build the preview, so it is your server rather than each of your users that contacts the site. Requests to private and loopback address ranges are refused, which keeps the fetcher away from everything else on your network.',
    ),
    default: false,
  }),
  push_include_content: Value.toggle({
    name: i18n('Message Text in Notifications'),
    description: i18n(
      'Include the message itself in push notifications, rather than only who sent it and where. Turning this off means notifications give nothing away on a locked screen, at the cost of having to open the app to see what was said. Encrypted messages never include their text either way.',
    ),
    default: true,
  }),
  admin_contact: Value.text({
    name: i18n('Admin Contact'),
    description: i18n(
      'How to reach you, shown to your users if the server ever refuses an action because it has hit a resource limit. A mailto: link is the usual form.',
    ),
    required: false,
    default: null,
    placeholder: 'mailto:admin@example.com',
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
    group: i18n('Settings'),
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
    const { admin_contact, presence, push, url_preview_enabled } = yaml

    return {
      admin_contact: admin_contact ?? null,
      log_level: logLevel,
      turn,
      presence: presence.enabled,
      url_previews: url_preview_enabled,
      push_include_content: push.include_content,
    }
  },

  // the execution function
  async ({ effects, input }) => {
    // `main` reads this, resolves the Coturn endpoint and renders the turn_*
    // keys, so nothing here writes them directly.
    await storeJson.merge(effects, { turn: input.turn })
    await homeserverLogConfig.merge(effects, {
      root: { level: input.log_level },
    })

    await homeserverYaml.merge(effects, {
      admin_contact: input.admin_contact ?? undefined,
      presence: { enabled: input.presence },
      url_preview_enabled: input.url_previews,
      push: { include_content: input.push_include_content },
    })
  },
)
