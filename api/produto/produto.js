const restful = require('node-restful')
const mongoose = restful.mongoose
const ObjectId = mongoose.Schema.Types.ObjectId

const produtoSchema = new mongoose.Schema({
    nome: { type: String },
    descricao: { type: String },
    qtdDias: { type: Number, min: 30, max: 720 },
    valor: { type: Number },
    imgLink:{ type: String },
  })

  module.exports = restful.model('Produto', produtoSchema)
