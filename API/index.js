console.log("🔥 INDEX RODANDO DE VERDADE");
console.log("MONGO_URL =", process.env.MONGO_URL);
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const app = express();

// CORS — permite o header id-token usado pelo JWT
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, id-token"
    );
    // Responde preflight OPTIONS direto (necessário para CORS com headers customizados)
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

app.use(express.json());

// rota teste
app.get("/", (req, res) => {
    res.send("API rodando 🚀");
});

const PORT = process.env.PORT || 3000;

// rotas
const routes = require('./routes/routes');
app.use('/api', routes);

// Mongo
mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log("Database Connected"))
    .catch(err => console.log("Mongo Error:", err));

// start server
app.listen(PORT, () => {
    console.log("Server Started at", PORT);
});
