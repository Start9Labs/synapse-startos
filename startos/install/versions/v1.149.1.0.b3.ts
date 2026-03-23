import { VersionInfo, IMPOSSIBLE, YAML } from '@start9labs/start-sdk'
import { rm, readFile } from 'fs/promises'
import { storeJson } from '../../fileModels/store.json'

export const v_1_149_1_0_b3 = VersionInfo.of({
  version: '1.149.1:0-beta.3',
  releaseNotes: {
    en_US: 'Fix initial install failure caused by missing public_baseurl default in file model',
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
                  selection: 'custom' as const,
                  value: {
                    provider: {
                      selection: 'other' as const,
                      value: {
                        host: configYaml['smtp-host'],
                        from: configYaml['from-name'],
                        username: configYaml['smtp-user'],
                        password: configYaml['smtp-pass'],
                        security: {
                          selection: 'tls' as const,
                          value: {
                            port: '465' as const,
                          },
                        },
                      },
                    },
                  },
                }
              : { selection: 'disabled' as const, value: {} },
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
