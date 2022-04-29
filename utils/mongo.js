const mongoose = require('mongoose')
require('dotenv').config()

const { MONGODB_URI } = require('./config')
// conexión a mongodb
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
})
  .then(() => {
    console.log('Database connected')
    //console.log(process.env.MONGODB_URI)
  }).catch(err => {
    console.error(err)
  })

process.on('uncaughtException', () => {
  mongoose.connection.disconnect()
})