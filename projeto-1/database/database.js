const Sequelize = require("sequelize")
const connection = new Sequelize('guiadeperguntas','root','123456',{
    host: 'localhost',//onde está sendo rodado o mysql 
    dialect: 'mysql'//tipo de banco de dados
})

module.exports = connection