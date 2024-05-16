FROM node:20.12.1 As development

RUN curl -LOs https://artifacts.elastic.co/downloads/beats/metricbeat/metricbeat-7.17.19-amd64.deb && dpkg -i metricbeat-7.17.19-amd64.deb && rm metricbeat-7.17.19-amd64.deb
COPY --chown=root:metricbeat elastic/metricbeat.yml /usr/share/metricbeat/metricbeat.yml

WORKDIR /app
COPY package*.json ./
RUN npm ci --silent --legacy-peer-deps
COPY . .

COPY elastic/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

FROM node:20.12.1 As build

WORKDIR /app
COPY package*.json ./
COPY --from=development /app/node_modules ./node_modules
COPY . .
RUN npm run build
ENV NODE_ENV production
RUN npm ci --silent --legacy-peer-deps  --only=production && npm cache clean --force

FROM node:20.12.1 As production

RUN curl -LOs https://artifacts.elastic.co/downloads/beats/metricbeat/metricbeat-7.17.19-amd64.deb && dpkg -i metricbeat-7.17.19-amd64.deb && rm metricbeat-7.17.19-amd64.deb
COPY --chown=root:metricbeat elastic/metricbeat.yml /usr/share/metricbeat/metricbeat.yml

WORKDIR /app
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist

CMD /entrypoint.sh && node dist/main.js