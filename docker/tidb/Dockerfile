FROM rockylinux:9.3.20231119

ARG TIDB_VERSION=v7.5.0
VOLUME /tidb-data

RUN dnf -y update && dnf -y install glibc-langpack-ja procps-ng psmisc \
  && ln -sf /usr/share/zoneinfo/Asia/Tokyo /etc/localtime \
  && curl --proto '=https' --tlsv1.2 -sSf https://tiup-mirrors.pingcap.com/install.sh | sh \
  && /root/.tiup/bin/tiup install pd:${TIDB_VERSION} tidb:${TIDB_VERSION} tiflash:${TIDB_VERSION} tikv:${TIDB_VERSION} prometheus:${TIDB_VERSION} \
  && mkdir -p /root/.tiup/data \
  && ln -sf /tidb-data /root/.tiup/data/devenv

ENV PATH=/root/.tiup/bin:$PATH \
    LANG="ja_JP UTF8" \
    LANGUAGE="ja_JP:ja" \
    LC_ALL="ja_JP.UTF8" \
    TZ="Asia/Tokyo"

EXPOSE 2379 3000 4000 9090 10080

VOLUME ["/root/.tiup/data"]
