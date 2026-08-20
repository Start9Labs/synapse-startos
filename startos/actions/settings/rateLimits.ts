import {
  homeserverYaml,
  upstreamDefaults,
} from '../../fileModels/homeserver.yml'
import { i18n } from '../../i18n'
import { sdk } from '../../sdk'

const { InputSpec, Value, Variants } = sdk

type Rate = { per_second: number; burst_count: number }

// This pair is bytes rather than counts, so it is carried in the form's own
// units and converted at the edges.
const mediaUpstream = {
  per_second: Number(
    upstreamDefaults.remote_media_download_per_second.slice(0, -1),
  ),
  burst_count: Number(
    upstreamDefaults.remote_media_download_burst_count.slice(0, -1),
  ),
}
const mediaRelaxed = { per_second: 1024, burst_count: 500 }

// Synapse's own defaults, read from the shipped image rather than its docs.
// `Normal` writes none of these — it clears the keys so upstream applies —
// but Custom pre-fills from them, so they have to be right.
const upstream = {
  rc_message: { per_second: 0.2, burst_count: 10 },
  rc_registration: { per_second: 0.17, burst_count: 3 },
  rc_joins: {
    local: { per_second: 0.1, burst_count: 10 },
    remote: { per_second: 0.01, burst_count: 10 },
  },
  rc_invites: {
    per_room: { per_second: 0.3, burst_count: 10 },
    per_user: { per_second: 0.003, burst_count: 5 },
    per_issuer: { per_second: 0.3, burst_count: 10 },
  },
  rc_login: {
    address: { per_second: 0.003, burst_count: 5 },
    account: { per_second: 0.003, burst_count: 5 },
    failed_attempts: { per_second: 0.17, burst_count: 3 },
  },
}

// The values Start9 actually runs on start9.me, which were raised because bots
// and bulk operations hit the stock limits. Everything it doesn't override is
// left at upstream rather than guessed at.
const relaxed = {
  rc_message: { per_second: 5, burst_count: 30 },
  rc_joins: {
    local: { per_second: 5, burst_count: 20 },
    remote: { per_second: 5, burst_count: 20 },
  },
}

const rate = (name: string, d: Rate) =>
  Value.object(
    { name },
    InputSpec.of({
      per_second: Value.number({
        name: i18n('Per Second'),
        description: i18n(
          'The sustained rate allowed once the burst allowance is spent. Fractions are normal here — 0.2 means one every five seconds.',
        ),
        required: true,
        default: d.per_second,
        integer: false,
        min: 0,
      }),
      burst_count: Value.number({
        name: i18n('Burst'),
        description: i18n(
          'How many are allowed in quick succession before the sustained rate starts applying.',
        ),
        required: true,
        default: d.burst_count,
        integer: true,
        min: 1,
      }),
    }),
  )

export const inputSpec = InputSpec.of({
  preset: Value.union({
    name: i18n('Rate Limits'),
    default: 'normal',
    description: i18n(
      "Synapse slows down anyone who sends, joins, invites or signs in too quickly. The stock limits suit a server open to strangers; a private server among people you know can afford to be looser, and bots and bulk operations hit the stock limits almost immediately. Choose Custom to set any of them yourself — it starts pre-filled with Synapse's own values.",
    ),
    variants: Variants.of({
      normal: { name: i18n('Normal'), spec: InputSpec.of({}) },
      relaxed: { name: i18n('Relaxed'), spec: InputSpec.of({}) },
      custom: {
        name: i18n('Custom'),
        spec: InputSpec.of({
          rc_message: rate(i18n('Sending Messages'), upstream.rc_message),
          rc_joins_local: rate(
            i18n('Joining Rooms on This Server'),
            upstream.rc_joins.local,
          ),
          rc_joins_remote: rate(
            i18n('Joining Rooms Elsewhere'),
            upstream.rc_joins.remote,
          ),
          rc_invites_per_room: rate(
            i18n('Invitations into One Room'),
            upstream.rc_invites.per_room,
          ),
          rc_invites_per_user: rate(
            i18n('Invitations to One Person'),
            upstream.rc_invites.per_user,
          ),
          rc_invites_per_issuer: rate(
            i18n('Invitations Sent by One Person'),
            upstream.rc_invites.per_issuer,
          ),
          rc_login_address: rate(
            i18n('Sign-ins from One Address'),
            upstream.rc_login.address,
          ),
          rc_login_account: rate(
            i18n('Sign-ins to One Account'),
            upstream.rc_login.account,
          ),
          rc_login_failed_attempts: rate(
            i18n('Failed Sign-ins'),
            upstream.rc_login.failed_attempts,
          ),
          rc_registration: rate(
            i18n('Creating Accounts'),
            upstream.rc_registration,
          ),
          remote_media_downloads: Value.object(
            { name: i18n('Downloading Files from Other Servers') },
            InputSpec.of({
              per_second: Value.number({
                name: i18n('Per Second'),
                description: i18n(
                  'The sustained download speed each person is held to once their burst allowance is spent. It is counted per requester, so one person working through a photo-heavy backlog is slowed without affecting anyone else.',
                ),
                required: true,
                default: mediaUpstream.per_second,
                integer: true,
                min: 1,
                units: i18n('KB/s'),
                footnote: `${i18n('Default')}: ${mediaUpstream.per_second} ${i18n('KB/s')}`,
              }),
              burst_count: Value.number({
                name: i18n('Burst'),
                description: i18n(
                  'How much each person may download at full speed before the sustained rate starts applying.',
                ),
                required: true,
                default: mediaUpstream.burst_count,
                integer: true,
                min: 1,
                units: i18n('MB'),
                footnote: `${i18n('Default')}: ${mediaUpstream.burst_count} ${i18n('MB')}`,
              }),
            }),
          ),
        }),
      },
    }),
  }),
})

export const rateLimits = sdk.Action.withInput(
  // id
  'rate-limits',

  // metadata
  async () => ({
    name: i18n('Rate Limits'),
    description: i18n(
      'How quickly users may send messages, join rooms, invite people and sign in before your server starts holding them back.',
    ),
    warning: null,
    allowedStatuses: 'any',
    group: i18n('Settings'),
    visibility: 'enabled',
  }),

  // form input specification
  inputSpec,

  // optionally pre-fill the input form
  async ({ effects }) => {
    const yaml = await homeserverYaml.read().const(effects)
    if (!yaml) return {}

    const {
      rc_message,
      rc_registration,
      rc_joins,
      rc_invites,
      rc_login,
      remote_media_download_per_second,
      remote_media_download_burst_count,
    } = yaml
    // Absent keys mean nothing has been overridden, which is Normal by
    // definition. Anything else is shown as Custom with the live values, even
    // if it happens to match a preset — the user can always re-pick one.
    if (
      !rc_message &&
      !rc_registration &&
      !rc_joins &&
      !rc_invites &&
      !rc_login &&
      !remote_media_download_per_second &&
      !remote_media_download_burst_count
    )
      return { preset: { selection: 'normal' as const, value: {} } }

    return {
      preset: {
        selection: 'custom' as const,
        value: {
          rc_message: rc_message ?? upstream.rc_message,
          rc_joins_local: rc_joins?.local ?? upstream.rc_joins.local,
          rc_joins_remote: rc_joins?.remote ?? upstream.rc_joins.remote,
          rc_invites_per_room:
            rc_invites?.per_room ?? upstream.rc_invites.per_room,
          rc_invites_per_user:
            rc_invites?.per_user ?? upstream.rc_invites.per_user,
          rc_invites_per_issuer:
            rc_invites?.per_issuer ?? upstream.rc_invites.per_issuer,
          rc_login_address: rc_login?.address ?? upstream.rc_login.address,
          rc_login_account: rc_login?.account ?? upstream.rc_login.account,
          rc_login_failed_attempts:
            rc_login?.failed_attempts ?? upstream.rc_login.failed_attempts,
          rc_registration: rc_registration ?? upstream.rc_registration,
          remote_media_downloads: {
            per_second: toKB(
              remote_media_download_per_second,
              mediaUpstream.per_second,
            ),
            burst_count: toMB(
              remote_media_download_burst_count,
              mediaUpstream.burst_count,
            ),
          },
        },
      },
    }
  },

  // the execution function
  async ({ effects, input }) => {
    // `undefined` removes the key, which is how Normal gets back to upstream:
    // Synapse's own defaults apply to anything homeserver.yaml doesn't name.
    const blank = {
      rc_message: undefined,
      rc_registration: undefined,
      rc_joins: undefined,
      rc_invites: undefined,
      rc_login: undefined,
      remote_media_download_per_second: undefined,
      remote_media_download_burst_count: undefined,
    }

    switch (input.preset.selection) {
      case 'normal':
        return void (await homeserverYaml.merge(effects, blank))
      case 'relaxed':
        return void (await homeserverYaml.merge(effects, {
          ...blank,
          ...relaxed,
          remote_media_download_per_second: `${mediaRelaxed.per_second}K`,
          remote_media_download_burst_count: `${mediaRelaxed.burst_count}M`,
        }))
      case 'custom': {
        const v = input.preset.value
        return void (await homeserverYaml.merge(effects, {
          rc_message: v.rc_message,
          rc_registration: v.rc_registration,
          rc_joins: { local: v.rc_joins_local, remote: v.rc_joins_remote },
          rc_invites: {
            per_room: v.rc_invites_per_room,
            per_user: v.rc_invites_per_user,
            per_issuer: v.rc_invites_per_issuer,
          },
          rc_login: {
            address: v.rc_login_address,
            account: v.rc_login_account,
            failed_attempts: v.rc_login_failed_attempts,
          },
          remote_media_download_per_second: `${v.remote_media_downloads.per_second}K`,
          remote_media_download_burst_count: `${v.remote_media_downloads.burst_count}M`,
        }))
      }
    }
  },
)

// Synapse parses these with parse_size: a bare number is bytes, and only the
// K/M/G suffixes carry a multiplier.
const parseSize = (size: string) => {
  const value = Number(size.slice(0, -1))
  switch (size.at(-1)) {
    case 'G':
      return value * 1024 ** 3
    case 'M':
      return value * 1024 ** 2
    case 'K':
      return value * 1024
    default:
      return Number(size)
  }
}

const toKB = (size: string | undefined, fallback: number) =>
  size ? Math.max(1, Math.round(parseSize(size) / 1024)) : fallback

const toMB = (size: string | undefined, fallback: number) =>
  size ? Math.max(1, Math.round(parseSize(size) / 1024 ** 2)) : fallback
