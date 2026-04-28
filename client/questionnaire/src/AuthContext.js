import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState({ id: null, name: '' });
    const navigate = useNavigate();

    useEffect(() => {
        // При загрузке компонента проверяем наличие сохраненной аутентификации в localStorage
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setIsAuthenticated(true);
            setUser(parsedUser);
        }
    }, []);

    const login = (id, name) => {
        setIsAuthenticated(true);
        setUser({ id, name });
        localStorage.setItem('user', JSON.stringify({ id, name })); // Сохраняем пользователя в localStorage
        navigate('/');
    };

    const logout = () => {
        setIsAuthenticated(false);
        setUser({ id: null, name: '' });
        localStorage.removeItem('user'); // Удаляем пользователя из localStorage при выходе
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
