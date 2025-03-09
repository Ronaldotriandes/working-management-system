import Role from '../collections/role/model';
import User from '../collections/user/model';
import WorkOrderTracking from '../collections/workOderTracking/model';
import WorkOrder from '../collections/workOrder/model';
import sequelize from './db';

User.belongsTo(Role, { foreignKey: 'roleId', as: 'userRole' });
Role.hasMany(User, { foreignKey: 'roleId' });

WorkOrder.belongsTo(User, { foreignKey: 'operatorId', as: 'taskOperator' });
WorkOrder.belongsTo(User, { foreignKey: 'createdById', as: 'createdByUser' });
User.hasMany(WorkOrder, { foreignKey: 'operatorId', as: 'assignedWorkOrders' });
User.hasMany(WorkOrder, { foreignKey: 'createdById', as: 'createdWorkOrders' });

WorkOrderTracking.belongsTo(WorkOrder, { foreignKey: 'workOrderId' });
WorkOrderTracking.belongsTo(User, { foreignKey: 'userId' });
WorkOrder.hasMany(WorkOrderTracking, { foreignKey: 'workOrderId' });
User.hasMany(WorkOrderTracking, { foreignKey: 'userId' });

// Initialize database with predefined roles
const initializeDatabase = async () => {
  try {
    await sequelize.sync({ alter: true });

    // Create roles if they don't exist
    const roles = [
      { name: 'Production Manager', description: 'Can create and manage work orders' },
      { name: 'Operator', description: 'Can view and update assigned work orders' },
    ];

    for (const role of roles) {
      await Role.findOrCreate({
        where: { name: role.name },
        defaults: role,
      });
    }

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};

export { Role, User, WorkOrder, WorkOrderTracking, initializeDatabase, sequelize };
