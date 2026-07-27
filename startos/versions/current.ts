import { VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '1.156.0:5',
  releaseNotes: {
    en_US: `Settings now take effect on their own — no more restarting Synapse by hand.

- Fixes "Set Admin Password" requiring a manual restart before the new password worked.
- Moves SMTP out of "Config" into its own "Configure SMTP" action, which applies immediately. Turning SMTP off now actually clears the credentials, which it previously did not.
- Removes the "Create Bot User" action. Create user accounts from the Users tab of the Admin Dashboard instead.`,
    es_ES: `Los ajustes ahora se aplican solos: ya no hay que reiniciar Synapse a mano.

- Corrige que «Set Admin Password» requiriera un reinicio manual para que la nueva contraseña funcionara.
- Traslada la configuración SMTP de «Config» a su propia acción «Configure SMTP», que se aplica de inmediato. Desactivar SMTP ahora sí borra las credenciales, algo que antes no ocurría.
- Elimina la acción «Create Bot User». Cree las cuentas de usuario desde la pestaña «Users» del panel de administración.`,
    de_DE: `Einstellungen werden jetzt von selbst wirksam – kein manueller Neustart von Synapse mehr nötig.

- Behebt, dass „Set Admin Password“ einen manuellen Neustart erforderte, bevor das neue Passwort funktionierte.
- Verschiebt SMTP aus „Config“ in eine eigene Aktion „Configure SMTP“, die sofort wirksam wird. Das Deaktivieren von SMTP löscht die Zugangsdaten nun tatsächlich, was zuvor nicht der Fall war.
- Entfernt die Aktion „Create Bot User“. Legen Sie Benutzerkonten stattdessen im Tab „Users“ des Admin-Dashboards an.`,
    pl_PL: `Ustawienia zaczynają teraz obowiązywać samoczynnie — bez ręcznego restartu Synapse.

- Naprawia „Set Admin Password”, które wymagało ręcznego restartu, zanim nowe hasło zaczęło działać.
- Przenosi SMTP z „Config” do osobnej akcji „Configure SMTP”, która działa natychmiast. Wyłączenie SMTP faktycznie usuwa teraz dane logowania, czego wcześniej nie robiło.
- Usuwa akcję „Create Bot User”. Konta użytkowników twórz w zakładce „Users” panelu administracyjnego.`,
    fr_FR: `Les réglages prennent désormais effet d'eux-mêmes — plus besoin de redémarrer Synapse à la main.

- Corrige « Set Admin Password », qui nécessitait un redémarrage manuel avant que le nouveau mot de passe ne fonctionne.
- Déplace la configuration SMTP de « Config » vers une action « Configure SMTP » dédiée, appliquée immédiatement. Désactiver SMTP efface maintenant réellement les identifiants, ce qui n'était pas le cas auparavant.
- Supprime l'action « Create Bot User ». Créez les comptes utilisateur depuis l'onglet « Users » du tableau de bord d'administration.`,
  },
  migrations: {},
})
