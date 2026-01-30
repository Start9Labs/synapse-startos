import { unlink } from 'node:fs/promises'
import { homeserverYaml } from '../fileModels/homeserver.yml'
import { sdk } from '../sdk'
import { mountpoint } from '../utils'

const { InputSpec, Value } = sdk

const appservicesSubpath = 'appservices'

export const inputSpec = InputSpec.of({
  id: Value.dynamicSelect(async ({ effects }) => {
    const files =
      (await homeserverYaml.read((h) => h.app_service_config_files).once()) ||
      []

    const values: Record<string, string> = {}
    for (const f of files) {
      const match = f.match(/\/appservices\/(.+)\.yaml$/)
      if (match) values[match[1]] = match[1]
    }

    const keys = Object.keys(values)

    return {
      name: 'Appservice',
      description: 'Select the appservice to remove',
      values,
      default: keys[0] || '',
    }
  }),
})

export const deleteAppservice = sdk.Action.withInput(
  'delete-appservice',

  async ({ effects }) => ({
    name: 'Delete Appservice',
    description: 'Remove a registered appservice (bridge) from the homeserver.',
    warning:
      'This will remove the appservice registration. The bridge service will no longer be able to communicate with Synapse until re-registered.',
    allowedStatuses: 'any',
    group: null,
    visibility: 'enabled',
  }),

  inputSpec,

  async ({ effects }) => ({}),

  async ({ effects, input }) => {
    const { id } = input

    const registrationFile = `${appservicesSubpath}/${id}.yaml`
    const registrationPath = `${mountpoint}/${registrationFile}`
    const volumePath = `/media/startos/volumes/main/${registrationFile}`

    try {
      await unlink(volumePath)
    } catch (e: any) {
      if (e.code !== 'ENOENT') throw e
    }

    const currentFiles =
      (await homeserverYaml.read((h) => h.app_service_config_files).once()) ||
      []

    const updatedFiles = currentFiles.filter(
      (f: string) => f !== registrationPath,
    )

    await homeserverYaml.merge(effects, {
      app_service_config_files: updatedFiles,
    })
  },
)
