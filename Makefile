SYNAPSE_SRC := $(shell find ./synapse)
DOCKER_CUR_ENGINE := $(shell docker buildx ls | grep "*" | awk '{print $$1;}')

.DELETE_ON_ERROR:

all: synapse.s9pk

install: synapse.s9pk
	appmgr install synapse.s9pk

synapse.s9pk: manifest.yaml config_spec.yaml config_rules.yaml image.tar instructions.md
	appmgr -vv pack $(shell pwd) -o synapse.s9pk
	appmgr -vv verify synapse.s9pk

instructions.md: README.md
	cp README.md instructions.md

image.tar: Dockerfile docker_entrypoint.sh priv-config-forward-all priv-config-forward-onion base-image.tar configurator.py
	docker load < base-image.tar
	docker buildx use default
	DOCKER_CLI_EXPERIMENTAL=enabled docker buildx build --tag start9/synapse --platform=linux/arm/v7 .
	docker buildx use $(DOCKER_CUR_ENGINE)
	docker save start9/synapse > image.tar

base-image.tar: synapse/docker/Dockerfile $(SYNAPSE_SRC)
	DOCKER_CLI_EXPERIMENTAL=enabled docker buildx build -f synapse/docker/Dockerfile --tag matrixdotorg/synapse:v1.32.2 --platform=linux/arm/v7 -o type=docker,dest=base-image.tar ./synapse
