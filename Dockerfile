#FROM awesometechnologies/synapse-admin:0.8.7 as synapse-admin
FROM node:lts-alpine as builder

ARG REACT_APP_SERVER
RUN apk add --no-cache wget
RUN wget https://github.com/Awesome-Technologies/synapse-admin/archive/refs/tags/0.8.7.tar.gz \
    && tar -xzvf 0.8.7.tar.gz \
    && mv synapse-admin-0.8.7 /src
WORKDIR /src

RUN yarn --network-timeout=300000 install
RUN REACT_APP_SERVER=http://synapse.onion yarn build

FROM matrixdotorg/synapse:v1.75.0

ARG PLATFORM
ENV YQ_VER v4.3.2

RUN pip install --prefix="/install" --no-warn-script-location pyyaml

RUN apt-get update && \
    apt-get install -y \
    tini \
    ca-certificates \
    nginx \
    curl \
    jq \
    openssl \
    privoxy \
    iproute2 \
    wget \
    sqlite3; \
    apt clean; \
    rm -rf \
    /config/* \
    /tmp/* \
    /var/lib/apt/lists/* \
    /var/tmp/*

RUN wget -O /usr/local/bin/yq https://github.com/mikefarah/yq/releases/download/${YQ_VER}/yq_linux_${PLATFORM} \
    && chmod a+x /usr/local/bin/yq

ADD ./www /var/www
COPY --from=builder /src/build /var/www
ADD ./cert.conf /etc/ssl/cert.conf
ADD ./docker_entrypoint.sh /usr/local/bin/docker_entrypoint.sh
RUN chmod a+x /usr/local/bin/docker_entrypoint.sh
ADD ./check-federation.sh /usr/local/bin/check-federation.sh
RUN chmod a+x /usr/local/bin/check-federation.sh
ADD ./user-signups-off.sh /usr/local/bin/user-signups-off.sh
RUN chmod a+x /usr/local/bin/user-signups-off.sh
ADD ./configurator.py /configurator.py
RUN chmod a+x /configurator.py
RUN sed -i 's#timeout=10000#timeout=20000#g' /usr/local/lib/python3*/site-packages/synapse/crypto/keyring.py
RUN sed -i 's#timeout=10000#timeout=20000#g' /usr/local/lib/python3*/site-packages/synapse/federation/transport/client.py
RUN sed -i 's#timeout=10000#timeout=20000#g' /usr/local/lib/python3*/site-packages/synapse/federation/federation_client.py

WORKDIR /data

RUN mkdir /run/nginx

EXPOSE 8448 443 80
