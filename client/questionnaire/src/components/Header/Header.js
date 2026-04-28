import './header.css';
import React, { useState } from 'react';
import logo from '../../img/icon.png';
import {Link, useNavigate} from 'react-router-dom';
import { useAuth } from '../../AuthContext';

function Header() {
    const [activeLink, setActiveLink] = useState('');
    const { isAuthenticated, user, logout } = useAuth();
    const navigate = useNavigate();
    const handleMouseEnter = (link) => {
        setActiveLink(link);
    };

    const handleMouseLeave = () => {
        setActiveLink('');
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav>
            <div className="container-fluid header">
                <header className="d-flex flex-wrap justify-content-center py-3 px-md-5 mb-4 border-bottom border-md-0 mb-md-1">
                    <Link to="/" className="d-flex align-items-center mb-3 mb-md-0 me-md-auto link-body-emphasis text-decoration-none">
                        <img src={logo} alt="Logo" className="logo" />
                        <span className="fs-4">Questionnaire</span>
                    </Link>
                    <ul className="nav nav-pills">
                        <li className="nav-item">
                            <Link
                                to="/"
                                className={`nav-link ${activeLink === 'Главная' ? 'active' : ''}`}
                                onMouseEnter={() => handleMouseEnter('Главная')}
                                onMouseLeave={handleMouseLeave}
                            >
                                Главная
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link
                                to="/surveys"
                                className={`nav-link ${activeLink === 'Опросы' ? 'active' : ''}`}
                                onMouseEnter={() => handleMouseEnter('Опросы')}
                                onMouseLeave={handleMouseLeave}
                            >
                                Опросы
                            </Link>
                        </li>
                        {isAuthenticated ? (
                            <>
                                <li className="nav-item">
                                    <Link
                                        to="/my-surveys"
                                        className={`nav-link ${activeLink === 'Мои опросы' ? 'active' : ''}`}
                                        onMouseEnter={() => handleMouseEnter('Мои опросы')}
                                        onMouseLeave={handleMouseLeave}
                                    >
                                        Мои опросы
                                    </Link>
                                </li>

                                    <span className="nav-link" style={{marginRight: 20}}>
                                        {user.name}
                                    </span>

                                <li className="nav-item">
                                    <button className="nav-link login-button" onClick={handleLogout}>
                                             Выйти
                                    </button>
                                </li>
                            </>
                        ) : (
                            <li className="nav-item">
                                <Link
                                    to="/login"
                                    className={`nav-link login-button ${activeLink === 'Вход | Регистрация' ? 'active' : ''}`}
                                    onMouseEnter={() => handleMouseEnter('Вход | Регистрация')}
                                    onMouseLeave={handleMouseLeave}
                                >
                                    Вход | Регистрация
                                </Link>
                            </li>
                        )}
                    </ul>
                </header>
            </div>
        </nav>
    );
}

export default Header;
