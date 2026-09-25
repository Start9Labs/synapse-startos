import { VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '1.161.0:1',
  releaseNotes: {
    en_US: `Importing a large database from another Synapse server no longer fails and retries on every start.`,
    es_ES: `Importar una base de datos grande desde otro servidor Synapse ya no falla ni se reintenta en cada inicio.`,
    de_DE: `Das Importieren einer großen Datenbank von einem anderen Synapse-Server schlägt nicht mehr fehl und wird nicht mehr bei jedem Start wiederholt.`,
    pl_PL: `Import dużej bazy danych z innego serwera Synapse nie kończy się już błędem ani nie jest ponawiany przy każdym uruchomieniu.`,
    fr_FR: `L'importation d'une base de données volumineuse depuis un autre serveur Synapse n'échoue plus et n'est plus relancée à chaque démarrage.`,
  },
  migrations: {},
})
