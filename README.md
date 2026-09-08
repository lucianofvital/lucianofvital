# Web2App Project - LucianoFvital
Projeto preparado pelo VitalLab.

## Passos para Finalização:
1. Hospede os arquivos `manifest.json` e `sw.js` na raiz do seu site.
2. Link o manifest no HTML: `<link rel="manifest" href="/manifest.json">`
3. Coloque a pasta `icons/` na raiz.
4. Gere a chave de assinatura Android, pegue o SHA-256 e crie o arquivo `.well-known/assetlinks.json` no seu site.
5. Utilize a ferramenta CLI do Google **Bubblewrap** para compilar o APK:
   `npm i -g @GoogleChromeLabs/bubblewrap`
   `bubblewrap init --manifest=http://www.lucianofvital.com.br/manifest.json`
   `bubblewrap build`
