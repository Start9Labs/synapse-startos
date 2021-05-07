#!/usr/local/bin/python
import os
import yaml

EMAIL_CFG_KEYS = ["smtp-host", "smtp-port", "from-address", "smtp-user", 
    "smtp-pass", "require-transport-security", "app-name", "enable-notifs", 
    "notif-for-new-users"
]

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

    if s9_cfg.get("advanced").get("smtp").get("enabled"):
        homeserver_cfg["public_baseurl"] = os.getenv('TOR_ADDRESS')
        homeserver_email_cfg = {}
        s9_email_cfg = s9_cfg.get("advanced").get("smtp")
        for s9_key in EMAIL_CFG_KEYS:
            if s9_email_cfg.get(s9_key):
                if s9_key == "from-address":
                    homeserver_email_cfg["notif_from"] = "Your Friendly" + \
                        " %(app)s homeserver <" + s9_email_cfg[s9_key] + ">"
                else:
                    homeserver_email_cfg[s9_key.replace("-", "_")] = s9_email_cfg[s9_key]
        # print(homeserver_email_cfg)
        homeserver_cfg["email"] = homeserver_email_cfg
        # print(homeserver_cfg)

    with open(r'/data/homeserver.yaml', 'w') as hs:
    # with open(r'homeserver1.yaml', 'w') as hs:
        data1 = yaml.dump(homeserver_cfg, hs)

if __name__ == "__main__":
    main()
