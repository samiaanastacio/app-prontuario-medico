// const express = require("express");
// const Paciente = require("../models/Paciente");

// const router = express.Router();

// // Criar um novo paciente
// router.post("/", async (req, res) => {
//   try {
//     const paciente = new Paciente(req.body);
//     await paciente.save();
//     res.status(201).json(paciente);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// });

// // Listar todos os pacientes
// router.get("/", async (req, res) => {
//   try {
//     const pacientes = await Paciente.find();
//     res.json(pacientes);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // Buscar um paciente por ID
// router.get("/:id", async (req, res) => {
//   try {
//     const paciente = await Paciente.findById(req.params.id);
//     if (!paciente) return res.status(404).json({ message: "Paciente não encontrado" });
//     res.json(paciente);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // Atualizar um paciente por ID
// router.put("/:id", async (req, res) => {
//   try {
//     const paciente = await Paciente.findByIdAndUpdate(req.params.id, req.body, { new: true });
//     if (!paciente) return res.status(404).json({ message: "Paciente não encontrado" });
//     res.json(paciente);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// });

// // Deletar um paciente por ID
// router.delete("/:id", async (req, res) => {
//   try {
//     const paciente = await Paciente.findByIdAndDelete(req.params.id);
//     if (!paciente) return res.status(404).json({ message: "Paciente não encontrado" });
//     res.json({ message: "Paciente removido com sucesso" });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// module.exports = router;

const express = require("express");
const { body, validationResult, query } = require("express-validator"); // Importando express-validator
const Paciente = require("../models/Paciente");

const router = express.Router();

// Criar um novo paciente (com validação)
router.post(
    "/",
    [
        body("nome").notEmpty().withMessage("Nome é obrigatório"),
        body("email").isEmail().withMessage("Email inválido"),
        // Adicione outras validações aqui
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const paciente = new Paciente(req.body);
            await paciente.save();
            res.status(201).json({ data: paciente, message: "Paciente criado com sucesso" });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
);

// Listar todos os pacientes (com paginação e filtragem)
router.get(
  "/",
  [
    query("page").isInt({ min: 1 }).optional().withMessage("Página deve ser um número positivo"),
    query("limit").isInt({ min: 1 }).optional().withMessage("Limite deve ser um número positivo"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    try {
      const pacientes = await Paciente.find().skip(skip).limit(limit);
      const total = await Paciente.countDocuments();

      // Garante que a resposta sempre será um array, mesmo que não haja pacientes
      res.json({
        data: {
          pacientes: pacientes || [], // Retorna um array vazio se não houver pacientes
          page,
          limit,
          total,
        },
        message: "Pacientes listados com sucesso",
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Buscar um paciente por ID
router.get("/:id", async (req, res) => {
    try {
        const paciente = await Paciente.findById(req.params.id);
        if (!paciente) {
            return res.status(404).json({ message: "Paciente não encontrado" });
        }
        res.json({ data: paciente, message: "Paciente encontrado com sucesso" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Atualizar um paciente por ID (com validação)
router.put(
    "/:id",
    [
        body("nome").optional().notEmpty().withMessage("Nome não pode ser vazio"),
        body("email").optional().isEmail().withMessage("Email inválido"),
        // Adicione outras validações aqui
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const paciente = await Paciente.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (!paciente) {
                return res.status(404).json({ message: "Paciente não encontrado" });
            }
            res.json({ data: paciente, message: "Paciente atualizado com sucesso" });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
);

// Deletar um paciente por ID
router.delete("/:id", async (req, res) => {
    try {
        const paciente = await Paciente.findByIdAndDelete(req.params.id);
        if (!paciente) {
            return res.status(404).json({ message: "Paciente não encontrado" });
        }
        res.json({ message: "Paciente removido com sucesso" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
