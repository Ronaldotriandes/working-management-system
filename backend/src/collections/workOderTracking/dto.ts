export interface WorkOrderTrackingCreate {
    workOrderId: number;
    previousStatus?: string 
    newStatus: string;
    notes?: string ;
    quantityChanged?: number ;
    userId: number;
}