import { NotFoundError } from '../../lib/error';
import { DecodedToken } from '../../middleware/auth.middleware';
import User from '../user/model';
import { WorkOrderTrackingCreate } from './dto';
import WorkOrderTracking from './model';

// Define interfaces for the service
 interface BodyCreateWork extends WorkOrderTrackingCreate {
  [key: string]: any;
}

export interface IQuery {
  search?: string;
  page?: string;
  limit?: string;
  [key: string]: any;
}

export class WorkOrderTrackingService {
  /**
   * Get all users with pagination and search
   */
  public async GetAllWorkOrderTracking(query: IQuery, tokenUser: DecodedToken) {
    const searchQuery = query.search || '';
    const page: number = parseInt(query.page as string) || 1;
    const limit: number = parseInt(query.limit as string) || 10;
    const offset = (page - 1) * limit;
    const { count, rows } = await WorkOrderTracking.findAndCountAll({
      limit,
      offset,
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
  public async createWorkOrderTracking(body: BodyCreateWork) {
    const workOrderData: BodyCreateWork = {
      ...body,
    };
    const workOrder = await WorkOrderTracking.create(body);

    // Return work order without sensitive data
    return {
      ...workOrder.toJSON(),
    };
  }  /**
   * Find a user by ID
   */
  public async findById(id: string) {
    const user = await WorkOrderTracking.findByPk(id, {
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    return user;
  }



}

export default new WorkOrderTrackingService();
