import { sdk } from '../sdk'
import { config } from './config'
import { createBotUser } from './createBotUser'
import { deleteAppservice } from './deleteAppservice'
import { listAppservices } from './listAppservices'
import { registerAppservice } from './registerAppservice'
import { resetAdmin } from './resetAdmin'
import { setServerName } from './setServerName'

export const actions = sdk.Actions.of()
  .addAction(setServerName)
  .addAction(resetAdmin)
  .addAction(config)
  .addAction(registerAppservice)
  .addAction(listAppservices)
  .addAction(deleteAppservice)
  .addAction(createBotUser)
