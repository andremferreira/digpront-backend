const Cep = require('./cep')

Cep.methods(['get', 'post', 'put', 'delete'])
Cep.updateOptions({new: true, runValidators: true})
Cep.after('post', sendErrorsOrNext).after('put', sendErrorsOrNext)

Cep.route('count', function(req, res, next) {
    Cep.count(function(error, value) {
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
  
module.exports = Cep