import { VersionInfo, IMPOSSIBLE, YAML } from '@start9labs/start-sdk'
import { rm, readFile } from 'fs/promises'
import { storeJson } from '../../fileModels/store.json'

export const v_1_146_0_0_b0 = VersionInfo.of({
  version: '1.146.0:0-beta.0',
  releaseNotes: {
    en_US: 'Updated upstream Synapse to 1.146.0',
    es_ES: 'Actualizado Synapse upstream a 1.146.0',
    de_DE: 'Upstream Synapse auf 1.146.0 aktualisiert',
    pl_PL: 'Zaktualizowano upstream Synapse do 1.146.0',
    fr_FR: 'Mise à jour de Synapse upstream vers 1.146.0',
  },
  migrations: {
    up: async ({ effects }) => {
      // get old config.yaml
      const configYaml:
        | {
            'email-notifications'?: boolean
            'smtp-host'?: string
            'smtp-port'?: number
            'from-name'?: string
            'smtp-user'?: string
            'smtp-pass'?: string
          }
        | undefined = await readFile(
        '/media/startos/volumes/main/start9/config.yaml',
        'utf-8',
      ).then(YAML.parse, () => undefined)

      if (configYaml) {
        // Write store
        await storeJson.merge(effects, {
          adminUserCreated: true,
          serverStarted: true,
          smtp:
            configYaml['email-notifications'] &&
            configYaml['smtp-host'] &&
            configYaml['smtp-port'] &&
            configYaml['from-name'] &&
            configYaml['smtp-user']
              ? {
                  selection: 'custom',
                  value: {
                    server: configYaml['smtp-host'],
                    port: configYaml['smtp-port'],
                    from: configYaml['from-name'],
                    login: configYaml['smtp-user'],
                    password: configYaml['smtp-pass'],
                  },
                }
              : { selection: 'disabled', value: {} },
        })

        // Clean up legacy folder
        await rm('/media/startos/volumes/main/start9', {
          recursive: true,
        })
      }
    },
    down: IMPOSSIBLE,
  },
})
