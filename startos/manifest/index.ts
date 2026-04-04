import { setupManifest } from '@start9labs/start-sdk'
import { long, short } from './i18n'

export const manifest = setupManifest({
  id: 'synapse',
  title: 'Synapse',
  license: 'AGPL-3.0',
  packageRepo: 'https://github.com/Start9Labs/synapse-startos',
  upstreamRepo: 'https://github.com/element-hq/synapse',
  marketingUrl: 'https://matrix.org/',
  donationUrl: null,
  docsUrls: [
    'https://github.com/Start9Labs/synapse-startos/blob/master/docs/instructions.md',
    'https://element-hq.github.io/synapse/latest',
    'https://docs.element.io/latest/element-support/understanding-your-element-accounts/#up',
  ],
  description: { short, long },
  volumes: ['main', 'db'],
  images: {
    synapse: {
      source: {
        dockerBuild: {
          workdir: './synapse',
          dockerfile: './Dockerfile',
        },
      },
      arch: ['x86_64', 'aarch64'],
    },
    nginx: {
      source: {
        dockerTag: 'nginx:stable-alpine',
      },
      arch: ['x86_64', 'aarch64'],
    },
    postgres: {
      source: {
        dockerTag: 'postgres:16-alpine',
      },
      arch: ['x86_64', 'aarch64'],
    },
  },
  dependencies: {},
})
