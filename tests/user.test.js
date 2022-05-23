const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const { api, getUsers } = require('./helpers')
// const { server } = require('../index')
const User = require('../models/User')

describe.only('creating a new user', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    console.log('beforeEach')
    const passwordHash = await bcrypt.hash('pswd', 10)
    const user = new User({
      username: 'root',
      passwordHash
    })
    await user.save()
  })

  test('works as expected creating a fresh username', async () => {
    const usersAtStart = await getUsers()
    console.log(usersAtStart)
    const newUser = {
      username: 'usertest',
      name: 'Test',
      password: 'nodoymas'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await getUsers()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usersnames = usersAtEnd.map(u => u.username)
    expect(usersnames).toContain(newUser.username)
  })

  test('creating fails with proper statuscode and message if username is already taken', async () => {
    const usersAtStart = await getUsers()
    console.log(usersAtStart)
    const newUser = {
      username: 'root',
      name: 'test usuario duplicado',
      password: 'otropswd'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.errors.username.message).toContain('`username` to be unique')
    const usersAtEnd = await getUsers()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  afterAll(() => {
    mongoose.connection.close()
  })
})
