import { sdk } from '../sdk'
import { deleteAppservice } from './appServices/deleteAppservice'
import { listAppservices } from './appServices/listAppservices'
import { registerAppservice } from './appServices/registerAppservice'
import { config } from './config'
import { createBotUser } from './createBotUser'
import { getAccessToken } from './getAccessToken'
import { setAdminPassword } from './setAdminPassword'
import { setServerName } from './setServerName'

export const actions = sdk.Actions.of()
  .addAction(setServerName)
  .addAction(setAdminPassword)
  .addAction(getAccessToken)
  .addAction(config)
  .addAction(registerAppservice)
  .addAction(listAppservices)
  .addAction(deleteAppservice)
  .addAction(createBotUser)
