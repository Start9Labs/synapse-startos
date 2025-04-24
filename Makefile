PACKAGE_ID := $(shell grep -o "id: '[^']*'" startos/manifest.ts | sed "s/id: '\([^']*\)'/\1/")
INGREDIENTS := $(shell start-cli s9pk list-ingredients 2> /dev/null) assets/synapse-admin
SYNAPSE_ADMIN_VERSION = 0.10.3
SYNAPSE_ADMIN_CHECKSUM = 0998ee4e2d9e55d72c2d160fa70734a3484ebcf5b6f380204e19bc376f2d500d

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

assets/synapse-admin: assets tmp/synapse-admin-$(SYNAPSE_ADMIN_VERSION).tar.gz
	rm -rf assets/synapse-admin
	tar -xzvf tmp/synapse-admin-0.10.3.tar.gz -C assets
	mv assets/synapse-admin-$(SYNAPSE_ADMIN_VERSION) assets/synapse-admin

tmp/synapse-admin-$(SYNAPSE_ADMIN_VERSION).tar.gz:
	mkdir -p tmp
	(cd tmp && wget https://github.com/Awesome-Technologies/synapse-admin/releases/download/$(SYNAPSE_ADMIN_VERSION)/synapse-admin-$(SYNAPSE_ADMIN_VERSION).tar.gz)
	echo "$(SYNAPSE_ADMIN_CHECKSUM)  tmp/synapse-admin-$(SYNAPSE_ADMIN_VERSION).tar.gz" | shasum -a 256 -c -

node_modules: package-lock.json
	npm ci

package-lock.json: package.json
	npm i

clean:
	rm -rf ${PACKAGE_ID}.s9pk
	rm -rf javascript
	rm -rf node_modules

install: | check-deps check-init
	@if [ ! -f ~/.startos/config.yaml ]; then echo "You must define \"host: http://server-name.local\" in ~/.startos/config.yaml config file first."; exit 1; fi
	@echo "\nInstalling to $$(grep -v '^#' ~/.startos/config.yaml | cut -d'/' -f3) ...\n"
	@[ -f $(PACKAGE_ID).s9pk ] || ( $(MAKE) && echo "\nInstalling to $$(grep -v '^#' ~/.startos/config.yaml | cut -d'/' -f3) ...\n" )
	@start-cli package install -s $(PACKAGE_ID).s9pk
