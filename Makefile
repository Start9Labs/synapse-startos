SYNAPSE_SRC := $(shell find ./synapse)
VERSION := $(shell yq e ".version" manifest.yaml)

.DELETE_ON_ERROR:

all: verify

install: 
	embassy-cli package install synapse.s9pk

clean:
	rm -f synapse.s9pk
	rm -f image.tar
	rm -f scripts/*.js

verify: synapse.s9pk
	embassy-sdk verify s9pk synapse.s9pk

synapse.s9pk: manifest.yaml instructions.md icon.png LICENSE scripts/embassy.js image.tar
	embassy-sdk pack

image.tar: synapse/timeouts.patch Dockerfile docker_entrypoint.sh check-federation.sh priv-config-forward-all priv-config-forward-onion configurator.py $(shell find ./www)
	DOCKER_CLI_EXPERIMENTAL=enabled docker buildx build --tag start9/synapse/main:$(VERSION) --platform=linux/arm64 -o type=docker,dest=image.tar .

scripts/embassy.js: scripts/**/*.ts
	deno cache --reload scripts/embassy.ts
	deno bundle scripts/embassy.ts scripts/embassy.js
	
# for running on a non-embassy amd64 linux server
image-x86.tar: patch synapse/docker/Dockerfile $(SYNAPSE_SRC)
	DOCKER_CLI_EXPERIMENTAL=enabled docker buildx build -f synapse/docker/Dockerfile --tag matrixdotorg/synapse:$(VERSION) --platform=linux/amd64 -o type=docker,dest=base-image.tar ./synapse

synapse/timeouts.patch:
	@cp timeouts.patch synapse/ && cd synapse && git apply -R --check < timeouts.patch 2>/dev/null; if [ "$?" = "0" ]; then git am < timeouts.patch; else echo "PATCH: Synapse appears to be patched ..."; fi && rm -f synapse/timeouts.patch
