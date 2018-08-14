# [Voz Ativa](#)

# Requisitos

O projeto é desenvolvido em duas partes, _frontend_ e _backend_ necessitando dos seguintes requisitos:

```
  NodeJS >= 4.0
```

Opcionalmente, as seguintes extensões podem ser instaladas para facilitar o trabalho de desenvolvimento:

- [React Developer Tools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi)

- [Redux DevTools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi)

O _frontend_ da aplicação é desenvolvido utilizando [React](https://reactjs.org/) e [Redux](https://redux.js.org/). O _backend_ e banco de dados estão hospedados no [firebase](https://firebase.google.com/?hl=pt-br).

# Desenvolvimento

Para rodar o projeto:

```
cd client
npm install
npm start
```

Para desenvolvedores:

1. Client >> src >> config
2. New file: keys_dev.js
3. Vá ao firebase e pegue a variável de configuração
4. Adicione a variável no keys_dev.js
5. Troque o `var config` por `const keys_dev` e exporte.
