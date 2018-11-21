# [Voz Ativa](http://vozativa.org)

# Requisitos

O projeto foi desenvolvido utilizando a arquitetura MERN (Mongo Express React/Redux e Node). Os requisitos para rodar a aplicação são:

```
  NodeJS >= 4.0
```

Opcionalmente, as seguintes ferramentas podem ser instaladas para facilitar o trabalho de desenvolvimento:

- [React Developer Tools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi)
- [Redux DevTools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi)
- [Robo Mongo](https://robomongo.org/)

# Desenvolvimento

## Conexão com o banco de dados

É necessária a configuração variável de ambiente `MONGODB_URI` para realizar a conexão,
por exemplo:

```
export MONGODB_URI=mongodb://localhost:27017/voz-ativa
```

## Conexão com os aplicativos do Google, Facebook e Twitter para login

É necessário exportar as seguintes variáveis de ambiente: `FACEBOOK_APP_ID`, `FACEBOOK_APP_SECRET`, `GOOGLE_APP_ID`, `GOOGLE_APP_SECRET`, `TWITTER_CONSUMER_KEY` e `TWITTER_CONSUMER_SECRET`, por exemplo:

```
export FACEBOOK_APP_ID="MeuAPPID"
```

Além disso, é necessário exportar a variável `SECRET_OR_KEY` para a geração do _token jwt_.

```
export SECRET_OR_KEY="SECRET"
```

## Instalando dependências:

```
npm install
npm run client-install
```

## Rodando o projeto:

Somente o servidor:

```
npm run server
```

Somente o cliente:

```
npm run client
```

Servidor e cliente:

```
npm run dev
```
