import { storeJson } from './fileModels/store.json'
import { sdk } from './sdk'
import { coturnId, coturnVersionRange } from './utils'

export const setDependencies = sdk.setupDependencies(async ({ effects }) => {
  const turn = await storeJson.read((s) => s.turn).const(effects)
  if (!turn) return {}

  return {
    [coturnId]: {
      kind: 'running',
      versionRange: coturnVersionRange,
      // No healthChecks: Coturn's `TURN Server` check fails until the user
      // attaches a public domain to it, which would leave a permanent unmet
      // dependency on Synapse even though Synapse serves fine without relay.
      // Coturn's own check already names what's missing.
      healthChecks: [],
    },
  }
})
