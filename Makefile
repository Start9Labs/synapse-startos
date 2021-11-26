SYNAPSE_SRC := $(shell find ./synapse)
VERSION := $(shell yq e ".version" manifest.yaml)

.DELETE_ON_ERROR:

all: verify

install: 
	embassy-cli install synapse

verify: synapse.s9pk
	embassy-sdk verify synapse.s9pk

synapse.s9pk: manifest.yaml assets/compat/config_spec.yaml assets/compat/config_rules.yaml image.tar
	embassy-sdk pack

image.tar: Dockerfile docker_entrypoint.sh assets/utils/user-signups-off.sh priv-config-forward-all priv-config-forward-onion configurator.py $(shell find ./www)
	DOCKER_CLI_EXPERIMENTAL=enabled docker buildx build --tag start9/synapse/main:$(VERSION) --platform=linux/arm64 -o type=docker,dest=image.tar .
