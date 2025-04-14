FROM ghcr.io/etkecc/synapse-admin:v0.10.3-etke38 AS synapse-admin

FROM matrixdotorg/synapse:v1.128.0

ARG PLATFORM
ENV YQ_VER=v4.3.2

RUN pip install --prefix="/install" --no-warn-script-location pyyaml

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    tini \
    ca-certificates \
    nginx \
    curl \
    openssl \
    privoxy \
    iproute2 \
    sqlite3; \
    apt clean; \
    rm -rf \
    /config/* \
    /tmp/* \
    /var/lib/apt/lists/* \
    /var/tmp/*

RUN curl -skLo /usr/local/bin/yq https://github.com/mikefarah/yq/releases/download/${YQ_VER}/yq_linux_${PLATFORM} \
    && chmod a+x /usr/local/bin/yq

ADD ./www /var/www
COPY --from=synapse-admin /app /var/www/admin
ADD ./cert.conf /etc/ssl/cert.conf
ADD ./priv-config-forward-onion /root
ADD ./docker_entrypoint.sh /usr/local/bin/docker_entrypoint.sh
RUN chmod a+x /usr/local/bin/docker_entrypoint.sh
ADD ./check-federation.sh /usr/local/bin/check-federation.sh
RUN chmod a+x /usr/local/bin/check-federation.sh
ADD ./check-ui.sh /usr/local/bin/check-ui.sh
RUN chmod a+x /usr/local/bin/check-ui.sh
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
