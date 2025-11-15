## Versão Atualizada

### O que muda nessa abordagem?

Pipeline de integração síncrona e assíncrona

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

## Versão para publicação no K8s

Executar o setup para criar um Registry no seu K8S

```sh
chmod +x setup-registry.sh 
./setup-registry.sh

# habilitar acesso de fora do k8s
kubectl port-forward -n registry pod/registry 5000:5000 >/tmp/registry-forward.log 2>&1 &
# Verificar o catalogo
curl -s http://127.0.0.1:5000/v2/_catalog 
```

Build da imagem

```sh
# export DD_API_KEY=
docker build -t webshop-api:1.1.3 .

docker run -it --rm -p 3000:3000 \
  -e MAGENTO_URL=http://localhost:8080 \
  -e ORDER_MGMT_API_URL=http://localhost:4010/order/group \
  -e DD_API_KEY=$DD_API_KEY \
  -e DD_AGENT_HOST=localhost \
  -e DD_TRACE_AGENT_PORT=8126 \
  -e DD_ENV=development \
  -e DD_SERVICE=webshop-api \
  -e DD_VERSION=1.0.0 \
  webshop-api:1.1.3

# para testar se está mandando logs e erros para o DD
curl -i -X POST "http://localhost:3000/group-buying" \          
  -H "Content-Type: application/json" \
  -d '{"userId":"trigger-500","items":[{"productId":"p1","qty":2}]}'
```

### Instalar o DD no K8s

  ```sh
# Adiciona o repo do DD
helm repo add datadog https://helm.datadoghq.com
helm repo update

# Cria namespace para facilitar o isolamento e controle
kubectl create namespace observability
kubectl create secret generic datadog-api-key \
  --from-literal api-key=$DD_API_KEY \
  -n observability
# Instala o agente no namespace
helm install datadog-agent -f datadog-values.yaml datadog/datadog -n observability

#datadog-values.yaml
#datadog:
# apiKeyExistingSecret: datadog-api-key
# clusterName: colima
# site: datadoghq.com

# verificar a secret
kubectl get secret datadog-api-key -n observability -o yaml
# Verifica o valor da secret
kubectl get secret datadog-api-key -n observability -o jsonpath='{.data.api-key}' | base64 --decode

# destroy caso necessario
helm uninstall datadog-agent -n observability
kubectl delete secret datadog-api-key -n observability
kubectl delete ns observability --ignore-not-found=true
```

### Instalar a App no K8S

```sh
kubectl create secret generic webshop-api-secrets \
  --from-literal=DD_API_KEY=$DD_API_KEY$ \
  --from-literal=DD_AGENT_HOST=localhost \
  --from-literal=DD_TRACE_AGENT_PORT=8126 \
  --from-literal=DD_ENV=development \
  --from-literal=DD_SERVICE=webshop-api \
  --from-literal=DD_VERSION=1.0.0

kubectl create configmap webshop-api-config \
  --from-literal=MAGENTO_URL=http://localhost:8080 \
  --from-literal=ORDER_MGMT_API_URL=http://localhost:4010/order/group


kubectl get secrets webshop-api-secrets -o yaml
kubectl get configmap webshop-api-config -o yaml


kubectl apply -f webshop-api-deployment.yaml
kubectl get pods
kubectl describe pod webshop-api-7f8dc7b498-tdl2n
```

Caso precise destruir tudo
```sh
kubectl delete deployment webshop-api
```

Caso preciso exportar a imagem para subir manualmente
```sh
docker save webshop-api:1.1.3 -o webshop-api_1.1.3.tar
```


## Aula 9: API Management

Executar a pipeline local

```sh
act workflow_dispatch -j publish-api \
  -P ubuntu-latest=node:22-bullseye \
  --container-architecture linux/amd64
```