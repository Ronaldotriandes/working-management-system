import { fetchWorkOrders, updateWorkOrder, updateWorkOrderStatus } from '@/store/features/workOrderSlice';
import { useAppDispatch } from '@/store/hooks';
import { getDecodeToken } from '@/store/types';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

interface RootState {
    workOrders: {
        workOrders: any[];
        loading: boolean;
        error: string | null;
    }
}

export function LaporanWorkOrderTable() {
    const decodeToken = getDecodeToken()
    const dispatch = useAppDispatch()
    const { workOrders, loading, error } = useSelector((state: RootState) => state.workOrders);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedWorkOrder, setSelectedWorkOrder] = useState(null);

    // Add this handler
    const handleEdit = (workOrder: any) => {
        setSelectedWorkOrder(workOrder);
        setIsEditModalOpen(true);
    };

    const handleSaveEdit = (updatedData: any) => {
        // Implement your edit logic here
        let body: any = { id: updatedData.id }
        console.log(updatedData)
        if (decodeToken && decodeToken.roleId === 1) {
            body.status = updatedData.status;
            body.operatorId = updatedData.operator?.id;
        }
        else {
            body.quantity = updatedData.quantity;
            body.status = updatedData.status;
            body.operatorId = updatedData.operator?.id;
        }
        dispatch(updateWorkOrder(body as any));
        window.location.reload();
    };

    const [filters, setFilters] = useState({
        status: '',
        dateFrom: '',
        dateTo: ''
    });

    useEffect(() => {
        dispatch(fetchWorkOrders() as any);
    }, [filters])
    useEffect(() => {
        dispatch(fetchWorkOrders() as any);
    }, [dispatch]);

    const handleStatusChange = (id: string, status: string) => {
        dispatch(updateWorkOrderStatus({ id, status }));
    };

    const filteredWorkOrders = workOrders.filter(wo => {
        if (filters.status && wo.status !== filters.status) return false;
        if (filters.dateFrom && new Date(wo.deadline) < new Date(filters.dateFrom)) return false;
        return true;
    });

    return (
        <div>
            <table className="w-full border-collapse border text-gray-700">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="p-2 border">Order Number</th>
                        <th className="p-2 border">Product Name</th>
                        <th className="p-2 border">Quantity</th>
                        <th className="p-2 border">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {loading ? (
                        <tr>
                            <td colSpan={7} className="text-center p-4">Loading...</td>
                        </tr>
                    ) : (
                        filteredWorkOrders.map((workOrder) => (
                            <tr key={workOrder.id}>
                                <td className="p-2 border">{workOrder.orderNumber}</td>
                                <td className="p-2 border">{workOrder.productName}</td>
                                <td className="p-2 border">{workOrder.quantity}</td>
                                <td className="p-2 border">{workOrder.status}</td>

                            </tr>

                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}
