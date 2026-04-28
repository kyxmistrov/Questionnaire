import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../AuthContext';
import { RiSearchLine, RiSearchEyeLine } from 'react-icons/ri';
import { LuFilter } from 'react-icons/lu';
import './MySurveysPage.css';
import { TfiTrash } from "react-icons/tfi";
import { TfiLightBulb } from "react-icons/tfi";

function MySurveysPage() {
    const { user } = useAuth();
    const [tests, setTests] = useState([]);
    const [sortConfig, setSortConfig] = useState({ key: 'title', direction: 'ascending' });
    const [searchTerm, setSearchTerm] = useState('');
    const [isSearchVisible, setIsSearchVisible] = useState(false);
    const [filterType, setFilterType] = useState('all');
    const [filterOptions, setFilterOptions] = useState([]);
    const [deleteConfirmation, setDeleteConfirmation] = useState(null);
    const [selectedTest, setSelectedTest] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [testResults, setTestResults] = useState([]);
    const [selectedResultId, setSelectedResultId] = useState(null);
    const [selectedOption, setSelectedOption] = useState('');
    const searchInputRef = useRef(null);
    const [resultsSearchTerm, setResultsSearchTerm] = useState('');
    const [scoreFilter, setScoreFilter] = useState('all');
    const [scoreOptions, setScoreOptions] = useState([]);
    const [choose, setChoose] = useState('');


    useEffect(() => {
        if (user.id) {
            axios
                .get(`http://localhost:8080/api/tests/find`, { params: { user_id: user.id } })
                .then((response) => {
                    setTests(response.data);
                    const uniqueTypes = [...new Set(response.data.map((test) => test.type))];
                    setFilterOptions(uniqueTypes);
                })
                .catch((error) => {
                    console.error('Ошибка при получении информации:', error);
                });
        }
    }, [user.id]);

    const sortedTests = React.useMemo(() => {
        let sortableTests = [...tests];
        if (sortConfig !== null) {
            sortableTests.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableTests;
    }, [tests, sortConfig]);

    /*const filteredTests = React.useMemo(() => {
        return sortedTests.filter(
            (test) =>
                (filterType === 'all' || test.type.toLowerCase() === filterType.toLowerCase()) &&
                (test.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    test.uniqueId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    new Date(test.createdAt).toLocaleDateString().includes(searchTerm.toLowerCase()))
        );
    }, [sortedTests, searchTerm, filterType]);*/

    const filteredTests = React.useMemo(() => {
        const isUniqueIdSearch = searchTerm.startsWith('#');
        return sortedTests.filter((test) => {
            if (isUniqueIdSearch) {
                // Проверка на соответствие uniqueId
                const uniqueIdMatch = `#${test.uniqueId}` === searchTerm;
                return uniqueIdMatch;
            } else {
                // Фильтрация по типу и поисковому запросу с проверками на null/undefined
                const titleMatch = test.title && test.title.toLowerCase().includes(searchTerm.toLowerCase());
                const uniqueIdMatch = test.uniqueId && test.uniqueId.toLowerCase().includes(searchTerm.toLowerCase());
                const dateMatch = test.createdAt && new Date(test.createdAt).toLocaleDateString().includes(searchTerm.toLowerCase());
                const filterMatch = filterType === 'all' || (test.type && test.type.toLowerCase() === filterType.toLowerCase());
                return (titleMatch || uniqueIdMatch || dateMatch) && filterMatch;
            }
        });
    }, [sortedTests, searchTerm, filterType]);


    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const getClassNamesFor = (key) => {
        if (!sortConfig) {
            return;
        }
        return sortConfig.key === key ? sortConfig.direction : undefined;
    };

    const toggleSearch = () => {
        setIsSearchVisible((prevState) => !prevState);
        setSearchTerm('');
        if (!isSearchVisible && searchInputRef.current) {
            setTimeout(() => {
                searchInputRef.current.focus();
            }, 100);
        }
    };

    const handleFilterChange = (event) => {
        setFilterType(event.target.value.toLowerCase());
    };

    const handleDelete = (testId) => {
        setChoose('test')
        setDeleteConfirmation(testId);
    };
    const handleDeleteResult = (resultId) => {
        setChoose('result')
        setDeleteConfirmation(resultId);
    };

    const confirmDelete = () => {
        if (deleteConfirmation) {
            if (choose==='test') {
                axios
                    .delete(`http://localhost:8080/api/tests/delete/${deleteConfirmation}`)
                    .then((response) => {
                        setTests(tests.filter((test) => test.testId !== deleteConfirmation));
                        setDeleteConfirmation(null);
                    })
                    .catch((error) => {
                        console.error('Ошибка при удалении теста:', error);
                    });
            }else{
                deleteResult(deleteConfirmation);
            }
        }
    };

    const cancelDelete = () => {
        setDeleteConfirmation(null);
    };

    const openResultsModal = (testId) => {
        setSelectedTest(testId);
        setResultsSearchTerm('');
        setScoreFilter('all');
        axios
            .get(`http://localhost:8080/api/test-results/find`, { params: { test_id: testId } })
            .then((response) => {
                if (response.data.length === 0) {
                    setIsModalVisible(true);
                    setTestResults([]);
                    setSelectedResultId(null);
                    setSelectedOption('');
                } else {
                    setTestResults(response.data);
                    setIsModalVisible(true);
                    const normalizedType = response.data[0].testId.type.toLowerCase();
                    const option = normalizedType === 'тест' ? 'test' : 'survey';
                    setSelectedOption(option);
                    // Collecting unique scores in descending order
                    const uniqueScores = [
                        ...new Set(response.data.map((result) => result.totalScore)),
                    ].sort((a, b) => b - a);
                    setScoreOptions(uniqueScores);
                }
            })
            .catch((error) => {
                console.error('Ошибка при загрузке результатов теста:', error);
            });
    };

    const closeResultsModal = () => {
        setSelectedTest(null);
        setTestResults([]);
        setIsModalVisible(false);
        setSelectedResultId(null);
    };


    const filteredTestResults = React.useMemo(() => {
        return testResults.filter(
            (result) =>
                result.userName.toLowerCase().includes(resultsSearchTerm.toLowerCase()) ||
                new Date(result.created_at)
                    .toLocaleDateString()
                    .includes(resultsSearchTerm.toLowerCase()) ||
                (selectedOption === 'test' &&
                    result.totalScore.toString().includes(resultsSearchTerm))
        );
    }, [testResults, resultsSearchTerm, selectedOption]);

    const filteredByScoreResults = React.useMemo(() => {
        if (scoreFilter === 'all') {
            return filteredTestResults;
        } else {
            return filteredTestResults.filter(
                (result) => result.totalScore.toString() === scoreFilter
            );
        }
    }, [filteredTestResults, scoreFilter]);

    const deleteResult = (resultId) => {
        axios
            .delete(`http://localhost:8080/api/test-results/delete/${resultId}`)
            .then((response) => {
                setTestResults(testResults.filter((result) => result.resultId !== resultId));
                setSelectedResultId(null);
                setDeleteConfirmation(null);
            })
            .catch((error) => {
                console.error('Ошибка при удалении результата:', error);
            });
    };


    const handleCopyUniqueId = (uniqueId) => {
        navigator.clipboard.writeText(`#${uniqueId}`).then(() => {
            //console.log(`Copied: ${uniqueId}`);
        }).catch(err => {
            console.error('Failed to copy: ', err);
        });
    };

    return (
        <div className="d-flex flex-column min-vh-100">
            {deleteConfirmation && (
                <>
                    <div className="overlay visible" onClick={cancelDelete}></div>
                    <div className="delete-confirmation visible">
                        <p>Подтвердите удаление</p>
                        <button onClick={confirmDelete}>Ок</button>
                        <button onClick={cancelDelete}>Отмена</button>
                    </div>
                </>
            )}

            {isModalVisible && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={closeResultsModal}>
                            &times;
                        </span>
                        <h2>
                            {testResults.length === 0
                                ? 'Нет результатов'
                                : `Результаты ${
                                    selectedOption === 'test'
                                        ? 'прохождения теста'
                                        : 'заполнения анкеты'
                                }`}
                        </h2>

                        {testResults.length !== 0 && (
                            <>
                                <div className="results-search-container">
                                    <RiSearchLine
                                        size={25}
                                        className="results-search-icon"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Поиск..."
                                        value={resultsSearchTerm}
                                        onChange={(e) =>
                                            setResultsSearchTerm(e.target.value)
                                        }
                                        className="results-search-input"
                                    />


                                    {selectedOption === 'test' && (
                                        <>
                                            <LuFilter size={25} className="score-filter-select"/>
                                            <select
                                                value={scoreFilter}
                                                onChange={(e) =>
                                                    setScoreFilter(e.target.value)
                                                }
                                                className="fil"
                                            >
                                                <option value="all">Все</option>
                                                {scoreOptions.map((score) => (
                                                    <option
                                                        key={score}
                                                        value={score.toString()}
                                                    >
                                                        {score}
                                                    </option>
                                                ))}
                                            </select>
                                        </>
                                    )}
                                </div>
                                <caption>Общее количество прошедших: {filteredByScoreResults.length}</caption>
                            </>
                        )}

                        {filteredByScoreResults.length > 0 && (
                            <div className="table-container">
                                <table>
                                    <thead>
                                    <tr>
                                        <th>Пользователь</th>
                                        <th>Дата прохождения</th>
                                        {selectedOption === 'test' && (
                                            <th>Суммарный балл</th>
                                        )}
                                        <th>Действия</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {filteredByScoreResults.map((result) => (
                                        <tr key={result.resultId}>
                                            <td>{result.userName}</td>
                                            <td>
                                                {new Date(
                                                    result.created_at
                                                ).toLocaleDateString()}
                                            </td>
                                            {selectedOption === 'test' && (
                                                <td>{result.totalScore}</td>
                                            )}
                                            <td>
                                                <TfiTrash
                                                    size={30}
                                                    className="del"
                                                    onClick={() => handleDeleteResult(result.resultId)}
                                                />
                                                <TfiLightBulb size={30} className="detail-button"
                                                              onClick={() => setSelectedResultId(result.resultId)}/>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {selectedResultId && (
                            <div className="detailed-result">
                                <h3>
                                    Подробные результаты для:{' '}
                                    {testResults.find(
                                        (result) =>
                                            result.resultId ===
                                            selectedResultId
                                    ).userName}
                                </h3>
                                <div  className="table-container-info">
                                <table className="table-info">
                                    <thead>
                                    <tr>
                                        <th>Вопрос</th>
                                        {selectedOption === 'test' && (
                                            <>
                                                <th>
                                                    Ответ пользователя
                                                </th>
                                                <th>Правильный ответ</th>
                                                <th>Балл</th>
                                            </>
                                        )}
                                        {selectedOption === 'survey' && (
                                            <th>Ответ пользователя</th>
                                        )}
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {testResults
                                        .find(
                                            (result) =>
                                                result.resultId ===
                                                selectedResultId
                                        )
                                        .results.map((result, idx) => (
                                            <tr key={idx}>
                                                <td>{result.question}</td>
                                                {selectedOption ===
                                                    'test' && (
                                                        <>
                                                            <td>
                                                                {Array.isArray(
                                                                    result.userAnswer
                                                                )
                                                                    ? result.userAnswer.join(
                                                                        ', '
                                                                    )
                                                                    : result.userAnswer}
                                                            </td>
                                                            <td>
                                                                {Array.isArray(
                                                                    result.correctAnswer
                                                                )
                                                                    ? result.correctAnswer.join(
                                                                        ', '
                                                                    )
                                                                    : result.correctAnswer}
                                                            </td>
                                                            <td>
                                                                {result.score}
                                                            </td>
                                                        </>
                                                    )}
                                                {selectedOption ===
                                                    'survey' && (
                                                        <td>
                                                            {Array.isArray(
                                                                result.userAnswer
                                                            )
                                                                ? result.userAnswer.join(
                                                                    ', '
                                                                )
                                                                : result.userAnswer}
                                                        </td>
                                                    )}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            )}

            <div className="search-container">
                {isSearchVisible ? (
                    <RiSearchEyeLine
                        onClick={toggleSearch}
                        className="search-icon"
                    />
                ) : (
                    <RiSearchLine
                        onClick={toggleSearch}
                        className="search-icon"
                    />
                )}
                <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Поиск..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`search-input ${
                        isSearchVisible ? 'visible' : ''
                    }`}
                />
                <div className="filter-container">
                    <LuFilter className="filter-icon" />
                    <select
                        value={filterType}
                        onChange={handleFilterChange}
                        className="filter-select"
                    >
                        <option value="all">Все</option>
                        {filterOptions.map((option, index) => (
                            <option
                                key={index}
                                value={option.toLowerCase()}
                            >
                                {option}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="table-container-all">
            <table className="table">
                <thead>
                <tr>
                    <th
                        onClick={() => requestSort('testId')}
                        className={getClassNamesFor('testId')}
                    >
                        №
                        {sortConfig.key === 'testId' && (
                            <span className={`arrow ${sortConfig.direction}`}></span>
                        )}
                    </th>
                    <th
                        onClick={() => requestSort('title')}
                        className={getClassNamesFor('title')}
                    >
                        Название
                        {sortConfig.key === 'title' && (
                            <span className={`arrow ${sortConfig.direction}`}></span>
                        )}
                    </th>
                    <th
                        onClick={() => requestSort('type')}
                        className={getClassNamesFor('type')}
                    >
                        Тип
                        {sortConfig.key === 'type' && (
                            <span className={`arrow ${sortConfig.direction}`}></span>
                        )}
                    </th>
                    <th
                        onClick={() => requestSort('uniqueId')}
                        className={getClassNamesFor('uniqueId')}
                    >
                        Уникальный номер
                        {sortConfig.key === 'uniqueId' && (
                            <span className={`arrow ${sortConfig.direction}`}></span>
                        )}
                    </th>
                    <th
                        onClick={() => requestSort('createdAt')}
                        className={getClassNamesFor('createdAt')}
                    >
                        Дата создания
                        {sortConfig.key === 'createdAt' && (
                            <span className={`arrow ${sortConfig.direction}`}></span>
                        )}
                    </th>
                    <th>Действия</th>
                </tr>
                </thead>
                <tbody>
                {filteredTests.map((test, index) => (
                    <tr key={test.testId}>
                        <td>{index + 1}</td>
                        <td>{test.title}</td>
                        <td>{test.type}</td>
                        <td onClick={()=>handleCopyUniqueId(test.uniqueId)} style={{ cursor: 'pointer'}}>#{test.uniqueId}</td>
                        <td>
                            {new Date(test.createdAt).toLocaleDateString()}
                        </td>
                        <td>
                            <TfiTrash size={35} className="del"  onClick={() => handleDelete(test.testId)}/>

                            <button
                                onClick={() => openResultsModal(test.testId)}
                                className="result-button"
                            >
                                Результаты
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            </div>
        </div>
    );
}

export default MySurveysPage;

