// Importa o framework Express
const express = require('express');

// Cria um objeto Router do Express
// O Router permite organizar as rotas em arquivos separados
const router = express.Router();

// Exporta esse router para que ele possa ser usado em outros arquivos (ex: app.js)
module.exports = router;

// Importa o modelo "Tarefa"
// Esse modelo representa a estrutura dos dados no MongoDB
const modeloTarefa = require('../models/tarefa');


// Define uma rota do tipo POST no caminho '/post'
// Essa rota será chamada quando o cliente quiser criar uma nova tarefa
router.post('/post', async (req, res) => {

    // Cria um novo objeto baseado no modelo "Tarefa"
    // Os dados vêm do corpo da requisição (req.body), normalmente enviado em JSON
    const objetoTarefa = new modeloTarefa({
        descricao: req.body.descricao,           // Texto da tarefa
        statusRealizada: req.body.statusRealizada // Indica se foi realizada (true/false)
    })

    try {
        // Salva o objeto no banco de dados (MongoDB)
        // O "await" espera a operação terminar antes de continuar
        const tarefaSalva = await objetoTarefa.save();

        // Retorna status HTTP 200 (sucesso)
        // E envia como resposta o objeto salvo (já com ID gerado pelo banco)
        res.status(200).json(tarefaSalva)
    }
    catch (error) {
        // Se ocorrer algum erro (ex: validação, conexão, etc)
        // retorna status HTTP 400 (erro do cliente)
        // e envia a mensagem de erro em formato JSON
        res.status(400).json({ message: error.message })
    }
})

// Define uma rota do tipo GET no caminho '/getAll'
// Essa rota será chamada quando o cliente quiser buscar todas as tarefas
router.get('/getAll', async (req, res) => {

    try {
        // Busca todos os documentos da coleção "Tarefa" no MongoDB
        // O método find() sem parâmetros retorna todos os registros
        const resultados = await modeloTarefa.find();

        // Retorna os dados encontrados em formato JSON
        // Status padrão é 200 (sucesso)
        res.json(resultados)
    }
    catch (error) {
        // Se ocorrer algum erro (ex: problema no banco, conexão, etc)
        // retorna status HTTP 500 (erro interno do servidor)
        // e envia a mensagem de erro em formato JSON
        res.status(500).json({ message: error.message })
    }
})

// Define uma rota do tipo DELETE no caminho '/delete/:id'
// Essa rota será chamada quando o cliente quiser excluir uma tarefa específica
// O ":id" indica um parâmetro dinâmico na URL (ex: /delete/123)
router.delete('/delete/:id', async (req, res) => {

    try {
        // Usa o método findByIdAndDelete para buscar e remover o registro pelo ID
        // O ID vem dos parâmetros da requisição (req.params.id)
        const resultado = await modeloTarefa.findByIdAndDelete(req.params.id)

        // Retorna como resposta o objeto que foi removido do banco
        // Status padrão é 200 (sucesso)
        res.json(resultado)
    }
    catch (error) {
        // Se ocorrer algum erro (ex: ID inválido, problema no banco, etc)
        // retorna status HTTP 400 (erro do cliente)
        // e envia a mensagem de erro em formato JSON
        res.status(400).json({ message: error.message })
    }
})


// Define uma rota do tipo PATCH no caminho '/update/:id'
// Essa rota será chamada quando o cliente quiser atualizar parcialmente uma tarefa
// O ":id" indica qual tarefa será atualizada
router.patch('/update/:id', async (req, res) => {

    try {
        // Obtém o ID da tarefa a partir dos parâmetros da requisição
        const id = req.params.id;

        // Recebe os novos dados enviados no corpo da requisição (JSON)
        // Pode conter apenas os campos que serão atualizados
        const novaTarefa = req.body;

        // Define opções da atualização:
        // { new: true } faz com que o método retorne o objeto já atualizado
        const options = { new: true };

        // Atualiza o documento no banco usando o ID
        // Apenas os campos enviados em novaTarefa serão modificados
        const result = await modeloTarefa.findByIdAndUpdate(
            id, novaTarefa, options
        )

        // Retorna o objeto atualizado como resposta
        res.json(result)
    }
    catch (error) {
        // Se ocorrer algum erro (ex: ID inválido, erro de validação, etc)
        // retorna status HTTP 400 (erro do cliente)
        // e envia a mensagem de erro em formato JSON
        res.status(400).json({ message: error.message })
    }
})