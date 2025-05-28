
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
  reference?: string | null;
}


export interface Course {
  id: string;
  createdAt: Date | string;
  updatedAt: Date | string | null
  deletedAt: Date | string | null
  price: string;
  name: string;
  description: string;
  image: string | null;
  paymentScheme: PaymentScheme;
  course: any | undefined; // this is only a workaround for the response retrieved from the backend when used in the course list in user view
}
export interface UserBalance {
  id: string,
  email: string,
  balance: string
}
export interface Company {
  id: string;
  name: string;
  address?: string | null;
  telephone_number?: string | null;
  email?: string | null;
  description?: string | null;
  created_at: string;
  image?: string | null;
  payment_preference?: 'paypal' | 'zelle' | 'both' | null;
  updated_at: string;
}

export type CompanyForm = Omit<Partial<Company>, 'id' | 'created_at' | 'updated_at'>;

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
  | ''

export type PaymentScheme =
  | 'single_payment'
  | 'installments';


export enum Roles {
  ADMIN = 'ADMIN',
  OPERATOR = 'ACCOUNTING',
  USER = 'USER'
}

// This should be an error instead of a string CHECK FOR LATER 

export type CreateTRXResponse = {
  finalAmount: number;
  transactionId: any;
}


export interface UserCoursesFeed { [status: string]: Course[]; }
export const BASE_URL = 'http://localhost:3000';