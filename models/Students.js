const mongoose = require('mongoose')
const studentsSchema = mongoose.Schema({
    name:String,
    phone:String,
    address:String,
    image:String
})
module.exports = mongoose.model('Students', studentsSchema)