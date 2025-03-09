import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

const decodeToken = (token: string) => {
    try {
        return jwtDecode(token);
    } catch (error) {
        return null;
    }
};

axios.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 404) {
            return Promise.reject('API endpoint not found');
        }
        if (error.code === 'ERR_NETWORK') {
            return Promise.reject('Network error - check if server is running');
        }
        return Promise.reject(error);
    }
);
axios.interceptors.request.use((config) => {
    const token = Cookies.get('auth_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
axios.defaults.headers.common['Content-Type'] = 'application/json';

export const loginUser = createAsyncThunk(
    'auth/login',
    async (credentials: { email: string; password: string }) => {
        const response = await axios.post('http://localhost:8080/api/auth/login', credentials, {
            withCredentials: false,
        });
        const decodedToken = decodeToken(response.data.data.token);
        console.log(decodedToken, 'adssadsa')
        Cookies.set('auth_token', response.data.data.token, {
            expires: 7, // 7 days
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });
        return response.data;
    }
);

export const registerUser = createAsyncThunk(
    'auth/register',
    async (userData: { email: string; password: string; fullname: string, roleId: string }) => {
        const response = await axios.post('http://127.0.0.1:8080/api/auth/register', userData);
        return response.data;
    }
);
interface UserDto {
    id: number;
    email: string;
    fullname: string;
    token: string
}

interface ResDTO {
    status: boolean;
    message: string;
    data: UserDto;
}
const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null as UserDto | null,
        loading: false,
        error: null as string | null,
    },
    reducers: {
        logout: (state) => {
            state.user = null;
            Cookies.remove('auth_token');
        },
        restoreUser: (state, action) => {
            state.user = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload?.data;
                state.error = null;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload?.data;
                state.error = null;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },

});
export const { logout } = authSlice.actions;
export default authSlice.reducer;
