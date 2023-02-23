import { compat, types as T } from "../deps.ts";

export const getConfig: T.ExpectedExports.getConfig = compat.getConfig({
  "tor-address": {
    "name": "Network Tor Address",
    "description": "The Tor address for the network interface.",
    "type": "pointer",
    "subtype": "package",
    "package-id": "synapse",
    "target": "tor-address",
    "interface": "main"
  },
  "federation": {
    "name": "Federation",
    "description": "If enabled, users on your homeserver will be able to join rooms on other homeservers and vica versa. If disabled, users on your homeserver will only be able to interact with other users and rooms on your homeserver.",
    "type": "boolean",
    "default": true
  },
  "email-notifications": {
    "type": "union",
    "name": "Email Notifications",
    "description": "Enable this setting to receive email notifications from your Synapse server. Requires inputting SMTP credentials.",
    "tag": {
      "id": "enabled",
      "name": "Email Notifications",
      "variant-names": {
        "true": "Enabled",
        "false": "Disabled"
      }
    },
    "default": "false",
    "variants": {
      "true": {
        "smtp-host": {
          "type": "string",
          "name": "Host",
          "description": "The fully qualified domain name of your SMTP server",
          "placeholder": "e.g. email-smtp.eu-west-1.amazonaws.com",
          "nullable": false,
          "masked": false
        },
        "smtp-port": {
          "type": "number",
          "name": "Port",
          "description": "The TCP port of your SMTP server",
          "default": 587,
          "integral": true,
          "range": "[1,65535]",
          "nullable": false,
        },
        "from-name": {
          "type": "string",
          "name": "From Address",
          "description": "Name/Address to display in the from field when receiving emails from your Synapse server.",
          "placeholder": "e.g. Synapse<synapse@mydomain.com>",
          "nullable": false,
          "masked": false
        },
        "smtp-user": {
          "type": "string",
          "name": "Username",
          "description": "The username for logging into your SMTP server",
          "nullable": false,
          "masked": false
        },
        "smtp-pass": {
          "type": "string",
          "name": "Password",
          "description": "The password for logging into your SMTP server",
          "nullable": true,
          "masked": true
        },
        "require-transport-security": {
          "type": "boolean",
          "name": "Require Transport Security",
          "description": "Require TLS transport security for SMTP. By default, Synapse will connect over plain text, and will then switch to TLS via STARTTLS <strong>if the SMTP server supports it</strong>. If this option is set, Synapse will refuse to connect unless the server supports STARTTLS.",
          "default": false
        },
      },
     "false": {} 
    },
  },
  "advanced": {
   "type": "object",
   "name": "Advanced",
   "description": "Advanced settings for Synapse",
   "spec": {
      "enable-registration": {
        "name": "Enable Registration",
        "description": "Allow outsiders to create their own accounts on your homeserver. This is not recommended, as it leaves your server vulnerable to attack. It is preferable for you to create accounts on their behalf using your server's admin portal.",
        "warning": "It is recommended to leave this setting disabled whenever possible.",
        "type": "boolean",
        "default": false
      },
    }
  }
});
