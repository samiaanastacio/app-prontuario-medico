import { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { Link, Route, Routes, useLocation } from "react-router-dom";
import "./App.css";


function App() {
  const [pacientes, setPacientes] = useState([]);
  const [busca, setBusca] = useState("");
  const [form, setForm] = useState({
    nome: "",
    idade: "",
    convenio: "",
    medicamentos: "",
    alergias: "",
    antecedentesClinicos: "",
    antecedentesCirurgicos: "",
    atendimento: "",
  });
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;

  const location = useLocation(); // Para verificar a rota atual

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    fetch(`${API_URL}/api/pacientes`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (data.data && Array.isArray(data.data.pacientes)) {
          const pacientes = data.data.pacientes;
          setPacientes(pacientes.sort((a, b) => a.nome.localeCompare(b.nome)));
        } else {
          console.error("Resposta inesperada da API:", data);
        }
      })
      .catch((error) => console.error("Erro ao carregar pacientes:", error));
  }, []);

  const handleSearch = () => {
    console.log("Buscando por:", busca);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.nome.trim() === "") return;

    try {
      const response = await fetch(`${API_URL}/api/pacientes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const novoPaciente = await response.json();
      setPacientes([...pacientes, novoPaciente].sort((a, b) => a.nome.localeCompare(b.nome)));
      setForm({
        nome: "",
        idade: "",
        convenio: "",
        medicamentos: "",
        alergias: "",
        antecedentesClinicos: "",
        antecedentesCirurgicos: "",
        atendimento: "",
      });
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Erro ao adicionar paciente:", error);
    }
  };

  const pacientesFiltrados = pacientes.filter((paciente) =>
    paciente.nome.toLowerCase().includes(busca.toLowerCase())
  );

  const offset = currentPage * itemsPerPage;
  const currentPageData = pacientesFiltrados.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(pacientesFiltrados.length / itemsPerPage);

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  return (
    <div className="app-container">
      <h1>Prontuário Médico</h1>
      <form onSubmit={(e) => e.preventDefault()} className="search-container">
        <div className="search-input-container">
          <input
            type="text"
            placeholder="Buscar paciente..."
            className="form-input"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
          <button type="button" className="search-button" onClick={handleSearch}>
            Buscar
          </button>
        </div>
        {location.pathname === "/lista" && (
          <Link to="/" className="form-link">
            <div className = "voltar">Voltar à página inicial</div>
          </Link>
        )}
      </form>
      <Routes>
        <Route
          path="/"
          element={
            <CadastroPage
              form={form}
              handleChange={handleChange}
              handleSubmit={handleSubmit}
              setShowSuccessModal={setShowSuccessModal}
            />
          }
        />
        <Route
          path="/lista"
          element={
            <ListaPage
              currentPageData={currentPageData}
              pageCount={pageCount}
              handlePageClick={handlePageClick}
            />
          }
        />
      </Routes>
      {location.pathname !== "/lista" && (
        <footer className="footer">
          <Link to="/lista" className="footer-link">
            Lista de Pacientes
          </Link>
        </footer>
      )}
    </div>
  );
}

function ListaPage({ currentPageData, pageCount, handlePageClick }) {
  return (
    <div className="pacientes-container">
      <h2>Pacientes Cadastrados</h2>
      {currentPageData.length > 0 ? (
        currentPageData.map((paciente) => (
          <div key={paciente._id} className="paciente-card">
            <h3>{paciente.nome}</h3>
            <p><strong>Idade:</strong> {paciente.idade}</p>
            <p><strong>Convênio:</strong> {paciente.convenio}</p>
            <p><strong>Medicamentos:</strong> {paciente.medicamentos}</p>
            <p><strong>Alergias:</strong> {paciente.alergias}</p>
            <p><strong>Antecedentes Clínicos:</strong> {paciente.antecedentesClinicos}</p>
            <p><strong>Antecedentes Cirúrgicos:</strong> {paciente.antecedentesCirurgicos}</p>
            <p><strong>Atendimento:</strong> {paciente.atendimento}</p>
          </div>
        ))
      ) : (
        <p>Nenhum paciente encontrado.</p>
      )}
      <ReactPaginate
        previousLabel={"← Anterior"}
        nextLabel={"Próximo →"}
        pageCount={pageCount}
        onPageChange={handlePageClick}
        containerClassName={"pagination"}
        previousLinkClassName={"pagination__link"}
        nextLinkClassName={"pagination__link--disabled"}
        activeClassName={"pagination__link--active"}
      />
    </div>
  );
}

function CadastroPage({ form, handleChange, handleSubmit, setShowSuccessModal }) {
  return (
    <form onSubmit={handleSubmit} className="form-container">
      <h2>Cadastrar Paciente</h2>
      <input
        type="text"
        name="nome"
        placeholder="Nome"
        className="form-input"
        value={form.nome}
        onChange={handleChange}
        required
      />
      <input
        type="number"
        name="idade"
        placeholder="Idade"
        className="form-input"
        value={form.idade}
        onChange={handleChange}
      />
      <input
        type="text"
        name="convenio"
        placeholder="Convênio"
        className="form-input"
        value={form.convenio}
        onChange={handleChange}
      />
      <input
        type="text"
        name="medicamentos"
        placeholder="Medicamentos em uso"
        className="form-input"
        value={form.medicamentos}
        onChange={handleChange}
      />
      <input
        type="text"
        name="alergias"
        placeholder="Alergias"
        className="form-input"
        value={form.alergias}
        onChange={handleChange}
      />
      <input
        type="text"
        name="antecedentesClinicos"
        placeholder="Antecedentes Clínicos"
        className="form-input"
        value={form.antecedentesClinicos}
        onChange={handleChange}
      />
      <input
        type="text"
        name="antecedentesCirurgicos"
        placeholder="Antecedentes Cirúrgicos"
        className="form-input"
        value={form.antecedentesCirurgicos}
        onChange={handleChange}
      />
      <textarea
        name="atendimento"
        placeholder="Descrição do atendimento"
        className="form-input"
        value={form.atendimento}
        onChange={handleChange}
      />
      <button type="submit" className="form-button">
        Adicionar Paciente
      </button>
    </form>
  );
}

export default App;