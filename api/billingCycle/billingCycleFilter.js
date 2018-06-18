const _ = require('lodash')
const BillingCycleFilter = require('./billingCycle')
const ObjectId = require('mongoose').Types.ObjectId

function getCountByMedic(req, res, next) {
    // var ObjectId = require('mongoose').Types.ObjectId
    // console.log(req.params.medico)
    BillingCycleFilter.count({ medicoId: new ObjectId(req.params.medico) }, function(error, value) {
      if(error) {
        res.status(500).json({errors: [error]})
      } else {
        res.json(value)
      }
    })
  }
  
  function getListByMedic(req, res, next) {
    var ObjectId = require('mongoose').Types.ObjectId
    // console.log(req.params.medico)
    BillingCycleFilter.find( 
        { medicoId : new ObjectId(req.params.medico) }, function(error, value) {
        if(error) {
          res.status(500).json({errors: [error]})
        } else {
          res.json(value)
        }
      })
  }

  module.exports =  { getListByMedic  ,  getCountByMedic }