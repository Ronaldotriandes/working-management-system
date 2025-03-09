import { Request, Response } from 'express';
import { SuccessCreated } from '../../lib/response';
import service from './service';

export class AuthController {


  public async login(req: Request, res: Response): Promise<any> {
    const result = await service.login(req.body);
    return SuccessCreated(res, result, 'Successfully logged in');
  }

  public async register(req: Request, res: Response): Promise<any> {
    const result = await service.register(req.body);
    return SuccessCreated(res, result);
  }
}

export default new AuthController();
