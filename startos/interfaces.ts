import { sdk } from './sdk'
import { homeserverPort, adminPort } from './utils'

export const setInterfaces = sdk.setupInterfaces(async ({ effects }) => {
  const homeserverMulti = sdk.MultiHost.of(effects, 'homeserver-multi')
  const homeserverMultiOrigin = await homeserverMulti.bindPort(homeserverPort, {
    protocol: 'http',
    addSsl: { preferredExternalPort: 8448 }, // @TODO Aiden does this actually work?
  })
  const homeserver = sdk.createInterface(effects, {
    name: 'Homeserver',
    id: 'homeserver',
    description: 'Your Matrix homeserver instance',
    type: 'ui',
    masked: false,
    schemeOverride: null,
    username: null,
    path: '',
    search: {},
  })
  const homeserverReceipt = await homeserverMultiOrigin.export([homeserver])

  const adminMulti = sdk.MultiHost.of(effects, 'admin-multi')
  const adminMultiOrigin = await adminMulti.bindPort(adminPort, {
    protocol: 'http',
  })
  const admin = sdk.createInterface(effects, {
    name: 'Admin Dashboard',
    id: 'admin',
    description: 'Your admin web dashboard of Synapse',
    type: 'ui',
    masked: false,
    schemeOverride: null,
    username: null,
    path: '',
    search: {},
  })
  const adminReceipt = await adminMultiOrigin.export([admin])

  return [homeserverReceipt, adminReceipt]
})
