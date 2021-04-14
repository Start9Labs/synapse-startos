ELEMENT_SRC := $(shell find ./element-web/src)
SYNAPSE_SRC := $(shell find ./synapse)

.DELETE_ON_ERROR:

all: synapse.s9pk

install: synapse.s9pk
	appmgr install synapse.s9pk

synapse.s9pk: manifest.yaml config_spec.yaml config_rules.yaml image.tar instructions.md
	appmgr -vv pack $(shell pwd) -o synapse.s9pk
	appmgr -vv verify synapse.s9pk

instructions.md: README.md
	cp README.md instructions.md

image.tar: Dockerfile docker_entrypoint.sh element-web/webapp #base-image.tar
	# docker load < base-image.tar
	DOCKER_CLI_EXPERIMENTAL=enabled docker buildx build --tag start9/synapse --platform=linux/arm/v7 -o type=docker,dest=image.tar .

# base-image.tar: $(SYNAPSE_SRC) synapse/docker/Dockerfile
# 	DOCKER_CLI_EXPERIMENTAL=enabled docker buildx build -f synapse/docker/Dockerfile --tag matrixdotorg/synapse:v1.31.0 --platform=linux/arm/v7 -o type=docker,dest=base-image.tar ./synapse

element-web/webapp: element-web/node_modules $(ELEMENT_SRC) element-web/config.json
	NODE_OPTIONS=--max-old-space-size=2048 npm --prefix element-web run build

element-web/node_modules: element-web/package.json
	cd element-web && yarn install

element-web/config.json: element-web/config.sample.json
	cat element-web/config.sample.json | jq ".default_theme = \"dark\"" > element-web/config.json
