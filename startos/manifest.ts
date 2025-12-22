import { setupManifest } from '@start9labs/start-sdk'
import { SDKImageInputSpec } from '@start9labs/start-sdk/base/lib/types/ManifestTypes'

const BUILD = process.env.BUILD || ''

const architectures =
  BUILD === 'x86_64' || BUILD === 'aarch64' ? [BUILD] : ['x86_64', 'aarch64']

export const manifest = setupManifest({
  id: 'synapse',
  title: 'Synapse',
  license: 'AGPL-3.0',
  wrapperRepo: 'https://github.com/Start9Labs/synapse-startos',
  upstreamRepo: 'https://github.com/element-hq/synapse',
  supportSite: 'https://github.com/element-hq/synapse/issues',
  marketingSite: 'https://matrix.org/',
  donationUrl: null,
  docsUrl:
    'https://github.com/Start9Labs/synapse-startos/blob/master/instructions.md',
  description: {
    short:
      'Synapse is a battle-tested implementation of the Matrix protocol, the killer of all messaging apps.',
    long: 'Synapse is the battle-tested, reference implementation of the Matrix protocol. Matrix is a next-generation, federated, full-featured, encrypted, independent messaging system. There are no trusted third parties involved. (see matrix.org for details).',
  },
  volumes: ['main'],
  images: {
    synapse: {
      source: {
        dockerTag: 'matrixdotorg/synapse:v1.144.0',
      },
      arch: architectures,
    } as SDKImageInputSpec,
    nginx: {
      source: {
        dockerTag: 'nginx:stable-alpine',
      },
      arch: architectures,
    } as SDKImageInputSpec,
    sqlite3: {
      source: {
        dockerTag: 'alpine/sqlite',
      },
      arch: architectures,
    } as SDKImageInputSpec,
  },
  hardwareRequirements: {
    arch: architectures,
  },
  alerts: {
    install: null,
    update: null,
    uninstall: null,
    restore: null,
    start: null,
    stop: null,
  },
  dependencies: {},
})
