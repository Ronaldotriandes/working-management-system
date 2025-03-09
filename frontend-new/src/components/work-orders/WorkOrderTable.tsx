import { fetchUsers } from '@/store/features/userSlice';
import { fetchWorkOrders, updateWorkOrder, updateWorkOrderStatus } from '@/store/features/workOrderSlice';
import { useAppDispatch } from '@/store/hooks';
import { getDecodeToken } from '@/store/types';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Modal } from '../ui/Modal';

interface RootState {
    workOrders: {
        workOrders: any[];
        loading: boolean;
        error: string | null;
    }
}

export function WorkOrderTable() {
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
            <div className="mb-4 flex gap-4 text-gray-700">
                <select
                    className="border p-2 rounded"
                    value={filters.status}
                    onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                >
                    <option value="">All Status</option>
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Canceled">Canceled</option>
                </select>

                <input
                    type="date"
                    className="border p-2 rounded"
                    value={filters.dateFrom}
                    onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                />
            </div>

            <table className="w-full border-collapse border text-gray-700">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="p-2 border">Order Number</th>
                        <th className="p-2 border">Product Name</th>
                        <th className="p-2 border">Quantity</th>
                        <th className="p-2 border">Deadline</th>
                        <th className="p-2 border">Status</th>
                        <th className="p-2 border">Operator</th>
                        <th className="p-2 border">Actions</th>
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
                                <td className="p-2 border">{new Date(workOrder.deadline).toLocaleDateString()}</td>
                                <td className="p-2 border">{workOrder.status}</td>

                                <td className="p-2 border">{workOrder.operator?.fullname}</td>
                                <td className="p-2 border">
                                    <button className="text-blue-500 mr-2"
                                        onClick={() => handleEdit(workOrder)}
                                    >Edit</button>
                                    {isEditModalOpen && (
                                        <EditModal
                                            isOpen={isEditModalOpen}
                                            onClose={() => setIsEditModalOpen(false)}
                                            workOrder={selectedWorkOrder}
                                            onSave={handleSaveEdit}
                                        />
                                    )}
                                    {/* <button className="text-red-500">Delete</button> */}
                                </td>

                            </tr>

                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}

// Add this interface
interface EditModalProps {
    isOpen: boolean;
    onClose: () => void;
    workOrder: any;
    onSave: (updatedData: any) => void;
}
interface RootState {
    users: {
        users: any[];
        loading: boolean;
        error: string | null;
    }
}

// Add the EditModal component
function EditModal({ isOpen, onClose, workOrder, onSave }: EditModalProps) {
    const dispatch = useAppDispatch();
    const decodeToken = getDecodeToken()
    const [editData, setEditData] = useState({
        id: workOrder?.id || '',
        productName: workOrder?.productName || '',
        quantity: workOrder?.quantity || '',
        deadline: workOrder?.deadline || '',
        operator: workOrder?.operator || '',
        status: workOrder?.status || '',
    });
    const { users } = useSelector((state: RootState) => state.users);

    useEffect(() => {
        dispatch(fetchUsers({ roleId: 2 }));
    }, [dispatch]);
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(editData);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="p-6">
                <h2 className="text-xl font-bold mb-4">Edit Work Order</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Product Name</label>
                        <input
                            type="text"
                            className="w-full border rounded-md p-2 text-gray-700 disabled:bg-gray-100 disabled:text-gray-700"
                            value={editData.productName}
                            onChange={(e) => setEditData({ ...editData, productName: e.target.value })}
                            disabled
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Quantity</label>
                        <input
                            type="number"
                            className="w-full border rounded-md p-2 text-gray-700 disabled:bg-gray-100 disabled:text-gray-700"
                            value={editData.quantity}
                            onChange={(e) => setEditData({ ...editData, quantity: e.target.value })}
                            disabled={decodeToken && decodeToken.roleId === 1 ? true : false}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Deadline</label>
                        <input
                            type="date"
                            className="w-full border rounded-md p-2 text-gray-700 disabled:bg-gray-100 disabled:text-gray-700"
                            value={editData.deadline}
                            onChange={(e) => setEditData({ ...editData, deadline: e.target.value })}
                            disabled
                        />
                    </div>
                    <div >
                        <label className="block text-sm font-medium mb-1 text-gray-700">Status</label>
                        <select
                            className="w-full border rounded-md p-2 text-gray-700"
                            value={editData.status}
                            onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                        >
                            <option value="">All Status</option>
                            <option value="Pending">Pending</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                            <option value="Canceled">Canceled</option>
                        </select>
                    </div>
                    {decodeToken && decodeToken.roleId === 1 &&
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-700 ">Operator</label>
                            <select
                                className="w-full border rounded-md p-2 text-gray-700 disabled:bg-gray-100 disabled:text-gray-700"
                                value={editData.operator.id}
                                onChange={(e) => setEditData({ ...editData, operator: e.target.value })}
                                required
                            >
                                <option value="">Select Operator</option>
                                {users.filter((item) => item.roleId !== 1).map((user) => (
                                    <option key={user.id} value={user.id}>
                                        {user.fullname}
                                    </option>
                                ))}
                            </select>
                        </div>}


                    <div className="flex justify-end gap-2 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border rounded-md hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
}
