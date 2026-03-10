import { VersionInfo, IMPOSSIBLE, YAML } from '@start9labs/start-sdk'
import { rm, readFile } from 'fs/promises'
import { storeJson } from '../../fileModels/store.json'

export const v_1_146_0_1_b0 = VersionInfo.of({
  version: '1.146.0:1-beta.0',
  releaseNotes: {
    en_US: 'Update to StartOS SDK beta.59',
    es_ES: 'Actualización a StartOS SDK beta.59',
    de_DE: 'Update auf StartOS SDK beta.59',
    pl_PL: 'Aktualizacja do StartOS SDK beta.59',
    fr_FR: 'Mise à jour vers StartOS SDK beta.59',
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
                          selection: 'starttls' as const,
                          value: {
                            port: String(configYaml['smtp-port']) as
                              | '587'
                              | '25'
                              | '2525',
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
