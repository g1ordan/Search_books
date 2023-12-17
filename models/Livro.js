const {mongoose} = require('../db')

const livroSchema = new mongoose.Schema({
    titulo: {
        type: String,
        required: true
    },
    autor: {
        type: String,
        required: true
    },
    isbn13: String,
    isbn10: String,
    img: String
})

const Livro = mongoose.model("Livro", livroSchema)

module.exports = Livro