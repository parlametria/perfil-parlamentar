Bem vindo ao Voz Ativa.

Informações antes de rodar o projeto:

Esse projeto, na versão do desenvolvedor, utiliza ferramentas como o Redux DevTools e o React Developer Tools. Dessa forma, você deve instalar essas duas ferramentas antes de executar o `npm start`, do contrário o projeto irá quebrar.

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
5. Troque o ```var config``` por ```const keys_dev``` e exporte.
