import { YAML } from '@start9labs/start-sdk'
import { homeserverYaml } from '../fileModels/homeserver.yml'
import { sdk } from '../sdk'
import { mountpoint } from '../utils'

type ResultEntry =
  | {
      type: 'single'
      name: string
      description: string | null
      value: string
      masked: boolean
      copyable: boolean
      qr: boolean
    }
  | {
      type: 'group'
      name: string
      description: string | null
      value: ResultEntry[]
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

    const groups: ResultEntry[] = []

    for (const filePath of files) {
      const subpath = filePath.replace(`${mountpoint}/`, '')
      try {
        const content = await sdk.volumes.main.readFile(subpath, 'utf-8')
        const parsed = YAML.parse(content as string)

        const fields: ResultEntry[] = [
          {
            type: 'single',
            name: 'ID',
            description: null,
            value: parsed.id || 'unknown',
            masked: false,
            copyable: true,
            qr: false,
          },
          {
            type: 'single',
            name: 'URL',
            description: null,
            value: parsed.url || 'not configured',
            masked: false,
            copyable: true,
            qr: false,
          },
          {
            type: 'single',
            name: 'Sender Localpart',
            description: null,
            value: parsed.sender_localpart || 'unknown',
            masked: false,
            copyable: true,
            qr: false,
          },
          {
            type: 'single',
            name: 'AS Token',
            description: null,
            value: parsed.as_token || 'unknown',
            masked: true,
            copyable: true,
            qr: false,
          },
          {
            type: 'single',
            name: 'HS Token',
            description: null,
            value: parsed.hs_token || 'unknown',
            masked: true,
            copyable: true,
            qr: false,
          },
          {
            type: 'single',
            name: 'Rate Limited',
            description: null,
            value: String(parsed.rate_limited ?? 'unknown'),
            masked: false,
            copyable: false,
            qr: false,
          },
        ]

        if (parsed.namespaces?.users?.[0]?.regex) {
          fields.push({
            type: 'single',
            name: 'User Namespace',
            description: null,
            value: parsed.namespaces.users[0].regex,
            masked: false,
            copyable: true,
            qr: false,
          })
        }

        groups.push({
          type: 'group',
          name: parsed.id || subpath,
          description: null,
          value: fields,
        })
      } catch {
        groups.push({
          type: 'single',
          name: subpath,
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
