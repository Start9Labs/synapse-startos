import { sdk } from '../sdk'
import { deleteAppservice } from './appServices/deleteAppservice'
import { listAppservices } from './appServices/listAppservices'
import { registerAppservice } from './appServices/registerAppservice'
import { config } from './config'
import { getAccessToken } from './getAccessToken'
import { importHomeserver } from './importHomeserver'
import { manageSmtp } from './manageSmtp'
import { rateLimits } from './rateLimits'
import { setAdminPassword } from './setAdminPassword'
import { setServerName } from './setServerName'

export const actions = sdk.Actions.of()
  .addAction(setServerName)
  .addAction(importHomeserver)
  .addAction(setAdminPassword)
  .addAction(getAccessToken)
  .addAction(config)
  .addAction(manageSmtp)
  .addAction(rateLimits)
  .addAction(registerAppservice)
  .addAction(listAppservices)
  .addAction(deleteAppservice)
