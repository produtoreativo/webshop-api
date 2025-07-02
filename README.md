## Versão com o DD

### O que muda nessa abordagem?

O ideal é sempre 


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



