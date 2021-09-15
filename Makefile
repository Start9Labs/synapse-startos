SYNAPSE_SRC := $(shell find ./synapse)
DOCKER_CUR_ENGINE := $(shell docker buildx ls | grep "*" | awk '{print $$1;}')

.DELETE_ON_ERROR:

all: verify

install: 
	embassy-cli install synapse

verify: synapse.s9pk
	embassy-sdk verify synapse.s9pk

synapse.s9pk: manifest.yaml assets/compat/config_spec.yaml assets/compat/config_rules.yaml image.tar
	embassy-sdk pack

image.tar: Dockerfile docker_entrypoint.sh priv-config-forward-all priv-config-forward-onion base-image.tar configurator.py $(shell find ./www)
	docker load < base-image.tar
	docker buildx use default
	DOCKER_CLI_EXPERIMENTAL=enabled docker buildx build --tag start9/synapse --platform=linux/arm64 .
	docker buildx use $(DOCKER_CUR_ENGINE)
	docker save start9/synapse > image.tar

base-image.tar: synapse/docker/Dockerfile $(SYNAPSE_SRC)
	DOCKER_CLI_EXPERIMENTAL=enabled docker buildx build -f synapse/docker/Dockerfile --tag matrixdotorg/synapse:v1.37.1 --platform=linux/arm64 -o type=docker,dest=base-image.tar ./synapse
