const _ = require('lodash')
const Cep = require('./cep')

function getCep(req, res, next) {
    /*console.log(req.params.codCep)*/
    Cep.find( 
        { codCep : req.params.codCep }, function(error, value) {
        if(error) {
          res.status(500).json({errors: [error]})
        } else {
          res.json(value)
        }
      })
  }

  module.exports = { getCep }