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
