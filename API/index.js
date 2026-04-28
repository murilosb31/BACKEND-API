console.log("🔥 INDEX RODANDO DE VERDADE");
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const app = express();

// CORS simples
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    next();
});

app.use(express.json());

// rota teste (IMPORTANTE PRA VER SE ESTÁ ONLINE)
app.get("/", (req, res) => {
    res.send("API rodando 🚀");
});

const PORT = process.env.PORT || 3000;

// rotas
const routes = require('./routes/routes');
app.use('/api', routes);

// Mongo (limpo e direto)
mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log("Database Connected"))
    .catch(err => console.log("Mongo Error:", err));

// start server
app.listen(PORT, () => {
    console.log("Server Started at", PORT);
});