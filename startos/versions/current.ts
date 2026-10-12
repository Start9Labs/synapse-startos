import { VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '1.162.0:3',
  releaseNotes: {
    en_US:
      'Restarting Synapse while it is still starting stops every process of the previous run.',
    es_ES:
      'Reiniciar Synapse mientras aún se está iniciando detiene todos los procesos de la ejecución anterior.',
    de_DE:
      'Ein Neustart von Synapse, während es noch startet, beendet alle Prozesse des vorherigen Laufs.',
    pl_PL:
      'Ponowne uruchomienie Synapse w trakcie uruchamiania zatrzymuje wszystkie procesy poprzedniego uruchomienia.',
    fr_FR:
      "Redémarrer Synapse pendant son démarrage arrête tous les processus de l'exécution précédente.",
  },
  migrations: {},
})
