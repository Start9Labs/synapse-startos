import { matches, FileHelper } from '@start9labs/start-sdk'
import { sdk } from '../sdk'

const { object, string, boolean, arrayOf } = matches

const shape = object({
  id: string,
  url: string,
  as_token: string,
  hs_token: string,
  sender_localpart: string,
  rate_limited: boolean.onMismatch(false),
  namespaces: object({
    users: arrayOf(
      object({
        regex: string,
        exclusive: boolean.onMismatch(true),
      }),
    ).onMismatch([]),
    aliases: arrayOf(string).onMismatch([]),
    rooms: arrayOf(string).onMismatch([]),
  }),
})

export type AppserviceRegistration = typeof shape._TYPE

export const appservicesSubpath = 'appservices'

export const appserviceRegistrationYaml = (id: string) =>
  FileHelper.yaml(
    {
      base: sdk.volumes.main,
      subpath: `${appservicesSubpath}/${id}.yaml`,
    },
    shape,
  )
