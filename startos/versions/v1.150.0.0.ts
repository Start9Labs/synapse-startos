import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'

export const v_1_150_0_0 = VersionInfo.of({
  version: '1.150.0:0',
  releaseNotes: {
    en_US: 'Initial release for StartOS 0.4.0',
    es_ES: 'Versión inicial para StartOS 0.4.0',
    de_DE: 'Erstveröffentlichung für StartOS 0.4.0',
    pl_PL: 'Pierwsze wydanie dla StartOS 0.4.0',
    fr_FR: 'Version initiale pour StartOS 0.4.0',
  },
  migrations: {
    up: async () => {},
    down: IMPOSSIBLE,
  },
})
