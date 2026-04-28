// Importa o framework Express, usado para criar o servidor web
const express = require('express');

// Cria a aplicação servidor
const app = express();

// Middleware global
// Ele será executado em todas as requisições recebidas pelo servidor
app.use((req, res, next) => {

    // Permite que qualquer origem acesse a API
    // Isso libera o CORS para todos os domínios
    res.setHeader("Access-Control-Allow-Origin", "*");

    // Define quais métodos HTTP podem ser usados nas requisições
    res.setHeader('Access-Control-Allow-Methods', 'HEAD, GET, POST, PATCH, DELETE');

    // Define quais cabeçalhos podem ser enviados pelo cliente
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );

    // Manda a execução continuar para o próximo middleware ou rota
    next();
});

// Middleware do Express que converte automaticamente o corpo da requisição em JSON
// Exemplo: se o cliente enviar {"nome":"Thiago"}, isso ficará disponível em req.body
app.use(express.json());

// Define a porta do servidor
// Primeiro tenta usar a variável de ambiente PORT
// Se ela não existir, usa a porta 3000
const PORT = process.env.PORT || 3000;

// Importa o arquivo de rotas localizado em "./routes/routes"
// Esse arquivo deve exportar um Router do Express (module.exports = router)
// Ou seja, aqui você está trazendo todas as rotas definidas naquele arquivo
const routes = require('./routes/routes');

// Registra as rotas no servidor principal (app)
// O prefixo '/api' será automaticamente adicionado a todas as rotas do router
// Exemplo:
// Se no router tiver: router.get('/tarefas')
// A rota final será: http://localhost:3000/api/tarefas
app.use('/api', routes);

// Inicia o servidor na porta definida
app.listen(PORT, () => {
    console.log(`Server Started at ${PORT}`);
});

// Obtendo os parâmetros passados pela linha de comando
// process.argv contém tudo que foi digitado ao executar o programa
// slice(2) ignora:
// [0] caminho do node
// [1] caminho do arquivo js
// e pega apenas os argumentos passados pelo usuário
var userArgs = process.argv.slice(2);

// Pega o primeiro argumento informado na linha de comando
// Aqui espera-se que seja a URL de conexão com o MongoDB

// Importa o Mongoose, biblioteca usada para conectar e modelar dados no MongoDB
var mongoose = require('mongoose');

// Faz a conexão com o MongoDB usando a URL recebida por argumento
const uri = "mongodb://admin:123456mu@ac-etwdcvg-shard-00-00.0njfmhm.mongodb.net:27017,ac-etwdcvg-shard-00-01.0njfmhm.mongodb.net:27017,ac-etwdcvg-shard-00-02.0njfmhm.mongodb.net:27017/?ssl=true&replicaSet=atlas-ouiwdh-shard-0&authSource=admin&appName=manoSeila";

mongoose.connect(uri)
// Define que o Mongoose vai usar as Promises nativas do JavaScript
mongoose.Promise = global.Promise;

// Obtém o objeto de conexão do Mongoose
const db = mongoose.connection;

// Evento disparado se ocorrer erro na conexão com o banco
db.on('error', (error) => {
    console.log(error);
});

// Evento disparado uma única vez quando a conexão for estabelecida com sucesso
db.once('connected', () => {
    console.log('Database Connected');
});