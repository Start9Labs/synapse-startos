PACKAGE_ID := $(shell awk -F"'" '/id:/ {print $$2}' startos/manifest.ts)
INGREDIENTS := $(shell start-cli s9pk list-ingredients 2>/dev/null)
SYNAPSE_ADMIN_VERSION = v0.11.1-etke47
SYNAPSE_ADMIN_CHECKSUM = 9323ec6921f8170dc9fb65efdcd23e35fd2dea12c588cba34753b0492b7871c2

CMD_ARCH_GOAL := $(filter aarch64 x86_64 arm x86, $(MAKECMDGOALS))
ifeq ($(CMD_ARCH_GOAL),)
  BUILD := universal
  S9PK := $(PACKAGE_ID).s9pk
else
  RAW_ARCH := $(firstword $(CMD_ARCH_GOAL))
  ACTUAL_ARCH := $(patsubst x86,x86_64,$(patsubst arm,aarch64,$(RAW_ARCH)))
  BUILD := $(ACTUAL_ARCH)
  S9PK := $(PACKAGE_ID)_$(BUILD).s9pk
endif

.PHONY: all aarch64 x86_64 arm x86 clean install check-deps check-init package ingredients
.DELETE_ON_ERROR:

define SUMMARY
	@manifest=$$(start-cli s9pk inspect $(1) manifest); \
	size=$$(du -h $(1) | awk '{print $$1}'); \
	title=$$(printf '%s' "$$manifest" | jq -r .title); \
	version=$$(printf '%s' "$$manifest" | jq -r .version); \
	arches=$$(printf '%s' "$$manifest" | jq -r '.hardwareRequirements.arch | join(", ")'); \
	sdkv=$$(printf '%s' "$$manifest" | jq -r .sdkVersion); \
	gitHash=$$(printf '%s' "$$manifest" | jq -r .gitHash | sed -E 's/(.*-modified)$$/\x1b[0;31m\1\x1b[0m/'); \
	printf "\n"; \
	printf "\033[1;32m✅ Build Complete!\033[0m\n"; \
	printf "\n"; \
	printf "\033[1;37m📦 $$title\033[0m   \033[36mv$$version\033[0m\n"; \
	printf "───────────────────────────────\n"; \
	printf " \033[1;36mFilename:\033[0m   %s\n" "$(1)"; \
	printf " \033[1;36mSize:\033[0m       %s\n" "$$size"; \
	printf " \033[1;36mArch:\033[0m       %s\n" "$$arches"; \
	printf " \033[1;36mSDK:\033[0m        %s\n" "$$sdkv"; \
	printf " \033[1;36mGit:\033[0m        %s\n" "$$gitHash"; \
	echo ""
endef

all: $(PACKAGE_ID).s9pk
	$(call SUMMARY,$(S9PK))

$(BUILD): $(PACKAGE_ID)_$(BUILD).s9pk
	$(call SUMMARY,$(S9PK))

x86: x86_64
arm: aarch64

$(S9PK): $(INGREDIENTS) .git/HEAD .git/index assets/synapse-admin
	@$(MAKE) --no-print-directory ingredients
	@echo "   Packing '$(S9PK)'..."
	BUILD=$(BUILD) start-cli s9pk pack -o $(S9PK)

ingredients: $(INGREDIENTS)
	@echo "   Re-evaluating ingredients..."

install: package | check-deps check-init
	@HOST=$$(awk -F'/' '/^host:/ {print $$3}' ~/.startos/config.yaml); \
	if [ -z "$$HOST" ]; then \
		echo "Error: You must define \"host: http://server-name.local\" in ~/.startos/config.yaml"; \
		exit 1; \
	fi; \
	echo "\n🚀 Installing to $$HOST ..."; \
	start-cli package install -s $(S9PK)

check-deps:
	@command -v start-cli >/dev/null || \
		(echo "Error: start-cli not found. Please see https://docs.start9.com/latest/developer-guide/sdk/installing-the-sdk" && exit 1)
	@command -v npm >/dev/null || \
		(echo "Error: npm not found. Please install Node.js and npm." && exit 1)

check-init:
	@if [ ! -f ~/.startos/developer.key.pem ]; then \
		echo "Initializing StartOS developer environment..."; \
		start-cli init; \
	fi

assets/synapse-admin: tmp/synapse-admin.tar.gz
	rm -rf assets/synapse-admin
	tar -xzvf tmp/synapse-admin.tar.gz -C assets

tmp/synapse-admin.tar.gz:
	mkdir -p tmp
	(cd tmp && curl --progress-bar -OL https://github.com/etkecc/synapse-admin/releases/download/$(SYNAPSE_ADMIN_VERSION)/synapse-admin.tar.gz)
	echo "$(SYNAPSE_ADMIN_CHECKSUM)  tmp/synapse-admin.tar.gz" | shasum -a 256 -c

javascript/index.js: $(shell find startos -type f) tsconfig.json node_modules
	npm run build

node_modules: package-lock.json
	npm ci

package-lock.json: package.json
	npm i

clean:
	@echo "Cleaning up build artifacts..."
	@rm -rf $(PACKAGE_ID).s9pk $(PACKAGE_ID)_x86_64.s9pk $(PACKAGE_ID)_aarch64.s9pk javascript assets/synapse-admin tmp node_modules