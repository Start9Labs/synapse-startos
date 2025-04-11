import { sdk } from './sdk'
import { exposedStore, initStore } from './store'
import { setDependencies } from './dependencies'
import { setInterfaces } from './interfaces'
import { versions } from './versions'
import { actions } from './actions'
import { homeserverYaml } from './file-models/homeserver.yml'
import { configDefaults, mount } from './utils'
import { setServerName } from './actions/setServerName'
import { resetAdmin } from './actions/resetAdmin'

// **** Pre Install ****
const preInstall = sdk.setupPreInstall(async ({ effects }) => {
  await sdk.runCommand(
    effects,
    { imageId: 'synapse' },
    [
      'SYNAPSE_SERVER_NAME=placeholder.com',
      'SYNAPSE_REPORT_STATS=no',
      '/start.py',
      'generate',
    ],
    { mounts: mount },
    'gen-config',
  )

  // @TODO Aiden should this be necessary?
  await new Promise((resolve) => setTimeout(resolve, 69))

  await homeserverYaml.write(effects, configDefaults)
})

// **** Post Install ****
const postInstall = sdk.setupPostInstall(async ({ effects }) => {
  await Promise.all([
    sdk.action.requestOwn(effects, setServerName, 'critical', {
      reason: 'Choose the permanent address/URL of your Synapse Matrix server',
    }),
    sdk.action.requestOwn(effects, resetAdmin, 'critical', {
      reason: 'Create a root admin user for your Synapse Matrix homeserver',
    }),
  ])
})

// **** Uninstall ****
const uninstall = sdk.setupUninstall(async ({ effects }) => {})

/**
 * Plumbing. DO NOT EDIT.
 */
export const { packageInit, packageUninit, containerInit } = sdk.setupInit(
  versions,
  preInstall,
  postInstall,
  uninstall,
  setInterfaces,
  setDependencies,
  actions,
  initStore,
  exposedStore,
)
