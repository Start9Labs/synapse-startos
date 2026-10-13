import { VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '1.162.0:4',
  releaseNotes: {
    en_US:
      'New Force-Purge Room action deletes a room from your server when deleting it from the Admin Dashboard fails.',
    es_ES:
      'La nueva acción Purgar sala a la fuerza elimina una sala de su servidor cuando eliminarla desde el Panel de administración falla.',
    de_DE:
      'Die neue Aktion „Raum zwangsweise löschen“ entfernt einen Raum von Ihrem Server, wenn das Löschen über das Admin-Dashboard fehlschlägt.',
    pl_PL:
      'Nowa akcja Wymuś usunięcie pokoju usuwa pokój z serwera, gdy usunięcie go z Panelu administratora się nie udaje.',
    fr_FR:
      'La nouvelle action Purger le salon de force supprime un salon de votre serveur lorsque sa suppression depuis le Tableau de bord administrateur échoue.',
  },
  migrations: {},
})
