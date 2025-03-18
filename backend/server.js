const express = require("express");
const cors = require("cors"); // Importando CORS
require("dotenv").config();
const mongoose = require("mongoose");
const pacienteRoutes = require('./routes/pacienteRoutes');


const app = express();

const allowedOrigins = [
    "http://localhost:5173", // Frontend local
    "https://app-prontuario-medico.vercel.app", // Frontend em produção
  ];

// Configuração do CORS
const corsOptions = {
    origin: (origin, callback) => {
      // Permitir requisições de origens na lista ou sem origem (ex.: Postman)
      if (allowedOrigins.includes(origin) || !origin) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // Permitir envio de cookies/sessões
  };

app.use(cors(corsOptions)); // Agora o CORS está definido corretamente
app.use(express.json()); // Permite trabalhar com JSON

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:5173, https://app-prontuario-medico.vercel.app");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-Credentials", "true");
    next();
  });

app.use("/api/pacientes", pacienteRoutes);



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
