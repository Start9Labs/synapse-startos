import { setupManifest } from '@start9labs/start-sdk'

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
  hardwareRequirements: {},
  alerts: {
    install: null,
    update: null,
    uninstall: null,
    restore: null,
    start: null,
    stop: null,
  },
  images: {
    synapse: {
      source: {
        dockerBuild: {
          workdir: './synapse',
          dockerfile: './Dockerfile',
        },
      },
    },
    nginx: {
      source: {
        dockerTag: 'nginx:stable-alpine',
      },
    },
    sqlite3: {
      source: {
        dockerBuild: {
          dockerfile: './Dockerfile-sqlite',
        },
      },
    },
  },
  dependencies: {},
})
