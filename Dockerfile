# =========================
# Stage 1: Build
# =========================

FROM node:22-bullseye-slim AS build

WORKDIR /app

# Instalar dependências nativas necessárias (para build de libs)
RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

# Copiar manifestos primeiro (cache de dependências)
COPY package.json yarn.lock ./

# Instalar todas as dependências (incluindo devDependencies)
RUN yarn install --frozen-lockfile

# Copiar todo o código fonte e configs
COPY . .

# Substituir temporariamente o main.ts pelo main.with-dd.ts antes do build
# Isso permite que o "nest build" use o arquivo instrumentado
RUN cp src/main.with-dd.ts src/main.ts

# Executar build padrão (usa src/main.ts temporariamente sobrescrito)
RUN yarn build

# =========================
# Stage 2: Runtime
# =========================

FROM node:22-bullseye-slim AS runtime

WORKDIR /app

# Copiar apenas dependências essenciais
COPY package.json yarn.lock ./
RUN yarn install --production --frozen-lockfile && yarn cache clean

# Copiar apenas o resultado do build
COPY --from=build /app/dist ./dist

ENV NODE_ENV=production
ENV PORT=3000

# Porta padrão do NestJS
EXPOSE 3000

# Rodar a versão instrumentada
CMD ["node", "dist/main.js"]