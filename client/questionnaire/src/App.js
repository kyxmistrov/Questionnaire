import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import SurveysPage from './pages/SurveysPage';
import MySurveysPage from './pages/MySurveysPage';
import LoginPage from './pages/LoginPage';
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import CreatePage from "./pages/CreatePage";
import StartPage from "./pages/StartPage";
import './mian.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { AuthProvider } from './AuthContext';


function App() {
    return (
        <AuthProvider>
            <div className="d-flex flex-column min-vh-100">
                <Header />
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/surveys" element={<SurveysPage />} />
                    <Route path="/my-surveys" element={<MySurveysPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/create" element={<CreatePage />} />
                    <Route path="/test" element={<StartPage />} />
                </Routes>
                <Footer  />
            </div>
        </AuthProvider>
    );
}

export default App;
