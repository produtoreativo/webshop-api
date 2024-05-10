FROM node:20.12.1-alpine As development

WORKDIR /app
COPY --chown=node:node package*.json ./
RUN npm ci --silent --legacy-peer-deps
COPY --chown=node:node . .
USER node

FROM node:20.12.1-alpine As build

WORKDIR /app
COPY --chown=node:node package*.json ./
COPY --chown=node:node --from=development /app/node_modules ./node_modules
COPY --chown=node:node . .
RUN npm run build
ENV NODE_ENV production
RUN npm ci --silent --legacy-peer-deps  --only=production && npm cache clean --force
USER node

FROM node:20.12.1-alpine As production
RUN apk --no-cache add curl

COPY --chown=node:node --from=build /app/node_modules ./node_modules
COPY --chown=node:node --from=build /app/dist ./dist
CMD [ "node", "dist/main.js" ]