require('dotenv').config()
const mongoose = require('mongoose')


const URL = process.env.MONGODB_URL
console.log(`connecting to ${URL}`)

mongoose.connect(URL).then(() => {
    console.log("Connected to mongoDB")
}).catch(err => {
    console.log("Could not connect to mongo database")
})

const personSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is missing"],
        minLength: [3, "Name {value} us shorter than min length (3)"]
    },
    number: String
})


// Configures the toJSON methods transform function
personSchema.set('toJSON', {
    transform: (document, result) => {
        result.id = result._id
        delete result._id
        delete result.__v
    }
})

module.exports = mongoose.model('Person', personSchema)

