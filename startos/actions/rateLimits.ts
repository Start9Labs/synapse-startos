import { homeserverYaml } from '../fileModels/homeserver.yml'
import { i18n } from '../i18n'
import { sdk } from '../sdk'

const { InputSpec, Value, Variants } = sdk

type Rate = { per_second: number; burst_count: number }

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

// Half the rate, burst halved and rounded up, applied only where abuse happens:
// registration, invitations and failed sign-ins. Messaging and joining are left
// at upstream so ordinary use is untouched. Unlike the other two presets this
// has no upstream reference — it is a rule we chose, which is why Custom exists.
const half = ({ per_second, burst_count }: Rate): Rate => ({
  per_second: per_second / 2,
  burst_count: Math.ceil(burst_count / 2),
})
const strict = {
  rc_registration: half(upstream.rc_registration),
  rc_invites: {
    per_room: half(upstream.rc_invites.per_room),
    per_user: half(upstream.rc_invites.per_user),
    per_issuer: half(upstream.rc_invites.per_issuer),
  },
  rc_login: {
    address: upstream.rc_login.address,
    account: upstream.rc_login.account,
    failed_attempts: half(upstream.rc_login.failed_attempts),
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
      strict: { name: i18n('Strict'), spec: InputSpec.of({}) },
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
    group: null,
    visibility: 'enabled',
  }),

  // form input specification
  inputSpec,

  // optionally pre-fill the input form
  async ({ effects }) => {
    const yaml = await homeserverYaml.read().const(effects)
    if (!yaml) return {}

    const { rc_message, rc_registration, rc_joins, rc_invites, rc_login } = yaml
    // Absent keys mean nothing has been overridden, which is Normal by
    // definition. Anything else is shown as Custom with the live values, even
    // if it happens to match a preset — the user can always re-pick one.
    if (
      !rc_message &&
      !rc_registration &&
      !rc_joins &&
      !rc_invites &&
      !rc_login
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
    }

    switch (input.preset.selection) {
      case 'normal':
        return void (await homeserverYaml.merge(effects, blank))
      case 'relaxed':
        return void (await homeserverYaml.merge(effects, {
          ...blank,
          ...relaxed,
        }))
      case 'strict':
        return void (await homeserverYaml.merge(effects, {
          ...blank,
          ...strict,
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
        }))
      }
    }
  },
)
