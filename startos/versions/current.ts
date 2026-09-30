import { VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '1.162.0:0',
  releaseNotes: {
    en_US: `Updated Synapse to 1.162.0 and Ketesa to 1.5.1.

- New rooms use room version 12 by default.
- Configure profile-lookup throttling in Rate Limits → Custom.
- Improved federated invitations and faster recursive relation queries in large rooms.

[Synapse release notes](https://github.com/element-hq/synapse/releases/tag/v1.162.0) · [Ketesa release notes](https://github.com/etkecc/ketesa/releases/tag/v1.5.1)`,
    es_ES: `Synapse actualizado a 1.162.0 y Ketesa a 1.5.1.

- Las salas nuevas usan la versión de sala 12 de forma predeterminada.
- Configure los límites de consultas de perfiles en Límites de velocidad → Personalizado.
- Mejoras en las invitaciones federadas y consultas recursivas de relaciones más rápidas en salas grandes.

[Notas de Synapse](https://github.com/element-hq/synapse/releases/tag/v1.162.0) · [Notas de Ketesa](https://github.com/etkecc/ketesa/releases/tag/v1.5.1)`,
    de_DE: `Synapse auf 1.162.0 und Ketesa auf 1.5.1 aktualisiert.

- Neue Räume verwenden standardmäßig Raumversion 12.
- Profilabfragen lassen sich unter Ratenlimits → Benutzerdefiniert begrenzen.
- Verbesserte föderierte Einladungen und schnellere rekursive Relationsabfragen in großen Räumen.

[Synapse-Versionshinweise](https://github.com/element-hq/synapse/releases/tag/v1.162.0) · [Ketesa-Versionshinweise](https://github.com/etkecc/ketesa/releases/tag/v1.5.1)`,
    pl_PL: `Zaktualizowano Synapse do 1.162.0 i Ketesa do 1.5.1.

- Nowe pokoje domyślnie używają wersji pokoju 12.
- Limity zapytań o profile można ustawić w Limity szybkości → Niestandardowe.
- Ulepszono zaproszenia federacyjne i przyspieszono rekurencyjne zapytania o relacje w dużych pokojach.

[Informacje o wydaniu Synapse](https://github.com/element-hq/synapse/releases/tag/v1.162.0) · [Informacje o wydaniu Ketesa](https://github.com/etkecc/ketesa/releases/tag/v1.5.1)`,
    fr_FR: `Synapse mis à jour vers 1.162.0 et Ketesa vers 1.5.1.

- Les nouveaux salons utilisent par défaut la version de salon 12.
- Configurez la limitation des consultations de profils dans Limites de débit → Personnalisé.
- Amélioration des invitations fédérées et accélération des requêtes récursives de relations dans les grands salons.

[Notes de Synapse](https://github.com/element-hq/synapse/releases/tag/v1.162.0) · [Notes de Ketesa](https://github.com/etkecc/ketesa/releases/tag/v1.5.1)`,
  },
  migrations: {},
})
