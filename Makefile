ARCHES := x86 arm
# overrides to s9pk.mk must precede the include statement
include node_modules/@start9labs/start-sdk/s9pk.mk

SYNAPSE_ADMIN_VERSION = v1.3.0
SYNAPSE_ADMIN_CHECKSUM = ad241735fe683ff25aa6a46c791024e5df4aedd8e89814e0ee9649f9280801c3

# Ensure synapse-admin is built as part of 'ingredients' (which the s9pk
# recipe runs before packing). A prerequisite-only pattern rule like
# $(BASE_NAME)_%.s9pk: assets/synapse-admin is silently ignored by GNU Make
# (pattern rules without recipes are discarded), so we hook into 'ingredients'
# instead.
ingredients: assets/synapse-admin

# Override clean to also remove synapse-admin artifacts
clean:
	@echo "Cleaning up build artifacts..."
	@rm -rf $(PACKAGE_ID).s9pk $(PACKAGE_ID)_x86_64.s9pk $(PACKAGE_ID)_aarch64.s9pk $(PACKAGE_ID)_riscv64.s9pk javascript assets/synapse-admin tmp node_modules

# Custom recipes for synapse-admin
assets/synapse-admin: tmp/synapse-admin.tar.gz
	rm -rf assets/synapse-admin
	mkdir -p assets/synapse-admin
	tar -xzvf tmp/synapse-admin.tar.gz -C assets/synapse-admin --strip-components=1

tmp/synapse-admin.tar.gz:
	mkdir -p tmp
	curl --progress-bar -L https://github.com/etkecc/ketesa/releases/download/$(SYNAPSE_ADMIN_VERSION)/ketesa.tar.gz -o tmp/synapse-admin.tar.gz
	echo "$(SYNAPSE_ADMIN_CHECKSUM)  tmp/synapse-admin.tar.gz" | shasum -a 256 -c
