require('dotenv').config()
const mongoose = require('mongoose')


const URL = process.env.MONGODB_URL
console.log(`connecting to ${URL}`)

mongoose.connect(URL).then(() => {
  console.log('Connected to mongoDB')
}).catch(() => {
  console.log('Could not connect to mongo database')
})

const personSchema = mongoose.Schema({

  name: {
    type: String,
    required: [true, 'Name is missing'],
    minLength: [3, 'Name \'{VALUE}\' is shorter than min length (3)']
  },
  number: {
    type: String,
    required: [true, 'Contact must have a number'],
    validate: {
      validator: (val) => {
        console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~')
        if (/^\d{2,3}-\d{5,}$/.test(val)){
          return val.length >= 9
        }
        return false
      },
      message: 'Phone number not in correct format'
    }
  }
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

