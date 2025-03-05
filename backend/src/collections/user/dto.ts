import Role from '../role/model';

export interface IUserBody {
  username: string;
  password: string;
  fullName: string;
  role: Role;
}

export interface IUserResponse {
  id: string;
  username: string;
  fullName: string;
  role: Role;
}

export interface IQuery {
  search?: string;
  page?: string;
  limit?: string;
}

export interface IUserReqBody {
  username: string;
  password: string;
  fullName: string;
  email: string;
  roleId: string;
  role?: Role;
}
