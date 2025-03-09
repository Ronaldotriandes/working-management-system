import { DataTypes, Model, Op } from 'sequelize';
import sequelize from '../../database/db';
import User from '../user/model';

export enum WorkOrderStatus {
  PENDING = 'Pending',
  IN_PROGRESS = 'In Progress',
  COMPLETED = 'Completed',
  CANCELED = 'Canceled',
}

export interface WorkOrderAttributes {
  id?: number;
  orderNumber: string;
  productName: string;
  quantity: number;
  deadline: Date;
  status: WorkOrderStatus;
  operatorId: number;
  createdById: number;
  completedQuantity?: number;
  description?: string;
}

class WorkOrder extends Model<WorkOrderAttributes> implements WorkOrderAttributes {
  public id!: number;
  public orderNumber!: string;
  public productName!: string;
  public quantity!: number;
  public deadline!: Date;
  public status!: WorkOrderStatus;
  public operatorId!: number;
  public createdById!: number;
  public completedQuantity!: number;
  public description!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

WorkOrder.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    orderNumber: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
    },
    productName: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    deadline: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(...Object.values(WorkOrderStatus)),
      allowNull: false,
      defaultValue: WorkOrderStatus.PENDING,
    },
    operatorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    createdById: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    completedQuantity: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    description: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'work_orders',
    timestamps: true,
    hooks: {
      beforeCreate: async (workOrder: WorkOrder) => {
        const today = new Date();
        const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');
        
        // Get the latest work order for today
        const latestWorkOrder = await WorkOrder.findOne({
          where: {
            orderNumber: {
              [Op.like]: `WO-${dateStr}-%`
            }
          },
          order: [['orderNumber', 'DESC']],
        });

        let sequence = 1;
        if (latestWorkOrder) {
          const lastSequence = parseInt(latestWorkOrder.orderNumber.split('-')[2]);
          sequence = lastSequence + 1;
        }

        // Generate the new order number
        workOrder.orderNumber = `WO-${dateStr}-${String(sequence).padStart(3, '0')}`;
      }
    }
  }
);

// Define relationships
WorkOrder.belongsTo(User, { foreignKey: 'operatorId', as: 'operator' });
WorkOrder.belongsTo(User, { foreignKey: 'createdById', as: 'createdBy' });

export default WorkOrder;
