// Las pruebas solo usan la aplicación express definida en el archivo app.js:
// const supertest = require('supertest')
const mongoose = require('mongoose')
// const { server } = require('../index')
// const app = require('../app') // chequear
const Note = require('../models/Note')
const {
  api,
  initialNotes,
  getAllContentFromNotes
} = require('./helpers')

beforeEach(async () => {
  await Note.deleteMany({})
  console.log('beforeEach')
  // const note1 = new Note(initialNotes[0])
  // await note1.save()
  // const note2 = new Note(initialNotes[1])
  // await note2.save()

  // initialNotes.forEach(async note => {
  //   const noteObject = new Note(note)
  //   noteObject.save()
  //   console.log('saved note')
  // })

  // parallel
  // const notesObjects = initialNotes.map(note => new Note(note))
  // const promises = notesObjects.map(note => note.save())
  // await Promise.all(promises)

  // sequential
  for (const note of initialNotes) {
    const noteObject = new Note(note)
    await noteObject.save()
  }
})

describe('GET all notes', () => {
  test('notes are returned as json', async () => {
    console.log('first test')
    await api
      .get('/api/notes')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('there are two notes', async () => {
    console.log(initialNotes)
    console.log({ api })
    const response = await api.get('/api/notes')
    expect(response.body).toHaveLength(initialNotes.length)
  })

  test('the first note is about midudev', async () => {
    // const response = await api.get('/api/notes')
    // const contents = response.body.map(note => note.content)  
    const { contents } = await getAllContentFromNotes()

    expect(contents).toContain('Aprendiendo fullstack JS con midudev')
  })
})

describe('Create a note', () => {

  test('is possible with a valid note', async () => {
    const newNote = {
      content: 'Proximamente async/await',
      important: true
    }

    await api
      .post('/api/notes')
      .send(newNote)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    // const response = await api.get('/api/notes')
    // const contents = response.body.map(note => note.content)

    const { contents, response } = await getAllContentFromNotes()

    console.log(contents)

    expect(response.body).toHaveLength(initialNotes.length + 1)
    expect(contents).toContain(newNote.content)
  })

  test('is not possible with an invalid note', async () => {
    const newNote = {
      important: true
    }

    await api
      .post('/api/notes')
      .send(newNote)
      .expect(400)

    // const response = await api.get('/api/notes')
    const { response } = await getAllContentFromNotes()

    expect(response.body).toHaveLength(initialNotes.length)
  })
})

describe('Delete a note', () => {
  test('a note can be deleted', async () => {
    const { response: firstResponse } = await getAllContentFromNotes()
    const { body: notes } = firstResponse
    const noteToDelete = notes[0]
  
    await api
      .delete(`/api/notes/${noteToDelete.id}`)
      .expect(204)
  
    const { contents, response: secondResponse } = await getAllContentFromNotes()
  
    expect(secondResponse.body).toHaveLength(initialNotes.length - 1)
    expect(contents).not.toContain(noteToDelete.content)
  
  })
  
  test('a note that do not exist can not be deleted', async () => {
    await api
      .delete('/api/notes/53cb6b9b4f4ddef1ad47f943')
      .expect(400)
  
    const { contents, response } = await getAllContentFromNotes()
  
    expect(response.body).toHaveLength(initialNotes.length)
  })
  
})

afterAll(() => {
  mongoose.connection.close()
})