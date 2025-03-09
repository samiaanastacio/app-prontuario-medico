import { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { Link, Route, BrowserRouter as Router, Routes, useLocation, useNavigate } from "react-router-dom";
import "./App.css";

function SuccessModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>Sucesso!</h3>
        <p>Paciente cadastrado com sucesso.</p>
        <button className="form-button" onClick={onClose}>
          Fechar
        </button>
      </div>
    </div>
  );
}

function ExitWarningModal({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>Atenção!</h3>
        <p>Existem alterações não salvas. Deseja realmente sair?</p>
        <div className="modal-buttons">
          <button className="form-button" onClick={onConfirm}>
            Sim, sair
          </button>
          <button className="form-button" onClick={onClose}>
            Continuar editando
          </button>
        </div>
      </div>
    </div>
  );
}

function NavigationButtonWrapper() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavigate = (e) => {
    if (location.pathname === "/") {
      const form = document.querySelector("form");
      const hasUnsavedChanges = Array.from(form.elements).some(element => element.value !== "");
      
      if (hasUnsavedChanges) {
        e.preventDefault();
        window.dispatchEvent(new CustomEvent('showExitWarning'));
      }
    }
  };

  return (
    <Link 
      to={location.pathname === "/lista" ? "/" : "/lista"} 
      className="form-button"
      onClick={handleNavigate}
    >
      {location.pathname === "/lista" ? "Voltar" : "Lista de Pacientes"}
    </Link>
  );
}

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
  const [showExitModal, setShowExitModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;

  useEffect(() => {
    const handleExitWarning = () => {
      setShowExitModal(true);
    };

    window.addEventListener('showExitWarning', handleExitWarning);
    return () => window.removeEventListener('showExitWarning', handleExitWarning);
  }, []);

  // useEffect(() => {
  //   fetch("http://localhost:5000/pacientes")
  //     .then((response) => response.json())
  //     .then((data) => setPacientes(data.sort((a, b) => a.nome.localeCompare(b.nome))))
  //     .catch((error) => console.error("Erro ao carregar pacientes:", error));
  // }, []);

  useEffect(() => {
    fetch("/api/pacientes")
      .then((response) => response.json())
      .then((data) => setPacientes(data.sort((a, b) => a.nome.localeCompare(b.nome))))
      .catch((error) => console.error("Erro ao carregar pacientes:", error));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.nome.trim() === "") return;

    try {
      const response = await fetch("http://localhost:5000/pacientes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

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
    <Router>
      <div className="app-container">
        <h1>Prontuário Médico</h1>
        <NavigationButtonWrapper />
        <form onSubmit={(e) => { e.preventDefault(); }} className="search-container">
          <input
            type="text"
            placeholder="Buscar paciente..."
            className="form-input"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
          <Link to="/lista" className="form-button">
            Buscar
          </Link>
        </form>
        <Routes>
          <Route 
            path="/" 
            element={
              <CadastroPage 
                form={form} 
                handleChange={handleChange} 
                handleSubmit={handleSubmit}
                showExitModal={showExitModal}
                setShowExitModal={setShowExitModal}
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
        <SuccessModal 
          isOpen={showSuccessModal} 
          onClose={() => setShowSuccessModal(false)} 
        />
      </div>
    </Router>
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
            <p><strong>Antecedentes Clínicos:</strong> {paciente.antecedentes_clinicos}</p>
            <p><strong>Antecedentes Cirúrgicos:</strong> {paciente.antecedentes_cirurgicos}</p>
            <p><strong>Atendimento:</strong> {paciente.descricao_atendimento}</p>
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
        nextLinkClassName={"pagination__link"}
        disabledClassName={"pagination__link--disabled"}
        activeClassName={"pagination__link--active"}
      />
    </div>
  );
}

function CadastroPage({ form, handleChange, handleSubmit, showExitModal, setShowExitModal }) {
  const navigate = useNavigate();
  const hasUnsavedChanges = Object.values(form).some(value => value !== "");

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasUnsavedChanges]);

  return (
    <>
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
      <ExitWarningModal 
        isOpen={showExitModal}
        onClose={() => setShowExitModal(false)}
        onConfirm={() => {
          setShowExitModal(false);
          navigate("/lista");
        }}
      />
    </>
  );
}

export default App;