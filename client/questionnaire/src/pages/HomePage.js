import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from '../components/Header/Header';
import Content from '../components/Content/Content';
import Footer from '../components/Footer/Footer';
import '../mian.css';

function HomePage() {
    return (
        <div className="d-flex flex-column min-vh-100">

            <Content/>

        </div>
    );
}

export default HomePage;
