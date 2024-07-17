require('mongoose')
// imports express
const express = require("express")
// Imports morgan, request logging middlewear
const morgan = require("morgan")
// Imports cors, middlewear for changing the Access-Control-Allow-Origin attribute of the response
const cors = require("cors")
// Imports the model from the mongoose module
const Person = require('./models/person')

// Assigns an express server to app variable
const app = express();

// For using the static resource loader
app.use(express.static('dist'))

// For using the json parser middlewear provided by express
app.use(express.json())

// For using the morgan middlewear with a pre-defined format
app.use(morgan('tiny'))

app.use(cors())

// Adds a new body token to morgan, with the stringified body of the request
// Not necessary for this use, but best practice
morgan.token('body', (req, _res) => {
    return JSON.stringify(req.body)
})

// For using morgan middlewear to log the json data in post requests
app.use(morgan((tokens, req, res) => {
    
    // Skips this request if the method is not POST
    if (req.method !== "POST"){
        return null
    }

    return [
        tokens.method(req,res),
        tokens.url(req,res),
        tokens.status(req,res),
        tokens['response-time'](req,res),
        tokens.body(req,res)
    ].join(' ')

}))

app.get('/info', (req, res, next) => {
    Person.countDocuments({})
        .then(count => {
            const infoTime = new Date();
            res.send(`<p>There are ${count} entries in the phonebook, at ${infoTime}</p>`)
        })
        .catch(error => next(error))
})

// Get mapping for api/persons using the mongoose model
app.get('/api/persons', (req, res, next) => {
    Person.find({})
        .then(people => {
            res.json(people)
        })
        .catch(error => next(error))
})

// Get mapping for a single person using mongoose model.findById()
app.get('/api/persons/:id', (req, res, next) =>{
    Person.findById(req.params.id).then(foundPerson => {
        return res.json(foundPerson)
    }).catch(err => next(err))
    
})

// Post mapping for a new contact with mongoose Person model.save()
app.post('/api/persons', (req, res, next) => {
    let newPerson = req.body

    const newPersonDocument = new Person({...newPerson})

    newPersonDocument.save()
        .then(addedPerson => {
            console.log("This person was added and mongoose Model method responded with this", addedPerson)
            res.json(addedPerson)
        })
        .catch(error => next(error))
})


// Mapping for updating a person document using mongoose
app.put('/api/persons/:id', (req, res, next) => {
    const body = req.body

    const personObject = {
        name: body.name,
        number: body.number
    }

    Person.findByIdAndUpdate(req.params.id, personObject, {new:true})
        .then(updatedPerson => {
            console.log("Person updated, database returned this updated:", updatedPerson)
            res.json(updatedPerson)
        }).catch(error => next(error))
})


// Delete mapping using mongoose.findByIdAndRemove()
// Calling the next() function passed into the middlwear with a parameter, results in the error-handling middlewear executing
app.delete('/api/persons/:id', (req, res, next) => {
    Person.findByIdAndDelete(req.params.id)
        .then(response => {
            res.status(204).end()
        })
        .catch(error => {
            next(error)
        })
})

// Error handling middlewear
app.use((error, request, response, next) => {
    console.log(error.name)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    }

    if (error.name === 'ValidationError') {
        console.log("VALERRIR CALLED")
        return response.status(400).send({error: error.message})
    }

    next(error)
})

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
    console.log(`Server listenening on port ${PORT}`)
})
