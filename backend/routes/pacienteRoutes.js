const express = require("express");
const Paciente = require("../models/Paciente");

const router = express.Router();

// Criar um novo paciente
router.post("/", async (req, res) => {
  try {
    const paciente = new Paciente(req.body);
    await paciente.save();
    res.status(201).json(paciente);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Listar todos os pacientes
router.get("/", async (req, res) => {
  try {
    const pacientes = await Paciente.find();
    res.json(pacientes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Buscar um paciente por ID
router.get("/:id", async (req, res) => {
  try {
    const paciente = await Paciente.findById(req.params.id);
    if (!paciente) return res.status(404).json({ message: "Paciente não encontrado" });
    res.json(paciente);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Atualizar um paciente por ID
router.put("/:id", async (req, res) => {
  try {
    const paciente = await Paciente.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!paciente) return res.status(404).json({ message: "Paciente não encontrado" });
    res.json(paciente);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Deletar um paciente por ID
router.delete("/:id", async (req, res) => {
  try {
    const paciente = await Paciente.findByIdAndDelete(req.params.id);
    if (!paciente) return res.status(404).json({ message: "Paciente não encontrado" });
    res.json({ message: "Paciente removido com sucesso" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
