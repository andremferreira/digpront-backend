const Cep = require('./cep')

Cep.methods(['get', 'post'])
Cep.updateOptions({ new: true, runValidators: true })

module.exports = Cep