# [Voz Ativa](https://www.vozativa.org)

# Sobre o projeto

O projeto foi desenvolvido utilizando a arquitetura PEAN (Postgres Express Angular e Node). 

# Desenvolvimento

Instale o [docker](https://docs.docker.com/install/linux/docker-ce/ubuntu/#install-docker-ce) e o [docker-compose](https://docs.docker.com/compose/install/).

## Inicialização do banco de dados

No [repositório](https://github.com/analytics-ufcg/vozativa-dados) de dados do projeto siga as instruções do README para inicializar o banco de dados usando docker.

## Configuração das variáveis de ambiente

Faça uma cópia arquivo `variables.env.sample` para o arquivo `variables.env` e preencha com as chaves para as variáveis de ambiente. 

## Iniciando docker

Após a definição das variáveis e com o banco de dados executando via docker. Rode com o docker executando:

```
docker-compose up
```

Pronto, o desenvolvimento já pode ser iniciado!

A api estará disponível em: localhost:5000/api
O frontend estará disponível em: localhost:4200

Caso for preciso reconstruir as imagens (backend e frontend) basta fazer:

```
docker-compose up --build
```

**Limitação**: Alterações no arquivo package.json (do frontend ou do backend) exigem um rebuild (reconstrução) da imagem com o comando citado acima.

### Comandos úteis

Caso você queira parar os containers e remover os volumes execute:

```
docker-compose down --volumes
```

Para visualizar os containers rodando:

```
docker ps
```

Para executar comandos num shell dentro do container:

```
docker exec -it <container_id> sh
```

Para matar um container

```
docker kill <container_id>
```

# Desenvolvimento sem Docker

## Configuração das variáveis de ambiente

É necessário exportar as variáveis de ambiente para que o projeto possa ser executado. Essa é a lista de variáveis necessárias:

- SECRET_OR_KEY
- POSTGRESURI
- FACEBOOK_APP_ID
- FACEBOOK_APP_SECRET
- GOOGLE_APP_ID
- GOOGLE_APP_SECRET

Para exportar use, como exemplo, o comando abaixo (no terminal):

```
export SECRET_OR_KEY="umsupersegredo"
```

Obs: a variável POSTGRESURI deve ter o seguinte formato "postgres://<username>:<password>@localhost:5432/vozativa"

## Instalação de dependências

### Para o backend

```
npm install
```

### Para o frontend

```
npm run client-install
```

## Execução do projeto

### Para execução do backend

```
npm run server
```

### Para execução do frontend

```
npm run client
```

# Testes

Os testes são escritos usando [chai](https://www.chaijs.com) e rodam via [docker-compose](https://github.com/mochajs/mocha).

### Executar testes

```
npm test
```
