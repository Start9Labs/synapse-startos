import { sdk } from './sdk'

export const homeserverPort = 8008
export const nginxPort = 80
export const adminPort = 8080

export const mountpoint = '/data'

export const mount = sdk.Mounts.of().mountVolume({
  volumeId: 'main',
  subpath: null,
  mountpoint,
  readonly: false,
})
