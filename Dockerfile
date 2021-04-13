FROM matrixdotorg/synapse:v1.26.0

RUN apt-get update \
    && apt-get install -y software-properties-common gnupg \
    && add-apt-repository ppa:rmescandon/yq \
    && apt-get update \
    && apt-get install -y \
        tini \
        ca-certificates \
        nginx \
        curl \
        jq \
        yq \
        openssl \
        torsocks

ADD ./element-web/webapp /var/www
ADD ./cert.conf /etc/ssl/cert.conf
ADD ./torsocks.conf.template /etc/torsocks.conf.template
ADD ./docker_entrypoint.sh /usr/local/bin/docker_entrypoint.sh
RUN chmod a+x /usr/local/bin/docker_entrypoint.sh
ADD ./renew.sh /usr/local/bin/renew.sh
RUN chmod a+x /usr/local/bin/renew.sh

WORKDIR /root

RUN mkdir /run/nginx

EXPOSE 8448 443

ENTRYPOINT ["/usr/local/bin/docker_entrypoint.sh"]