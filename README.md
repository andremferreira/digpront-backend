# Digital Prontuário (Backend)
 **Versão final** Implementado pela Api rest.

## Organização
A aplicação foi organizada em duas pastas: **api** e **config**.
-- TESTE ANDRE
### Config
Basicamente para a aplicação funcionar é necessário configurar:
- Servidor HTTP (Express)
- Rotas para a API REST (Express/Node Restful)
- Conexão com Banco de Dados (Mongoose/MongoDB).

### Api
API REST foi implementada utilizando um módulo node chamado [node-restful](https://github.com/baugarten/node-restful).

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

3. Inicializar a aplicação em **modo produção** (Fica a dica... :P).
```sh
$ npm run production (pm2 - alias: backend)
```

## Rotas Abertas

1. Retorna a sigla dos estados
http://localhost:3000/oapi/slgUf

2. Retorna dados do cep se existir 
http://localhost:3000/oapi/ceps/00000-000

3. Carrega uma imagem para utilização como avatar (Body[Key:avatar,Value:andre.png]) para pasta ./public/avatar
http://localhost:3000/oapi/sendImage

4. Retorna uma lista de profissões cadastradas
http://localhost:3000/oapi/profissoes
