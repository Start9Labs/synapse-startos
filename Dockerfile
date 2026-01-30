# syntax=docker/dockerfile:1
# Custom Dockerfile for Synapse — replaces ghcr.io/astral-sh/uv with pip
# for riscv64 compatibility. Based on upstream synapse/docker/Dockerfile.
#
# Changes from upstream:
# - Stage 0: Replace uv image with python-slim, use pip-installed poetry
# - Stage 1: Replace uv image with python, use pip instead of uv
# - Stage 2: Add riscv64 to runtime dependency architectures

ARG DEBIAN_VERSION=trixie
ARG PYTHON_VERSION=3.13
ARG POETRY_VERSION=2.1.1

###
### Stage 0: generate requirements.txt
###
### This stage is platform-agnostic, so we can use the build platform in case of cross-compilation.
###
FROM --platform=$BUILDPLATFORM docker.io/library/python:${PYTHON_VERSION}-slim-${DEBIAN_VERSION} AS requirements

WORKDIR /synapse

# Copy just what we need to run `poetry export`...
COPY pyproject.toml poetry.lock /synapse/

# If specified, we won't verify the hashes of dependencies.
# This is only needed if the hashes of dependencies cannot be checked for some
# reason, such as when a git repository is used directly as a dependency.
ARG TEST_ONLY_SKIP_DEP_HASH_VERIFICATION

# If specified, we won't use the Poetry lockfile.
# Instead, we'll just install what a regular `pip install` would from PyPI.
ARG TEST_ONLY_IGNORE_POETRY_LOCKFILE

# Export the dependencies, but only if we're actually going to use the Poetry lockfile.
# Otherwise, just create an empty requirements file so that the Dockerfile can
# proceed.
ARG POETRY_VERSION
RUN --mount=type=cache,target=/root/.cache/pip \
  if [ -z "$TEST_ONLY_IGNORE_POETRY_LOCKFILE" ]; then \
    pip install poetry==${POETRY_VERSION} poetry-plugin-export==1.9.0 && \
    poetry export --extras all -o /synapse/requirements.txt ${TEST_ONLY_SKIP_DEP_HASH_VERIFICATION:+--without-hashes}; \
  else \
    touch /synapse/requirements.txt; \
  fi

###
### Stage 1: builder
###
FROM docker.io/library/python:${PYTHON_VERSION}-${DEBIAN_VERSION} AS builder

# Install rust and ensure its in the PATH
ENV RUSTUP_HOME=/rust
ENV CARGO_HOME=/cargo
ENV PATH=/cargo/bin:/rust/bin:$PATH
RUN mkdir /rust /cargo

RUN curl -sSf https://sh.rustup.rs | sh -s -- -y --no-modify-path --default-toolchain stable --profile minimal

# arm64 builds consume a lot of memory if `CARGO_NET_GIT_FETCH_WITH_CLI` is not
# set to true, so we expose it as a build-arg.
ARG CARGO_NET_GIT_FETCH_WITH_CLI=false
ENV CARGO_NET_GIT_FETCH_WITH_CLI=$CARGO_NET_GIT_FETCH_WITH_CLI

# To speed up rebuilds, install all of the dependencies before we copy over
# the whole synapse project, so that this layer in the Docker cache can be
# used while you develop on the source
#
# This is aiming at installing the `[tool.poetry.depdendencies]` from pyproject.toml.
COPY --from=requirements /synapse/requirements.txt /synapse/
RUN --mount=type=cache,target=/root/.cache/pip \
  pip install --prefix="/install" --no-deps -r /synapse/requirements.txt

# Copy over the rest of the synapse source code.
COPY synapse /synapse/synapse/
COPY rust /synapse/rust/
# ... and what we need to `pip install`.
COPY pyproject.toml README.rst build_rust.py Cargo.toml Cargo.lock /synapse/

# Repeat of earlier build argument declaration, as this is a new build stage.
ARG TEST_ONLY_IGNORE_POETRY_LOCKFILE

# Install the synapse package itself.
# If we have populated requirements.txt, we don't install any dependencies
# as we should already have those from the previous `pip install` step.
RUN \
  --mount=type=cache,target=/root/.cache/pip \
  --mount=type=cache,target=/synapse/target,sharing=locked \
  --mount=type=cache,target=${CARGO_HOME}/registry,sharing=locked \
  if [ -z "$TEST_ONLY_IGNORE_POETRY_LOCKFILE" ]; then \
    pip install --prefix="/install" --no-deps /synapse[all]; \
  else \
    pip install --prefix="/install" /synapse[all]; \
  fi

###
### Stage 2: runtime dependencies download for ARM64, AMD64, and RISCV64
###
FROM --platform=$BUILDPLATFORM docker.io/library/debian:${DEBIAN_VERSION} AS runtime-deps

# Tell apt to keep downloaded package files, as we're using cache mounts.
RUN rm -f /etc/apt/apt.conf.d/docker-clean; echo 'Binary::apt::APT::Keep-Downloaded-Packages "true";' > /etc/apt/apt.conf.d/keep-cache

# Add all target architectures
RUN dpkg --add-architecture arm64
RUN dpkg --add-architecture amd64
RUN dpkg --add-architecture riscv64

# Fetch the runtime dependencies debs for all architectures
# We do that by building a recursive list of packages we need to download with `apt-cache depends`
# and then downloading them with `apt-get download`.
RUN \
  --mount=type=cache,target=/var/cache/apt,sharing=locked \
  --mount=type=cache,target=/var/lib/apt,sharing=locked \
  apt-get update -qq && \
  apt-cache depends --recurse --no-recommends --no-suggests --no-conflicts --no-breaks --no-replaces --no-enhances --no-pre-depends \
      curl \
      gosu \
      libjpeg62-turbo \
      libpq5 \
      libwebp7 \
      xmlsec1 \
      libjemalloc2 \
    | grep '^\w' > /tmp/pkg-list && \
  for arch in arm64 amd64 riscv64; do \
    mkdir -p /tmp/debs-${arch} && \
    chown _apt:root /tmp/debs-${arch} && \
    cd /tmp/debs-${arch} && \
    apt-get -o APT::Architecture="${arch}" download $(cat /tmp/pkg-list); \
  done

# Extract the debs for each architecture
RUN \
  for arch in arm64 amd64 riscv64; do \
    mkdir -p /install-${arch}/var/lib/dpkg/status.d/ && \
    for deb in /tmp/debs-${arch}/*.deb; do \
      package_name=$(dpkg-deb -I ${deb} | awk '/^ Package: .*$/ {print $2}'); \
      echo "Extracting: ${package_name}"; \
      dpkg --ctrl-tarfile $deb | tar -Ox ./control > /install-${arch}/var/lib/dpkg/status.d/${package_name}; \
      dpkg --extract $deb /install-${arch}; \
    done; \
  done


###
### Stage 3: runtime
###

FROM docker.io/library/python:${PYTHON_VERSION}-slim-${DEBIAN_VERSION}

ARG TARGETARCH

LABEL org.opencontainers.image.url='https://github.com/element-hq/synapse'
LABEL org.opencontainers.image.documentation='https://element-hq.github.io/synapse/latest/'
LABEL org.opencontainers.image.source='https://github.com/element-hq/synapse.git'
LABEL org.opencontainers.image.licenses='AGPL-3.0-or-later OR LicenseRef-Element-Commercial'

COPY --from=runtime-deps /install-${TARGETARCH}/etc /etc
COPY --from=runtime-deps /install-${TARGETARCH}/usr /usr
COPY --from=runtime-deps /install-${TARGETARCH}/var /var

# Copy the installed python packages from the builder stage.
#
# uv will generate a `.lock` file when installing packages, which we don't want
# to copy to the final image.
COPY --from=builder  --exclude=.lock /install /usr/local
COPY ./docker/start.py /start.py
COPY ./docker/conf /conf

EXPOSE 8008/tcp 8009/tcp 8448/tcp

ENTRYPOINT ["/start.py"]

HEALTHCHECK --start-period=5s --interval=15s --timeout=5s \
  CMD curl -fSs http://localhost:8008/health || exit 1
