# [Voz Ativa](#)

# Requisitos

O projeto é majoritariamente _frontend_ e o _backend_ advém do firebase necessitando dos seguintes requisitos:

```
  NodeJS >= 4.0
```

Opcionalmente, as seguintes extensões podem ser instaladas para facilitar o trabalho de desenvolvimento:

- [React Developer Tools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi)

- [Redux DevTools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi)

O _frontend_ da aplicação é desenvolvido utilizando [React](https://reactjs.org/) e [Redux](https://redux.js.org/).

# Desenvolvimento

O banco de dados utilizado é o firebase, então antes de iniciar o desenvolvimento, crie uma [conta](https://firebase.google.com/?hl=pt-br) e inicialize um novo projeto. Você pode utilizar o script disponível no diretório `script` para povoar o banco de dados (Ainda a ser disponibilizado).

## Integrando o projeto com o firebase

Crie um arquivo `keys_dev.js` no diretório `client/src/config` e adicione sua variável de configuração no seguinte formato:

```
const keys_dev = {
    apiKey: "<API_KEY>",
    authDomain: "<PROJECT_ID>.firebaseapp.com",
    databaseURL: "https://<DATABASE_NAME>.firebaseio.com",
    storageBucket: "<BUCKET>.appspot.com",
    messagingSenderId: "<SENDER_ID>",
  }

export default keys_dev;
```

## Rodando o projeto:

```
cd client
npm install
npm start
```
