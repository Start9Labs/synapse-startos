import { VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '1.163.1:0',
  releaseNotes: {
    en_US:
      'Updated Synapse to 1.163.1. Security updates to certificate-validation dependencies distrust compromised eMudhra certificate authorities. Full notes: https://github.com/element-hq/synapse/blob/v1.163.1/CHANGES.md',
    es_ES:
      'Actualiza Synapse a 1.163.1. Las actualizaciones de seguridad de las dependencias de validación de certificados dejan de confiar en las autoridades de certificación comprometidas de eMudhra. Notas completas: https://github.com/element-hq/synapse/blob/v1.163.1/CHANGES.md',
    de_DE:
      'Aktualisiert Synapse auf 1.163.1. Sicherheitsupdates der Abhängigkeiten zur Zertifikatsprüfung entziehen kompromittierten eMudhra-Zertifizierungsstellen das Vertrauen. Vollständige Hinweise: https://github.com/element-hq/synapse/blob/v1.163.1/CHANGES.md',
    pl_PL:
      'Zaktualizowano Synapse do 1.163.1. Aktualizacje bezpieczeństwa zależności weryfikujących certyfikaty wycofują zaufanie do przejętych urzędów certyfikacji eMudhra. Pełne informacje: https://github.com/element-hq/synapse/blob/v1.163.1/CHANGES.md',
    fr_FR:
      'Met à jour Synapse vers 1.163.1. Les mises à jour de sécurité des dépendances de validation des certificats retirent la confiance aux autorités de certification eMudhra compromises. Notes complètes : https://github.com/element-hq/synapse/blob/v1.163.1/CHANGES.md',
  },
  migrations: {
    up: async ({ effects }) => {},
  },
})
