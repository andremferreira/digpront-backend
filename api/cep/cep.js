const restful = require('node-restful')
const mongoose = restful.mongoose

const cepSchema = new mongoose.Schema({

    codCep: { type: String },
    dscUf: { type: String },
    slgUf: { type: String },
    dscMunicipio: { type: String },
    dscBairro: { type: String},
    dscLogradouro: { type: String }    
})

module.exports = restful.model('Cep', cepSchema)