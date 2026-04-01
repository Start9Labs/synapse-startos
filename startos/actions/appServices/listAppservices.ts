import type { T } from '@start9labs/start-sdk'
import {
  appserviceRegistrationYaml,
  appservicesSubpath,
  type AppserviceRegistration,
} from '../../fileModels/appserviceRegistration.yaml'
import { homeserverYaml } from '../../fileModels/homeserver.yml'
import { i18n } from '../../i18n'
import { sdk } from '../../sdk'

const appserviceFields = (
  reg: AppserviceRegistration,
): T.ActionResultMember[] => {
  const fields: T.ActionResultMember[] = [
    {
      type: 'single',
      name: i18n('ID'),
      description: null,
      value: reg.id,
      masked: false,
      copyable: true,
      qr: false,
    },
    {
      type: 'single',
      name: i18n('URL'),
      description: null,
      value: reg.url,
      masked: false,
      copyable: true,
      qr: false,
    },
    {
      type: 'single',
      name: i18n('Sender Localpart'),
      description: null,
      value: reg.sender_localpart,
      masked: false,
      copyable: true,
      qr: false,
    },
    {
      type: 'single',
      name: i18n('AS Token'),
      description: null,
      value: reg.as_token,
      masked: true,
      copyable: true,
      qr: false,
    },
    {
      type: 'single',
      name: i18n('HS Token'),
      description: null,
      value: reg.hs_token,
      masked: true,
      copyable: true,
      qr: false,
    },
    {
      type: 'single',
      name: i18n('Rate Limited'),
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
      name: i18n('User Namespace'),
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
    name: i18n('List Appservices'),
    description: i18n(
      'View all registered Matrix appservices (bridges) on this homeserver.',
    ),
    warning: null,
    allowedStatuses: 'any',
    group: 'App Services',
    visibility: 'enabled',
  }),

  async ({ effects }) => {
    const files =
      (await homeserverYaml.read((h) => h.app_service_config_files).once()) ||
      []

    if (files.length === 0) {
      return {
        version: '1',
        title: i18n('Registered Appservices'),
        message: i18n('No appservices are currently registered.'),
        result: null,
      }
    }

    const groups: T.ActionResultMember[] = []

    for (const filePath of files) {
      const match = filePath.match(
        new RegExp(`/${appservicesSubpath}/(.+)\\.yaml$`),
      )
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
          value: i18n('Error reading registration file'),
          masked: false,
          copyable: false,
          qr: false,
        })
      }
    }

    return {
      version: '1',
      title: i18n('Registered Appservices'),
      message: null,
      result: {
        type: 'group',
        value: groups,
      },
    }
  },
)
