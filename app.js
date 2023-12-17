const express = require('express')
const request = require('request')
const app = express()
const path = require('path')
const methodOverride = require('method-override')
const Livro = require('./models/Livro')


app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({extended: true}))
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, 'public')))


app.get('/', (req, res) => {
    res.render('busca')
})

app.get('/livro/:id', async (req, res)=>{
    const {id} = req.params
    const livro = await Livro.findById(id)
    res.render('show', {livro})
})

app.get('/busca', (req, res) => {
    let {busca, tipo} = req.query
    let resposta = {}
    request(`https://www.googleapis.com/books/v1/volumes?q=${tipo}${busca}`, (error, response, body) => {
        if(!error && response.statusCode == 200){
            resposta = JSON.parse(body)
        }
        res.render('resultadoBusca', {resposta})
    })
})

app.get('/addFav/:titulo/:autor/:isbn13/:isbn10/:img', async (req, res) =>{
    const {titulo, autor, isbn13, isbn10, img} = req.params
    const novoLivro = new Livro({titulo, autor, isbn13, isbn10, img})
    await novoLivro.save()
    res.redirect('/meusLivros')
})

app.get('/meusLivros', async (req, res) =>{
    const livros = await Livro.find({})
    res.render('meusLivros', {livros})
})

app.delete('/livro/:id', async( req, res) =>{
    const {id} = req.params
    await Livro.findByIdAndDelete(id)
    res.redirect('/meusLivros')
})

app.listen(3000, () => console.log("Servidor ligado na porta 3000!"))