import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { addClient, updateClient, getClient } from '../api/clientAPI';
import { useNavigate } from 'react-router-dom';
import InputMask from 'react-input-mask';

const ClientForm = ({ onSave, onCancel }) => {
  const { clientId } = useParams();
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchClientData = async () => {
      if (clientId) {
        try {
          const clientData = await getClient(clientId);
          setName(clientData.TECL_NOME || '');
          setAddress(clientData.TECL_ENDERECO || '');
          setCity(clientData.TECL_CIDADE || '');
          setState(clientData.TECL_UF || '');
          setPhone(clientData.TECL_TELEFONE || '');
        } catch (error) {
          console.error('Erro ao carregar dados do cliente:', error);
          setMessage('Erro ao carregar dados do cliente.');
        }
      }
    };

    fetchClientData();
  }, [clientId]);

  const handleBack = () => {
    navigate('/clients');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const client = {
      TECL_ID: clientId,
      TECL_NOME: name,
      TECL_ENDERECO: address,
      TECL_CIDADE: city,
      TECL_UF: state,
      TECL_TELEFONE: phone,
    };

    try {
      if (clientId) {
        await updateClient(client);
        setMessage('Cliente atualizado com sucesso!');
      } else {
        await addClient(client);
        setMessage('Cliente adicionado com sucesso!');
        setName('');
        setAddress('');
        setCity('');
        setState('');
        setPhone('');
      }
    } catch (error) {
      console.error('Erro ao salvar cliente:', error);
      setMessage('Erro ao salvar cliente.');
    }
  };

  const handleStateChange = (e) => {
    const value = e.target.value.toUpperCase();     
    if (/^[A-Z]*$/.test(value) || value === '') {
      setState(value);
    }
  };

  return (
    <div className="ClientForm container mt-4 mx-auto p-4 bg-white rounded shadow-md">
      <h2 className="text-2xl font-bold mb-4 flex items-center">
        <button onClick={handleBack} className="text-blue-500 hover:underline mr-4">
          <img src="/assets/back.png" alt="Adicionar" className="w-6 h-6 mx-auto" />
        </button>
        {clientId ? 'Editar Registro' : 'Novo Registro'}
      </h2>
      {message && (
        <div className="mb-4 p-2 text-center text-white bg-blue-500 rounded">
          {message}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="mb-4 flex flex-col md:flex-row md:space-x-4">
          <div className="flex-1">
            <label className="block text-gray-700">Nome:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="p-2 border border-gray-300 rounded w-full"
              required
            />
          </div>
          <div className="flex-1">
            <label className="block text-gray-700">Endereço:</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="p-2 border border-gray-300 rounded w-full"
            />
          </div>
        </div>
        <div className="mb-4 flex flex-col md:flex-row md:space-x-4">
          <div className="flex-1 md:w-3/4"> 
            <label className="block text-gray-700">Cidade:</label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="p-2 border border-gray-300 rounded w-full"
            />
          </div>
          <div className="flex-none md:w-20">
            <label className="block text-gray-700">Estado</label>
            <input
              type="text"
              value={state}
              onChange={handleStateChange}
              className="p-2 border border-gray-300 rounded w-full"
              maxLength={2} 
            />
          </div>
          <div className="flex-1">
            <label className="block text-gray-700">Telefone:</label>
            <InputMask
              mask="(99) 99999-9999"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="p-2 border border-gray-300 rounded w-full"
            />
          </div>
        </div>
        <div className="flex justify-end space-x-2">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            {clientId ? 'Atualizar' : 'Adicionar'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ClientForm;
