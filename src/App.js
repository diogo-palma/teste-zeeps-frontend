import './App.css';
import ClientTable from './components/ClientTable';
import ClientForm from './components/ClientForm';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';

function App() {
  return (
    <Router>
      <div className="App">
        <Header/>
        <Routes>
          <Route path="/" element={<h1 className="text-2xl font-bold">Início</h1>} />
          <Route path="/clients" element={<ClientTable />} />
          <Route path="/clientes/adicionar" element={<ClientForm />} />
          <Route path="/clientes/editar/:clientId" element={<ClientForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
