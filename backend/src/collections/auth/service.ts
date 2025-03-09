import jwt from 'jsonwebtoken';
import config from '../../config/config';
import { NotFoundError } from '../../lib/error';
import User from '../user/model';
import { IAuthBody } from './dto';
// Define interfaces for the service
export interface IUserBody {
  password: string;
  fullname: string;
  email: string;
  roleId: number;
  [key: string]: any;
}

export interface IQuery {
  search?: string;
  page?: string;
  limit?: string;
  [key: string]: any;
}

export class AuthService {


  /**
   * Create a new user
   */
  public async login(body: IAuthBody) {
    const user = await User.findOne({
      where: {
        email: body.email,
      },
    });
    if(!user){
      throw new NotFoundError('Invalid Credentials');
    }

    const isValidPassowrd = await user.comparePassword(body.password)
    if(!isValidPassowrd){
      throw new NotFoundError('Invalid credentials');
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        roleId: user.roleId
      },
      config.jwtSecret || 'your-secret-key',
      { expiresIn: '1h' }
    );
    // Return user without sensitive data
    return {
      id: user.id,
      fullname: user.fullname,
      email: user.email,
      roleId: user.roleId,
      token
    };
  }

  public async register(body: IUserBody) {
    const user = await User.create(body);
    return {
      id: user.id,
      fullname: user.fullname,
      email: user.email,
      roleId: user.roleId,
    };
  }

}

export default new AuthService();
