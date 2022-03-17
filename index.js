// const http = require('http')
const express = require('express')
const cors = require('cors')
const app = express()

app.use(cors())
app.use(express.json())
const logger = require('./loggerMiddleware')
app.use(logger)

let notes = [
    {
        "id": 1,
        "content": "prueba 1",
        "important": true
    },
    {
        "id": 2,
        "content": "prueba 2",
        "important": false
    },
    {
        "id": 4,
        "content": "prueba 4",
        "important": true
    }
]

// const app = http.createServer((request, response) => {
//     response.writeHead(200, { 'Content-Type': 'application/json' })
//     response.end(JSON.stringify(notes))
// })

app.get('/', (request, response) => {
    response.send('<h1>Hello World</h1>')
})

app.get('/api/notes', (request, response) => {
    response.json(notes)
})

app.get('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id)
    const note = notes.find(note => note.id === id)
    if (note) {
        response.json(note)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id)
    notes = notes.filter(note => note.id != id)
    response.status(204).end()
})

// no se recomienda pero por el momento usamos esta solicitud
const generateId = () => {
    const maxId = notes.length > 0
        ? Math.max(...notes.map(note => note.id))
        : 0
    return maxId + 1
}

app.post('/api/notes', (request, response) => {
    const note = request.body
    console.log(note)

    // Tenga en cuenta que llamar a return es crucial, 
    // porque de lo contrario el código se ejecutará hasta el final 
    // y la nota con formato incorrecto se guardará en la aplicación.
    if (!note || !note.content) {
        return response.status(400).json({
            error: 'note.content is missing'
        })
    }

    const newNote = {
        id: generateId(),
        content: note.content,
        important: typeof note.important != 'undefined' ? note.important : false,
        date: new Date().toISOString()
    }
    // notes = notes.concat(newNote)
    notes = [...notes, newNote]
    response.status(201).json(newNote)
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({
        error: 'unknownEndpoint'
    })
}
app.use(unknownEndpoint)

const PORT = 3001
// app.listen(PORT)
// console.log(`Server running on port ${PORT}`)
// porque es asincrono
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})


