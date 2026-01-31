import { homeserverYaml } from '../fileModels/homeserver.yml'
import { i18n } from '../i18n'
import { sdk } from '../sdk'
import { mountpoint } from '../utils'

const { InputSpec, Value } = sdk

const appservicesSubpath = 'appservices'

export const inputSpec = InputSpec.of({
  id: Value.text({
    name: i18n('Appservice ID'),
    description: i18n('Unique identifier for this appservice (e.g. "signal")'),
    required: true,
    default: null,
    placeholder: 'signal',
    masked: false,
  }),
  asToken: Value.text({
    name: i18n('AS Token'),
    description:
      i18n('Appservice token used by the bridge to authenticate with the homeserver'),
    required: true,
    default: null,
    placeholder: null,
    masked: true,
  }),
  hsToken: Value.text({
    name: i18n('HS Token'),
    description:
      i18n('Homeserver token used by the homeserver to authenticate with the bridge'),
    required: true,
    default: null,
    placeholder: null,
    masked: true,
  }),
  senderLocalpart: Value.text({
    name: i18n('Sender Localpart'),
    description: i18n('The localpart of the bot user (e.g. "signalbot")'),
    required: true,
    default: null,
    placeholder: 'signalbot',
    masked: false,
  }),
  url: Value.text({
    name: i18n('Bridge URL'),
    description:
      i18n('The URL where the homeserver can reach the bridge appservice'),
    required: true,
    default: null,
    placeholder: 'http://mautrix-signal.startos:29328',
    masked: false,
  }),
  rateLimited: Value.toggle({
    name: i18n('Rate Limited'),
    description:
      i18n('Whether requests from this appservice should be rate limited'),
    default: false,
  }),
  userNamespaceRegex: Value.text({
    name: i18n('User Namespace Regex'),
    description:
      i18n('Regex pattern for user IDs managed by this appservice (e.g. "@signal_.*:.*")'),
    required: true,
    default: null,
    placeholder: '@signal_.*:.*',
    masked: false,
  }),
})

export const registerAppservice = sdk.Action.withInput(
  'register-appservice',

  async ({ effects }) => ({
    name: i18n('Register Appservice'),
    description:
      i18n('Register a Matrix appservice (bridge) with the homeserver. This is typically triggered automatically by bridge services.'),
    warning: null,
    allowedStatuses: 'any',
    group: null,
    visibility: 'enabled',
  }),

  inputSpec,

  async ({ effects }) => ({}),

  async ({ effects, input }) => {
    const {
      id,
      asToken,
      hsToken,
      senderLocalpart,
      url,
      rateLimited,
      userNamespaceRegex,
    } = input

    const registrationYaml = [
      `id: ${id}`,
      `url: ${url}`,
      `as_token: ${asToken}`,
      `hs_token: ${hsToken}`,
      `sender_localpart: ${senderLocalpart}`,
      `rate_limited: ${rateLimited}`,
      `namespaces:`,
      `  users:`,
      `    - regex: '${userNamespaceRegex}'`,
      `      exclusive: true`,
      `  aliases: []`,
      `  rooms: []`,
    ].join('\n')

    const registrationFile = `${appservicesSubpath}/${id}.yaml`
    const registrationPath = `${mountpoint}/${registrationFile}`

    await sdk.volumes.main.writeFile(registrationFile, registrationYaml)

    const currentFiles =
      (await homeserverYaml.read((h) => h.app_service_config_files).once()) ||
      []

    if (!currentFiles.includes(registrationPath)) {
      await homeserverYaml.merge(effects, {
        app_service_config_files: [...currentFiles, registrationPath],
      })
    }
  },
)
