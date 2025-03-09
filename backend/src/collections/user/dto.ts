import Role from '../role/model';

export interface IUserBody {
  password: string;
  fullname: string;
  role: Role;
}

export interface IUserResponse {
  id: string;
  fullname: string;
  role: Role;
}

export interface IQuery {
  search?: string;
  page?: string;
  limit?: string;
}

export interface IUserReqBody {
  password: string;
  fullname: string;
  email: string;
  roleId: string;
  role?: Role;
}
