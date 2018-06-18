const _ = require('lodash')
const Fila = require('./fila')
const ObjectId = require('mongoose').Types.ObjectId

Fila.methods(['get', 'post', 'put', 'delete'])
Fila.updateOptions({new: true, runValidators: true})
Fila.after('post', sendErrorsOrNext).after('put', sendErrorsOrNext)

Fila.route('count', function(req, res, next) {
  Fila.count(function(error, value) {
    if(error) {
      res.status(500).json({errors: [error]})
    } else {
      res.json({value})
    }
  })
})

function sendErrorsOrNext(req, res, next) {
  const bundle = res.locals.bundle

  if(bundle.errors) {
    var errors = parseErrors(bundle.errors)
    res.status(500).json({errors})
  } else {
    next()
  }
}

function parseErrors(nodeRestfulErrors) {
  const errors = []
  _.forIn(nodeRestfulErrors, error => errors.push(error.message))
  return errors
}

module.exports = Fila
