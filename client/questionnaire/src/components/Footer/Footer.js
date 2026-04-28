import React from 'react';
import { FaTwitter, FaInstagram, FaFacebook } from 'react-icons/fa';
import './footer.css';

function Footer() {
    const currentYear = new Date().getFullYear();  // Получаем текущий год

    return (
        <footer className="footer bg-dark py-2" style={{marginTop:'auto'}}>
            <div className="container-fluid d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center">
                    <a href="/" className="mb-3 me-2 mb-md-0 text-body-secondary text-decoration-none lh-1">
                        <svg className="bi" width="30" height="24">
                            <use xlinkHref="#bootstrap"></use>
                        </svg>
                    </a>
                    <span className="mb-3 mb-md-0 text-body-secondary">© {currentYear} Questionnaire</span>  {/* Здесь вставляется текущий год */}
                </div>
                <ul className="nav list-unstyled d-flex">
                    <li className="ms-3"><a className="text-body-secondary" href="https://twitter.com" target="_blank"><FaTwitter style={{marginTop: 15}}/></a></li>
                    <li className="ms-3"><a className="text-body-secondary" href="https://instagram.com" target="_blank"><FaInstagram style={{marginTop: 15}}/></a></li>
                    <li className="ms-3"><a className="text-body-secondary" href="https://facebook.com" target="_blank"><FaFacebook style={{marginTop: 15}}/></a></li>
                </ul>
            </div>
        </footer>
    );
}

export default Footer;
