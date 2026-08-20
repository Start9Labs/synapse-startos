import {
  defaultMaxImagePixels,
  defaultThumbnailSizes,
  homeserverYaml,
  upstreamDefaults,
  upstreamThumbnailSizes,
} from '../../fileModels/homeserver.yml'
import { i18n } from '../../i18n'
import { sdk } from '../../sdk'

const { InputSpec, Value, Variants } = sdk

// Synapse parses these with parse_size, so a bare number means pixels and an
// M suffix means millions of them.
const toMegapixels = (pixels: string) =>
  pixels.at(-1) === 'M'
    ? Number(pixels.slice(0, -1))
    : Math.max(1, Math.round(Number(pixels) / 1e6))

export const inputSpec = InputSpec.of({
  max_upload_size: Value.number({
    name: i18n('Max Upload Size'),
    description: i18n(
      'The maximum file size that is permitted to be uploaded by users to your homeserver.',
    ),
    required: true,
    default: 50,
    units: i18n('MB'),
    integer: true,
    min: 1,
    max: 2000,
    footnote: `${i18n('Default')}: 50 ${i18n('MB')}`,
  }),
  max_image_pixels: Value.number({
    name: i18n('Largest Image to Thumbnail'),
    description: i18n(
      'Images above this size get no thumbnail at all, so clients must fetch the full original or show nothing. Current phone cameras shoot 48-50 MP in their ordinary mode, well past what Synapse allows by default. Raising it costs memory rather than disk: the whole image is decoded to thumbnail it, so roughly 3 MB of RAM per megapixel while one is in flight.',
    ),
    required: true,
    default: toMegapixels(defaultMaxImagePixels),
    units: i18n('MP'),
    integer: true,
    min: 1,
    footnote: `${i18n('Synapse default')}: ${toMegapixels(upstreamDefaults.max_image_pixels)} ${i18n('MP')}`,
  }),
  thumbnails: Value.union({
    name: i18n('Thumbnails'),
    default: 'high_detail',
    description: i18n(
      'Which sizes your server prepares when someone uploads an image. Clients ask for the size that suits their screen and get the closest one that exists, so a high-density phone display shown only small thumbnails will upscale them and look soft.',
    ),
    variants: Variants.of({
      standard: { name: i18n('Standard'), spec: InputSpec.of({}) },
      high_detail: { name: i18n('High Detail'), spec: InputSpec.of({}) },
      on_demand: { name: i18n('On Demand'), spec: InputSpec.of({}) },
    }),
  }),
  remote_media_lifetime: Value.number({
    name: i18n('Remote Media Retention'),
    description: i18n(
      'How long to keep a cached copy of media uploaded to other homeservers. Purged files are re-downloaded on demand, so the only cost is a little bandwidth. Leave empty to keep them forever, which is the default and can grow your disk usage and your backups without limit.',
    ),
    required: false,
    default: null,
    units: i18n('days'),
    integer: true,
    min: 1,
  }),
})

export const media = sdk.Action.withInput(
  // id
  'media',

  // metadata
  async () => ({
    name: i18n('Media'),
    description: i18n(
      "How your homeserver handles the pictures and files people send, and how long it keeps copies of other servers'.",
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

    return {
      max_upload_size: toMB(yaml.max_upload_size),
      max_image_pixels: toMegapixels(yaml.max_image_pixels),
      thumbnails: {
        selection: yaml.dynamic_thumbnails
          ? ('on_demand' as const)
          : yaml.thumbnail_sizes.length > upstreamThumbnailSizes.length
            ? ('high_detail' as const)
            : ('standard' as const),
        value: {},
      },
      remote_media_lifetime: toDays(
        yaml.media_retention?.remote_media_lifetime,
      ),
    }
  },

  // the execution function
  async ({ effects, input }) => {
    await homeserverYaml.merge(effects, {
      max_upload_size: `${input.max_upload_size}M`,
      max_image_pixels: `${input.max_image_pixels}M`,
      dynamic_thumbnails: input.thumbnails.selection === 'on_demand',
      // On Demand still needs a size list: it is the set generated at upload,
      // and anything else is produced per request on top of it.
      thumbnail_sizes:
        input.thumbnails.selection === 'standard'
          ? upstreamThumbnailSizes
          : defaultThumbnailSizes,
      media_retention: input.remote_media_lifetime
        ? { remote_media_lifetime: `${input.remote_media_lifetime}d` }
        : undefined,
    })
  },
)

// The schema guarantees a B/K/M/G suffix, so only those four appear here.
function toMB(max_upload_size: string): number {
  const value = Number(max_upload_size.slice(0, -1))

  switch (max_upload_size.at(-1)) {
    case 'M':
      return value
    case 'G':
      return value * 1024
    case 'K':
      return Math.max(1, Math.round(value / 1024))
    default:
      return Math.max(1, Math.round(value / 1024 ** 2))
  }
}

// Only the suffixes that divide evenly into whole days survive the round trip;
// anything else a power user hand-wrote reads back as "keep forever".
function toDays(remote_media_lifetime: string | undefined): number | null {
  const value = Number(remote_media_lifetime?.slice(0, -1))
  if (!value) return null

  switch (remote_media_lifetime?.at(-1)) {
    case 'd':
      return value
    case 'w':
      return value * 7
    case 'y':
      return value * 365
    default:
      return null
  }
}
