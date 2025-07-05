import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Save, X, Users, UserPlus } from 'lucide-react';
import { Invoice, InvoiceItem } from '../types/Invoice';
import { Client } from '../types/client';
import { clientService } from '../services/clientService';
import ClientManagement from './clientManagement';

interface InvoiceFormProps {
  invoice?: Invoice | null;
  onSubmit: (invoice: Omit<Invoice, '_id' | 'invoiceNumber' | 'createdAt'>) => void;
  onCancel: () => void;
}

const InvoiceForm: React.FC<InvoiceFormProps> = ({ invoice, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    clientName: '',
    clientNumber: '',
    clientAddress: '',
    clientMF: '',
    date: new Date().toISOString().split('T')[0],
    items: [] as InvoiceItem[],
    totalRemise: 0,
    livreurNom: 'AbdelMonaam Alioui',
  });

  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<string>('');
  const [clientInputMode, setClientInputMode] = useState<'select' | 'manual'>('select');
  const [showClientManagement, setShowClientManagement] = useState(false);
  const [loadingClients, setLoadingClients] = useState(true);

  useEffect(() => {
    loadClients();
  }, []);

  useEffect(() => {
    if (invoice) {
      setFormData({
        clientName: invoice.clientName,
        clientNumber: invoice.clientNumber,
        clientAddress: invoice.clientAddress,
        clientMF: invoice.clientMF,
        date: invoice.date.split('T')[0],
        items: invoice.items,
        totalRemise: invoice.totalRemise,
        livreurNom: invoice.livreurNom || 'AbdelMonaam Alioui',
      });
      setClientInputMode('manual');
    }
  }, [invoice]);

  const loadClients = async () => {
    try {
      const data = await clientService.getAllClients();
      setClients(data);
    } catch (error) {
      console.error('Error loading clients:', error);
    } finally {
      setLoadingClients(false);
    }
  };

  const handleClientSelect = (clientId: string) => {
    setSelectedClientId(clientId);
    if (clientId) {
      const selectedClient = clients.find(c => c._id === clientId);
      if (selectedClient) {
        setFormData(prev => ({
          ...prev,
          clientName: selectedClient.name,
          clientNumber: selectedClient.number,
          clientAddress: selectedClient.address,
          clientMF: selectedClient.mf,
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        clientName: '',
        clientNumber: '',
        clientAddress: '',
        clientMF: '',
      }));
    }
  };

  const switchToManualMode = () => {
    setClientInputMode('manual');
    setSelectedClientId('');
  };

  const switchToSelectMode = () => {
    setClientInputMode('select');
    setFormData(prev => ({
      ...prev,
      clientName: '',
      clientNumber: '',
      clientAddress: '',
      clientMF: '',
    }));
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { designation: '', quantity: 1, unitPrice: 0, totalPrice: 0 }]
    }));
  };

  const removeItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const updateItem = (index: number, field: keyof InvoiceItem, value: string | number) => {
    setFormData(prev => {
      const newItems = [...prev.items];
      newItems[index] = { ...newItems[index], [field]: value };
      
      if (field === 'quantity' || field === 'unitPrice') {
        newItems[index].totalPrice = newItems[index].quantity * newItems[index].unitPrice;
      }
      
      return { ...prev, items: newItems };
    });
  };

  const calculateTotals = () => {
    const totalTTC = formData.items.reduce((sum, item) => sum + item.totalPrice, 0);
    const totalHT = totalTTC / 1.19;
    return { totalHT, totalTTC };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { totalHT, totalTTC } = calculateTotals();
    
    onSubmit({
      ...formData,
      totalHT,
      totalTTC,
    });
  };

  const { totalHT, totalTTC } = calculateTotals();

  return (
    <>
      <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
        <div className="flex justify-between items-center mb-4 md:mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">
            {invoice ? 'Modifier Facture' : 'Nouvelle Facture'}
          </h2>
          <button
            onClick={onCancel}
            className="p-1 md:p-2 text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
          {/* Client Selection Section */}
          <div className="bg-gray-50 p-3 md:p-4 rounded-lg">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-3 md:mb-4 space-y-2 md:space-y-0">
              <h3 className="text-base md:text-lg font-semibold text-gray-900">Informations Client</h3>
              <button
                type="button"
                onClick={() => setShowClientManagement(true)}
                className="flex items-center justify-center px-3 py-1.5 md:py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-xs md:text-sm"
              >
                <Users className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                Gérer les Clients
              </button>
            </div>

            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 mb-3 md:mb-4">
              <button
                type="button"
                onClick={switchToSelectMode}
                className={`px-3 py-1.5 md:px-4 md:py-2 rounded-md transition-colors text-sm ${
                  clientInputMode === 'select'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Sélectionner un Client
              </button>
              <button
                type="button"
                onClick={switchToManualMode}
                className={`px-3 py-1.5 md:px-4 md:py-2 rounded-md transition-colors text-sm ${
                  clientInputMode === 'manual'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Saisie Manuelle
              </button>
            </div>

            {clientInputMode === 'select' ? (
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 md:mb-2">
                    Sélectionner un Client
                  </label>
                  {loadingClients ? (
                    <div className="text-xs md:text-sm text-gray-500">Chargement des clients...</div>
                  ) : (
                    <select
                      value={selectedClientId}
                      onChange={(e) => handleClientSelect(e.target.value)}
                      className="w-full px-2 py-1.5 md:px-3 md:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm md:text-base"
                      required
                    >
                      <option value="">Choisir un client...</option>
                      {clients.map((client) => (
                        <option key={client._id} value={client._id}>
                          {client.name} - {client.number}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
                {selectedClientId && (
                  <div className="bg-white p-2 md:p-3 rounded border text-xs md:text-sm">
                    <h4 className="font-medium text-gray-900 mb-1 md:mb-2">Détails du Client:</h4>
                    <div className="text-gray-600 space-y-1">
                      <div><strong>Nom:</strong> {formData.clientName}</div>
                      <div><strong>Numéro:</strong> {formData.clientNumber}</div>
                      <div><strong>Adresse:</strong> {formData.clientAddress}</div>
                      <div><strong>MF:</strong> {formData.clientMF}</div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 md:mb-2">
                    Nom du Client
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.clientName}
                    onChange={(e) => setFormData(prev => ({ ...prev, clientName: e.target.value }))}
                    className="w-full px-2 py-1.5 md:px-3 md:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm md:text-base"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 md:mb-2">
                    Numéro du Client
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.clientNumber}
                    onChange={(e) => setFormData(prev => ({ ...prev, clientNumber: e.target.value }))}
                    className="w-full px-2 py-1.5 md:px-3 md:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm md:text-base"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1 md:mb-2">
                    Adresse du Client
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.clientAddress}
                    onChange={(e) => setFormData(prev => ({ ...prev, clientAddress: e.target.value }))}
                    className="w-full px-2 py-1.5 md:px-3 md:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm md:text-base"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 md:mb-2">
                    MF du Client
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.clientMF}
                    onChange={(e) => setFormData(prev => ({ ...prev, clientMF: e.target.value }))}
                    className="w-full px-2 py-1.5 md:px-3 md:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm md:text-base"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Invoice Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 md:mb-2">
                Date
              </label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                className="w-full px-2 py-1.5 md:px-3 md:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm md:text-base"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 md:mb-2">
                Total Remise (TND)
              </label>
              <input
                type="number"
                step="0.001"
                min="0"
                value={formData.totalRemise}
                onChange={(e) => setFormData(prev => ({ ...prev, totalRemise: parseFloat(e.target.value) || 0 }))}
                className="w-full px-2 py-1.5 md:px-3 md:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm md:text-base"
              />
            </div>
            
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1 md:mb-2">
                Nom du Livreur
              </label>
              <input
                type="text"
                required
                value={formData.livreurNom}
                onChange={(e) => setFormData(prev => ({ ...prev, livreurNom: e.target.value }))}
                className="w-full px-2 py-1.5 md:px-3 md:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm md:text-base"
                placeholder="Entrer le nom du livreur"
              />
            </div>
          </div>

          {/* Invoice Items */}
          <div>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-3 md:mb-4 space-y-2 sm:space-y-0">
              <h3 className="text-base md:text-lg font-semibold text-gray-900">Articles de la Facture</h3>
              <button
                type="button"
                onClick={addItem}
                className="flex items-center justify-center px-3 py-1.5 md:py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm"
              >
                <Plus className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                Ajouter un Article
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300 text-xs md:text-sm">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-300 px-2 py-1 md:px-4 md:py-2 text-left">Désignation</th>
                    <th className="border border-gray-300 px-2 py-1 md:px-4 md:py-2 text-left">Qté</th>
                    <th className="border border-gray-300 px-2 py-1 md:px-4 md:py-2 text-left">Prix Unitaire</th>
                    <th className="border border-gray-300 px-2 py-1 md:px-4 md:py-2 text-left">Total</th>
                    <th className="border border-gray-300 px-2 py-1 md:px-4 md:py-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {formData.items.map((item, index) => (
                    <tr key={index}>
                      <td className="border border-gray-300 px-2 py-1 md:px-4 md:py-2">
                        <input
                          type="text"
                          required
                          value={item.designation}
                          onChange={(e) => updateItem(index, 'designation', e.target.value)}
                          className="w-full px-1 py-0.5 md:px-2 md:py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-green-500 text-xs md:text-sm"
                        />
                      </td>
                      <td className="border border-gray-300 px-2 py-1 md:px-4 md:py-2">
                        <input
                          type="number"
                          required
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 1)}
                          className="w-full px-1 py-0.5 md:px-2 md:py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-green-500 text-xs md:text-sm"
                        />
                      </td>
                      <td className="border border-gray-300 px-2 py-1 md:px-4 md:py-2">
                        <input
                          type="number"
                          step="0.001"
                          required
                          min="0"
                          value={item.unitPrice}
                          onChange={(e) => updateItem(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                          className="w-full px-1 py-0.5 md:px-2 md:py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-green-500 text-xs md:text-sm"
                        />
                      </td>
                      <td className="border border-gray-300 px-2 py-1 md:px-4 md:py-2">
                        <span className="font-medium">{item.totalPrice.toFixed(3)}</span>
                      </td>
                      <td className="border border-gray-300 px-2 py-1 md:px-4 md:py-2">
                        <button
                          type="button"
                          onClick={() => removeItem(index)}
                          className="text-red-600 hover:text-red-800 flex justify-center w-full"
                        >
                          <Trash2 className="w-3 h-3 md:w-4 md:h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Totals */}
          <div className="bg-gray-50 p-3 md:p-4 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4 text-xs md:text-sm">
              <div>
                <span className="font-medium">Total HT:</span>
                <span className="ml-1 md:ml-2">{totalHT.toFixed(3)} TND</span>
              </div>
              <div>
                <span className="font-medium">Total Remise:</span>
                <span className="ml-1 md:ml-2">{formData.totalRemise.toFixed(3)} TND</span>
              </div>
              <div>
                <span className="font-medium">Total TTC:</span>
                <span className="ml-1 md:ml-2">{totalTTC.toFixed(3)} TND</span>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end space-y-2 sm:space-y-0 space-x-0 sm:space-x-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-1.5 md:px-6 md:py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors text-sm md:text-base"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex items-center justify-center px-4 py-1.5 md:px-6 md:py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm md:text-base"
            >
              <Save className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
              {invoice ? 'Mettre à jour' : 'Créer la Facture'}
            </button>
          </div>
        </form>
      </div>

      {/* Client Management Modal */}
      {showClientManagement && (
        <ClientManagement
          onClose={() => {
            setShowClientManagement(false);
            loadClients();
          }}
        />
      )}
    </>
  );
};

export default InvoiceForm;