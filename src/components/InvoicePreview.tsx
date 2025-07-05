import React from 'react';
import { X, Download, Printer } from 'lucide-react';
import { Invoice } from '../types/Invoice';

interface InvoicePreviewProps {
  invoice: Invoice;
  onClose: () => void;
  onDownload: () => void;
}

const InvoicePreview: React.FC<InvoicePreviewProps> = ({ invoice, onClose, onDownload }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const formatCurrency = (amount: number) => {
    return `${amount.toFixed(3)} TND`;
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="flex flex-col sm:flex-row justify-between items-center px-6 py-4 border-b border-gray-200 bg-gray-50">
        <h2 className="text-xl font-semibold text-gray-900 mb-3 sm:mb-0">Aperçu de la facture</h2>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Printer className="w-4 h-4 mr-2" />
            Imprimer
          </button>
          <button
            onClick={onDownload}
            className="flex items-center px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            <Download className="w-4 h-4 mr-2" />
            Télécharger PDF
          </button>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div className="p-4 md:p-8">
        {/* Invoice Template */}
        <div className="max-w-4xl mx-auto bg-white" style={{ fontFamily: 'Arial, sans-serif' }}>
          {/* Header */}
          <div className="border-2 border-black p-3 md:p-5 mb-6">
            <div className="flex flex-col md:flex-row justify-between items-start mb-6">
              {/* Left side - Logo and Company Info */}
              <div className="flex flex-col mb-4 md:mb-0">
                <div className="mb-4">
                  <img 
                    src="./logo1.png" 
                    alt="Logo Fromagerie Alioui" 
                    width={100}
                    onError={(e) => {
                      const target = e.currentTarget as HTMLImageElement;
                      target.style.display = 'none';
                      const nextSibling = target.nextElementSibling as HTMLElement;
                      if (nextSibling) nextSibling.style.display = 'block';
                    }}
                  />
                  <div 
                    className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm"
                    style={{ display: 'none' }}
                  >
                    <div className="text-center leading-tight">
                      <div>Fromagerie</div>
                      <div>Alioui</div>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Fromagerie Alioui</h3>
                  <p className="text-sm text-gray-700 mb-1">Zhena, Utique Bizerte</p>
                  <p className="text-sm text-gray-700 mb-1"><strong>TEL:</strong> 98136638</p>
                  <p className="text-sm text-gray-700"><strong>MF:</strong> 1718082/N</p>
                  <p className="text-sm text-gray-700">Livreur: <strong>{invoice.livreurNom || 'AbdelMonaam Alioui'}</strong></p>
                </div>
              </div>

              {/* Right side - Invoice Info and Client Details */}
              <div className="text-right md:mr-20 mt-4 md:mt-10 w-full md:w-auto">
                <div className="text-xl font-bold text-center mb-6">
                  Facture : N° {invoice.invoiceNumber}
                </div>
                <div className="text-left">
                  <p className="text-sm mb-2"><strong>Nom client:</strong> {invoice.clientName}</p>
                  <p className="text-sm mb-2"><strong>N° client:</strong> {invoice.clientNumber}</p>
                  <p className="text-sm mb-2"><strong>Adresse:</strong> {invoice.clientAddress}</p>
                  <p className="text-sm mb-4"><strong>MF:</strong> {invoice.clientMF}</p>
                  <p className="text-sm font-bold"><strong>Date:</strong> {formatDate(invoice.date)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-black mb-6">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-black px-4 py-2 text-left font-bold">Désignation Article</th>
                  <th className="border border-black px-4 py-2 text-center font-bold">Quantité</th>
                  <th className="border border-black px-4 py-2 text-center font-bold">Prix Uni. TTC</th>
                  <th className="border border-black px-4 py-2 text-center font-bold">Montant TTC</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map((item, index) => (
                  <tr key={index}>
                    <td className="border border-black px-4 py-2">{item.designation}</td>
                    <td className="border border-black px-4 py-2 text-center">{item.quantity}</td>
                    <td className="border border-black px-4 py-2 text-center">{formatCurrency(item.unitPrice)}</td>
                    <td className="border border-black px-4 py-2 text-center">{formatCurrency(item.totalPrice)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary Table */}
          <table className="w-full border-collapse border border-black mb-6">
            <tbody>
              <tr>
                <td className="border border-black px-4 py-2 bg-gray-100 font-bold">Montant Total HT</td>
                <td className="border border-black px-4 py-2 text-right">{formatCurrency(invoice.totalHT)}</td>
              </tr>
              <tr>
                <td className="border border-black px-4 py-2 bg-gray-100 font-bold">Total REMISE</td>
                <td className="border border-black px-4 py-2 text-right">{formatCurrency(invoice.totalRemise)}</td>
              </tr>
              <tr>
                <td className="border border-black px-4 py-2 bg-gray-100 font-bold">Total TTC</td>
                <td className="border border-black px-4 py-2 text-right">{formatCurrency(invoice.totalTTC)}</td>
              </tr>
            </tbody>
          </table>

          {/* Footer Section */}
          <div className="border border-black p-4 mb-6 h-32">
            <p className="font-bold text-sm">Arrêté la présente facture à la somme de {formatCurrency(invoice.totalTTC)}.</p>
          </div>

          {/* Bottom Footer */}
          <div className="border border-black p-2 text-xs flex flex-wrap justify-between bg-gray-50">
            <span>Page : 1/1</span>
            <span>Utilisateur : Alioui Assil</span>
            <span>Date d'impression : {formatDate(new Date().toISOString())}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoicePreview;