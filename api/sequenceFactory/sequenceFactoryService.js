const _ = require('lodash')
const SequenceFactory = require('./sequenceFactory')

SequenceFactory.findAndModify = function (query, sort, doc, options, callback, res, req) {
  return this.collection.findAndModify(query, sort, doc, options, callback, res, req)
}

SequenceFactory.methods(['get', 'post', 'put', 'delete'])
SequenceFactory.updateOptions({new: true, runValidators: true})

SequenceFactory.after('post', sendErrorsOrNext).after('put',  sendErrorsOrNext)

function sendErrorsOrNext(req, res, next) {
  const bundle = res.locals.bundle

  if(bundle.errors) {
    var errors = parseErrors(bundle.errors)
    res.status(500).json({errors})
  } else {
    next()
  }
}

function getSeqByMedic(req, res, medico, next ) {
  SequenceFactory.find(
     { _id : { $eq: medico }}, function(error, value) {
     if(error) {
       res.status(500).json({errors: [error]})
     } else {
       //console.log(res.json(value))
       res.json(_.defaults(result[0], {value:0}))
     }
   })
}


module.exports = SequenceFactory
