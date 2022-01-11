const { request, response } = require('express')
const express = require('express')
const { use } = require('express/lib/application')
const morgan = require('morgan')
const cors = require('cors')

const app = express()

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
    response.json(persons)
)

app.get('/info', (request,response) => {
    response
    .send(`<div>Phonebook has info for ${persons.length} People</div>
    <br/>
    <div>${new Date()}</div>
    `)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    if(person){
        response.json(person)
    }else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(persons => persons.id !== id)

    response.status(204).end()
})

app.post('/api/persons', (request, response) =>{
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

    const person = {
        id: Math.round(Math.random() * 10000), 
        name : body.name,
        number: body.number

    }


    persons = persons.concat(person)
    response.json(person)

})

const PORT = process.env.PORT || 3001
app.listen(PORT, () =>{
    console.log(`Server running on ${PORT}`)
})