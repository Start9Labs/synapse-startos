#!/usr/local/bin/python
import os
import yaml
import subprocess

EMAIL_CFG_KEYS = [
    "smtp-host",
    "smtp-port",
    "smtp-user",
    "smtp-pass",
    "require-transport-security",
]


def main():
    with open(r"/data/homeserver.yaml") as hs:
        homeserver_cfg = yaml.full_load(hs)
        hs.close()

    with open(r"/data/start9/config.yaml") as s9:
        s9_cfg = yaml.full_load(s9)
        s9.close()

    homeserver_cfg["public_baseurl"] = "http://" + os.getenv("TOR_ADDRESS")
    if s9_cfg.get("advanced").get("enable-registration"):
        homeserver_cfg["enable_registration"] = True
    else:
        homeserver_cfg["enable_registration"] = False

    homeserver_email_cfg = None
    if s9_cfg.get("email-notifications").get("enabled") == "true":
        s9_email_cfg = s9_cfg.get("email-notifications")
        homeserver_email_cfg = {
            "enable_notifs": True,
            "notif_from": s9_email_cfg["from-name"]
        }
        for s9_key in EMAIL_CFG_KEYS:
            if s9_email_cfg.get(s9_key):
                homeserver_email_cfg[s9_key.replace("-", "_")] = s9_email_cfg[s9_key]
    homeserver_cfg["email"] = homeserver_email_cfg

    with open(r"/data/homeserver.yaml", "w") as hs:
        yaml.dump(homeserver_cfg, hs)

    with open(r"/data/start9/stats.yaml", "w") as s:
        stats = {
            "version": 2,
            "data": {
                "Admin Username": {
                    "type": "string",
                    "value": "admin",
                    "description": "Username for your Admin Portal",
                    "copyable": True,
                    "qr": False,
                    "masked": False,
                },
                "Admin Password": {
                    "type": "string",
                    "value": os.popen("cat /data/start9/adm.key").read().strip(),
                    "description": "Password for your Admin Portal",
                    "copyable": True,
                    "qr": False,
                    "masked": True,
                },
                "SSL Cert SHA256 Fingerprint": {
                    "type": "string",
                    "value": os.popen(
                        "openssl x509 -noout -fingerprint -sha256 -in /mnt/cert/main.cert.pem"
                    )
                    .read()
                    .strip()
                    .split("=")[-1],
                    "description": "Your SSL Certificate's unique public identifier. No one can impersonate your homeserver without access to the corresponding private key",
                    "copyable": True,
                    "qr": False,
                    "masked": False,
                },
            },
        }
        yaml.dump(stats, s)


if __name__ == "__main__":
    main()
