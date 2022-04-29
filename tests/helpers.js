const supertest = require('supertest')
// const { app } = require('../index')
const app = require('../app')
const api = supertest(app)
const User = require('../models/User')

const initialNotes = [
  {
    content: 'Aprendiendo fullstack JS con midudev',
    important: true,
    date: new Date()
  },
  {
    content: 'Otra prueba',
    important: false,
    date: new Date()
  },
  {
    content: 'y va el tercero',
    important: true,
    date: new Date()
  }
]

const getAllContentFromNotes = async () => {
  const response = await api.get('/api/notes')
  return {
    contents: response.body.map(note => note.content),
    response
  }
}

const getUsers = async () => {
  const usersDB = await User.find({})
  return usersDB.map(user => user.toJSON())
}

module.exports = {
  api,
  initialNotes,
  getAllContentFromNotes,
  getUsers
}  