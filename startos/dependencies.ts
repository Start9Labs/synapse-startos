import { storeJson } from './fileModels/store.json'
import { sdk } from './sdk'
import { coturnId, coturnVersionRange } from './utils'

const coturn = sdk.Dependency.optional(coturnId, {
  description:
    'Provides a TURN/STUN relay so voice and video calls connect through NAT and restrictive firewalls',
  metadata: {
    title: 'Coturn',
    icon: 'https://raw.githubusercontent.com/Start9Labs/coturn-startos/d67ecaca5800a87e3300ce44c62484888f35d51b/icon.svg',
  },
  kind: 'running',
  versionRange: coturnVersionRange,
  // No healthChecks: Coturn's `TURN Server` check fails until the user
  // attaches a public domain to it, which would leave a permanent unmet
  // dependency on Synapse even though Synapse serves fine without relay.
  // Coturn's own check already names what's missing.
  healthChecks: [],
  // Enabled only while a TURN server is configured. Declaring coturn
  // unconditionally would show an unmet-dependency warning to every user who
  // never asked for voice or video.
  enabled: async ({ effects }) =>
    (await storeJson.read((s) => s.turn).const(effects)) ?? false,
})

export const dependencies = sdk.Dependencies.of().addDependency(coturn)
