import { fetchUsers } from '@/store/features/userSlice';
import { createWorkOrder } from '@/store/features/workOrderSlice';
import { useAppDispatch } from '@/store/hooks';
import { WorkOrderData } from '@/types/workOrder';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Modal } from '../ui/Modal';
interface CreateWorkOrderModalProps {
    isOpen: boolean;
    onClose: () => void;
}
interface RootState {
    users: {
        users: any[];
        loading: boolean;
        error: string | null;
    }
}

export function CreateWorkOrderModal({ isOpen, onClose }: CreateWorkOrderModalProps) {
    const dispatch = useAppDispatch();
    const { users } = useSelector((state: RootState) => state.users);

    const [formData, setFormData] = useState<Partial<WorkOrderData>>({
        productName: '',
        quantity: 0,
        operatorId: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(createWorkOrder(formData as WorkOrderData));
        onClose();
        window.location.reload();
    };

    useEffect(() => {
        dispatch(fetchUsers({}));
    }, [dispatch]);
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="p-6">
                <h2 className="text-xl font-bold mb-4">Create Work Order</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm text-gray-700 font-medium mb-1">Product Name</label>
                        <input
                            type="text"
                            className="w-full border rounded-md p-2 text-gray-700"
                            value={formData.productName}
                            onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-gray-700 font-medium mb-1">Quantity</label>
                        <input
                            type="number"
                            className="w-full border rounded-md p-2 text-gray-700"
                            value={formData.quantity}
                            onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value, 10) })}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700">Deadline</label>
                        <input
                            type="date"
                            className="w-full border rounded-md p-2 text-gray-700"
                            value={formData.deadline instanceof Date ? formData.deadline.toISOString().split('T')[0] : ''}
                            onChange={(e) => setFormData({ ...formData, deadline: new Date(e.target.value) })}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700">Operator</label>
                        <select
                            className="w-full border rounded-md p-2 text-gray-700"
                            value={formData.operatorId}
                            onChange={(e) => setFormData({ ...formData, operatorId: e.target.value })}
                            required
                        >
                            <option value="">Select Operator</option>
                            {users.filter((item) => item.roleId !== 1).map((user) => (
                                <option key={user.id} value={user.id}>
                                    {user.fullname}
                                </option>
                            ))}
                        </select>
                    </div>

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
                            Create Work Order
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
}
