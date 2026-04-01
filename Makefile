ARCHES := x86 arm
# overrides to s9pk.mk must precede the include statement
include s9pk.mk

SYNAPSE_ADMIN_VERSION = v0.11.1-etke50
SYNAPSE_ADMIN_CHECKSUM = c2a6888db6e4ac2766f17be2bc703d284a7e5f6e8af1c1a7fda0af9ae44e06aa

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
	tar -xzvf tmp/synapse-admin.tar.gz -C assets

tmp/synapse-admin.tar.gz:
	mkdir -p tmp
	(cd tmp && curl --progress-bar -OL https://github.com/etkecc/synapse-admin/releases/download/$(SYNAPSE_ADMIN_VERSION)/synapse-admin.tar.gz)
	echo "$(SYNAPSE_ADMIN_CHECKSUM)  tmp/synapse-admin.tar.gz" | shasum -a 256 -c
