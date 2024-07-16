
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

let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

// Get mapping for api/persons using the mongoose model
app.get('/api/persons', (req, res) => {
    Person.find({}).then(people => {
        console.log(people)
        res.json(people)
    })
})

// Get mapping for a single person using mongoose model.findById()
app.get('/api/persons/:id', (req, res) =>{
    Person.findById(req.params.id).then(foundPerson => {
        return res.json(foundPerson)
    }).catch(err => res.status(404).end())
    
})

// Post mapping for a new contact with mongoose Person model.save()
app.post('/api/persons', (req, res) => {
    let newPerson = req.body
    // For checking there is a name field
    if (!newPerson.name){
        return res.status(400).json({
            error: "name missing"
        })
    }
    // For checking if there is a number 
    if (!newPerson.number){
        return res.status(400).json({
            error: "number missing"
        })
    }
    // For ensuring that the name is not already in the phonebook
    if (persons.some(person => person.name === newPerson.name)){
        return res.status(400).json({
            error: "name must be unique"
        })
    }

    console.log("Adding new person from request body", newPerson)

    const newPersonDocument = new Person({...newPerson})

    console.log("new person is now a mongoose document constucted using the model", newPersonDocument)

    newPersonDocument.save().then(addedPerson => {
        console.log("This person was added and mongoose Model method responded with this", addedPerson)
        res.json(addedPerson)
    })
})

// Get mapping for info
app.get('/info', (req, res) => {
    const peopleCount = persons.length;
    const requestTime = new Date();
    res.send(`<p>Phonebook has info for ${peopleCount} people</p><p>${requestTime}</p>`)
})




// Delete mapping for a single person object based on id parameter
app.delete('/api/persons/:id', (req, res) => {
    const personId = req.params.id
    persons = persons.filter(person => person.id !== personId)
    res.status(204).end()
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server listenening on port ${PORT}`)
})
