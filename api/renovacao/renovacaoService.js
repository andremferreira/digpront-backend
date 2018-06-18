const _ = require('lodash')
const Renovacao = require('./renovacao')
const ObjectId = require('mongoose').Types.ObjectId

Renovacao.methods(['get', 'post', 'put', 'delete'])
Renovacao.updateOptions({new: true, runValidators: true})
Renovacao.after('post', sendErrorsOrNext).after('put', sendErrorsOrNext)

Renovacao.route('count', function(req, res, next) {
  Renovacao.count(function(error, value) {
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

module.exports = Renovacao
