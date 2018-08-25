const Prof = require('./profissao')

Prof.methods(['get', 'post', 'put', 'delete'])
Prof.updateOptions({new: true, runValidators: true})
Prof.after('post', sendErrorsOrNext).after('put', sendErrorsOrNext)

console.log('passou aqui')
Prof.route('count', function(req, res, next) {
    Prof.count(function(error, value) {
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
  
module.exports = Prof