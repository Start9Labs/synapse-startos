import type { T } from '@start9labs/start-sdk'
import {
  appserviceRegistrationYaml,
  appservicesSubpath,
} from './fileModels/appserviceRegistration.yaml'
import { registerAppservice } from './actions/registerAppservice'
import { sdk } from './sdk'

const synapseMountpoint = '/mnt/synapse'

export type AppserviceParams = {
  id: string
  asToken: string
  hsToken: string
  senderLocalpart: string
  url: string
  rateLimited: boolean
  userNamespaceRegex: string
  reason: string
}

/**
 * Ensures an appservice registration exists in Synapse with matching tokens.
 * Intended for use by dependent services in their setupOnInit handlers.
 *
 * Mounts Synapse's volume read-only, checks the registration file,
 * and creates a task on Synapse to register the appservice if needed.
 */
export const ensureAppserviceRegistration = async (
  effects: T.Effects,
  params: AppserviceParams,
) => {
  await sdk.mount(effects, {
    location: synapseMountpoint,
    target: {
      packageId: 'synapse',
      readonly: true,
      volumeId: 'main',
      subpath: null,
      idmap: [],
    },
  })

  let needsRegistration = false

  try {
    const reg = await appserviceRegistrationYaml(params.id)
      .withPath(`${synapseMountpoint}/${appservicesSubpath}/${params.id}.yaml`)
      .read()
      .once()

    if (
      reg?.as_token !== params.asToken ||
      reg?.hs_token !== params.hsToken
    ) {
      console.info(
        `[i] Appservice registration tokens mismatch for ${params.id}`,
      )
      needsRegistration = true
    }
  } catch {
    console.info(
      `[i] Appservice registration not found in Synapse for ${params.id}`,
    )
    needsRegistration = true
  }

  if (needsRegistration) {
    await sdk.action.createTask(effects, 'synapse', registerAppservice, 'critical', {
      input: {
        kind: 'partial',
        value: {
          id: params.id,
          asToken: params.asToken,
          hsToken: params.hsToken,
          senderLocalpart: params.senderLocalpart,
          url: params.url,
          rateLimited: params.rateLimited,
          userNamespaceRegex: params.userNamespaceRegex,
        },
      },
      when: { condition: 'input-not-matches', once: false },
      reason: params.reason,
    })
  }
}
