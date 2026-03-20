import { FileHelper, z } from '@start9labs/start-sdk'
import { sdk } from '../sdk'

const defaultNamespaces = { users: [] as { regex: string; exclusive: boolean }[], aliases: [] as string[], rooms: [] as string[] }

const namespacesShape = z
  .object({
    users: z
      .array(
        z.object({
          regex: z.string(),
          exclusive: z.boolean().catch(true),
        }),
      )
      .catch(defaultNamespaces.users),
    aliases: z.array(z.string()).catch(defaultNamespaces.aliases),
    rooms: z.array(z.string()).catch(defaultNamespaces.rooms),
  })
  .catch(defaultNamespaces)

const shape = z.object({
  // set per-appservice
  id: z.string(),
  url: z.string(),
  as_token: z.string(),
  hs_token: z.string(),
  sender_localpart: z.string(),
  // enforced
  rate_limited: z.boolean().catch(false),
  // configurable
  namespaces: namespacesShape,
})

export type AppserviceRegistration = z.infer<typeof shape>

export const appservicesSubpath = 'appservices'

export const appserviceRegistrationYaml = (id: string) =>
  FileHelper.yaml(
    {
      base: sdk.volumes.main,
      subpath: `${appservicesSubpath}/${id}.yaml`,
    },
    shape,
  )
