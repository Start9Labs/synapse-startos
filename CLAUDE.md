## How the upstream version is pulled
- Git submodule `synapse/` → checkout new tag (e.g. `cd synapse && git fetch --tags && git checkout v<version>`)
- Image `synapse` is `dockerBuild` from the submodule (no dockerTag to update)
