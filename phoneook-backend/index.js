
// imports express
const express = require("express");
// Assigns an express server to app variable
const app = express();

const persons = [
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
app.get('/', (req, res) => {
    console.log("called")
    res.send("<h1>Hw</h1>")
})

// Get mapping for api/persons
app.get('/api/persons', (req, res) => {
    console.log("persons called")
    res.json(persons)
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server listenening on port ${PORT}`)
})
