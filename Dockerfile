FROM matrixdotorg/synapse:v1.26.0

RUN apt-get update \
    && apt-get install -y \
    tini \
    ca-certificates \
    nginx \
    curl \
    jq \
    openssl \
    torsocks \
    iproute2 \
    wget

RUN wget -O /usr/local/bin/yq https://github.com/mikefarah/yq/releases/download/v4.6.3/yq_linux_arm \
    && chmod a+x /usr/local/bin/yq

ADD ./element-web/webapp /var/www
ADD ./cert.conf /etc/ssl/cert.conf
ADD ./torsocks.conf.template /etc/tor/torsocks.conf.template
ADD ./docker_entrypoint.sh /usr/local/bin/docker_entrypoint.sh
RUN chmod a+x /usr/local/bin/docker_entrypoint.sh
ADD ./renew.sh /usr/local/bin/renew.sh
RUN chmod a+x /usr/local/bin/renew.sh

WORKDIR /root

RUN mkdir /run/nginx

EXPOSE 8448 443 80

ENTRYPOINT ["/usr/local/bin/docker_entrypoint.sh"]