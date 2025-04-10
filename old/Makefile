PKG_ID := $(shell yq e ".id" manifest.yaml)
PKG_VERSION := $(shell yq e ".version" manifest.yaml)
TS_FILES := $(shell find ./ -name \*.ts)

.DELETE_ON_ERROR:

all: verify

install:
ifeq (,$(wildcard ~/.embassy/config.yaml))
	@echo; echo "You must define \"host: http://server-name.local\" in ~/.embassy/config.yaml config file first"; echo
else
	start-cli package install $(PKG_ID).s9pk
endif

clean:
	rm -f $(PKG_ID).s9pk
	rm -f scripts/*.js
	rm -rf docker-images
	rm -f synapse-vps.tar

arm:
	@rm -f docker-images/x86_64.tar
	@ARCH=aarch64 $(MAKE)

x86:
	@rm -f docker-images/aarch64.tar
	@ARCH=x86_64 $(MAKE)

verify: $(PKG_ID).s9pk
	@start-sdk verify s9pk $(PKG_ID).s9pk
	@echo " Done!"
	@echo "   Filesize: $(shell du -h $(PKG_ID).s9pk) is ready"

$(PKG_ID).s9pk: manifest.yaml instructions.md icon.png LICENSE scripts/embassy.js docker-images/aarch64.tar docker-images/x86_64.tar
ifeq ($(ARCH),aarch64)
	@echo "start-sdk: Preparing aarch64 package ..."
else ifeq ($(ARCH),x86_64)
	@echo "start-sdk: Preparing x86_64 package ..."
else
	@echo "start-sdk: Preparing Universal Package ..."
endif
	@start-sdk pack

docker-images/aarch64.tar: Dockerfile docker_entrypoint.sh check-federation.sh priv-config-forward-onion configurator.py $(shell find ./www)
ifeq ($(ARCH),x86_64)
else
	mkdir -p docker-images
	DOCKER_CLI_EXPERIMENTAL=enabled docker buildx build --build-arg PLATFORM=arm64 --tag start9/$(PKG_ID)/main:$(PKG_VERSION) --platform=linux/arm64 -o type=docker,dest=docker-images/aarch64.tar .
endif

docker-images/x86_64.tar: Dockerfile docker_entrypoint.sh check-federation.sh priv-config-forward-onion configurator.py $(shell find ./www)
ifeq ($(ARCH),aarch64)
else
	mkdir -p docker-images
	DOCKER_CLI_EXPERIMENTAL=enabled docker buildx build --build-arg PLATFORM=amd64 --tag start9/$(PKG_ID)/main:$(PKG_VERSION) --platform=linux/amd64 -o type=docker,dest=docker-images/x86_64.tar .
endif

scripts/embassy.js: $(TS_FILES)
	deno run --allow-read --allow-write --allow-env --allow-net scripts/bundle.ts

vps: Dockerfile.vps
	DOCKER_CLI_EXPERIMENTAL=enabled docker buildx build --build-arg PLATFORM=amd64 -f Dockerfile --tag matrixdotorg/synapse:v$(PKG_VERSION) --platform=linux/amd64 -o type=docker,dest=synapse-vps.tar .
