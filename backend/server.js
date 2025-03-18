const express = require("express");
const cors = require("cors"); // Importando CORS
require("dotenv").config();
const mongoose = require("mongoose");
const pacienteRoutes = require('./routes/pacienteRoutes');


const app = express();

// Configuração do CORS
const corsOptions = {
    // origin: "http://localhost:5173",
    origin: "*",
    credentials: true, // Permite envio de cookies/sessões
    optionSuccessStatus: 200,
};

app.use(cors(corsOptions)); // Agora o CORS está definido corretamente
app.use(express.json()); // Permite trabalhar com JSON
app.use("api/pacientes", pacienteRoutes);

// Conectar ao MongoDB Atlas
mongoose
    .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB conectado"))
    .catch((err) => console.error(err));

// Rota de teste
app.get("/", (req, res) => {
    res.send("Backend rodando!");
});

// Iniciando o servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
