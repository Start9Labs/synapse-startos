import { setupExposeStore } from '@start9labs/start-sdk'
import { sdk } from './sdk'

export type Store = {
  adminUserCreated: boolean
  serverStarted: boolean
  smtp: typeof sdk.inputSpecConstants.smtpInputSpec._TYPE
}

export const initStore: Store = {
  adminUserCreated: false,
  serverStarted: false,
  smtp: { selection: 'disabled', value: {} },
}

export const exposedStore = setupExposeStore<Store>(() => [])
