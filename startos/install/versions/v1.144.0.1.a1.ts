import { VersionInfo, IMPOSSIBLE, YAML } from '@start9labs/start-sdk'
import { rm, readFile } from 'fs/promises'
import { storeJson } from '../../fileModels/store.json'

export const v_1_144_0_1_a1 = VersionInfo.of({
  version: '1.144.0:1-alpha.1',
  releaseNotes: 'Revamped for StartOS 0.4.0',
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
