import { Roles } from "../global.types";


export type LoginResponse = {
  status: number;
  description: string;
}

export type UserPayload = {
  name: string,
  email: string,
  password: string,
  identificationNumber: string,
  firstName: string,
  lastName: string,
  role: Roles
}