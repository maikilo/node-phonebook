const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

morgan.token('req-body', function (req, res) {return JSON.stringify(req.body)})

const app = express()
app.use(express.json())
app.use(express.static('dist'))
app.use(cors())
app.use(morgan(':method :url :status :req[header] :res[header] :response-time ms :req-body'))


let data = [
  { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/info', (request, response) => {
  const requestTime = new Date().toTimeString()
  Person.find({}).then(() => Person.countDocuments()).then(count => {
    response.send("<p>Phonebook has info for " + count + " people</p> <br/> <p>" + requestTime + "</p>")
  })
})

app.get('/api/persons', (request, response) => { 
  Person.
  find({}).
  then(persons => {
    response.json(persons)
  })
})

app.get('/api/persons/:id', (request, response) => {
  Person
  .findById(request.params.id)
  .then(person => {
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  })

})


app.delete('/api/persons/:id', (request, response) => {
  Person
  .findByIdAndDelete(request.params.id)
  .then(() => {
    console.log('Success')
    response.status(200).end()
  })
  
})

app.post('/api/persons/', (request, response) => {
  const id = Math.floor(Math.random() * 500000)
  const name = request.body.name
  const number = request.body.number
  console.log('request', request)
  console.log('name', name, 'number', number)

  if (name == null) {
    console.log('Missing a name')
    response.status(400).end()
  } else if (number == null) {
    console.log('Missing a number')
    response.status(400).end()
/*   } else if (data.find(person => person.name === name) != null) {
    console.log('This person exists already!')
    response.status(400).end() */
  } else {
    const person = new Person({
      name: name,
      number: number
    })
    person.save().then(result => {
      console.log('Success!')
      response.status(200).end()
    })
  
  }
  
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})