#!/usr/local/bin/python
import os
import yaml

EMAIL_CFG_KEYS = ["smtp-host", "smtp-port", "smtp-user", "smtp-pass", "require-transport-security"]

def main():
    with open(r'/data/homeserver.yaml') as hs:
    # with open(r'homeserver.yaml') as hs:
        homeserver_cfg = yaml.full_load(hs)
        # print(homeserver_cfg)
        hs.close()

    with open(r'/data/start9/config.yaml') as s9:
    # with open(r'config.yaml') as s9:
        s9_cfg = yaml.full_load(s9)
        # print(s9_cfg)
        s9.close()

    if s9_cfg.get("enable-registration"):
        homeserver_cfg["enable_registration"] = True
    else:
        homeserver_cfg["enable_registration"] = False

    homeserver_email_cfg = None
    if s9_cfg.get("email-notifications").get("enabled") == "true":
        s9_email_cfg = s9_cfg.get("email-notifications").get("smtp-settings")
        homeserver_email_cfg = {
          "enable_notifs": True,
          "notif_from": s9_email_cfg["from-name"] + " <" + s9_email_cfg["from-address"] + ">"
        }
        for s9_key in EMAIL_CFG_KEYS:
            if s9_email_cfg.get(s9_key):
                homeserver_email_cfg[s9_key.replace("-", "_")] = s9_email_cfg[s9_key]
        homeserver_cfg["public_baseurl"] = os.getenv('TOR_ADDRESS')
    homeserver_cfg["email"] = homeserver_email_cfg
        # print(homeserver_email_cfg)
        # print(homeserver_cfg)

    with open(r'/data/homeserver.yaml', 'w') as hs:
    # with open(r'homeserver1.yaml', 'w') as hs:
        data1 = yaml.dump(homeserver_cfg, hs)

if __name__ == "__main__":
    main()
