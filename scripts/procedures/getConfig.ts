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
  "enable-registration": {
    "name": "Enable Registration",
    "description": "Allow users to sign up on this homeserver. It is recommended that you disable this feature the moment user confirms successful registration.",
    "type": "boolean",
    "default": false,
  },
  "email-notifications": {
    "type": "union",
    "name": "Email Notifications",
    "description": "Enable this setting to receive email notifications from your Matrix server. Requires inputting SMTP credentials.",
    "tag": {
      "id": "enabled",
      "name": "Enable SMTP Settings",
      "variant-names": {
        "true": "True",
        "false": "False",
      }
    },
    "default": "false",
    "variants": {
     "true": {
        "smtp-settings": {
         "type": "object",
         "name": "SMTP Settings",
         "spec": {
          "smtp-host": {
            "type": "string",
            "name": "Server Address",
            "description": "The fully qualified domain name of your SMTP server",
            "nullable": false    
           },
           "smtp-port": {
            "type": "number",
            "name": "Port",
            "description": "The TCP port of your SMTP server",
            "default": 587,
            "integral": true,
            "range": "[1,65535]",
            "nullable": false
           },
           "from-name": {
            "type": "string",
            "name": "From Name",
            "description": "Name to display in the from field when receiving emails from your Synapse server.",
            "nullable": false,
            "default": "Synapse"
           },
           "smtp-user": {
            "type": "string",
            "name": "Username",
            "description": "The username for logging into your SMTP server",
            "nullable": false
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
         }
        }
      },
     "false": {} 
    },
  },
  "advanced": {
   "type": "object",
   "name": "Advanced",
   "description": "Advanced settings for Synapse",
   "spec": {
      "tor-only-mode": {
        "type": "boolean",
        "name": "Tor Only Mode",
        "description": "If enabled, communications with clearnet homeservers will be exclusively routed over Tor using Tor exit nodes instead of encrypted clearnet (https). This is not necessarily more private, and it is slower.",
        "default": false
      }
    }
  }
});
