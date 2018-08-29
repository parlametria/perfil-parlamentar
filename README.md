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

Antes de iniciar o projeto é necessário integrar o MongoDB e instalar as dependências.

## Integrando o projeto com o MongoDB

Crie um arquivo `keys_dev.js` no diretório `config` e adicione sua variável de configuração no seguinte formato:

```
module.exports = {
  mongoURI: "ENDERECO_MONGO"
};
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
