import { DataTypes, Model } from 'sequelize';
import sequelize from '../../database/db';
import User from '../user/model';

export enum WorkOrderStatus {
  PENDING = 'Pending',
  IN_PROGRESS = 'In Progress',
  COMPLETED = 'Completed',
  CANCELED = 'Canceled',
}

interface WorkOrderAttributes {
  id?: number;
  orderNumber: string;
  productName: string;
  quantity: number;
  deadline: Date;
  status: WorkOrderStatus;
  operatorId: number;
  createdById: number;
  completedQuantity?: number;
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
  },
  {
    sequelize,
    tableName: 'work_orders',
    timestamps: true,
  }
);

// Define relationships
WorkOrder.belongsTo(User, { foreignKey: 'operatorId', as: 'operator' });
WorkOrder.belongsTo(User, { foreignKey: 'createdById', as: 'createdBy' });

export default WorkOrder;
