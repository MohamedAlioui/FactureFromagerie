import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X, Users, AlertCircle } from 'lucide-react';
import { Client } from '../types/client';
import { clientService } from '../services/clientService';

interface ClientManagementProps {
  onClose: () => void;
}

const ClientManagement: React.FC<ClientManagementProps> = ({ onClose }) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string>('');
  const [formData, setFormData] = useState({
    name: '',
    number: '',
    address: '',
    mf: '',
  });

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      const data = await clientService.getAllClients();
      setClients(data);
    } catch (error) {
      console.error('Erreur lors du chargement des clients:', error);
      setError('Échec du chargement des clients. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      number: '',
      address: '',
      mf: '',
    });
    setEditingClient(null);
    setShowForm(false);
    setError('');
  };

  const handleEdit = (client: Client) => {
    setFormData({
      name: client.name,
      number: client.number,
      address: client.address,
      mf: client.mf,
    });
    setEditingClient(client);
    setShowForm(true);
    setError('');
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Le nom du client est requis');
      return false;
    }
    if (!formData.number.trim()) {
      setError('Le numéro du client est requis');
      return false;
    }
    if (!formData.address.trim()) {
      setError('L\'adresse du client est requise');
      return false;
    }
    if (!formData.mf.trim()) {
      setError('Le MF du client est requis');
      return false;
    }

    // Check for duplicate client number (excluding current client when editing)
    const existingClient = clients.find(c => 
      c.number.toLowerCase() === formData.number.toLowerCase() && 
      (!editingClient || c._id !== editingClient._id)
    );
    
    if (existingClient) {
      setError(`Le numéro de client "${formData.number}" existe déjà`);
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);

    try {
      // Trim all string values
      const trimmedData = {
        name: formData.name.trim(),
        number: formData.number.trim(),
        address: formData.address.trim(),
        mf: formData.mf.trim(),
      };

      if (editingClient) {
        const updatedClient = await clientService.updateClient(editingClient._id, trimmedData);
        setClients(clients.map(c => c._id === editingClient._id ? updatedClient : c));
      } else {
        const newClient = await clientService.createClient(trimmedData);
        setClients([newClient, ...clients]);
      }
      resetForm();
    } catch (error: any) {
      console.error('Erreur lors de l\'enregistrement du client:', error);
      
      // Extract meaningful error message
      let errorMessage = 'Échec de l\'enregistrement du client. Veuillez réessayer.';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      // Handle specific error cases
      if (errorMessage.includes('duplicate') || errorMessage.includes('already exists')) {
        errorMessage = `Le numéro de client "${formData.number}" existe déjà. Veuillez utiliser un numéro différent.`;
      }
      
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (clientId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce client ?')) return;
    
    try {
      await clientService.deleteClient(clientId);
      setClients(clients.filter(c => c._id !== clientId));
    } catch (error: any) {
      console.error('Erreur lors de la suppression du client:', error);
      let errorMessage = 'Échec de la suppression du client. Veuillez réessayer.';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      setError(errorMessage);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center">
            <Users className="w-6 h-6 text-green-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">Gestion des Clients</h2>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => {
                setShowForm(true);
                setError('');
              }}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Ajouter un Client
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            </div>
          )}

          {showForm && (
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold mb-4">
                {editingClient ? 'Modifier le Client' : 'Ajouter un Nouveau Client'}
              </h3>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom du Client *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, name: e.target.value }));
                      setError('');
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    disabled={submitting}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Numéro du Client *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.number}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, number: e.target.value }));
                      setError('');
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    disabled={submitting}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Adresse *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.address}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, address: e.target.value }));
                      setError('');
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    disabled={submitting}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    MF *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.mf}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, mf: e.target.value }));
                      setError('');
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    disabled={submitting}
                  />
                </div>

                <div className="md:col-span-2 flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                    disabled={submitting}
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Enregistrement...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        {editingClient ? 'Mettre à jour' : 'Enregistrer'} le Client
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nom
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Numéro
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Adresse
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      MF
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {clients.map((client) => (
                    <tr key={client._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{client.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{client.number}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{client.address}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{client.mf}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => handleEdit(client)}
                            className="text-yellow-600 hover:text-yellow-800 p-1 rounded"
                            title="Modifier"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(client._id)}
                            className="text-red-600 hover:text-red-800 p-1 rounded"
                            title="Supprimer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {clients.length === 0 && (
                <div className="px-6 py-12 text-center">
                  <p className="text-gray-500">Aucun client trouvé. Ajoutez votre premier client pour commencer.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientManagement;