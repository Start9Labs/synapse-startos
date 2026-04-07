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
    'https://docs.element.io/latest/element-support/*', // * means all children of element-support/, since this itself is a 404
  ],
  description: { short, long },
  volumes: ['main', 'db'],
  images: {
    synapse: {
      source: {
        dockerTag: 'ghcr.io/element-hq/synapse:v1.150.0',
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
