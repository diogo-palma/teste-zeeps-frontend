import React, { useState, useEffect, useRef } from 'react';
import { getClients, removeClient } from '../api/clientAPI';
import _ from 'lodash';
import { useNavigate } from 'react-router-dom';

const ClientTable = () => {
  const [clients, setClients] = useState([]);
  const [filter, setFilter] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isConfirming, setIsConfirming] = useState(false);
  const [clientToRemove, setClientToRemove] = useState(null); 

  const inputRef = useRef(null);
  const navigate = useNavigate();

  const fetchClients = async (page, filterName = '') => {
    setLoading(true);
    setError(null); 
    try {
      const { data, pagination } = await getClients(page, 10, filterName);
      setClients(data);
      setTotalPages(pagination.totalPages);
    } catch (error) {
      setError('Erro ao carregar clientes: ' + (error.message || 'Verifique sua conexão com a API'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients(page, filter);
  }, [page, filter]);

  useEffect(() => {
    if (!loading && inputRef.current) {
      inputRef.current.focus();
    }
  }, [clients, loading]);

  const debounceFilter = useRef(
    _.debounce((value) => {
      setPage(1);
      setFilter(value);
    }, 500)
  ).current;

  const handleFilterChange = (e) => {
    setSearchInput(e.target.value);
    debounceFilter(e.target.value);
  };

  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const handlePrevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleAddClient = () => {
    navigate('/clientes/adicionar');
  };

  const handleBack = () => {
    navigate('/');
  };

  const handleEditClient = (id) => {
    navigate(`/clientes/editar/${id}`);
  };

  const handleConfirmRemoveClient = (id) => {
    setClientToRemove(id);
    setIsConfirming(true);
  };

  const confirmRemoveClient = async () => {
    if (clientToRemove) {
      try {
        await removeClient(clientToRemove);
        setClients(clients.filter(client => client.TECL_ID !== clientToRemove));
      } catch (error) {
        setError('Erro ao remover cliente: ' + (error.message || 'Tente novamente mais tarde.'));
      } finally {
        setIsConfirming(false);
        setClientToRemove(null); 
      }
    }
  };

  const cancelRemoveClient = () => {
    setIsConfirming(false);
    setClientToRemove(null); 
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>; 

  return (
    <div className="ClientTable container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 flex items-center">
        <button onClick={handleBack} className="text-blue-500 hover:underline mr-2">
          <img src="/assets/back.png" alt="Adicionar" className="w-6 h-6" />
        </button>
        Clientes
      </h1>

      <div className="mb-4">
        <input
          ref={inputRef}
          type="text"
          placeholder="Filtrar por nome..."
          value={searchInput}
          onChange={handleFilterChange}
          className="p-2 border border-gray-300 rounded w-full"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-2 px-4 border">
                <button onClick={handleAddClient} className="text-blue-500 hover:underline">
                  <img src="/assets/plus.png" alt="Adicionar" className="w-8 h-8 mx-auto" />
                </button>
              </th>
              <th className="py-2 px-4 border">Nome</th>
              <th className="py-2 px-4 border">Endereço</th>
              <th className="py-2 px-4 border">Cidade</th>
              <th className="py-2 px-4 border">UF</th>
              <th className="py-2 px-4 border">Telefone</th>
            </tr>
          </thead>
          <tbody>
            {clients.length > 0 ? (
              clients.map(client => (
                <tr key={client.TECL_ID} className="hover:bg-gray-100">
                  <td className="py-2 px-4 border">
                    <div className="flex items-center justify-center"> 
                      <button onClick={() => handleEditClient(client.TECL_ID)} className="text-blue-500 hover:underline">
                        <img src="/assets/edit.png" alt="Editar" className="w-6 h-6 mx-auto mr-4" />
                      </button>
                      <button onClick={() => handleConfirmRemoveClient(client.TECL_ID)} className="text-red-500 hover:underline ml-2">
                        <img src="/assets/minus.png" alt="Remover" className="w-6 h-6 mx-auto mr-4" />
                      </button>
                    </div>
                  </td>
                  <td className="py-2 px-4 border">{client.TECL_NOME}</td>
                  <td className="py-2 px-4 border">{client.TECL_ENDERECO}</td>
                  <td className="py-2 px-4 border">{client.TECL_CIDADE}</td>
                  <td className="py-2 px-4 border">{client.TECL_UF}</td>
                  <td className="py-2 px-4 border">{client.TECL_TELEFONE}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="py-2 px-4 text-center">Nenhum cliente encontrado</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-4">
        <button 
          onClick={handlePrevPage} 
          disabled={page === 1} 
          className="bg-gray-200 p-2 rounded"
        >
          Página Anterior
        </button>
        
        <span>Página {page} de {totalPages}</span>
        
        <button 
          onClick={handleNextPage} 
          disabled={page === totalPages} 
          className="bg-gray-200 p-2 rounded"
        >
          Próxima Página
        </button>
      </div>

      {isConfirming && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-md">
            <h2 className="text-lg font-bold mb-4">Confirmar remoção</h2>
            <p>Você tem certeza que deseja remover este cliente?</p>
            <div className="mt-4">
              <button onClick={confirmRemoveClient} className="bg-red-500 text-white p-2 rounded mr-2">
                Sim
              </button>
              <button onClick={cancelRemoveClient} className="bg-gray-300 p-2 rounded">
                Não
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientTable;
