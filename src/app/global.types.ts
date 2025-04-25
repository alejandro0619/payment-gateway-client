

export interface Transaction {
  id: string;
  createdAt: string;
  updatedAt: string | null;
  deletedAt: string | null;
  amount: string;
  description: string;
  paymentMethod: PaymentMethod;
  status: TransactionStatus;
  course: Course;
  user: User;
  validatedBy: User | null;
}

export interface Course {
  id: string;
  createdAt: string;
  updatedAt: string | null;
  deletedAt: string | null;
  price: string;
  name: string;
  description: string;
  image: string | null;
  paymentScheme: PaymentScheme;
}

export interface User {
  id: string;
  createdAt: string;
  updatedAt: string | null;
  deletedAt: string | null;
  identificationNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  role: Roles;
  balance: string;
}

// Tipos específicos
export type TransactionStatus = 
  | 'ready_to_be_checked' 
  | 'completed'
  | 'pending'
  | 'rejected'
  | 'canceled';

export type PaymentMethod = 
  | 'zelle' 
  | 'paypal'

export type PaymentScheme = 
  | 'single_payment'
  | 'installments';


  export enum Roles {
    ADMIN = 'ADMIN',
    OPERATOR = 'ACCOUNTING',
    USER = 'USER'
}
  
export const BASE_URL = 'http://localhost:3000';