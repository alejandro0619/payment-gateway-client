import { Roles } from "../global.types";



type UserRoles = 'admin' | 'user' | 'student'; 


export interface User {
  id: string;
  name: string;
  email: string;
  identificationNumber: string;
  firstName: string;
  lastName: string;
  role: UserRoles
}

export interface SignInResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface CreateUser extends User {
  password: string; 
}