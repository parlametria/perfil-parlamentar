# Gerenciando ícones

Os ícones utilizados neste aplicativo são originais ou providos por pacotes gratuitos. Os arquivos SVGs originais precisam ser transformados em arquivos de fonte antes de serem usados.

Para isso, utilizamos a ferramenta [Iconmoon](https://icomoon.io/app/).

## Carregando e modificando o pacote de ícones

Na ferramenta [Iconmoon](https://icomoon.io/app/), siga os passos...

```
*Menu principal* > Manage projects > Import project
```

...e escolha o arquivo `docs/icons.json`. Isso irá carregar todos os ícones para a ferramenta. Faça as alterações necessárias adicionando, editando ou removendo ícones.

## Atualizando pacote de ícones na aplicação

Após as alterações, é preciso substituir o arquivo de fonte do projeto pelo novo gerado pelo [Iconmoon](https://icomoon.io/app/). Faça o download do arquivo ZIP contendo a fonte indo em `Generate font` e em seguida `Download` e faça as seguintes substituições no projeto:

```
No arquivo ZIP:       No projeto:
fonts/icomoon.eot     client/src/assets/fonts/icomoon.eot
fonts/icomoon.svg     client/src/assets/fonts/icomoon.svg
fonts/icomoon.ttf     client/src/assets/fonts/icomoon.ttf
fonts/icomoon.woff    client/src/assets/fonts/icomoon.woff
style.css             client/src/assets/styles/icons.scss
```

No arquivo `icons.scss`, substituir o caminho relativo para os arquivos de fonte de acordo com o caminho do projeto. Ex.:

```
No arquivo ZIP:                         No projeto:
src:  url('fonts/icomoon.eot?k15p2l')   src:  url('assets/fonts/icomoon.eot?k15p2l')
```