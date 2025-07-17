import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'
import { yaml } from '@start9labs/start-sdk'
import { readFile, rm } from 'fs/promises'
import { store } from '../../fileModels/store.json'

export const v_1_128_0_1 = VersionInfo.of({
  version: '1.128.0:1',
  releaseNotes: 'Revamped for StartOS 0.4.0',
  migrations: {
    up: async ({ effects }) => {
      const {
        'email-notifications': emailNotifications,
        'smtp-host': smtpHost,
        'smtp-port': smtpPort,
        'from-name': smtpFrom,
        'smtp-user': smtpUser,
        'smtp-pass': smtpPass,
      } = yaml.parse(
        await readFile(
          '/media/startos/volumes/main/start9/config.yaml',
          'utf-8',
        ),
      ) as {
        'email-notifications': boolean
        'smtp-host': string
        'smtp-port': number
        'from-name': string
        'smtp-user': string
        'smtp-pass': string
      }

      await store.merge(effects, {
        adminUserCreated: true,
        serverStarted: true,
        smtp: emailNotifications
          ? {
              selection: 'custom',
              value: {
                server: smtpHost,
                port: smtpPort,
                from: smtpFrom,
                login: smtpUser,
                password: smtpPass,
              },
            }
          : { selection: 'disabled', value: {} },
      })

      // remove old start9 dir
      await rm('/media/startos/volumes/main/start9', {
        recursive: true,
        force: true,
      })
    },
    down: IMPOSSIBLE,
  },
})
