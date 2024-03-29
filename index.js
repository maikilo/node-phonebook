const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

morgan.token('req-body', function (req) {return JSON.stringify(req.body)})

const app = express()

app.use(cors())
app.use(morgan(':method :url :status :req[header] :res[header] :response-time ms :req-body'))
app.use(express.static('dist'))
app.use(express.json())


app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/info', (request, response, next) => {
  const requestTime = new Date().toTimeString()
  Person
    .find({})
    .then(() => Person.countDocuments())
    .then(count => {
      response.send('<p>Phonebook has info for ' + count + ' people</p> <br/> <p>' + requestTime + '</p>')
    })
    .catch(error => next(error))
})

app.get('/api/persons', (request, response, next) => {
  Person.
    find({})
    .then(persons => {
      response.json(persons)
    })
    .catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
  Person
    .findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person
    .findByIdAndDelete(request.params.id)
    .then(() => {
      console.log('Success')
      response.status(200).end()
    })
    .catch(error => next(error))

})

app.post('/api/persons/', (request, response, next) => {
  const name = request.body.name
  const number = request.body.number
  console.log('request', request)
  console.log('name', name, 'number', number)

  if (name === undefined) {
    console.log('Missing a name')
    response.status(400).end()
  }

  if (number === undefined) {
    console.log('Missing a number')
    response.status(400).end()
  }

  Person.findOneAndUpdate(
    { name: name },
    { name: name, number: number },
    { ReturnDocument: 'after', upsert: true, runValidators: true, context: 'query' }
  )
    .then(newPerson => {
      response.json(newPerson)
      console.log('Added or updated person')
    })
    .catch(error => next(error))

})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body
  console.log('name', body.name, 'number', body.number)

  if (body.name === undefined) {
    console.log('Missing a name')
    response.status(400).end()
  }

  if (body.number === undefined) {
    console.log('Missing a number')
    response.status(400).end()
  }

  const person = {
    name: body.name,
    number: body.number
  }

  Person.findByIdAndUpdate(
    request.params.id,
    person,
    { new: true, runValidators: true, context: 'query' }
  )
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))


})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
