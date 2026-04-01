import { T } from '@start9labs/start-sdk'
import { sdk } from './sdk'

export const homeserverPort = 8008
export const nginxPort = 80
export const adminPort = 8080
export const postgresUser = 'synapse' as const
export const postgresDb = 'synapse' as const
export const postgresMountpoint = '/var/lib/postgresql'

export const mountpoint = '/data'

export const mount = sdk.Mounts.of().mountVolume({
  volumeId: 'main',
  subpath: null,
  mountpoint,
  readonly: false,
})

export const dbMount = sdk.Mounts.of().mountVolume({
  volumeId: 'db',
  subpath: null,
  mountpoint: postgresMountpoint,
  readonly: false,
})

export function getPostgresEnv(password: string) {
  return {
    POSTGRES_USER: postgresUser,
    POSTGRES_PASSWORD: password,
    POSTGRES_DB: postgresDb,
    POSTGRES_INITDB_ARGS: '--encoding=UTF8 --locale=C',
  }
}

export function getPostgresSub(effects: T.Effects, name: string) {
  return sdk.SubContainer.of(effects, { imageId: 'postgres' }, dbMount, name)
}

export async function checkPostgresReady(
  postgresSub: Awaited<ReturnType<typeof getPostgresSub>>,
) {
  const { exitCode } = await postgresSub.exec([
    'pg_isready',
    '-U',
    postgresUser,
    '-d',
    postgresDb,
    '-h',
    '127.0.0.1',
  ])
  if (exitCode !== 0) {
    return { result: 'loading' as const, message: null }
  }
  return { result: 'success' as const, message: null }
}
