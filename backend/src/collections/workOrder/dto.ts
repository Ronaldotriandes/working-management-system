import { WorkOrderStatus } from './model';

export interface IWorkOrderBody {
  productName: string;
  quantity: number;
  deadline: Date;
  operatorId: number;
}

export interface IUpdateWorkOrderBody {
  productName?: string;
  quantity?: number;
  deadline?: Date;
  status?: WorkOrderStatus;
  operatorId?: string;
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
