import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './content.css';
import { HiOutlineDocumentSearch } from "react-icons/hi";
import { LuFilter } from "react-icons/lu";
import { Link } from "react-router-dom";
import { RiSurveyLine, RiSurveyFill } from "react-icons/ri";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../AuthContext';

function getRandomLightColor() {
    const letters = 'BCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * letters.length)];
    }
    return color;
}

function Card({ id, title, text, date, backgroundColor, type, uniqueId }) {
    const navigate = useNavigate();
    const { user } = useAuth();

    const handleStartTest = () => {
        navigate('/test', { state: { id, title, type } });
    };

    const handleCopyUniqueId = () => {
        navigator.clipboard.writeText(`#${uniqueId}`).then(() => {
            //console.log(`Copied: ${uniqueId}`);
        }).catch(err => {
            console.error('Failed to copy: ', err);
        });
    };

    return (
        <div className="col mb-4">
            <div className="card shadow-sm">
                <div style={{position: 'absolute', width: '100%'}}>
                    <div style={{display: 'flex', justifyContent: 'space-between', padding: '5px'}}>
                        <div onClick={handleCopyUniqueId}
                             style={{cursor: 'pointer', color: 'black'}}>
                            #{uniqueId}
                        </div>
                        <div style={{color: 'black'}}>{type}</div>
                    </div>
                </div>
                <div className="bd-placeholder-img card-img-top no-select curs"
                     style={{width: '100%', height: '225px', backgroundColor}}>

                    <div className="placeholder-title" style={{textAlign: 'center', lineHeight: '225px'}}><u>{title}</u>
                    </div>
                </div>
                <div className="card-body">
                    <p className="card-text" style={{color: '#000'}}>
                        {text ? text : "Без описания"}
                    </p>
                    <div className="d-flex justify-content-between align-items-center">
                        <div className="btn-group">
                            <button type="button" className="btn btn-sm btn-outline-secondary hov"
                                    onClick={handleStartTest}>Пройти
                            </button>
                        </div>
                        <small className="text-body-secondary">{date}</small>
                    </div>
                </div>
            </div>
        </div>
    );
}

function Cards({cardsPerPage = 8}) {
    const [cardData, setCardData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedFilter, setSelectedFilter] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const [backgroundColors, setBackgroundColors] = useState({});
    const [hover, setHover] = useState(false);

    useEffect(() => {
        axios.get('http://localhost:8080/api/tests/find-all')
            .then(response => {
                setCardData(response.data);
            })
            .catch(error => {
                console.error('Ошибка при получении данных:', error);
            });
    }, []);

    useEffect(() => {
        const isUniqueIdSearch = searchTerm.startsWith('#');
        const filteredData = cardData.filter(card => {
            if (isUniqueIdSearch) {
                // Проверка на соответствие uniqueId
                const uniqueIdMatch = `#${card.uniqueId}` === searchTerm;
                return uniqueIdMatch;
            } else {
                // Поиск по названию
                const titleMatch = card.title.toLowerCase().includes(searchTerm.toLowerCase());
                const filterMatch = selectedFilter ? card.type === selectedFilter : true;
                return titleMatch && filterMatch;
            }
        });
        setFilteredData(filteredData);
    }, [cardData, searchTerm, selectedFilter]);

    useEffect(() => {
        const colors = {};
        cardData.forEach(card => {
            if (!backgroundColors[card.title]) {
                colors[card.title] = getRandomLightColor();
            } else {
                colors[card.title] = backgroundColors[card.title];
            }
        });
        if (JSON.stringify(colors) !== JSON.stringify(backgroundColors)) {
            setBackgroundColors(colors);
        }
    }, [cardData]);

    const pageCount = Math.ceil(filteredData.length / cardsPerPage);

    const handlePrevPage = () => {
        setCurrentPage(prevPage => Math.max(prevPage - 1, 1));
    };

    const handleNextPage = () => {
        setCurrentPage(prevPage => Math.min(prevPage + 1, pageCount));
    };

    const handleSearchChange = event => {
        setSearchTerm(event.target.value);
        setCurrentPage(1);
    };

    const handleFilterChange = event => {
        setSelectedFilter(event.target.value);
        setCurrentPage(1);
    };

    const displayCards = () => {
        const startIndex = (currentPage - 1) * cardsPerPage;
        const endIndex = startIndex + cardsPerPage;
        return filteredData.slice(startIndex, endIndex).map((card, index) => (
            <Card
                key={index}
                id={card.testId}
                title={card.title}
                text={card.description}
                date={card.createdAt}
                backgroundColor={backgroundColors[card.title]}
                type={card.type}
                uniqueId={card.uniqueId}
            />
        ));
    };

    const filterOptions = Array.from(new Set(cardData.map(card => card.type)));

    return (
        <div className="container" style={{ marginTop: 10 }}>
            <Link
                className="create-but custom-button"
                to="/create"
                style={{ marginLeft: '24px' }}
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
            >
                {hover ? <RiSurveyFill className="stile-on" size={29} /> : <RiSurveyLine className="stile-off" size={29} />}
                <span>Перейти к созданию</span>
            </Link>

            <div className="row mb-3 align-items-center">
                <div className="col-auto d-flex align-items-center">
                    <HiOutlineDocumentSearch size={30} />
                    <div className="col-auto">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Поиск по названию"
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                    </div>
                </div>
                <div className="col-auto d-flex align-items-center" style={{ marginLeft: 'auto' }}>
                    <LuFilter size={40} />
                    <select
                        className="form-select ms-2"
                        onChange={handleFilterChange}
                        value={selectedFilter}
                    >
                        <option value="">Все</option>
                        {filterOptions.map((filter, index) => (
                            <option key={index} value={filter}>{filter}</option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="cards-container row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
                {displayCards()}
            </div>
            {pageCount > 1 && filteredData.length > cardsPerPage && (
                <nav aria-label="Page navigation example">
                    <ul className="pagination justify-content-center fixed-pagination">
                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                            <button className="page-link" onClick={handlePrevPage}>Назад</button>
                        </li>
                        {Array.from({ length: pageCount }).map((_, index) => (
                            <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                                <button className="page-link"
                                        onClick={() => setCurrentPage(index + 1)}>{index + 1}</button>
                            </li>
                        ))}
                        <li className={`page-item ${currentPage === pageCount ? 'disabled' : ''}`}>
                            <button className="page-link" onClick={handleNextPage}>Далее</button>
                        </li>
                    </ul>
                </nav>
            )}
        </div>
    );
}

export default Cards;
