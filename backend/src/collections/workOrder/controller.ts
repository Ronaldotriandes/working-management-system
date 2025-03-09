import { Request, Response } from 'express';
import { SuccessCreated, SuccessOK, SuccessOKMeta } from '../../lib/response';
import service from './service';

export class WorkOrderController {
  public async getAllData(req: Request, res: Response): Promise<any> {
    if (!req.tokenUser) {
      throw new Error('Token user is undefined');
    }
    const result = await service.GetAllWorkOrder(req.query, req.tokenUser);
    const { data } = result;
    return SuccessOKMeta(res, data, 'Success', result.meta);
  }
  public async save(req: Request, res: Response): Promise<any> {
    if (!req.tokenUser) {
      throw new Error('Token user is undefined');
    }
    const result = await service.createWork(req.body, req.tokenUser);
    return SuccessCreated(res, result);
  }

  public async getById(req: Request, res: Response): Promise<any> {
    const result = await service.findById(req.params.id);
    return SuccessOK(res, result, 'Success get data');
  }

  public async update(req: Request, res: Response): Promise<any> {
    if (!req.tokenUser) {
      throw new Error('Token user is undefined');
    }
    const result = await service.update(req.params.id, req.body,  req.tokenUser);
    return SuccessOK(res, result, 'Book Update Successfully');
  }

  public async delete(req: Request, res: Response): Promise<any> {
    const result = await service.deleteById(req.params.id);
    return SuccessOK(res, result, 'Book Delete Successfully');
  }
}

export default new WorkOrderController();
