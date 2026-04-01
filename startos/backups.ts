import { homeserverYaml } from './fileModels/homeserver.yml'
import { sdk } from './sdk'
import { postgresDb, postgresMountpoint, postgresUser } from './utils'

export const { createBackup, restoreInit } = sdk.setupBackups(async () =>
  sdk.Backups.withPgDump({
    imageId: 'postgres',
    dbVolume: 'db',
    mountpoint: postgresMountpoint,
    pgdataPath: '/data',
    database: postgresDb,
    user: postgresUser,
    password: async () => {
      const config = await homeserverYaml.read().once()
      if (!config) throw new Error('homeserver.yaml not found')
      return config.database.args.password
    },
  }).addVolume('main'),
)
