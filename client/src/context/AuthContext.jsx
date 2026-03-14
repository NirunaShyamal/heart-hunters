import { createContext, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { loginUser, registerUser, logout } from '../store/authSlice';

const AuthContext = createContext();

// Thin bridge: wraps Redux so existing consumers of AuthContext still work unchanged
export const AuthProvider = ({ children }) => {
    const dispatch = useDispatch();
    const { user, status, error } = useSelector((state) => state.auth);
    const loading = status === 'loading';

    const login = async (username, password) => {
        const result = await dispatch(loginUser({ username, password }));
        if (loginUser.rejected.match(result)) {
            throw new Error(result.payload);
        }
        return result.payload;
    };

    const register = async (username, password, email) => {
        const result = await dispatch(registerUser({ username, email, password }));
        if (registerUser.rejected.match(result)) {
            throw new Error(result.payload);
        }
        return result.payload;
    };

    const logoutUser = () => dispatch(logout());

    return (
        <AuthContext.Provider value={{ user, login, register, logout: logoutUser, loading, error }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
