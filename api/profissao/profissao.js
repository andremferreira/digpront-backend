const restful = require('node-restful')
const mongoose = restful.mongoose

const profSchema = new mongoose.Schema({
    dscProfissao: { type: String }
  })

module.exports = restful.model('Prof', profSchema)