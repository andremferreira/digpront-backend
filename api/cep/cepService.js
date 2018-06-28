const Cep = require('./cep')

Cep.methods(['get', 'post', 'put', 'delete'])
Cep.updateOptions({ new: true, runValidators: true })

module.exports = Cep