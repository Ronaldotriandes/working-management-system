import { DataTypes, Model } from 'sequelize';
import sequelize from '../../database/db';
import WorkOrder from '../workOrder/model';
import User from '../user/model';

interface WorkOderTrackingAttributes {
  id?: number;
  workOrderId: number;
  previousStatus?: string;
  newStatus: string;
  notes?: string;
  quantityChanged?: number;
  userId: number;
}

class WorkOderTracking
  extends Model<WorkOderTrackingAttributes>
  implements WorkOderTrackingAttributes
{
  public id!: number;
  public workOrderId!: number;
  public previousStatus!: string;
  public newStatus!: string;
  public notes!: string;
  public quantityChanged!: number;
  public userId!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

WorkOderTracking.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    workOrderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'work_orders',
        key: 'id',
      },
    },
    previousStatus: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    newStatus: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    quantityChanged: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
  },
  {
    sequelize,
    tableName: 'work_order_tracking',
    timestamps: true,
  }
);

WorkOderTracking.belongsTo(WorkOrder, { foreignKey: 'workOrderId' });
WorkOderTracking.belongsTo(User, { foreignKey: 'userId' });

export default WorkOderTracking;
