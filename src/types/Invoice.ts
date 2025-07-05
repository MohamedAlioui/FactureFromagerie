export interface InvoiceItem {
  designation: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Invoice {
  _id: string;
  invoiceNumber: string;
  clientName: string;
  clientNumber: string;
  clientAddress: string;
  clientMF: string;
  date: string;
  items: InvoiceItem[];
  totalHT: number;
  totalRemise: number;
  totalTTC: number;
  livreurNom?: string;
  createdAt: string;
}