import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import Cookies from 'js-cookie';

interface WorkOrder {
    id: string;
    orderNumber: string;
    productName: string;
    quantity: number;
    deadline: string;
    status: 'Pending' | 'In Progress' | 'Completed' | 'Canceled';
    operator: string;
    createdAt: string;
}

interface WorkOrderState {
    workOrders: WorkOrder[];
    loading: boolean;
    error: string | null;
}
const api = axios.create({
    baseURL: 'http://localhost:8080/api'
});

api.interceptors.request.use((config) => {
    const token = Cookies.get('auth_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});


axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
axios.defaults.headers.common['Content-Type'] = 'application/json';


export const fetchWorkOrders = createAsyncThunk(
    'workOrders/fetchAll',
    async () => {
        const response = await api.get('/work-orders');
        return response.data.data;
    }
);

export const createWorkOrder = createAsyncThunk(
    'workOrders/create',
    async (workOrderData: Omit<WorkOrder, 'id' | 'orderNumber' | 'createdAt'>) => {
        const response = await api.post('/work-orders', workOrderData);
        return response.data.data;
    }
);

export const updateWorkOrder = createAsyncThunk(
    'workOrders/update',
    async (workOrderData: any) => {
        const id = workOrderData.id;
        delete workOrderData.id;
        const response = await api.put(`/work-orders/${id}`, workOrderData);
        return response.data.data;
    }
);
const workOrderSlice = createSlice({
    name: 'workOrders',
    initialState: {
        workOrders: [],
        loading: false,
        error: null
    } as WorkOrderState,
    reducers: {
        updateWorkOrderStatus: (state, action) => {
            const { id, status } = action.payload;
            const workOrder = state.workOrders.find(wo => wo.id === id);
            if (workOrder) {
                workOrder.status = status;
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchWorkOrders.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchWorkOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.workOrders = action.payload;
                state.error = null;
            })
            .addCase(fetchWorkOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch work orders';
            })
            .addCase(createWorkOrder.fulfilled, (state, action) => {
                state.workOrders.push(action.payload);
            })
            .addCase(updateWorkOrder.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateWorkOrder.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.workOrders.findIndex(wo => wo.id === action.payload.id);
                if (index !== -1) {
                    state.workOrders[index] = action.payload;
                }
            })
            .addCase(updateWorkOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to update work order';
            });

    }
});

export const { updateWorkOrderStatus } = workOrderSlice.actions;
export default workOrderSlice.reducer;
