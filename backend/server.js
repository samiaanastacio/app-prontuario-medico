// const express = require("express");
// const cors = require("cors"); // Importando CORS
// require("dotenv").config();
// const mongoose = require("mongoose");
// const pacienteRoutes = require("./routes/pacienteRoutes");

// const app = express();

// const allowedOrigins = [
//   "http://localhost:5173", // Frontend local
//   "https://app-prontuario-medico.vercel.app", // Frontend em produção
// ];

// // Configuração do CORS
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
// app.use(express.json()); // Middleware para JSON

// // Rotas
// app.use("/api/pacientes", pacienteRoutes);

// // Conectar ao MongoDB Atlas
// mongoose.connect(process.env.MONGO_URI) // Atualize para esta linha
// .then(() => console.log("MongoDB conectado"))
// .catch((err) => console.error(err));

// // Rota de teste
// app.get("/", (req, res) => {
//   res.send("Backend rodando!");

// });

// // Iniciando o servidor
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));

const express = require("express");
const cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");
const pacienteRoutes = require("./routes/pacienteRoutes");
const NodeCache = require("node-cache");

const app = express();

// Configuração do cache
const cache = new NodeCache({ stdTTL: 60 }); // Cache com TTL de 60 segundos

// Lista de origens permitidas
const allowedOrigins = [
  "http://localhost:5173", // Frontend local
  "https://app-prontuario-medico.vercel.app", // Frontend em produção
];

// Configuração do CORS
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      // Permitir requisições de origens na lista ou sem origem (ex.: Postman)
      callback(null, true);
    } else {
      console.error(`Origem bloqueada pelo CORS: ${origin}`);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true, // Permitir envio de cookies/sessões
};

app.use(cors(corsOptions)); // Middleware CORS
app.use(express.json()); // Middleware para JSON

// Middleware de cache
const cacheMiddleware = (req, res, next) => {
  const key = req.originalUrl;
  const cachedResponse = cache.get(key);
  if (cachedResponse) {
    return res.json(cachedResponse); // Retorna a resposta do cache
  }
  res.sendResponse = res.json;
  res.json = (body) => {
    cache.set(key, body); // Armazena a resposta no cache
    res.sendResponse(body);
  };
  next();
};

// Rotas
app.use("/api/pacientes", cacheMiddleware, pacienteRoutes);

// Conectar ao MongoDB Atlas
// Conectar ao MongoDB Atlas
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    maxPoolSize: 10, // Substituído poolSize por maxPoolSize
  })
  .then(() => console.log("MongoDB conectado"))
  .catch((err) => console.error("Erro ao conectar ao MongoDB:", err));

// Rota de teste
app.get("/", (req, res) => {
  res.send("Backend rodando!");
});

// Iniciando o servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));