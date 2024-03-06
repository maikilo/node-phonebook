const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()
app.use(express.json())
app.use(express.static('dist'))
app.use(cors())

morgan.token('req-body', function (req, res) {return JSON.stringify(req.body)})
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

app.get('/api/persons', (request, response) => {
  response.json(data)
})

app.get('/info', (request, response) => {
  const requestTime = new Date().toTimeString()
  const resp = "<p>Phonebook has info for " + data.length + " people</p> <br/> <p>" + requestTime + "</p>"
  response.send(resp)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = data.find(person => person.id === id)

  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
  
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = data.filter(person => person.id === id)

  console.log('Success')
  response.status(200).end()
  
})

app.post('/api/persons/', (request, response) => {
  const id = Math.floor(Math.random() * 500000)
  const body = request.body
  const name = body.name
  const number = body.number
  console.log('body', body)

  console.log('id', id, 'name', name, 'number', number)

  if (name == null) {
    console.log('Missing a name')
    response.status(400).end()
  } else if (number == null) {
    console.log('Missing a number')
    response.status(400).end()
  } else if (data.find(person => person.name === name) != null) {
    console.log('This person exists already!')
    response.status(400).end()
  } else {
    const newPerson = {"id": id, "name": name, "number": number}
    data.push(newPerson)
    console.log('Success!')
    response.status(200).end()
  }
  
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})