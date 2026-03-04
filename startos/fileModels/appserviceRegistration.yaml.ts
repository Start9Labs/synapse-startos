import { FileHelper, z } from '@start9labs/start-sdk'
import { sdk } from '../sdk'

const shape = z.object({
  id: z.string(),
  url: z.string(),
  as_token: z.string(),
  hs_token: z.string(),
  sender_localpart: z.string(),
  rate_limited: z.boolean().catch(false),
  namespaces: z.object({
    users: z
      .array(
        z.object({
          regex: z.string(),
          exclusive: z.boolean().catch(true),
        }),
      )
      .catch([]),
    aliases: z.array(z.string()).catch([]),
    rooms: z.array(z.string()).catch([]),
  }),
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
