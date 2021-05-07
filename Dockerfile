FROM matrixdotorg/synapse:v1.32.2

RUN apt-get update \
    && apt-get install -y \
    tini \
    ca-certificates \
    nginx \
    curl \
    jq \
    openssl \
    privoxy \
    iproute2 \
    wget

# RUN wget -O /usr/local/bin/yq https://github.com/mikefarah/yq/releases/download/v4.6.3/yq_linux_arm \
#     && chmod a+x /usr/local/bin/yq

RUN pip install --prefix="/install" --no-warn-script-location pyyaml

ADD ./element-web/webapp /var/www
ADD ./cert.conf /etc/ssl/cert.conf
ADD ./priv-config /etc/privoxy/config
ADD ./docker_entrypoint.sh /usr/local/bin/docker_entrypoint.sh
RUN chmod a+x /usr/local/bin/docker_entrypoint.sh
ADD ./configurator.py /configurator.py
RUN chmod a+x /configurator.py
ADD ./renew.sh /usr/local/bin/renew.sh
RUN chmod a+x /usr/local/bin/renew.sh

WORKDIR /root

RUN mkdir /run/nginx

EXPOSE 8448 443 80

ENTRYPOINT ["/usr/local/bin/docker_entrypoint.sh"]