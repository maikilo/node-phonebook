const express = require('express')
const app = express()

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
  console.log('request time', requestTime)
  const resp = "<p>Phonebook has info for 2 people</p> <br/> <p>" + requestTime + "</p>"
  console.log('request body', resp)
  response.send(resp)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})