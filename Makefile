SYNAPSE_SRC := $(shell find ./synapse)
VERSION := $(shell yq e ".version" manifest.yaml)

.DELETE_ON_ERROR:

all: verify

install: 
	embassy-cli install synapse

verify: synapse.s9pk
	embassy-sdk verify s9pk synapse.s9pk

synapse.s9pk: manifest.yaml assets/compat/config_spec.yaml assets/compat/config_rules.yaml image.tar
	embassy-sdk pack

image.tar: patch Dockerfile docker_entrypoint.sh check-federation.sh priv-config-forward-all priv-config-forward-onion configurator.py $(shell find ./www)
	DOCKER_CLI_EXPERIMENTAL=enabled docker buildx build --tag start9/synapse/main:$(VERSION) --platform=linux/arm64 -o type=docker,dest=image.tar .

# for running on a non-embassy amd64 linux server
image-x86.tar: patch synapse/docker/Dockerfile $(SYNAPSE_SRC)
	DOCKER_CLI_EXPERIMENTAL=enabled docker buildx build -f synapse/docker/Dockerfile --tag matrixdotorg/synapse:$(VERSION) --platform=linux/amd64 -o type=docker,dest=base-image.tar ./synapse

patch:
	cp timeouts.patch synapse/ && cd synapse && if ! git apply -R --check < timeouts.patch; then git am < timeouts.patch; fi