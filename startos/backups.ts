import { homeserverYaml } from './fileModels/homeserver.yml'
import { sdk } from './sdk'
import { importSubpath, postgresDb, postgresUser } from './utils'

export const { createBackup, restoreInit } = sdk.setupBackups(async () =>
  sdk.Backups.withPgDump({
    imageId: 'postgres',
    dbVolume: 'db',
    mountpoint: '/var/lib/postgresql',
    pgdataPath: '/data',
    database: postgresDb,
    user: postgresUser,
    password: async () => {
      const config = await homeserverYaml.read().once()
      if (!config) throw new Error('homeserver.yaml not found')
      return config.database.args.password
    },
  })
    .addVolume('main')
    // A staged migration is input to the import action, not homeserver data,
    // and its pg_dump is the size of the database — leaving it in would grow
    // every backup until the operator clears the directory out.
    .setOptions({ exclude: [`/${importSubpath}`] }),
)
