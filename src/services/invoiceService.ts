import { api } from './authService';
import { Invoice } from '../types/Invoice';

export const invoiceService = {
  getAllInvoices: async (): Promise<Invoice[]> => {
    const response = await api.get('/invoices');
    return response.data;
  },

  getInvoiceById: async (id: string): Promise<Invoice> => {
    const response = await api.get(`/invoices/${id}`);
    return response.data;
  },

  createInvoice: async (invoiceData: Omit<Invoice, '_id' | 'invoiceNumber' | 'createdAt'>): Promise<Invoice> => {
    const response = await api.post('/invoices', invoiceData);
    return response.data;
  },

  updateInvoice: async (id: string, invoiceData: Omit<Invoice, '_id' | 'invoiceNumber' | 'createdAt'>): Promise<Invoice> => {
    const response = await api.put(`/invoices/${id}`, invoiceData);
    return response.data;
  },

  deleteInvoice: async (id: string): Promise<void> => {
    await api.delete(`/invoices/${id}`);
  },

  downloadInvoicePDF: async (id: string): Promise<void> => {
    const response = await api.get(`/invoices/${id}/pdf`, {
      responseType: 'blob',
    });
    
    const blob = new Blob([response.data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `facture-${id}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  },
};