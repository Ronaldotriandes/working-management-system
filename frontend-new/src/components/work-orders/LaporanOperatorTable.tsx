import { fetchWorkOrders } from '@/store/features/workOrderSlice';
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

export function LaporanOperatorWorkTable() {
    const decodeToken = getDecodeToken()
    const dispatch = useAppDispatch()
    const { workOrders, loading, error } = useSelector((state: RootState) => state.workOrders);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedWorkOrder, setSelectedWorkOrder] = useState(null);



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


    const getUniqueWorkOrdersByOperator = (workOrders: any[]) => {
        const operatorSummary = new Map();

        workOrders.forEach(order => {
            if (order.operator?.id) {
                if (!operatorSummary.has(order.operator.id)) {
                    operatorSummary.set(order.operator.id, {
                        ...order,
                        quantity: Number(order.quantity)
                    });
                } else {
                    const existing = operatorSummary.get(order.operator.id);
                    existing.quantity += Number(order.quantity);
                    operatorSummary.set(order.operator.id, existing);
                }
            }
        });

        return Array.from(operatorSummary.values());
    };

    // Update the filtered work orders to use the new function:
    const filteredWorkOrders = getUniqueWorkOrdersByOperator(
        workOrders.filter(wo => {
            if (filters.status && wo.status !== filters.status) return false;
            if (filters.dateFrom && new Date(wo.deadline) < new Date(filters.dateFrom)) return false;
            if (wo.status === 'Completed') return true;
            return false;
        })
    );

    return (
        <div>


            <table className="w-full border-collapse border text-gray-700">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="p-2 border">Operator Name</th>
                        <th className="p-2 border">Product Name</th>
                        <th className="p-2 border">Quantity</th>
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
                                <td className="p-2 border">{workOrder.operator?.fullname}</td>

                                <td className="p-2 border">{workOrder.productName}</td>
                                <td className="p-2 border">{workOrder.quantity}</td>


                            </tr>

                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}
