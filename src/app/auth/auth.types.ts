import { Roles } from "../global.types";

export interface User {
  id: string;
  name: string;
  email: string;
  identificationNumber: string;
  firstName: string;
  lastName: string;
  role: Roles
}

export interface SignInResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface CreateUser extends User {
  password: string; 
}