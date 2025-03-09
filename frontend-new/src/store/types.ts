import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { store } from './store';
export type AppDispatch = typeof store.dispatch
interface DecodedToken {
    exp: number;
    id: string;
    roleId: string | number;
    fullname: string
}
export const getDecodeToken = (): DecodedToken | null => {
    try {
        const token = Cookies.get('auth_token');
        if (token) {
            const decoded = jwtDecode(token);
            if (decoded) return decoded as DecodedToken;
            return null
        }
        return null
    } catch (error) {
        return null;
    }
};
