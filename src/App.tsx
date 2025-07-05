import React, { useState, useEffect } from 'react';
import { PlusCircle, FileText, Download, Edit, Trash2, Eye, Users, User, LogOut, Settings } from 'lucide-react';
import InvoiceForm from './components/InvoiceForm';
import InvoiceList from './components/InvoiceList';
import InvoicePreview from './components/InvoicePreview';
import ClientManagement from './components/clientManagement';
import UserManagement from './components/UserManagement';
import LoginForm from './components/LoginForm';
import UserProfile from './components/UserProfile';
import { Invoice } from './types/Invoice';
import { User as UserType } from './types/user';
import { invoiceService } from './services/invoiceService';
import { authService } from './services/authService';

function App() {
  const [currentView, setCurrentView] = useState<'list' | 'form' | 'preview' | 'clients' | 'users'>('list');
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [showUserProfile, setShowUserProfile] = useState(false);

  useEffect(() => {
    checkAuthentication();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadInvoices();
    }
  }, [isAuthenticated]);

  const checkAuthentication = async () => {
    try {
      if (authService.isAuthenticated()) {
        const user = await authService.getCurrentUser();
        setCurrentUser(user);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Authentication check failed:', error);
      authService.logout();
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSuccess = async () => {
    try {
      const user = await authService.getCurrentUser();
      setCurrentUser(user);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Failed to get user after login:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      setIsAuthenticated(false);
      setCurrentUser(null);
      setInvoices([]);
      setCurrentView('list');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const loadInvoices = async () => {
    try {
      const data = await invoiceService.getAllInvoices();
      setInvoices(data);
    } catch (error) {
      console.error('Error loading invoices:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateInvoice = async (invoiceData: Omit<Invoice, '_id' | 'invoiceNumber' | 'createdAt'>) => {
    try {
      const newInvoice = await invoiceService.createInvoice(invoiceData);
      setInvoices([newInvoice, ...invoices]);
      setCurrentView('list');
      setEditingInvoice(null);
    } catch (error) {
      console.error('Error creating invoice:', error);
    }
  };

  const handleUpdateInvoice = async (invoiceData: Omit<Invoice, '_id' | 'invoiceNumber' | 'createdAt'>) => {
    if (!editingInvoice) return;
    
    try {
      const updatedInvoice = await invoiceService.updateInvoice(editingInvoice._id, invoiceData);
      setInvoices(invoices.map(inv => inv._id === editingInvoice._id ? updatedInvoice : inv));
      setCurrentView('list');
      setEditingInvoice(null);
    } catch (error) {
      console.error('Error updating invoice:', error);
    }
  };

  const handleDeleteInvoice = async (invoiceId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette facture ?')) return;
    
    try {
      await invoiceService.deleteInvoice(invoiceId);
      setInvoices(invoices.filter(inv => inv._id !== invoiceId));
    } catch (error) {
      console.error('Error deleting invoice:', error);
    }
  };

  const handleDownloadPDF = async (invoiceId: string) => {
    try {
      await invoiceService.downloadInvoicePDF(invoiceId);
    } catch (error) {
      console.error('Error downloading PDF:', error);
    }
  };

  const handleEditInvoice = (invoice: Invoice) => {
    setEditingInvoice(invoice);
    setCurrentView('form');
  };

  const handlePreviewInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setCurrentView('preview');
  };

  // Show loading screen during initial authentication check
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    );
  }

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return <LoginForm onLoginSuccess={handleLoginSuccess} />;
  }

  const renderHeader = () => (
    <div className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center py-6">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white font-bold mr-4">
              <img 
                src="/logo1.png" 
                alt="Fromagerie Alioui" 
                className="w-10 h-10 rounded-full object-cover"
                onError={(e) => {
                  const target = e.currentTarget as HTMLImageElement;
                  target.style.display = 'none';
                  const nextSibling = target.nextElementSibling as HTMLElement;
                  if (nextSibling) nextSibling.style.display = 'block';
                }}
              />
              <span style={{ display: 'none' }}>FA</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Fromagerie Alioui</h1>
              <p className="text-gray-600">Système de Gestion des Factures</p>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
            {/* Navigation Buttons */}
            <div className="flex flex-wrap justify-center gap-2">
              <button
                onClick={() => setCurrentView('list')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  currentView === 'list'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <FileText className="w-5 h-5 inline mr-2" />
                Factures
              </button>
              <button
                onClick={() => setCurrentView('clients')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  currentView === 'clients'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Users className="w-5 h-5 inline mr-2" />
                Clients
              </button>
              {currentUser?.role === 'admin' && (
                <button
                  onClick={() => setCurrentView('users')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    currentView === 'users'
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Settings className="w-5 h-5 inline mr-2" />
                  Utilisateurs
                </button>
              )}
              <button
                onClick={() => {
                  setEditingInvoice(null);
                  setCurrentView('form');
                }}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  currentView === 'form'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <PlusCircle className="w-5 h-5 inline mr-2" />
                Nouvelle Facture
              </button>
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-2 md:border-l md:border-gray-200 md:pl-4">
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">{currentUser?.username}</div>
                <div className="text-xs text-gray-500 capitalize">{currentUser?.role === 'admin' ? 'Administrateur' : 'Utilisateur'}</div>
              </div>
              <button
                onClick={() => setShowUserProfile(true)}
                className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100"
                title="Profil Utilisateur"
              >
                <User className="w-5 h-5" />
              </button>
              <button
                onClick={handleLogout}
                className="p-2 text-gray-500 hover:text-red-600 rounded-lg hover:bg-gray-100"
                title="Déconnexion"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
        </div>
      );
    }

    switch (currentView) {
      case 'form':
        return (
          <InvoiceForm
            invoice={editingInvoice}
            onSubmit={editingInvoice ? handleUpdateInvoice : handleCreateInvoice}
            onCancel={() => setCurrentView('list')}
          />
        );
      case 'preview':
        return selectedInvoice ? (
          <InvoicePreview
            invoice={selectedInvoice}
            onClose={() => setCurrentView('list')}
            onDownload={() => handleDownloadPDF(selectedInvoice._id)}
          />
        ) : (
          <div>Facture non trouvée</div>
        );
      case 'clients':
        return (
          <ClientManagement
            onClose={() => setCurrentView('list')}
          />
        );
      case 'users':
        return currentUser?.role === 'admin' ? (
          <UserManagement
            onClose={() => setCurrentView('list')}
          />
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">Accès refusé. Privilèges d'administrateur requis.</p>
          </div>
        );
      default:
        return (
          <InvoiceList
            invoices={invoices}
            onEdit={handleEditInvoice}
            onDelete={handleDeleteInvoice}
            onPreview={handlePreviewInvoice}
            onDownload={handleDownloadPDF}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {renderHeader()}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </main>

      {/* User Profile Modal */}
      {showUserProfile && currentUser && (
        <UserProfile
          user={currentUser}
          onClose={() => setShowUserProfile(false)}
        />
      )}
    </div>
  );
}

export default App;