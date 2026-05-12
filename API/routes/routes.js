console.log("🔥 ROUTES CARREGOU");
const express = require('express');
const router = express.Router();

// IMPORT DO MODEL DE TAREFAS
const modeloTarefa = require('../models/tarefa');

// ---------------- AUTENTICAÇÃO JWT ----------------
const userModel = require('../models/user');
var jwt = require('jsonwebtoken');

// Endpoint de login — busca usuário no banco e compara senha
router.post('/login', async (req, res) => {
    try {
        const data = await userModel.findOne({ 'nome': req.body.nome });

        if (data != null && data.senha === req.body.senha) {
            const token = jwt.sign({ id: req.body.nome }, 'segredo', { expiresIn: 300 });
            return res.json({ auth: true, token: token });
        }

        res.status(500).json({ message: 'Login invalido!' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Middleware que verifica o token JWT no header "id-token"
function verificaJWT(req, res, next) {
    const token = req.headers['id-token'];
    if (!token) return res.status(401).json({ auth: false, message: 'Token nao fornecido' });

    jwt.verify(token, 'segredo', function (err, decoded) {
        if (err) return res.status(500).json({ auth: false, message: 'Token invalido ou expirado!' });
        next();
    });
}

// ---------------- CREATE ----------------
router.post('/post', verificaJWT, async (req, res) => {
    try {
        const objetoTarefa = new modeloTarefa({
            descricao: req.body.descricao,
            statusRealizada: req.body.statusRealizada
        });
        const tarefaSalva = await objetoTarefa.save();
        res.status(200).json(tarefaSalva);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// ---------------- GET ALL ----------------
router.get('/getAll', verificaJWT, async (req, res) => {
    try {
        const resultados = await modeloTarefa.find();
        res.json(resultados);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ---------------- DELETE ----------------
router.delete('/delete/:id', verificaJWT, async (req, res) => {
    try {
        const resultado = await modeloTarefa.findByIdAndDelete(req.params.id);
        res.json(resultado);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// ---------------- UPDATE ----------------
router.patch('/update/:id', verificaJWT, async (req, res) => {
    try {
        const result = await modeloTarefa.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// EXPORT TEM QUE SER SEMPRE NO FINAL
module.exports = router;
