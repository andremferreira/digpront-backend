const restful = require('node-restful')
const mongoose = restful.mongoose

const creditSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Informe o atributo "Nome" do crédito.'] },
  value: { type: Number, min: 0, required: [true, 'Informe o valor do crédito!'] }
})

const debtSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Informe o atributo "Nome" do débito.'] },
  value: { type: Number, min: 0, required: [true, 'Informe o valor do débito!'] },
  status: { type: String, required: false, uppercase: true,
    enum: ['PAGO', 'PENDENTE', 'AGENDADO'] }
})

const billingCycleSchema = new mongoose.Schema({
  medicoId: { type: mongoose.Schema.Types.ObjectId, ref:'User', required: true, index: true },
  name: { type: String, required: [true, 'Informe o atributo "Nome" de seu crontrole.' ] },
  month: { type: Number, min: 1, max: 12, required: [true, 'Informe o atributo "Mês".' ] },
  year: { type: Number, min: 1970, max: 2100, required: [true, 'Informe o atributo "Ano".'] },
  credits: [creditSchema],
  debts: [debtSchema]
})

module.exports = restful.model('BillingCycle', billingCycleSchema)
