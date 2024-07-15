const mongoose = require('mongoose')

if (process.argv.length < 3){
    console.log("Enter password to view phonebook entries")
    process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://lewisburgess:${password}@fsocluster.z2ocxgx.mongodb.net/phonebook?retryWrites=true&w=majority&appName=FSOcluster`

mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name:String,
    number:String,
})

const Person = mongoose.model('Person', personSchema)

const addEntry = () => {
    const person = new Person({
        name: process.argv[3],
        number: process.argv[4]
    })
    person.save().then(result => {
        console.log("Saved")
        mongoose.connection.close()
    }).catch(err => {
        console.log("Not saved")
        mongoose.connection.close()
    })
}

const logEntries = () => {
    Person.find({}).then(persons => {
        persons.forEach(person => console.log(person))
        mongoose.connection.close()
    })
}

switch(process.argv.length) {
    case 3:
        logEntries()
        break;
    case 5:
        addEntry()
        break;
    default:
        console.log('Usage: "node <filename> <password>" to view entries')
        console.log('Or: "node <filename> <password> <name> <number>" to add an entry')
        process.exit(1)
}



