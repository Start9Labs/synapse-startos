# Wrapper for synapse

`Synapse` is a homeserver for the Matrix protocol

## Dependencies

- [docker](https://docs.docker.com/get-docker)
- [docker-buildx](https://docs.docker.com/buildx/working-with-buildx/)
- [yq](https://mikefarah.gitbook.io/yq)
- [deno](https://deno.land/)
- [make](https://www.gnu.org/software/make/)
- [embassy-sdk](https://github.com/Start9Labs/embassy-os/tree/master/backend)

## Build environment
Prepare your embassyOS build environment. In this example we are using Ubuntu 20.04.

1. Install docker
```
curl -fsSL https://get.docker.com -o- | bash
sudo usermod -aG docker "$USER"
exec sudo su -l $USER
```
2. Set buildx as the default builder
```
docker buildx install
docker buildx create --use
```
3. Enable cross-arch emulated builds in docker
```
docker run --privileged --rm linuxkit/binfmt:v0.8
```
4. Install yq
```
sudo snap install yq
```
5. Install deno
```
sudo snap install deno
```
6. Install essentials build packages
```
sudo apt-get install -y build-essential openssl libssl-dev libc6-dev clang libclang-dev ca-certificates
```
7. Install Rust
```
curl https://sh.rustup.rs -sSf | sh
# Choose nr 1 (default install)
source $HOME/.cargo/env
```
8. Build and install embassy-sdk
```
cd ~/ && git clone --recursive https://github.com/Start9Labs/embassy-os.git
cd embassy-os/backend/
./install-sdk.sh
embassy-sdk init
```
Now you are ready to build your Synapse service

## Cloning

Clone the Synapse wrapper locally. Note the submodule link to the original project. 

```
git clone https://github.com/Start9Labs/synapse-wrapper.git
cd synapse-wrapper
git submodule update --init --recursive
```

## Building

To build the Synapse service, run the following commands:

```
make
```

## Installing (on Embassy)

Run the following commands to determine successful install:
> :information_source: Change embassy-server-name.local to your Embassy address

```
embassy-cli auth login
#Enter your embassy password
embassy-cli --host https://embassy-server-name.local package install synapse.s9pk
```
**Tip:** You can also install the ghost.s9pk using **Sideload Service** under the **System > MANAGE** section.
## Verify Install

Go to your Embassy Services page, select **Synapse**, configure and start the service.

**Done!** 
