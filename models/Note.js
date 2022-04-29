// const { default: mongoose } = require('mongoose')
const { Schema, model } = require('mongoose')

const noteSchema = new Schema({
  content: String,
  date: String,
  important: Boolean,
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
})

noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Note = model('Note', noteSchema)

// const note = new Note({
//     content: 'Lee la documentación',
//     date: new Date(),
//     important: false
// })
// note.save().then(result => {
//     console.log('note saved')
//     mongoose.connection.close()
// })

module.exports = Note