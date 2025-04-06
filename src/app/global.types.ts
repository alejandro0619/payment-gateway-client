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

export const BASE_URL = 'http://localhost:3000';