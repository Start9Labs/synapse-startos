import { sdk } from '../sdk'
import { getAccessToken } from './accounts/getAccessToken'
import { setAdminPassword } from './accounts/setAdminPassword'
import { deleteAppservice } from './appServices/deleteAppservice'
import { listAppservices } from './appServices/listAppservices'
import { registerAppservice } from './appServices/registerAppservice'
import { config } from './settings/config'
import { discoverability } from './settings/discoverability'
import { manageSmtp } from './settings/manageSmtp'
import { rateLimits } from './settings/rateLimits'
import { registration } from './settings/registration'
import { importHomeserver } from './setup/importHomeserver'
import { setServerName } from './setup/setServerName'

export const actions = sdk.Actions.of()
  .addAction(setServerName)
  .addAction(importHomeserver)
  .addAction(setAdminPassword)
  .addAction(getAccessToken)
  .addAction(config)
  .addAction(registration)
  .addAction(rateLimits)
  .addAction(discoverability)
  .addAction(manageSmtp)
  .addAction(registerAppservice)
  .addAction(listAppservices)
  .addAction(deleteAppservice)
