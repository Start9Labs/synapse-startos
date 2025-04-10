import { sdk } from './sdk'
import { exposedStore, initStore } from './store'
import { setDependencies } from './dependencies'
import { setInterfaces } from './interfaces'
import { versions } from './versions'
import { actions } from './actions'
import { homeserverYaml } from './file-models/config.yml'
import { configDefaults } from './utils'

// **** Install ****
const install = sdk.setupInstall(
  // ** Post install **
  async ({ effects }) => {
    // @TODO create task for creating admin user and choosing permanent homeserver host
  },
  // ** Pre install **
  async ({ effects }) => {
    await sdk.runCommand(
      effects,
      { imageId: 'synapse' },
      [
        'python',
        '-m',
        'synapse.app.homeserver',
        '--server-name',
        'my.domain.name',
        '--config-path',
        'homeserver.yaml',
        '--generate-config',
        '--report-stats=no',
      ],
      { mounts: sdk.Mounts.of().addVolume('main', null, '/data', false) },
      'gen-config',
    )

    await homeserverYaml.write(effects, configDefaults)
  },
)

// **** Uninstall ****
const uninstall = sdk.setupUninstall(async ({ effects }) => {})

/**
 * Plumbing. DO NOT EDIT.
 */
export const { packageInit, packageUninit, containerInit } = sdk.setupInit(
  versions,
  install,
  uninstall,
  setInterfaces,
  setDependencies,
  actions,
  initStore,
  exposedStore,
)
