import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'
import { sdk } from '../sdk'

export const current = VersionInfo.of({
  version: '1.155.0:1',
  releaseNotes: {
    en_US: `Updated the Admin Dashboard (Ketesa) to 1.3.0. Synapse itself is unchanged at 1.155.0.

- Security: fixed an XSS hole when opening media — only real image types open in a tab; everything else (SVG included) downloads instead.
- Bugfix: editing a non-MAS user could trigger an accidental GDPR erase. Fixed.
- Safety: deactivate, delete, and erase user actions now ask for confirmation first.
- New "Reported users" queue in the sidebar, plus better Matrix Authentication Service (MAS) user management.

Full notes: https://github.com/etkecc/ketesa/releases/tag/v1.3.0

Internal updates (start-sdk 2.0.x). Fixes database backups that could previously be created empty.`,
    es_ES: `Panel de administración (Ketesa) actualizado a 1.3.0. Synapse se mantiene en 1.155.0.

- Seguridad: corregido un fallo XSS al abrir archivos multimedia — solo se abren en una pestaña los tipos de imagen reales; el resto (incluido SVG) se descarga.
- Corrección: editar un usuario sin MAS podía provocar un borrado GDPR accidental. Solucionado.
- Seguridad: las acciones de desactivar, eliminar y borrar usuarios ahora piden confirmación.
- Nueva cola de "Usuarios denunciados" en la barra lateral y mejor gestión de usuarios con Matrix Authentication Service (MAS).

Notas completas: https://github.com/etkecc/ketesa/releases/tag/v1.3.0

Actualizaciones internas (start-sdk 2.0.x). Corrige las copias de seguridad de la base de datos que anteriormente podían crearse vacías.`,
    de_DE: `Admin-Dashboard (Ketesa) auf 1.3.0 aktualisiert. Synapse bleibt bei 1.155.0.

- Sicherheit: eine XSS-Lücke beim Öffnen von Medien behoben — nur echte Bildtypen öffnen sich in einem Tab; alles andere (auch SVG) wird heruntergeladen.
- Fehlerbehebung: das Bearbeiten eines Nicht-MAS-Benutzers konnte versehentlich eine DSGVO-Löschung auslösen. Behoben.
- Sicherheit: die Aktionen Deaktivieren, Löschen und Endgültig löschen fragen jetzt vorher nach Bestätigung.
- Neue Warteschlange „Gemeldete Benutzer“ in der Seitenleiste sowie bessere Benutzerverwaltung mit Matrix Authentication Service (MAS).

Vollständige Hinweise: https://github.com/etkecc/ketesa/releases/tag/v1.3.0

Interne Aktualisierungen (start-sdk 2.0.x). Behebt Datenbank-Backups, die zuvor leer erstellt werden konnten.`,
    pl_PL: `Zaktualizowano panel administracyjny (Ketesa) do 1.3.0. Synapse pozostaje w wersji 1.155.0.

- Bezpieczeństwo: naprawiono lukę XSS przy otwieraniu mediów — w nowej karcie otwierają się tylko prawdziwe typy obrazów; reszta (w tym SVG) zostaje pobrana.
- Poprawka: edycja użytkownika spoza MAS mogła przypadkowo wywołać usunięcie GDPR. Naprawiono.
- Bezpieczeństwo: akcje dezaktywacji, usunięcia i wymazania użytkownika wymagają teraz potwierdzenia.
- Nowa kolejka „Zgłoszeni użytkownicy” na pasku bocznym oraz lepsze zarządzanie użytkownikami w Matrix Authentication Service (MAS).

Pełne informacje: https://github.com/etkecc/ketesa/releases/tag/v1.3.0

Aktualizacje wewnętrzne (start-sdk 2.0.x). Naprawia kopie zapasowe bazy danych, które wcześniej mogły być tworzone jako puste.`,
    fr_FR: `Tableau de bord d'administration (Ketesa) mis à jour vers 1.3.0. Synapse reste en 1.155.0.

- Sécurité : correction d'une faille XSS à l'ouverture des médias — seuls les vrais types d'image s'ouvrent dans un onglet ; tout le reste (SVG compris) est téléchargé.
- Correctif : modifier un utilisateur hors MAS pouvait déclencher un effacement RGPD accidentel. Corrigé.
- Sécurité : les actions désactiver, supprimer et effacer un utilisateur demandent désormais une confirmation.
- Nouvelle file « Utilisateurs signalés » dans la barre latérale, et meilleure gestion des utilisateurs avec Matrix Authentication Service (MAS).

Notes complètes : https://github.com/etkecc/ketesa/releases/tag/v1.3.0

Mises à jour internes (start-sdk 2.0.x). Corrige les sauvegardes de base de données qui pouvaient auparavant être créées vides.`,
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
