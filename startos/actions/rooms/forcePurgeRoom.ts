import { i18n } from '../../i18n'
import { sdk } from '../../sdk'
import { homeserverPort } from '../../utils'

const { InputSpec, Value } = sdk

const base = `http://localhost:${homeserverPort}`

const inputSpec = InputSpec.of({
  roomId: Value.text({
    name: i18n('Room ID'),
    description: i18n(
      "The room's ID as the Rooms tab of the Admin Dashboard shows it, starting with !",
    ),
    warning: null,
    required: true,
    default: null,
    placeholder: '!AbCdEfGhIjKlMnOpQr:matrix.org',
    masked: false,
    patterns: [
      { regex: '^!\\S+$', description: i18n('A room ID starts with !') },
    ],
    inputmode: 'text',
  }),
  username: Value.text({
    name: i18n('Username'),
    description: i18n('An administrator account on this server.'),
    warning: null,
    required: true,
    default: null,
    placeholder: 'admin',
    masked: false,
    patterns: [],
    inputmode: 'text',
  }),
  password: Value.text({
    name: i18n('Password'),
    description: null,
    warning: null,
    required: true,
    default: null,
    placeholder: null,
    masked: true,
    patterns: [],
    inputmode: 'text',
  }),
})

export const forcePurgeRoom = sdk.Action.withInput(
  // id
  'force-purge-room',

  // metadata
  async () => ({
    name: i18n('Force-Purge Room'),
    description: i18n(
      'Delete a room and its history from this server when deleting it from the Admin Dashboard fails.',
    ),
    warning: i18n(
      "This permanently deletes the room's history from this server and removes everyone here from it, even members Synapse cannot remove the normal way. Their apps may keep showing the room until they leave it.",
    ),
    allowedStatuses: 'only-running',
    group: i18n('Rooms'),
    visibility: 'enabled',
  }),

  // form input specification
  inputSpec,

  // optionally pre-fill the input form
  async () => ({}),

  // the execution function
  async ({ input }) => {
    const login = await fetch(`${base}/_matrix/client/v3/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'm.login.password',
        identifier: { type: 'm.id.user', user: input.username },
        password: input.password,
      }),
    })
    const { access_token, error } = await login.json()
    if (!login.ok) throw new Error(error || 'Login failed')

    const api = async (path: string, init: RequestInit = {}) => {
      const res = await fetch(`${base}${path}`, {
        ...init,
        headers: {
          Authorization: `Bearer ${access_token}`,
          'Content-Type': 'application/json',
        },
      })
      const body = await res.json()
      if (!res.ok) throw new Error(body.error || res.statusText)
      return body
    }

    try {
      const { delete_id } = await api(
        `/_synapse/admin/v2/rooms/${encodeURIComponent(input.roomId)}`,
        {
          method: 'DELETE',
          body: JSON.stringify({ purge: true, force_purge: true }),
        },
      )

      for (let i = 0; i < 60; i++) {
        await new Promise((r) => setTimeout(r, 5000))
        const status = await api(
          `/_synapse/admin/v2/rooms/delete_status/${delete_id}`,
        )
        if (status.status === 'complete') {
          return {
            version: '1',
            title: i18n('Success'),
            message: i18n('${room} was purged from this server.', {
              room: input.roomId,
            }),
            result: null,
          }
        }
        if (status.status === 'failed') {
          throw new Error(
            i18n('Synapse could not purge ${room}: ${error}', {
              room: input.roomId,
              error: status.error ?? 'unknown error',
            }),
          )
        }
      }

      return {
        version: '1',
        title: i18n('Still purging'),
        message: i18n(
          'Synapse is still purging ${room} and will finish in the background. The room disappears from the Rooms tab of the Admin Dashboard when it is done.',
          { room: input.roomId },
        ),
        result: null,
      }
    } finally {
      await fetch(`${base}/_matrix/client/v3/logout`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${access_token}` },
      }).catch(() => {})
    }
  },
)
