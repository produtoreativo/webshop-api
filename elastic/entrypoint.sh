#!/bin/sh

metricbeat modules enable system
chmod go-w /etc/metricbeat/metricbeat.yml
metricbeat run -E output.elasticsearch.hosts=elasticsearch:9200 setup.kibana.host=kibana:5601 --strict.perms=false&