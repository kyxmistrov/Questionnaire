import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import axios from 'axios';
import './LoginPage.css';

function LoginPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();

    useEffect(() => {
        setUsername('');
        setEmail('');
        setPassword('');
    }, [isLogin]);

    const handleLogin = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.get(`http://localhost:8080/api/users/find-user`, {
                params: { email, password }
            });
            const user = response.data;
            if (user.length > 0) {
                const { userId, username } = user[0];
                login(userId, username);
            } else {
                alert('Пользователь не найден. Пожалуйста, зарегистрируйтесь.');
            }
        } catch (error) {
            console.error('Ошибка при входе:', error);
            alert('Произошла ошибка при входе.');
        }
    };

    const handleRegister = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post(`http://localhost:8080/api/users/registration`, null, {
                params: {
                    username,
                    email,
                    password
                }
            });
            const data = response.data;
            if (data.error) {
                alert(data.error);
            } else {
                alert('Регистрация прошла успешно. Пожалуйста, войдите в систему.');
                setIsLogin(true);
            }
        } catch (error) {
            console.error('Ошибка при регистрации:', error);
            alert('Произошла ошибка при регистрации.');
        }
    };

    return (
        <div style={{justifyContent:"start", marginTop:100 , marginBottom: "auto"}} className="d-flex flex-column min-vh-81 justify-content-center align-items-center">
            <div className="login-register-form p-4 shadow">
                <h2>{isLogin ? 'Вход' : 'Регистрация'}</h2>
                <form onSubmit={isLogin ? handleLogin : handleRegister}>
                    {!isLogin && (
                        <div className="form-group">
                            <label htmlFor="username">Имя пользователя</label>
                            <input
                                type="text"
                                id="username"
                                className="form-control"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                autoComplete="off"
                            />
                        </div>
                    )}
                    <div className="form-group">
                        <label htmlFor="email">Электронная почта</label>
                        <input
                            type="email"
                            id="email"
                            className="form-control"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            autoComplete="off"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Пароль</label>
                        <input
                            type="password"
                            id="password"
                            className="form-control"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            autoComplete="off"
                        />
                    </div>
                    <button type="submit" className="btn btn-primary mt-3 w-100">
                        {isLogin ? 'Вход' : 'Регистрация'}
                    </button>
                </form>
                <button className="btn btn-link mt-3 w-100" onClick={() => setIsLogin(!isLogin)}>
                    {isLogin ? 'Нет учетной записи? Зарегистрироваться' : 'Уже есть учетная запись? Войти'}
                </button>
            </div>
        </div>
    );
}

export default LoginPage;
