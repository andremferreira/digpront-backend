const _ = require('lodash')
const Cep = require('./cep')

function getCep(req, res, next) {

  Cep.find({
    codCep: req.params.codCep
  }, function (error, value) {
    if (error) {
      res.status(500).json({
        errors: [error]
      })
    } else {
      res.json(value)
    }
  })
}

function getSlgUf(req, res, next) {

  Cep.aggregate(
    [
      { 
          "$match" : {
              "slgUf" : {
                  "$ne" : null
              }
          }
      }, 
      { 
          "$group" : {
              "_id" : {
                  "slgUf" : "$slgUf"
              }
          }
      }, 
      { 
          "$project" : {
              "_id" : 0, 
              "slgUf" : "$_id.slgUf"
          }
      }
  ],
    function (error, value) {
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
  getCep,
  getSlgUf
}