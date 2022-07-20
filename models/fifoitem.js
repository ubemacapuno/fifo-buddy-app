//Setup todo here instead of on server.js and call to it when needed:
const mongoose = require('mongoose')
//setup schema that we will be pushing to mongodb. We will wrap in an object and declare our keys and properties here:
const fifoBuddyItemSchema = new mongoose.Schema({
    item: {
        type: String,
        required: true
    },
    expirationDate: {
        type: Date,
        required: true
    },
    dateItemAdded: {
        type: Date,
        default: Date.now
    }
})
//export the schema to mongodb
module.exports = mongoose.model("FifoItem", fifoBuddyItemSchema,"items") //tasks is the collection we are referencing, otherwise a new one will be created by mongodb by default (ex: collection named 'test')
