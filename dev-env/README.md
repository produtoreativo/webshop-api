# Criação de imagem para ambiente dev

Criar rede para compartilhar o ambiente

```sh
docker network create magasiara
docker network ls
```

Executar o compose para DEV

```sh
docker compose -f docker-compose.dev.yml up -d
```