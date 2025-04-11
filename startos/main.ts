import { sdk } from './sdk'
import { T } from '@start9labs/start-sdk'
import { homeserverPort, adminPort } from './utils'

export const main = sdk.setupMain(async ({ effects, started }) => {
  /**
   * ======================== Setup (optional) ========================
   *
   * In this section, we fetch any resources or run any desired preliminary commands.
   */
  console.info('Starting Hello World!')

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
  return sdk.Daemons.of(effects, started, additionalChecks)
    .addDaemon('synapse', {
      subcontainer: { imageId: 'synapse' },
      command: ['/start.py'],
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
    })
    .addDaemon('synapse-admin', {
      subcontainer: { imageId: 'synapse-admin' },
      // @TODO how to start the admin UI?
      command: [''],
      mounts: sdk.Mounts.of().addVolume('main', null, '/data', false),
      ready: {
        display: 'Admin UI',
        fn: () =>
          sdk.healthCheck.checkPortListening(effects, adminPort, {
            successMessage: 'Your Synapse admin UI is ready',
            errorMessage: 'Your Synapse admin UI cannot be reached',
          }),
      },
      requires: [],
    })
})
