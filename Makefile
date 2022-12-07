PKG_ID := $(shell yq e ".id" manifest.yaml)
PKG_VERSION := $(shell yq e ".version" manifest.yaml)
SYNAPSE_SRC := $(shell find ./synapse)
TS_FILES := $(shell find ./ -name \*.ts)

.DELETE_ON_ERROR:

all: verify

install:
	embassy-cli package install $(PKG_ID).s9pk

clean:
	rm -f image.tar
	rm -f $(PKG_ID).s9pk
	rm -f scripts/*.js
	rm -rf docker-images

verify: $(PKG_ID).s9pk
	@embassy-sdk verify s9pk $(PKG_ID).s9pk
	@echo " Done!"
	@echo "   Filesize: $(shell du -h $(PKG_ID).s9pk) is ready"

$(PKG_ID).s9pk: manifest.yaml instructions.md icon.png LICENSE scripts/embassy.js docker-images/aarch64.tar docker-images/x86_64.tar
	@if ! [ -z "$(ARCH)" ]; then cp docker-images/$(ARCH).tar image.tar; echo "* image.tar compiled for $(ARCH)"; fi
	embassy-sdk pack

docker-images/aarch64.tar: synapse/timeouts.patch Dockerfile docker_entrypoint.sh check-federation.sh priv-config-forward-all priv-config-forward-onion configurator.py $(shell find ./www)
	mkdir -p docker-images
	DOCKER_CLI_EXPERIMENTAL=enabled docker buildx build --build-arg PLATFORM=arm64 --tag start9/$(PKG_ID)/main:$(PKG_VERSION) --platform=linux/arm64 -o type=docker,dest=docker-images/aarch64.tar .

docker-images/x86_64.tar: synapse/timeouts.patch Dockerfile docker_entrypoint.sh check-federation.sh priv-config-forward-all priv-config-forward-onion configurator.py $(shell find ./www)
	mkdir -p docker-images
	DOCKER_CLI_EXPERIMENTAL=enabled docker buildx build --build-arg PLATFORM=amd64 --tag start9/$(PKG_ID)/main:$(PKG_VERSION) --platform=linux/amd64 -o type=docker,dest=docker-images/x86_64.tar .

scripts/embassy.js: $(TS_FILES)
	deno bundle scripts/embassy.ts scripts/embassy.js

# for running on a non-embassy amd64 linux server
image-x86.tar: patch synapse/docker/Dockerfile $(SYNAPSE_SRC)
	DOCKER_CLI_EXPERIMENTAL=enabled docker buildx build -f synapse/docker/Dockerfile --tag matrixdotorg/synapse:$(VERSION) --platform=linux/amd64 -o type=docker,dest=base-image.tar ./synapse

synapse/timeouts.patch:
	@cp timeouts.patch synapse/ && cd synapse && git apply -R --check < timeouts.patch 2>/dev/null; if [ "$?" = "0" ]; then git am < timeouts.patch; else echo "PATCH: Synapse appears to be patched ..."; fi && rm -f synapse/timeouts.patch
