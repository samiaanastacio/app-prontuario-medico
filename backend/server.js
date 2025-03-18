const express = require("express");
// const cors = require("cors"); // Importando CORS
require("dotenv").config();
const mongoose = require("mongoose");
const pacienteRoutes = require("./routes/pacienteRoutes");

const app = express();

const allowedOrigins = [
  "http://localhost:5173", // Frontend local
  "https://app-prontuario-medico.vercel.app", // Frontend em produção
];

// Configuração do CORS
// const corsOptions = {
//   origin: (origin, callback) => {
//     // Permitir requisições de origens na lista ou sem origem (ex.: Postman)
//     if (allowedOrigins.includes(origin) || !origin) {
//       callback(null, true);
//     } else {
//       callback(new Error("Not allowed by CORS"));
//     }
//   },
//   credentials: true, // Permitir envio de cookies/sessões
// };

// app.use(cors(corsOptions)); // Middleware CORS
app.use(express.json()); // Middleware para JSON

// Rotas
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