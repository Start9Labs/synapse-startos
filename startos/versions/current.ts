import { VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '1.163.0:2',
  releaseNotes: {
    en_US: `Adds Forward Email to the SMTP provider presets.`,
    es_ES: `Añade Forward Email a los proveedores SMTP predefinidos.`,
    de_DE: `Fügt Forward Email zu den vordefinierten SMTP-Anbietern hinzu.`,
    pl_PL: `Dodaje Forward Email do predefiniowanych dostawców SMTP.`,
    fr_FR: `Ajoute Forward Email aux fournisseurs SMTP prédéfinis.`,
  },
  migrations: {
    up: async ({ effects }) => {},
  },
})
