# Curso de Frames Web (Backend)
 **Versão final** Implementado a API REST utilizada pelas aplicações frontend.

## Organização
A aplicação foi organizada em duas pastas: **api** e **config**.

### Config
Basicamente para a aplicação funcionar é necessário configurar:
- Servidor HTTP (Express)
- Rotas para a API REST (Express/Node Restful)
- Conexão com Banco de Dados (Mongoose/MongoDB).

### Api
API REST foi implementada utilizando um módulo node chamado [node-restful](https://github.com/baugarten/node-restful).

## Api de envio de e-mail NodeMailer
api/contato/contatoService.js

## Configuração
1. Instalar os módulos do node utilizando o **npm**.
```sh
$ cd /app/backend
$ npm update
```

2. Inicializar a aplicação em **modo desenvolvimento**.
```sh
$ npm run dev
```

3. Inicializar a aplicação em **modo produção - PM2**.
```sh
$ npm run production
```
