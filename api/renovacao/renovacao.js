const restful = require('node-restful')
const mongoose = restful.mongoose
const ObjectId = mongoose.Schema.Types.ObjectId

const renovacaoSchema = new mongoose.Schema({
    medicoId: { type: ObjectId, ref:'User', requered:true },
    produtoId: { type: ObjectId, ref:'Produto', requered:true },
    status: { type: String, enum: ['PAGO', 'PENDENTE', 'CANCELADO'] },
    dataRegistro: { type: Date, default: Date.now },
    qtdDias: { type: Number, min: 30, max: 720 },
  })

  module.exports = restful.model('Renovacao', renovacaoSchema)
