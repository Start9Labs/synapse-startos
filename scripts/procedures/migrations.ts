import { compat, types as T } from "../deps.ts";

export const migration: T.ExpectedExports.migration = compat.migrations
    .fromMapping( {
        "1.75.0": {
            up: compat.migrations.updateConfig(
                (config) => {
                    return {
                        federation: true,
                        "email-notifications": {
                            enabled: "false"
                        },
                        advanced: {
                            "enable-registration": config["enable-registration"]
                        }
                    };
                },
                true,
                { version: "1.75.0", type: "up" },
            ),
            down: compat.migrations.updateConfig(
                (config: any) => {
                    return {
                        "enable-registration": config.advanced["enable-registration"],
                        "email-notifications": {
                            enabled: "false"
                        },
                        advanced: { "tor-only-mode": false }
                    };
                },
                true,
                { version: "1.75.0", type: "down" },
            ),
      },
    }, "1.128.0" );
