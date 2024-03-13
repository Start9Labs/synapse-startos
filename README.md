<p align="center">
  <img src="icon.png" alt="Project Logo" width="21%">
</p>

# Synapse for StartOS

[Synapse](https://github.com/matrix-org/synapse) is a homeserver software for the Matrix protocol, enabling decentralized and federated communication across different Matrix servers to send messages and interact with each other seamlessly. This repository creates the `s9pk` package that is installed to run `Synapse` with integrated [`Admin UI`](https://github.com/Awesome-Technologies/synapse-admin) on [StartOS](https://github.com/Start9Labs/start-os/).

## Dependencies

Prior to building the `synapse` package, it's essential to configure your build environment for StartOS services. You can find instructions on how to set up the appropriate build environment in the [Developer Docs](https://docs.start9.com/latest/developer-docs/packaging).

- [docker](https://docs.docker.com/get-docker)
- [docker-buildx](https://docs.docker.com/buildx/working-with-buildx/)
- [deno](https://deno.land/)
- [make](https://www.gnu.org/software/make/)
- [start-sdk](https://github.com/Start9Labs/start-os/tree/sdk/core)
- [yq](https://mikefarah.gitbook.io/yq)

## Cloning

Clone the Synapse package repository locally.

```
git clone https://github.com/Start9Labs/synapse-startos.git
cd synapse-startos
```

## Building

To build the **Synapse** service as a universal package, run the following command:

```
make
```

Alternatively the package can be built for individual architectures by specifying the architecture as follows:

```
make x86
```

or

```
make arm
```

## Installing (on StartOS)

Before installation, define `host: https://server-name.local` in your `~/.embassy/config.yaml` config file then run the following commands to determine successful install:

> :information_source: Change server-name.local to your Start9 server address

```
start-cli auth login
#Enter your StartOS password
make install
```

**Tip:** You can also install the synapse.s9pk by sideloading it under the **StartOS > System > Sideload a Service** section.

## Verify Install

Go to your StartOS Services page, select **Synapse**, configure and start the service.

**Done!**
