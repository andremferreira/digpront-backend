const restful = require('node-restful')
const mongoose = restful.mongoose
const ObjectId = mongoose.Schema.Types.ObjectId

const filaSchema = new mongoose.Schema({
    dataFila: { type: Date, default: Date.now },
    index: { type: Number, require:[true, 'Informe a posição do paciente na fila de chegada!']},
    pacienteId: {type: ObjectId, ref:'CadastroPaciente', requered:true},
    medicoId: {type: ObjectId, ref:'User', requered:true},
    nome: { type: String, uppercase: true, require: [true, 'Informe o nome do paciente!'] , uppercase: true },
    sobrenome: { type: String, require: [true, 'Informe o sobrenome do paciente!'], uppercase: true },
    atendido: { type: Boolean, default: false },
  })

  module.exports = restful.model('Fila', filaSchema)
