## Versão Atualizada

### O que muda nessa abordagem?

O ideal é sempre 

### Executar o Sonar localmente

```sh

npx sonar-scanner \
  -Dsonar.projectKey=webshop-api \
  -Dsonar.sources=. \
  -Dsonar.host.url=http://localhost:9000 \
  -Dsonar.token=sqp_08314586a0d7555d1dcded916b38f91401c2d7ca \
  -X
```

### Executar a pipeline do Github Actions local

Estratégia para executar local as validações do [Workflow Validate](./.github/workflows/validate.yml) com separação de responsabilidades no CI/CD.

```sh
act workflow_dispatch -j validate \
  -P ubuntu-latest=node:22-bullseye \
  --container-architecture linux/amd64 \
  -s SONAR_TOKEN=sqp_08314586a0d7555d1dcded916b38f91401c2d7ca
```



## Configuração do DataDog

Crie um arquivo .env com o conteúdo

```sh
MAGENTO_URL=http://localhost:8080
DD_API_KEY_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxxxx
DD_API_KEY=xxxxxxxxccxxxxxxxxxxxxx
```

Na sequencia verifique se o Docker está pegando corretamente as variáveis
```sh
docker compose config
```

Execute o Docker compose para subir o agente

```sh
docker compose up -d
```



