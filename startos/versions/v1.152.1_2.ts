import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'
import { sdk } from '../sdk'

export const v_1_152_1_2 = VersionInfo.of({
  version: '1.152.1:2',
  releaseNotes: {
    en_US: 'Fixes a bug that caused database backups to be empty.',
    es_ES: 'Corrige un error que provocaba que las copias de seguridad de la base de datos estuvieran vacías.',
    de_DE: 'Behebt einen Fehler, durch den Datenbank-Backups leer waren.',
    pl_PL: 'Naprawia błąd powodujący, że kopie zapasowe bazy danych były puste.',
    fr_FR: 'Corrige un bug qui rendait les sauvegardes de base de données vides.',
  },
  migrations: {
    up: async ({ effects }) => {
      // The "create-admin-user" action was removed; clear any outstanding
      // task pointing at it so users mid-setup don't see a broken task.
      await sdk.action.clearTask(effects, 'synapse:create-admin-user')
    },
    down: IMPOSSIBLE,
  },
})
