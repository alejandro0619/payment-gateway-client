export enum Roles {
  ADMIN = 'admin',
  OPERATOR = 'accounting',
  USER = 'user'
}

export type Course = {
  id: string;
  name: string;
  description: string;
  price: string;
  createdAt: string;
  updatedAt: string | null;
  deletedAt: string | null;
  image: string | null;
}

export type PaymentScheme = {
  name: string;
  code: string;
}

export type Transaction = {
  id: string;
  createdAt: string;
  updatedAt: string | null;
  deletedAt: string | null;
  amount: string | null;
  description: string | null;
  paymentMethod: 'paypal' | 'zelle' | null;
  status: 'completed' | 'in_process' | 'rejected' | 'ready_to_be_checked' | null;
  course: Course | null;
  user: { id: string; email: string } | null; 
  validatedBy: { id: string; email: string } | null; 
}

export const BASE_URL = 'http://localhost:3000';