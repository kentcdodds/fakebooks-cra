export type InvoiceListItem = {
  id: string;
  total: number;
  number: number;
  dueDisplay: string;
  dueStatus: string;
  name: string;
};
export type Invoice = {
  id: string;
  name: string;
  number: number;
  invoiceDate: string;
  dueDate: string;
  paid: boolean;
  lineItems: Array<{
    id: string;
    label: string;
    amount: number;
  }>;
};

export type DueStatus = "overdue" | "due" | "paid";
