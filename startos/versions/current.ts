import { VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '1.164.1:0',
  releaseNotes: {
    en_US:
      'Updated Synapse to 1.164.1. Fixes clearing user status for clients that send null profile values and updates msgpack to prevent memory exhaustion from malformed public room list tokens (GHSA-j586-36cw-2gc2). Full notes: https://github.com/element-hq/synapse/blob/v1.164.1/CHANGES.md',
    es_ES:
      'Actualiza Synapse a 1.164.1. Corrige el borrado del estado de usuario en clientes que envían valores de perfil nulos y actualiza msgpack para evitar el agotamiento de memoria por tokens malformados de la lista de salas públicas (GHSA-j586-36cw-2gc2). Notas completas: https://github.com/element-hq/synapse/blob/v1.164.1/CHANGES.md',
    de_DE:
      'Aktualisiert Synapse auf 1.164.1. Behebt das Löschen des Benutzerstatus bei Clients, die null-Profilwerte senden, und aktualisiert msgpack, um Speichererschöpfung durch fehlerhafte Tokens der öffentlichen Raumliste zu verhindern (GHSA-j586-36cw-2gc2). Vollständige Hinweise: https://github.com/element-hq/synapse/blob/v1.164.1/CHANGES.md',
    pl_PL:
      'Aktualizuje Synapse do 1.164.1. Naprawia usuwanie statusu użytkownika w klientach wysyłających wartości null w profilu i aktualizuje msgpack, aby zapobiec wyczerpaniu pamięci przez nieprawidłowe tokeny listy publicznych pokoi (GHSA-j586-36cw-2gc2). Pełne informacje: https://github.com/element-hq/synapse/blob/v1.164.1/CHANGES.md',
    fr_FR:
      'Met à jour Synapse vers 1.164.1. Corrige la suppression du statut utilisateur pour les clients envoyant des valeurs de profil null et met à jour msgpack pour éviter un épuisement de la mémoire dû à des jetons malformés de la liste des salons publics (GHSA-j586-36cw-2gc2). Notes complètes : https://github.com/element-hq/synapse/blob/v1.164.1/CHANGES.md',
  },
  migrations: {
    up: async ({ effects }) => {},
  },
})
