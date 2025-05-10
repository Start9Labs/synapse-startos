import { matches, FileHelper } from '@start9labs/start-sdk'

const { object, boolean, any } = matches

const shape = object({
  adminUserCreated: boolean.onMismatch(true),
  serverStarted: boolean.onMismatch(true),
  smtp: object({
    selection: any,
    value: any,
  }).onMismatch({ selection: 'disabled' as any, value: {} }),
})

export const store = FileHelper.json(
  { volumeId: 'main', subpath: '/store.json' },
  shape,
)
