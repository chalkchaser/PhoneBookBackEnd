require('dotenv').config()

const { request, response } = require('express')
const express = require('express')
const { use } = require('express/lib/application')
const morgan = require('morgan')
const cors = require('cors')

const app = express()

const Person = require('./models/person')

app.use(express.static('build'))
app.use(cors())
app.use(express.json())




morgan.token('test',function(request, response){
  return request.body
})

morgan.token('body', (req, res) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))





let persons = [
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

app.get('/api/persons', (request, response) =>
    Person.find({}).then(person =>
      response.json(person)
    )
    
)

app.get('/info', (request,response) => {
    response
    .send(`<div>Phonebook has info for ${persons.length} People</div>
    <br/>
    <div>${new Date()}</div>
    `)
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    }).catch(error => { 
      console.log("error has been caught with:", error.name)
      next(error)})
})

app.delete('/api/persons/:id', (request, response) => {
    Person.findByIdAndRemove(request.params.id)
    .then(result => response.status(204).end())
  
})

app.post('/api/persons', (request, response, next) =>{
    const body = request.body

    
      if (!body.name) {
        return response.status(400).json({ 
          error: 'name is missing' 
        })
      }

      if (!body.number) {
        return response.status(400).json({ 
          error: 'number is missing' 
        })
      }

      if (persons.some(person => person.name == body.name)) {
        return response.status(400).json({ 
          error: 'person is already in phonebook' 
        })
      }

    const person = new Person({
        name : body.name,
        number: body.number
    })
    person.save().then(savedPerson =>
      response.json(savedPerson)).catch(error => next())

  
})

app.put(('/api/persons/:id'),(request, response, next) =>{
  const body = request.body
  const person = {
      name: body.name,
      number: body.number
    }
    Person.findByIdAndUpdate(request.params.id, person, {new:true})
      .then(updatedPerson => {response.json(updatedPerson)})
        .catch(error => next(error))
        
  
})


function errorHandler(error, request, response, next) {
  console.error("errorhandler says errorname is:",error.name)

  if (error.name == 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } 

  next(error)
}

// this has to be the last loaded middleware.
app.use(errorHandler)




const PORT = process.env.PORT || 3001
app.listen(PORT, () =>{
    console.log(`Server running on ${PORT}`)
})