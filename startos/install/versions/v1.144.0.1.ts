import { VersionInfo, IMPOSSIBLE, YAML } from '@start9labs/start-sdk'
import { rm, readFile } from 'fs/promises'
import { store } from '../../fileModels/store.json'

const defaultStore = {
  adminUserCreated: true,
  serverStarted: true,
  smtp: { selection: 'disabled' as const, value: {} },
}

export const v_1_144_0_1 = VersionInfo.of({
  version: '1.144.0:1-alpha.0',
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
        await store.merge(effects, {
          ...defaultStore,
          smtp:
            configYaml['email-notifications'] &&
            configYaml['smtp-host'] &&
            configYaml['smtp-port'] &&
            configYaml['from-name'] &&
            configYaml['smtp-user'] &&
            configYaml['smtp-pass']
              ? {
                  selection: 'custom' as const,
                  value: {
                    server: configYaml['smtp-host'],
                    port: configYaml['smtp-port'],
                    from: configYaml['from-name'],
                    login: configYaml['smtp-user'],
                    password: configYaml['smtp-pass'],
                  },
                }
              : defaultStore.smtp,
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
