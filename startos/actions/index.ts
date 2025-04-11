import { sdk } from '../sdk'
import { config } from './config'
import { resetAdmin } from './resetAdmin'
import { setServerName } from './setServerName'

export const actions = sdk.Actions.of()
  .addAction(setServerName)
  .addAction(resetAdmin)
  .addAction(config)
