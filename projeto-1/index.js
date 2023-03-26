const express = require("express")
const connection = require("./database/database")
const app = express()
const Pergunta = require("./database/Pergunta")
const Resposta = require("./database/Resposta")

//Database
connection
    .authenticate()
    .then(() => {
        console.log("Conexão feita com o banco de dados.")
    })
    .catch(() => {
        console.log("Erro na conexão")
    })

//Estou dizendo para o express usar o ejs como view engine
app.set('view engine', 'ejs')
app.use(express.static('public'))

//Body parser
app.use(express.urlencoded({extended:false}))
app.use(express.json())

//Rotas
app.get("/", (req,res) => {
    Pergunta.findAll({ raw: true, order: [
        ['id','DESC']
    ]}).then(pergunta => {
        res.render("index",{
            pergunta: pergunta
        })
    })
})

app.get("/pergunta", (req,res) => {
    res.render("pergunta")
})

app.post("/salvarpergunta", (req,res) => {
    
    var titulo = req.body.titulo
    var descricao = req.body.descricao
    
    Pergunta.create({//método responsável por salvar a pergunta no banco de dados
        titulo:titulo,
        descricao:descricao
    }).then(() => {
        res.redirect("/")
    })
})

app.get("/perguntar/:id", (req,res) => {

    var id = req.params.id

    Pergunta.findOne({
        where: {id: id}
    }).then(pergunta => {
        if(pergunta != undefined){
            Resposta.findAll({
                where: {perguntaId: pergunta.id},
                order:[['id','DESC']]
            }).then(respostas => {
                res.render("perguntar", {
                    pergunta: pergunta,
                    respostas: respostas
                })
            })
        }
        else{
            res.redirect("/")
        }
    })
})

app.post("/responder", (req,res) => {
    var corpo = req.body.corpo
    var perguntaId = req.body.perguntaId

    Resposta.create({
        corpo: corpo,
        perguntaId: perguntaId
    }).then(() => {
        res.redirect("/perguntar/"+perguntaId)
    })
})

//Criado o servidor local
app.listen(9000,() => {
    console.log("Servidor funcionando!")
})