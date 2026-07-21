import { i18n } from './i18n'
import { sdk } from './sdk'
import { nginxPort, adminPort } from './utils'

// Host ids (the sdk.MultiHost.of groups) — distinct from the interface ids
// exported on them. The `homeserver` interface lives on host `main`; the admin
// UI on host `admin`.
export const homeserverHostId = 'main'
export const homeserverInterfaceId = 'homeserver'
export const adminHostId = 'admin'
export const adminInterfaceId = 'admin'

export const setInterfaces = sdk.setupInterfaces(async ({ effects }) => {
  // ** homeserver **
  const homeserverMulti = sdk.MultiHost.of(effects, homeserverHostId)
  const homeserverMultiOrigin = await homeserverMulti.bindPort(nginxPort, {
    protocol: 'http',
  })
  const homeserver = sdk.createInterface(effects, {
    name: i18n('Homeserver'),
    id: homeserverInterfaceId,
    description: i18n('Your Matrix homeserver instance'),
    type: 'api',
    masked: false,
    schemeOverride: null,
    username: null,
    path: '',
    query: {},
  })
  const homeserverReceipt = await homeserverMultiOrigin.export([homeserver])

  // ** admin UI **
  const adminMulti = sdk.MultiHost.of(effects, adminHostId)
  const adminMultiOrigin = await adminMulti.bindPort(adminPort, {
    protocol: 'http',
  })
  const admin = sdk.createInterface(effects, {
    name: i18n('Admin Dashboard'),
    id: adminInterfaceId,
    description: i18n('Your admin web dashboard of Synapse'),
    type: 'ui',
    masked: false,
    schemeOverride: null,
    username: null,
    path: '',
    query: {},
  })
  const adminReceipt = await adminMultiOrigin.export([admin])

  return [homeserverReceipt, adminReceipt]
})
