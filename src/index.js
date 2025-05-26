const express = require('express')
const app = express()
var morgan = require('morgan')
app.use(express.json())
morgan.token('body', (req) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));
const cors = require('cors')
app.use(cors())

let notes = [
  { id: "1", content: "Sample note", important: true },
];
app.get('/', (request, response) => {
  response.send(`<h1>Hello World!</h1>`)
})
// toimi kun käynistetty npm run dev mukaan
app.get('/info', (request, response) => {
  response.send(`<h1>Phonebook has info for ${notes.length} people</h1>`)
})
app.get('/api/notes', (request, response) => {
  response.json(notes)
})
app.get('/api/notes/:id', (request, response) => {
  const id = request.params.id
  const note = notes.find(note => note.id === id)
  if (note) {
    response.json(note) // <-- send the note as JSON
  } else {
    response.status(404).end()
  }
})
//toimi DELETE http://localhost:3001/api/notes/2 HTTP/1.1 mukaan
app.delete('/api/notes/:id', (request, response) => {
  const id = request.params.id
  notes = notes.filter(note => note.id !== id)

  response.status(204).end()
})
//generates new id for a new note
const generateId = () => {
  //const maxId = notes.length > 0
  //  ? Math.max(...notes.map(n => Number(n.id)))
  //  : 0
  const newId=Math.floor(Math.random() * 1000000000);
  return String(newId)
}
//toimi POST http://localhost:3001/api/notes HTTP/1.1 mukaan
app.post('/api/notes', (request, response) => {
  const body = request.body
  if (!body.content) {
    return response.status(400).json({ 
      error: 'content missing' 
    })
  }

  const note = {
    content: body.content,
    important: body.important || false,
    id: generateId(),
  }

  notes = notes.concat(note)

  response.json(note)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
//tehtävä 3.1-3.8