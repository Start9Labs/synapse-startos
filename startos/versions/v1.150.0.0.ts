import { VersionInfo, IMPOSSIBLE, YAML } from '@start9labs/start-sdk'
import { rm, readFile } from 'fs/promises'
import { storeJson } from '../fileModels/store.json'

export const v_1_150_0_0 = VersionInfo.of({
  version: '1.150.0:0',
  releaseNotes: {
    en_US: 'Switch from SQLite to PostgreSQL. Add admin user creation wizard. Fix Synapse Admin dashboard CORS issues.',
    es_ES: 'Cambio de SQLite a PostgreSQL. Asistente de creación de usuario administrador. Corrección de problemas CORS en el panel de Synapse Admin.',
    de_DE: 'Umstellung von SQLite auf PostgreSQL. Assistent zur Erstellung eines Admin-Benutzers. Behebung von CORS-Problemen im Synapse Admin Dashboard.',
    pl_PL: 'Przejście z SQLite na PostgreSQL. Kreator tworzenia użytkownika administratora. Naprawa problemów CORS w panelu Synapse Admin.',
    fr_FR: "Passage de SQLite à PostgreSQL. Assistant de création d'utilisateur administrateur. Correction des problèmes CORS du tableau de bord Synapse Admin.",
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
