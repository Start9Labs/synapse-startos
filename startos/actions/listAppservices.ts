import type { T } from '@start9labs/start-sdk'
import {
  appserviceRegistrationYaml,
  appservicesSubpath,
  type AppserviceRegistration,
} from '../fileModels/appserviceRegistration.yaml'
import { homeserverYaml } from '../fileModels/homeserver.yml'
import { sdk } from '../sdk'

const appserviceFields = (reg: AppserviceRegistration): T.ActionResultMember[] => {
  const fields: T.ActionResultMember[] = [
    {
      type: 'single',
      name: 'ID',
      description: null,
      value: reg.id,
      masked: false,
      copyable: true,
      qr: false,
    },
    {
      type: 'single',
      name: 'URL',
      description: null,
      value: reg.url,
      masked: false,
      copyable: true,
      qr: false,
    },
    {
      type: 'single',
      name: 'Sender Localpart',
      description: null,
      value: reg.sender_localpart,
      masked: false,
      copyable: true,
      qr: false,
    },
    {
      type: 'single',
      name: 'AS Token',
      description: null,
      value: reg.as_token,
      masked: true,
      copyable: true,
      qr: false,
    },
    {
      type: 'single',
      name: 'HS Token',
      description: null,
      value: reg.hs_token,
      masked: true,
      copyable: true,
      qr: false,
    },
    {
      type: 'single',
      name: 'Rate Limited',
      description: null,
      value: String(reg.rate_limited),
      masked: false,
      copyable: false,
      qr: false,
    },
  ]

  if (reg.namespaces.users[0]?.regex) {
    fields.push({
      type: 'single',
      name: 'User Namespace',
      description: null,
      value: reg.namespaces.users[0].regex,
      masked: false,
      copyable: true,
      qr: false,
    })
  }

  return fields
}

export const listAppservices = sdk.Action.withoutInput(
  'list-appservices',

  async ({ effects }) => ({
    name: 'List Appservices',
    description:
      'View all registered Matrix appservices (bridges) on this homeserver.',
    warning: null,
    allowedStatuses: 'any',
    group: null,
    visibility: 'enabled',
  }),

  async ({ effects }) => {
    const files =
      (await homeserverYaml.read((h) => h.app_service_config_files).once()) ||
      []

    if (files.length === 0) {
      return {
        version: '1' as const,
        title: 'Registered Appservices',
        message: 'No appservices are currently registered.',
        result: null,
      }
    }

    const groups: T.ActionResultMember[] = []

    for (const filePath of files) {
      const match = filePath.match(new RegExp(`/${appservicesSubpath}/(.+)\\.yaml$`))
      if (!match) continue
      const id = match[1]

      try {
        const reg = await appserviceRegistrationYaml(id).read().once()
        if (!reg) throw new Error(`appservices/${id}.yaml not found`)

        groups.push({
          type: 'group',
          name: reg.id,
          description: null,
          value: appserviceFields(reg),
        })
      } catch {
        groups.push({
          type: 'single',
          name: id,
          description: null,
          value: 'Error reading registration file',
          masked: false,
          copyable: false,
          qr: false,
        })
      }
    }

    return {
      version: '1' as const,
      title: 'Registered Appservices',
      message: null,
      result: {
        type: 'group' as const,
        value: groups,
      },
    }
  },
)
