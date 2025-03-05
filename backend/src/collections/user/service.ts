import User from './model';
import { NotFoundError } from '../../lib/error';
import bcrypt from 'bcrypt';
import { Op } from 'sequelize';

// Define interfaces for the service
export interface IUserBody {
  username: string;
  password: string;
  fullName: string;
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

export class UserService {
  /**
   * Get all users with pagination and search
   */
  public async getAllUsers(query: IQuery) {
    const searchQuery = query.search || '';
    const page: number = parseInt(query.page as string) || 1;
    const limit: number = parseInt(query.limit as string) || 10;
    const offset = (page - 1) * limit;

    // Build where clause for search
    const whereClause = searchQuery
      ? {
          [Op.or]: [
            { username: { [Op.like]: `%${searchQuery}%` } },
            { fullName: { [Op.like]: `%${searchQuery}%` } },
            { email: { [Op.like]: `%${searchQuery}%` } },
          ],
        }
      : {};

    // Get users with count for pagination
    const { count, rows } = await User.findAndCountAll({
      where: whereClause,
      limit,
      offset,
      attributes: ['id', 'username', 'fullName', 'email', 'roleId'],
      include: [{ model: require('../role/model').default, as: 'userRole' }],
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
  public async createUser(body: IUserBody) {
    // Create user - password hashing is handled by model hooks
    const user = await User.create(body);

    // Return user without sensitive data
    return {
      id: user.id,
      username: user.username,
      fullName: user.fullName,
      email: user.email,
      roleId: user.roleId,
    };
  }

  /**
   * Find a user by ID
   */
  public async findById(id: string) {
    const user = await User.findByPk(id, {
      attributes: ['id', 'username', 'fullName', 'email', 'roleId'],
      include: [{ model: require('../role/model').default, as: 'userRole' }],
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    return user;
  }

  /**
   * Update a user
   */
  public async update(id: string, body: Partial<IUserBody>) {
    // Find user first
    const user = await User.findByPk(id);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Update the user - password hashing is handled by model hooks if password changed
    await user.update(body);

    // Return updated user without password
    return {
      id: user.id,
      username: user.username,
      fullName: user.fullName,
      email: user.email,
      roleId: user.roleId,
    };
  }

  /**
   * Delete a user
   */
  public async deleteById(id: string) {
    const user = await User.findByPk(id);
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

export default new UserService();
