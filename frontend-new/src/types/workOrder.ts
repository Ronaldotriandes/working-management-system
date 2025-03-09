export interface WorkOrder {
  id: string;
  orderNumber: string; // WO-YYYYMMDD-XXX
  productName: string;
  quantity: number;
  deadline: Date;
  status: 'Pending' | 'In Progress' | 'Completed' | 'Canceled';
  operator: string;
  createdAt: Date;
}

export interface WorkOrderData {
  productName: string;
  quantity: number;
  deadline?: Date;
  operatorId: string | number;
}

export interface WorkOrderUpdate {
  id: string;
  productName?: string;
  quantity: number;
  deadline?: Date;
  operatorId?: string | number;
}