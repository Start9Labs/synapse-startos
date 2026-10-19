import { VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '1.163.0:2',
  releaseNotes: {
    en_US: `Fixes email notifications not sending through SMTP servers set to TLS security. Adds Forward Email to the SMTP provider presets.`,
    es_ES: `Corrige las notificaciones por correo que no se enviaban a través de servidores SMTP con seguridad TLS. Añade Forward Email a los proveedores SMTP predefinidos.`,
    de_DE: `Behebt, dass E-Mail-Benachrichtigungen über SMTP-Server mit TLS-Sicherheit nicht versendet wurden. Fügt Forward Email zu den vordefinierten SMTP-Anbietern hinzu.`,
    pl_PL: `Naprawia niewysyłanie powiadomień e-mail przez serwery SMTP z zabezpieczeniem TLS. Dodaje Forward Email do predefiniowanych dostawców SMTP.`,
    fr_FR: `Corrige les notifications par e-mail qui n'étaient pas envoyées via les serveurs SMTP configurés en sécurité TLS. Ajoute Forward Email aux fournisseurs SMTP prédéfinis.`,
  },
  migrations: {
    up: async ({ effects }) => {},
  },
})
