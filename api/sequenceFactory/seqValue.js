const _ = require('lodash')
const SequenceFactory = require('./sequenceFactory')

// Mais uma função middleware
function getSequenceByName(req, res, next) {
    SequenceFactory.findOne(
        { _id: { $eq: req.params.name } },
        function (error, result) {
            if (error) {
                res.status(500).json({ errors: [error] })
            } else {
                res.json(_.defaults(result, {seq: 0}))
            }
        }).select('-_id seq')
}

function getNextSequenceByName(req, res, next) {
    SequenceFactory.findAndModify({ _id: req.params.name }, [], { $inc: { seq: 1 } }, {}, function (error, result) {
        if (error) {
            res.status(500).json({ errors: [error] })
        } else {
            SequenceFactory.findOne(
                { _id: { $eq: req.params.name } }, 
                function (error, result) {
                    if (error) {
                        res.status(500).json({ errors: [error] })
                    } else {
                        // res.json(result)
                        res.json(_.defaults(result, {seq: 0}))
                    }
                }).select('-_id seq')
        }
    })
}

module.exports = { getSequenceByName, getNextSequenceByName }
