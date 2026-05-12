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
            const token = jwt.sign({ id: req.body.nome, isAdmin: data.isAdmin }, 'segredo', { expiresIn: 300 });
            return res.json({ auth: true, token: token, isAdmin: data.isAdmin });
        }

        res.status(500).json({ message: 'Login invalido!' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Middleware que verifica o token JWT
function verificaJWT(req, res, next) {
    const token = req.headers['id-token'];
    if (!token) return res.status(401).json({ auth: false, message: 'Token nao fornecido' });

    jwt.verify(token, 'segredo', function (err, decoded) {
        if (err) return res.status(500).json({ auth: false, message: 'Token invalido ou expirado!' });
        req.decoded = decoded;
        next();
    });
}

// Middleware que verifica se é admin
function verificaAdmin(req, res, next) {
    const token = req.headers['id-token'];
    if (!token) return res.status(401).json({ auth: false, message: 'Token nao fornecido' });

    jwt.verify(token, 'segredo', function (err, decoded) {
        if (err) return res.status(500).json({ auth: false, message: 'Token invalido ou expirado!' });
        if (!decoded.isAdmin) return res.status(403).json({ auth: false, message: 'Acesso negado! Apenas admins.' });
        next();
    });
}

// ---------------- CRUD TAREFAS ----------------
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

router.get('/getAll', verificaJWT, async (req, res) => {
    try {
        const resultados = await modeloTarefa.find();
        res.json(resultados);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.delete('/delete/:id', verificaJWT, async (req, res) => {
    try {
        const resultado = await modeloTarefa.findByIdAndDelete(req.params.id);
        res.json(resultado);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

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

// ---------------- CRUD USUÁRIOS (só admin) ----------------

// GET todos os usuários
router.get('/users', verificaAdmin, async (req, res) => {
    try {
        const users = await userModel.find({}, { senha: 0 }); // não retorna senha
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST criar usuário
router.post('/users', verificaAdmin, async (req, res) => {
    try {
        const novoUser = new userModel({
            nome: req.body.nome,
            senha: req.body.senha,
            isAdmin: req.body.isAdmin || false
        });
        const salvo = await novoUser.save();
        res.status(200).json(salvo);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// PATCH editar usuário
router.patch('/users/:id', verificaAdmin, async (req, res) => {
    try {
        const result = await userModel.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// DELETE remover usuário
router.delete('/users/:id', verificaAdmin, async (req, res) => {
    try {
        const resultado = await userModel.findByIdAndDelete(req.params.id);
        res.json(resultado);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
