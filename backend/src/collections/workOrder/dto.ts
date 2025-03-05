import { WorkOrderStatus } from '../../entities/WorkOrder';

export interface IWorkOrderBody {
  productName: string;
  quantity: number;
  deadline: Date;
  assignedOperatorId: string;
}

export interface IUpdateWorkOrderBody {
  productName?: string;
  quantity?: number;
  deadline?: Date;
  status?: WorkOrderStatus;
  assignedOperatorId?: string;
}

export interface IStatusChangeBody {
  newStatus: WorkOrderStatus;
  quantityAffected: number;
  note?: string;
}

export interface IWorkOrderQuery {
  search?: string;
  page?: string;
  limit?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  operatorId?: string;
}
