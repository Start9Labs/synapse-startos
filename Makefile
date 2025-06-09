PACKAGE_ID := $(shell grep -o "id: '[^']*'" startos/manifest.ts | sed "s/id: '\([^']*\)'/\1/")
INGREDIENTS := $(shell start-cli s9pk list-ingredients 2> /dev/null) assets/synapse-admin
SYNAPSE_ADMIN_VERSION = v0.11.1-etke43
SYNAPSE_ADMIN_CHECKSUM = daa909e3441e997bbfa6c834d21696804e87c76bada37fa34e63769635fbab2c

.PHONY: all clean install check-deps check-init ingredients

.DELETE_ON_ERROR:

all: ${PACKAGE_ID}.s9pk
	@echo " Done!"
	@echo " Filesize:$(shell du -h $(PACKAGE_ID).s9pk) is ready"

check-deps:
	@if ! command -v start-cli > /dev/null; then \
		echo "Error: start-cli not found. Please install it first."; \
		exit 1; \
	fi
	@if ! command -v npm > /dev/null; then \
		echo "Error: npm (Node Package Manager) not found. Please install Node.js and npm."; \
		exit 1; \
	fi

check-init:
	@if [ ! -f ~/.startos/developer.key.pem ]; then \
		start-cli init; \
	fi

ingredients: $(INGREDIENTS)
	@echo "Re-evaluating ingredients..."

${PACKAGE_ID}.s9pk: $(INGREDIENTS) | check-deps check-init
	@$(MAKE) --no-print-directory ingredients
	start-cli s9pk pack

javascript/index.js: $(shell git ls-files startos) tsconfig.json node_modules package.json
	npm run build

assets:
	mkdir -p assets

assets/synapse-admin: assets tmp/synapse-admin.tar.gz
	rm -rf assets/synapse-admin
	tar -xzvf tmp/synapse-admin.tar.gz -C assets

tmp/synapse-admin.tar.gz:
	mkdir -p tmp
	(cd tmp && curl --progress-bar -OL https://github.com/etkecc/synapse-admin/releases/download/$(SYNAPSE_ADMIN_VERSION)/synapse-admin.tar.gz)
	echo "$(SYNAPSE_ADMIN_CHECKSUM)  tmp/synapse-admin.tar.gz" | shasum -a 256 -c

node_modules: package-lock.json
	npm ci

package-lock.json: package.json
	npm i

clean:
	rm -rf \
	${PACKAGE_ID}.s9pk \
	javascript \
	node_modules \
	assets/synapse-admin \
	tmp

install: | check-deps check-init
	@if [ ! -f ~/.startos/config.yaml ]; then echo "You must define \"host: http://server-name.local\" in ~/.startos/config.yaml config file first."; exit 1; fi
	@echo "\nInstalling to $$(grep -v '^#' ~/.startos/config.yaml | cut -d'/' -f3) ...\n"
	@[ -f $(PACKAGE_ID).s9pk ] || ( $(MAKE) && echo "\nInstalling to $$(grep -v '^#' ~/.startos/config.yaml | cut -d'/' -f3) ...\n" )
	@start-cli package install -s $(PACKAGE_ID).s9pk
