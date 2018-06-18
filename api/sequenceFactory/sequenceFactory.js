const _ = require('lodash')
const restful = require('node-restful')
const mongoose = restful.mongoose

const sequenceFactorySchema = new mongoose.Schema({
  _id: { type: String, required: true, index: true, unique: true },
  seq: { type: Number, required: true, default: 0 }
})

sequenceFactorySchema.statics.findAndModify = function (query, sort, doc, options, callback, res, req) {
    return this.collection.findAndModify(query, sort, doc, options, callback, res, req)
}
