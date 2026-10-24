import { VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '1.163.2:0',
  releaseNotes: {
    en_US:
      'Updated Synapse to 1.163.2. Updates the Pillow image-processing dependency to address critical security vulnerabilities. Full notes: https://github.com/element-hq/synapse/blob/v1.163.2/CHANGES.md',
    es_ES:
      'Actualiza Synapse a 1.163.2. Actualiza la dependencia de procesamiento de imágenes Pillow para corregir vulnerabilidades de seguridad críticas. Notas completas: https://github.com/element-hq/synapse/blob/v1.163.2/CHANGES.md',
    de_DE:
      'Aktualisiert Synapse auf 1.163.2. Aktualisiert die Bildverarbeitungsbibliothek Pillow, um kritische Sicherheitslücken zu schließen. Vollständige Hinweise: https://github.com/element-hq/synapse/blob/v1.163.2/CHANGES.md',
    pl_PL:
      'Zaktualizowano Synapse do 1.163.2. Zaktualizowano bibliotekę przetwarzania obrazów Pillow, aby usunąć krytyczne luki w zabezpieczeniach. Pełne informacje: https://github.com/element-hq/synapse/blob/v1.163.2/CHANGES.md',
    fr_FR:
      'Met à jour Synapse vers 1.163.2. Met à jour la bibliothèque de traitement des images Pillow pour corriger des vulnérabilités de sécurité critiques. Notes complètes : https://github.com/element-hq/synapse/blob/v1.163.2/CHANGES.md',
  },
  migrations: {
    up: async ({ effects }) => {},
  },
})
