const _ = require('lodash')
const User = require('./user')
const ObjectId = require('mongoose').Types.ObjectId
 
  function getUserById(req, res, next) {
    User.find( 
        { _id : new ObjectId(req.params.id) }, function(error, resp) {
        if(error) {
          res.status(500).json({errors: [error]})
        } else {
          res.json(resp)
        }
      })
  }

  module.exports =  { getUserById }