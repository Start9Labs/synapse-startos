import { setupManifest } from '@start9labs/start-sdk'
import { short, long } from './i18n'

export const manifest = setupManifest({
  id: 'synapse',
  title: 'Synapse',
  license: 'AGPL-3.0',
  wrapperRepo: 'https://github.com/Start9Labs/synapse-startos',
  upstreamRepo: 'https://github.com/element-hq/synapse',
  supportSite: 'https://github.com/element-hq/synapse/issues',
  marketingSite: 'https://matrix.org/',
  donationUrl: null,
  docsUrl: 'https://element-hq.github.io/synapse/latest/index.html',
  description: { short, long },
  volumes: ['main'],
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
