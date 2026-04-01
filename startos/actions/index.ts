import { sdk } from '../sdk'
import { deleteAppservice } from './appServices/deleteAppservice'
import { listAppservices } from './appServices/listAppservices'
import { registerAppservice } from './appServices/registerAppservice'
import { config } from './config'
import { createBotUser } from './createBotUser'
import { getAccessToken } from './getAccessToken'
import { resetAdmin } from './resetAdmin'
import { createAdminUser } from './setup/createAdminUser'
import { setServerName } from './setup/setServerName'

export const actions = sdk.Actions.of()
  .addAction(setServerName)
  .addAction(createAdminUser)
  .addAction(resetAdmin)
  .addAction(getAccessToken)
  .addAction(config)
  .addAction(registerAppservice)
  .addAction(listAppservices)
  .addAction(deleteAppservice)
  .addAction(createBotUser)
