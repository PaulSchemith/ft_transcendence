FROM grafana/grafana:latest

WORKDIR /data

COPY ./conf/defaults.ini /etc/grafana/grafana.ini

COPY ./conf/datasources/prometheus.yaml /etc/grafana/provisioning/datasources/prometheus.yaml

COPY ./conf/dashboards /etc/grafana/provisioning/dashboards

CMD ["grafana-server", "--homepath=/usr/share/grafana", "--packaging=docker", "cfg:default.paths.data=/data"]