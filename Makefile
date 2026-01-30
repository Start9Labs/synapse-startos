SYNAPSE_ADMIN_VERSION = v0.11.1-etke50
SYNAPSE_ADMIN_CHECKSUM = c2a6888db6e4ac2766f17be2bc703d284a7e5f6e8af1c1a7fda0af9ae44e06aa

include s9pk.mk

# Add synapse-admin as additional prerequisite for s9pk targets
$(BASE_NAME).s9pk: assets/synapse-admin
$(BASE_NAME)_%.s9pk: assets/synapse-admin

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
