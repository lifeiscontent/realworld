#!/bin/sh
env
envsubst < /etc/proxysql.cnf.template > /etc/proxysql.cnf
echo ----------------------------------------------
cat /etc/proxysql.cnf
echo ----------------------------------------------
exec proxysql -f -c /etc/proxysql.cnf --idle-threads -D /var/lib/proxysql
