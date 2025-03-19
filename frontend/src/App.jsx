import { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { Link, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import "./App.css";

function App() {
  const [pacientes, setPacientes] = useState([]);
  const [busca, setBusca] = useState("");
  const [filteredPacientes, setFilteredPacientes] = useState([]);
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
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;

  const location = useLocation();
  const navigate = useNavigate();

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
          setFilteredPacientes(pacientes); // Inicialmente, todos os pacientes são exibidos
        } else {
          console.error("Resposta inesperada da API:", data);
        }
      })
      .catch((error) => console.error("Erro ao carregar pacientes:", error));
  }, []);

  const handleSearch = () => {
    const resultados = pacientes.filter((paciente) =>
      paciente.nome.toLowerCase().includes(busca.toLowerCase())
    );
    setFilteredPacientes(resultados);
    navigate("/lista"); // Redireciona para a página de lista
  };

  const handleShowAll = () => {
    setFilteredPacientes(pacientes); // Restaura a lista completa
    setBusca(""); // Limpa a caixa de busca
    navigate("/lista"); // Redireciona para a página de lista
  };

  const offset = currentPage * itemsPerPage;
  const currentPageData = filteredPacientes.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(filteredPacientes.length / itemsPerPage);

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
            Voltar à página inicial
          </Link>
        )}
      </form>
      <Routes>
        <Route
          path="/"
          element={
            <CadastroPage
              form={form}
              handleChange={(e) =>
                setForm({ ...form, [e.target.name]: e.target.value })
              }
              handleSubmit={(e) => {
                e.preventDefault();
                // Lógica para enviar o formulário
              }}
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
              handleShowAll={handleShowAll}
            />
          }
        />
      </Routes>
      {location.pathname !== "/lista" && (
        <footer className="footer">
          <Link to="/lista" className="footer-link" onClick={handleShowAll}>
            Lista de Pacientes
          </Link>
        </footer>
      )}
    </div>
  );
}

function ListaPage({ currentPageData, pageCount, handlePageClick, handleShowAll }) {
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

function CadastroPage({ form, handleChange, handleSubmit }) {
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