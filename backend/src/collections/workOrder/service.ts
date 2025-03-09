import { NotFoundError } from '../../lib/error';
import { DecodedToken } from '../../middleware/auth.middleware';
import User from '../user/model';
import WorkOrderTrackingService from '../workOderTracking/service';
import { IWorkOrderBody } from './dto';
import WorkOrder, { WorkOrderAttributes, WorkOrderStatus } from './model';

// Define interfaces for the service
 interface BodyCreateWork extends IWorkOrderBody {
  [key: string]: any;
}

export interface IQuery {
  search?: string;
  page?: string;
  limit?: string;
  [key: string]: any;
}

export class WorkOrderService {

  /**
   * Get all users with pagination and search
   */
  public async GetAllWorkOrder(query: IQuery, tokenUser: DecodedToken) {
    const searchQuery = query.search || '';
    const page: number = parseInt(query.page as string) || 1;
    const limit: number = parseInt(query.limit as string) || 10;
    const offset = (page - 1) * limit;
    const { count, rows } = await WorkOrder.findAndCountAll({
      where: tokenUser.roleId === 1 ? {} : { operatorId: tokenUser.id },
      include: [
        { 
          model: User, 
          as: 'operator',
          attributes: ['id', 'fullname', 'email']
        },
      ]
      // attributes: ['id', 'fullname', 'email', 'roleId'],
      // include: [{ model: require('../role/model').default, as: 'userRole' }],
    });
    return {
      data: rows,
      meta: {
        totalUsers: count,
        totalPages: Math.ceil(count / limit),
        page,
      },
    };
  }

  /**
   * Create a new user
   */
  public async createWork(body: BodyCreateWork, tokenUser: DecodedToken) {
    const workOrderData: WorkOrderAttributes = {
      ...body,
      status: WorkOrderStatus.PENDING,
      orderNumber: body.orderNumber || '',
      operatorId: body.operatorId,
      createdById: Number(tokenUser.id),
    };
    console.log(workOrderData);
    const workOrder = await WorkOrder.create(workOrderData);

    // Return work order without sensitive data
    return {
      id: workOrder.id,
      orderNumber: workOrder.orderNumber,
      status: workOrder.status,
      operatorId: workOrder.operatorId,
      createdById: workOrder.createdById,
    };
  }  /**
   * Find a user by ID
   */
  public async findById(id: string) {
    const user = await WorkOrder.findByPk(id, {
      attributes: ['id', 'orderNumber', 'status', 'operatorId'],
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    return user;
  }

  /**
   * Update a user
   */
  public async update(id: string, body: Partial<any>, tokenUser: DecodedToken) {
    // Find user first
    let workOrder = await WorkOrder.findByPk(id);
    if (!workOrder) {
      throw new NotFoundError('workOrder not found');
    }
    const databody : any= {userId: tokenUser.id, workOrderId: workOrder.id}
    console.log(body)
    if(body.status ) {
      databody.newStatus = body.status
      databody.previousStatus = workOrder.status
    }
    if(body.quantity) {
      databody.quantityChanged = body.quantity
    }
    if(body.notes) {
      databody.notes = body.notes
    }
    // Update the user - password hashing is handled by model hooks if password changed
    await workOrder.update(body);

    //store to tracking
 
    await WorkOrderTrackingService.createWorkOrderTracking(databody);
    workOrder = await WorkOrder.findByPk(id);
     if (!workOrder) {
      throw new NotFoundError('workOrder not found');
    }
    // Return updated user without password
    return {
      id: workOrder.id,
      orderNumber: workOrder.orderNumber,
      status: workOrder.status,
      operatorId: workOrder.operatorId,
      createdById: workOrder.createdById,
      
    };
  }

  /**
   * Delete a user
   */
  public async deleteById(id: string) {
    const user = await WorkOrder.findByPk(id);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    await user.destroy();

    return {
      id: user.id,
      message: 'User deleted successfully',
    };
  }
}

export default new WorkOrderService();
