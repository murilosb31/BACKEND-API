const express = require('express');
const router = express.Router();

// IMPORT DO MODEL
const modeloTarefa = require('../models/tarefa');

// ---------------- CREATE ----------------
router.post('/post', async (req, res) => {
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
router.get('/getAll', async (req, res) => {
    try {
        const resultados = await modeloTarefa.find();
        res.json(resultados);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ---------------- DELETE ----------------
router.delete('/delete/:id', async (req, res) => {
    try {
        const resultado = await modeloTarefa.findByIdAndDelete(req.params.id);
        res.json(resultado);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// ---------------- UPDATE ----------------
router.patch('/update/:id', async (req, res) => {
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