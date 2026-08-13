import { access, copyFile } from 'fs/promises'
import { homeserverYaml } from '../fileModels/homeserver.yml'
import { importedHomeserverYaml } from '../fileModels/importedHomeserver.yml'
import { storeJson } from '../fileModels/store.json'
import { i18n } from '../i18n'
import { homeserverHostnames } from '../interfaces'
import { sdk } from '../sdk'
import {
  importConfigSubpath,
  importDumpSubpath,
  importKeySubpath,
  mountpoint,
  placeholderServerName,
} from '../utils'
import { setServerName } from './setServerName'

export const importHomeserver = sdk.Action.withoutInput(
  // id
  'import-homeserver',

  // metadata
  async ({ effects }) => {
    const claimed = await homeserverYaml
      .read((h) => h.server_name)
      .const(effects)

    return {
      name: i18n('Import Existing Homeserver'),
      description: i18n(
        'Adopt the identity, database and media of a Matrix homeserver you run elsewhere, so its users keep their accounts, their logins and their history.',
      ),
      warning: i18n(
        'Stage the old server\'s files on this volume first — see "Importing an existing homeserver" in the instructions. This replaces the empty homeserver created on install and cannot be undone.',
      ),
      allowedStatuses: 'only-stopped',
      group: null,
      visibility:
        !claimed || claimed === placeholderServerName
          ? 'enabled'
          : {
              disabled: i18n(
                'This homeserver already has an address, so there is nothing to import into. Importing is only possible before the first start.',
              ),
            },
    }
  },

  // the execution function
  async ({ effects }) => {
    const imported = await importedHomeserverYaml
      .read()
      .once()
      .catch(() => {
        throw new Error(
          i18n(
            '${path} is missing server_name, macaroon_secret_key or form_secret.',
            {
              path: importConfigSubpath,
            },
          ),
        )
      })
    if (!imported) {
      throw new Error(
        i18n('No file at ${path}. Stage the old homeserver first.', {
          path: importConfigSubpath,
        }),
      )
    }

    for (const subpath of [importDumpSubpath, importKeySubpath]) {
      await access(sdk.volumes.main.subpath(subpath)).catch(() => {
        throw new Error(
          i18n('No file at ${path}. Stage the old homeserver first.', {
            path: subpath,
          }),
        )
      })
    }

    // The imported user IDs all end in this domain, so it has to be reachable
    // here byte for byte. Catching that now beats catching it after the media
    // has been copied across.
    const hostnames = await homeserverHostnames(effects)
    if (!hostnames.includes(imported.server_name)) {
      throw new Error(
        i18n(
          'Add ${server_name} as a public domain on the Homeserver interface before importing. It has to match the old server exactly, or every imported user ID is wrong.',
          { server_name: imported.server_name },
        ),
      )
    }

    // Synapse's own default location for the key, so signing_key_path reads the
    // same as it would on a server that never moved.
    const signingKeySubpath = `${imported.server_name}.signing.key`
    await copyFile(
      sdk.volumes.main.subpath(importKeySubpath),
      sdk.volumes.main.subpath(signingKeySubpath),
    )

    await homeserverYaml.merge(effects, {
      server_name: imported.server_name,
      public_baseurl: `https://${imported.server_name}`,
      signing_key_path: `${mountpoint}/${signingKeySubpath}`,
      macaroon_secret_key: imported.macaroon_secret_key,
      form_secret: imported.form_secret,
      old_signing_keys: imported.old_signing_keys,
    })

    await storeJson.merge(effects, { pendingImport: true })

    // The import stands in for set-server-name, whose critical task would
    // otherwise keep the service from starting.
    await sdk.action.clearTask(effects, `synapse:${setServerName.id}`)

    return {
      version: '1',
      title: i18n('Success'),
      message: i18n(
        'Identity imported. The database is restored the next time you start Synapse, which will take a while for a large homeserver — watch the logs. Sign in with the accounts and passwords from the old server; no one is logged out.',
      ),
      result: null,
    }
  },
)
