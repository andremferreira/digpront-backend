const _ = require('lodash')
const Profissao = require('./profissao')

function getProfissoes(req, res, next) {

Profissao.aggregate(
    { 
        "$group" : {
            "_id" : {
                "dscProfissao" : "$dscProfissao"
            }
        }
    }, 
    { 
        "$project" : {
            "_id" : 0, 
            "dscProf" : "$_id.dscProfissao"
        }
    }
 , function (error, value) {
    if (error) {
      res.status(500).json({
        errors: [error]
      })
    } else {
      res.json(value)
    }
  })
}

module.exports = {
    getProfissoes
}