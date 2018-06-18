const restful = require('node-restful')
const mongoose = restful.mongoose
const ObjectId = mongoose.Schema.Types.ObjectId

const consultaSchema = new mongoose.Schema({
    queixa: { type: String, uppercase:true },
    anamnese: { type: String, uppercase:true },
    antecedente: { type: String, uppercase:true },
    medicacao: { type: String, uppercase:true },
    alergia: { type: String, uppercase:true },
    historicoFamiliar: { type: String, uppercase:true },
    exameFisico: { type: String, uppercase:true },
    exameCompl: { type: String, uppercase:true },
    conduta: { type: String, uppercase:true },
    receitaMedica: { type: String, uppercase:true },
    dataConsulta: { type: Date, default: Date.now }
  })

const cadastroPacienteSchema = new mongoose.Schema({
    nome: { type: String, required: [true, 'Informe o nome do paciente!'] , uppercase: true },
    sobrenome: { type: String, required: [true, 'Informe o sobrenome do paciente!'], uppercase: true },
    dt_nascimento: { type: Date, required: [ true, 'Informe a data de nascimento do paciente!' ]},
    endereco: { type: String,  uppercase: true },
    bairro: { type: String,  uppercase: true },
    cidade: { type: String,  uppercase: true },
    estado: { type: String, uppercase: true},
    profissao: { type: String, uppercase: true },
    email: { type: String,  lowercase: true },
    telefone: { type: String },
    indicacao: { type: String, uppercase: true },
    medicoId: { type: ObjectId, ref:'User', requered:true,  index:true },
    consultas: [consultaSchema]
})

module.exports = restful.model('CadastroPaciente', cadastroPacienteSchema)
