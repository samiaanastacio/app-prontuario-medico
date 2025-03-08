const mongoose = require("mongoose");

const PacienteSchema = new mongoose.Schema({
  nome: { type: String, required: true, maxlength: 256 },
  idade: { type: Number, required: true, min: 0 },
  convenio: { type: String, maxlength: 80 },
  medicamentos: { type: String, default: "" },
  alergias: { type: String, default: "" },
  antecedentes_clinicos: { type: String, default: "" },
  antecedentes_cirurgicos: { type: String, default: "" },
  descricao_atendimento: { type: String, default: "" },
}, { timestamps: true });

module.exports = mongoose.model("Paciente", PacienteSchema);
