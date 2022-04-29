const notesRouter = require('express').Router()
const Note = require('../models/Note')

// app.get('/api/notes', (request, response) => {
//     Note.find({}).then(notes => {
//         response.json(notes)
//     })
// })

notesRouter.get('/', async (request, response) => {
  const notes = await Note.find({})
  response.json(notes)
})

// app.get('/api/notes', async (request, response) => {
//   const notes = await Note.find({})
//   response.json(notes)
// })

notesRouter.get('/:id', (request, response, next) => {
  // const id = Number(request.params.id)
  // const note = notes.find(note => note.id === id)
  const { id } = request.params
  Note.findById(id).then(note => {
    return note
      ? response.json(note)
      : response.status(404).end()
  }).catch(next)
})

notesRouter.put('/:id', (request, response, next) => {
  const { id } = request.params
  const note = request.body

  const newNoteInfo = {
    content: note.content,
    important: note.important
  }

  Note.findByIdAndUpdate(id, newNoteInfo, { new: true })
    .then(result => {
      response.json(result)
    }).catch(err => next(err))
})

// app.delete('/api/notes/:id', (request, response, next) => {
//     const { id } = request.params
//     // notes = notes.filter(note => note.id != id)
//     Note.findByIdAndRemove(id).then(note => {
//         response.status(204).end()
//     }).catch(error => next(error))
//     // response.status(204).end()
// })

notesRouter.delete('/:id', async (request, response, next) => {
  const { id } = request.params
  // notes = notes.filter(note => note.id != id)
  await Note.findByIdAndRemove(id)
  response.status(204).end()
})

// no se recomienda pero por el momento usamos esta solicitud
// const generateId = () => {
//     const maxId = notes.length > 0
//         ? Math.max(...notes.map(note => note.id))
//         : 0
//     return maxId + 1
// }

// app.post('/api/notes', (request, response) => {
//     const note = request.body
//     console.log(note)

//     // Tenga en cuenta que llamar a return es crucial, 
//     // porque de lo contrario el código se ejecutará hasta el final 
//     // y la nota con formato incorrecto se guardará en la aplicación.
//     if (!note || !note.content) {
//         return response.status(400).json({
//             error: 'note.content is missing'
//         })
//     }

//     const newNote = new Note({
//         content: note.content,
//         important: typeof note.important != 'undefined' ? note.important : false,
//         date: new Date().toISOString()
//     })

//     // Version con array hardcodeado
//     // const newNote = {
//     //     id: generateId(),
//     //     content: note.content,
//     //     important: typeof note.important != 'undefined' ? note.important : false,
//     //     date: new Date().toISOString()
//     // }
//     // notes = notes.concat(newNote)
//     // notes = [...notes, newNote]
//     // response.status(201).json(note)
//     newNote.save().then(savedNote => {
//         response.json(savedNote)
//     })
// })

notesRouter.post('/', async (request, response, next) => {
  const note = request.body
  console.log(note)

  if (!note || !note.content) {
    return response.status(400).json({
      error: 'note.content is missing'
    })
  }

  const newNote = new Note({
    content: note.content,
    important: typeof note.important != 'undefined' ? note.important : false,
    date: new Date().toISOString()
  })

  // newNote.save().then(savedNote => {
  //     response.json(savedNote)
  // })

  try {
    const savedNotes = await newNote.save()
    response.json(savedNotes)
  } catch (error) {
    next(error)
  }
})

module.exports = notesRouter