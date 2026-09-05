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
  description: { short, long },
  volumes: ['main', 'db'],
  images: {
    synapse: {
      source: {
        dockerTag: 'ghcr.io/element-hq/synapse:v1.160.0',
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
  dependencies: {
    coturn: {
      description:
        'Provides a TURN/STUN relay so voice and video calls connect through NAT and restrictive firewalls',
      optional: true,
      metadata: {
        title: 'Coturn',
        icon: 'https://raw.githubusercontent.com/Start9Labs/coturn-startos/d67ecaca5800a87e3300ce44c62484888f35d51b/icon.svg',
      },
    },
  },
})
