﻿const mongoose = require('mongoose')
//localhost
// module.exports = mongoose.connect('mongodb://localhost/digprontdb')
//producao local
module.exports = mongoose.connect('mongodb://admandre:Solution0864%40@50.30.43.155:27017/digprontdb?3t.connection.name=Server4You&3t.connectTimeout=10000&3t.uriVersion=2&3t.connectionMode=direct&readPreference=primary&3t.socketTimeout=0')
// Usando  producao externo
//module.exports = mongoose.connect('mongodb://admandre:Hidden21@naboo.mongodb.umbler.com:35382/digprontdb')
mongoose.Error.messages.general.required = "O atributo '{PATH}' é obrigatório."
mongoose.Error.messages.Number.min = "O '{VALUE}' informado é menor que o limite mínimo de '{MIN}'."
mongoose.Error.messages.Number.max = "O '{VALUE}' informado é maior que o limite máximo de '{MAX}'."
mongoose.Error.messages.String.enum = "'{VALUE}' não é válido para o atributo '{PATH}'."
mongoose.Error.messages.String.unique = "'{VALUE}' já foi cadastrado em '{PATH}'."
