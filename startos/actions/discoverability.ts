import { homeserverYaml } from '../fileModels/homeserver.yml'
import { i18n } from '../i18n'
import { sdk } from '../sdk'

const { InputSpec, Value, Variants } = sdk

// Every one of these is a boolean with an unambiguous privacy direction, so the
// presets are just "all of them one way" — unlike a numeric preset, there is no
// magnitude to guess at and nothing to reference. `restrict_public_rooms_to_
// local_users` is deliberately never written: Synapse refuses to start if that
// legacy key appears alongside the two allow_public_rooms_* keys below.
const settings = {
  private: {
    allow_public_rooms_over_federation: false,
    allow_public_rooms_without_auth: false,
    enable_room_list_search: false,
    user_directory: {
      enabled: true,
      search_all_users: false,
      prefer_local_users: true,
      exclude_remote_users: true,
    },
    require_auth_for_profile_requests: true,
    limit_profile_requests_to_users_who_share_rooms: true,
    include_profile_data_on_invite: false,
  },
  public: {
    allow_public_rooms_over_federation: true,
    allow_public_rooms_without_auth: true,
    enable_room_list_search: true,
    user_directory: {
      enabled: true,
      search_all_users: true,
      prefer_local_users: false,
      exclude_remote_users: false,
    },
    require_auth_for_profile_requests: false,
    limit_profile_requests_to_users_who_share_rooms: false,
    include_profile_data_on_invite: true,
  },
}

// Absent, which is what Normal writes, so Synapse's own defaults apply.
const blank = {
  allow_public_rooms_over_federation: undefined,
  allow_public_rooms_without_auth: undefined,
  enable_room_list_search: undefined,
  user_directory: undefined,
  require_auth_for_profile_requests: undefined,
  limit_profile_requests_to_users_who_share_rooms: undefined,
  include_profile_data_on_invite: undefined,
}

const toggle = (name: string, description: string, dflt: boolean) =>
  Value.toggle({ name, description, default: dflt })

export const inputSpec = InputSpec.of({
  preset: Value.union({
    name: i18n('Discoverability'),
    default: 'normal',
    description: i18n(
      'How much a stranger can learn about your server without an account on it: which rooms it hosts, who has an account, and what their display names and avatars are. Private closes all of it down, Public opens all of it up, and Normal leaves Synapse to its own defaults, which sit in between. Choose Custom to decide each one.',
    ),
    variants: Variants.of({
      private: { name: i18n('Private'), spec: InputSpec.of({}) },
      normal: { name: i18n('Normal'), spec: InputSpec.of({}) },
      public: { name: i18n('Public'), spec: InputSpec.of({}) },
      custom: {
        name: i18n('Custom'),
        spec: InputSpec.of({
          allow_public_rooms_over_federation: toggle(
            i18n('Publish the Room List to Other Servers'),
            i18n(
              'Let other homeservers fetch the list of public rooms on yours, so your rooms turn up when their users browse.',
            ),
            false,
          ),
          allow_public_rooms_without_auth: toggle(
            i18n('Publish the Room List Without an Account'),
            i18n(
              'Let anyone read the list of public rooms on your server without signing in.',
            ),
            false,
          ),
          enable_room_list_search: toggle(
            i18n('Allow Searching the Room List'),
            i18n(
              'Let the room list be searched rather than only browsed in full.',
            ),
            true,
          ),
          user_directory_enabled: toggle(
            i18n('User Directory'),
            i18n(
              'Let your users search for other people by name. Turning this off removes the search entirely, including between people on your own server.',
            ),
            true,
          ),
          user_directory_search_all_users: toggle(
            i18n('Search All Local Users'),
            i18n(
              'Return every account on your server in search results, rather than only people the searcher already shares a room with. This is the setting most people are looking for on a small server where everyone knows each other.',
            ),
            false,
          ),
          user_directory_prefer_local_users: toggle(
            i18n('Rank Local Users First'),
            i18n(
              'Put people from your own server above people from other servers in search results.',
            ),
            false,
          ),
          user_directory_exclude_remote_users: toggle(
            i18n('Exclude Users from Other Servers'),
            i18n(
              'Leave people from other homeservers out of search results entirely.',
            ),
            false,
          ),
          require_auth_for_profile_requests: toggle(
            i18n('Require Sign-in to View Profiles'),
            i18n(
              'Refuse display name and avatar lookups from anyone who is not signed in.',
            ),
            false,
          ),
          limit_profile_requests_to_users_who_share_rooms: toggle(
            i18n('Only Share Profiles Within Shared Rooms'),
            i18n(
              'Only reveal a display name and avatar to someone who is already in a room with that person.',
            ),
            false,
          ),
          include_profile_data_on_invite: toggle(
            i18n('Attach Profiles to Invitations'),
            i18n(
              "Include the inviter's display name and avatar in an invitation, so the recipient sees who it is from before accepting.",
            ),
            true,
          ),
        }),
      },
    }),
  }),
})

export const discoverability = sdk.Action.withInput(
  // id
  'discoverability',

  // metadata
  async () => ({
    name: i18n('Discoverability'),
    description: i18n(
      'What a stranger can find out about your server: which rooms it hosts, who has an account, and what they look like.',
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

    const live = {
      allow_public_rooms_over_federation:
        yaml.allow_public_rooms_over_federation,
      allow_public_rooms_without_auth: yaml.allow_public_rooms_without_auth,
      enable_room_list_search: yaml.enable_room_list_search,
      user_directory: yaml.user_directory,
      require_auth_for_profile_requests: yaml.require_auth_for_profile_requests,
      limit_profile_requests_to_users_who_share_rooms:
        yaml.limit_profile_requests_to_users_who_share_rooms,
      include_profile_data_on_invite: yaml.include_profile_data_on_invite,
    }

    // Both presets write all seven keys, so an exact match really is that
    // preset rather than a coincidence — unlike the sparse rate-limit ones,
    // where absence carries the signal and a match proves nothing.
    const json = JSON.stringify
    if (Object.values(live).every((v) => v === undefined))
      return { preset: { selection: 'normal' as const, value: {} } }
    if (json(live) === json(settings.private))
      return { preset: { selection: 'private' as const, value: {} } }
    if (json(live) === json(settings.public))
      return { preset: { selection: 'public' as const, value: {} } }

    const d = live.user_directory
    return {
      preset: {
        selection: 'custom' as const,
        value: {
          allow_public_rooms_over_federation:
            live.allow_public_rooms_over_federation ?? false,
          allow_public_rooms_without_auth:
            live.allow_public_rooms_without_auth ?? false,
          enable_room_list_search: live.enable_room_list_search ?? true,
          user_directory_enabled: d?.enabled ?? true,
          user_directory_search_all_users: d?.search_all_users ?? false,
          user_directory_prefer_local_users: d?.prefer_local_users ?? false,
          user_directory_exclude_remote_users: d?.exclude_remote_users ?? false,
          require_auth_for_profile_requests:
            live.require_auth_for_profile_requests ?? false,
          limit_profile_requests_to_users_who_share_rooms:
            live.limit_profile_requests_to_users_who_share_rooms ?? false,
          include_profile_data_on_invite:
            live.include_profile_data_on_invite ?? true,
        },
      },
    }
  },

  // the execution function
  async ({ effects, input }) => {
    switch (input.preset.selection) {
      case 'normal':
        return void (await homeserverYaml.merge(effects, blank))
      case 'private':
        return void (await homeserverYaml.merge(effects, settings.private))
      case 'public':
        return void (await homeserverYaml.merge(effects, settings.public))
      case 'custom': {
        const v = input.preset.value
        return void (await homeserverYaml.merge(effects, {
          allow_public_rooms_over_federation:
            v.allow_public_rooms_over_federation,
          allow_public_rooms_without_auth: v.allow_public_rooms_without_auth,
          enable_room_list_search: v.enable_room_list_search,
          user_directory: {
            enabled: v.user_directory_enabled,
            search_all_users: v.user_directory_search_all_users,
            prefer_local_users: v.user_directory_prefer_local_users,
            exclude_remote_users: v.user_directory_exclude_remote_users,
          },
          require_auth_for_profile_requests:
            v.require_auth_for_profile_requests,
          limit_profile_requests_to_users_who_share_rooms:
            v.limit_profile_requests_to_users_who_share_rooms,
          include_profile_data_on_invite: v.include_profile_data_on_invite,
        }))
      }
    }
  },
)
