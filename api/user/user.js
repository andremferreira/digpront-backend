const restful = require('node-restful')
const mongoose = restful.mongoose
const limite = new Date(Date.now() + (30 * 24 * 60 * 60 * 1000));
const assistenteSchema = new mongoose.Schema({
    nomeAssist: { type: String, uppercase: true },
    sobrenomeAssist: { type: String, required: false, uppercase: true , trim: true },
    emailAssist: { type: String, lowercase: true},
    passAssist: { type: String, min: 6, max: 12 },
  })

const userSchema = new mongoose.Schema({
    nome: { type: String, required: true, uppercase: true },
    sobrenome: { type: String, required: false, uppercase: true , trim: true},
    email: { type: String, required: true , lowercase: true, unique: true },
    crm: { type: String, required: true, min: 3, max: 6 },
    telefone: { type: String, required: false, min: 10, max: 15 },
    celular: { type: String, required: true, min: 10, max: 15 },
    genero: { type: Boolean, required: false },
    endereco: { type: String, required: false },
    dataNascimento: { type: Date, required: true },
    /*
        Tipos de usuários:
                            1 - Admin
                            2 - Usuário comum
    */
    tipo: { type: Number, required: true, default: 2 },
    cep: { type: String, required: true },
    bairro: { type: String, required: false },
    cidade: { type: String, required: false },
    estado: { type: String, required: false },
    password: { type: String, min: 6, max: 12, required: true },
    // Assistem atrelado ao médico
    medicoId: { type: mongoose.Schema.Types.ObjectId, auto: true, requered:true,  index:true, unique:true },
    // default: seq.getNextSequenceByName("medicoid")
    validade: { type: Date, default: limite, required: true },
    assistente: [ assistenteSchema ],
    recoveryPass: { type: String },
    recoveryDt: { type: Date },
    recoveryStatus: { type: Boolean },
    formacaoAcademica: { type: String, required: false },
    posGraduacao: { type: String, required: false },
    cursoAprimoramento: { type: String, required: false },
    artigo: { type: String, required: false },
    avatarPath: { type: String, required: false },
    avisoVencimento: { type: String, required: false },
    paginaContato: { type: String, required: true , unique:true }, 
    tituloApresentacao: { type: String, required: false },

})

userSchema.statics.findAndModify = function (query, sort, doc, options, callback) {
    return this.collection.findAndModify(query, sort, doc, options, callback);
  };

module.exports = restful.model('User', userSchema)
