import { setupExposeStore } from '@start9labs/start-sdk'
import { sdk } from './sdk'

export type Store = {
  adminUserCreated: boolean
  host: string | null
  federationEnabled: boolean
  registrationEnabled: boolean
  smtp: typeof sdk.inputSpecConstants.smtpInputSpec._TYPE
}

export const initStore: Store = {
  adminUserCreated: false,
  host: null,
  federationEnabled: false,
  registrationEnabled: false,
  smtp: { selection: 'disabled', value: {} },
}

export const exposedStore = setupExposeStore<Store>(() => [])
