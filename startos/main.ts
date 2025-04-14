import { sdk } from './sdk'
import { T } from '@start9labs/start-sdk'
import { homeserverPort } from './utils'
import { homeserverYaml } from './file-models/homeserver.yml'

export const main = sdk.setupMain(async ({ effects, started }) => {
  /**
   * ======================== Setup (optional) ========================
   *
   * In this section, we fetch any resources or run any desired preliminary commands.
   */
  console.info('Starting Hello World!')

  // Merge to homeserver.yaml to enforce file model protections
  await homeserverYaml.merge(effects, {})

  const smtp = await sdk.store.getOwn(effects, sdk.StorePath.smtp).const()
  const creds =
    smtp.selection === 'disabled'
      ? null
      : smtp.selection === 'custom'
        ? smtp.value
        : await sdk.getSystemSmtp(effects).const()

  if (creds) {
    const { server, port, from, login, password } = creds
    await homeserverYaml.merge(effects, {
      email: {
        enable_notifs: true,
        require_transport_security: true,
        notif_from:
          (smtp.selection === 'system' && smtp.value.customFrom) || from,
        smtp_host: server,
        smtp_port: port,
        smtp_user: login,
        smtp_pass: password || undefined,
      },
    })
  } else {
    await homeserverYaml.merge(effects, {
      email: null,
    })
  }

  // Read from homeserver.yaml with const() to ensure service restart if the file changes
  await homeserverYaml.read.const(effects)

  /**
   * ======================== Additional Health Checks (optional) ========================
   *
   * In this section, we define *additional* health checks beyond those included with each daemon (below).
   */
  const additionalChecks: T.HealthCheck[] = []

  /**
   * ======================== Daemons ========================
   *
   * In this section, we create one or more daemons that define the service runtime.
   *
   * Each daemon defines its own health check, which can optionally be exposed to the user.
   */
  return sdk.Daemons.of(effects, started, additionalChecks).addDaemon(
    'synapse',
    {
      subcontainer: { imageId: 'synapse' },
      command: ['start.py'],
      mounts: sdk.Mounts.of().addVolume('main', null, '/data', false),
      ready: {
        display: 'Homeserver',
        fn: () =>
          sdk.healthCheck.checkPortListening(effects, homeserverPort, {
            successMessage: 'Your Synapse homeserver is ready',
            errorMessage: 'Your Synapse homeserver cannot be reached',
          }),
      },
      requires: [],
    },
  )
})
