import React, { useState, useEffect } from 'react';
import {TfiInfoAlt, TfiTrash} from "react-icons/tfi";
import '../Forms.css';
import SingleChoiceQuestion from '../forms/SingleChoiceQuestion';
import MultipleChoiceQuestion from '../forms/MultipleChoiceQuestion';
import PriorityQuestion from "../forms/PriorityQuestion";
import {useAuth} from "../../../AuthContext";
import {useNavigate} from "react-router-dom";
import axios from 'axios';


function Test({ selectedOption }) {
    const [loaded, setLoaded] = useState(false);
    const { isAuthenticated, user } = useAuth();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [questions, setQuestions] = useState([]);
    const navigate = useNavigate();


    useEffect(() => {
        const savedTest = JSON.parse(localStorage.getItem('test'));
        if (savedTest) {
            setTitle(savedTest.title);
            setDescription(savedTest.description);
            setQuestions(savedTest.questions);
        }
        setLoaded(true);
    }, []);

    useEffect(() => {
        if (loaded) {
            localStorage.setItem('test', JSON.stringify({ title, description, questions }));
        }
    }, [title, description, questions, loaded]);

    const handleSubmit =  async (event) => {
        event.preventDefault();

        if (!isAuthenticated) {
            navigate('/login');
            return;
        }


        if (selectedOption === 'test') {
            const hasEmptyCorrectAnswer = questions.some(q => q.correctAnswerIndices === null || q.correctAnswerIndices.length === 0);
            if (hasEmptyCorrectAnswer) {
                alert('Пожалуйста, выберите правильный ответ для каждого вопроса.');
                return;
            }
        }

        const testData = {
            title,
            description,
            questions
        };
        console.log('Тест:', testData);


        axios.post('http://localhost:8080/api/tests/create', testData, {
            params: { userId: user.id, type: 'Тест'}
        })
            .then(response => {
                alert('Тест успешно сохранен!');
                localStorage.removeItem('test');
                localStorage.removeItem('selectedOption');
                navigate('/');
            })
            .catch(error => {
                console.error('Ошибка при сохранении теста:', error);
                alert('Произошла ошибка при сохранении теста.');
            });

    };

    const handleAddQuestion = (type) => {
        setQuestions([...questions, { type, question: '', options: ['', ''], correctAnswerIndices: [] }]);
    };

    const handleQuestionChange = (index, field, value) => {
        const newQuestions = [...questions];
        newQuestions[index][field] = value;
        setQuestions(newQuestions);
    };

    const handleOptionChange = (qIndex, oIndex, value) => {
        const newQuestions = [...questions];
        newQuestions[qIndex].options[oIndex] = value;

        // Update the correctAnswer field to reflect the current option text
        if (newQuestions[qIndex].correctAnswerIndices.includes(oIndex)) {
            newQuestions[qIndex].correctAnswer = newQuestions[qIndex].correctAnswerIndices.map(index => newQuestions[qIndex].options[index]);
        }

        setQuestions(newQuestions);
    };

    const handleDeleteQuestion = (index) => {
        const newQuestions = [...questions];
        newQuestions.splice(index, 1);
        setQuestions(newQuestions);
    };

    const handleAddOption = (qIndex) => {
        const newQuestions = [...questions];
        newQuestions[qIndex].options.push('');
        setQuestions(newQuestions);
    };

    const handleDeleteOption = (qIndex, oIndex) => {
        const newQuestions = [...questions];
        newQuestions[qIndex].options.splice(oIndex, 1);
        setQuestions(newQuestions);
    };

    const handleSelectCorrectAnswer = (qIndex, correctAnswerIndices) => {
        const newQuestions = [...questions];
        newQuestions[qIndex].correctAnswerIndices = correctAnswerIndices;
        newQuestions[qIndex].correctAnswer = correctAnswerIndices.map(index => newQuestions[qIndex].options[index]);
        setQuestions(newQuestions);
    };


    const handleMoveOptionUp = (qIndex, oIndex) => {
        if (oIndex > 0) {
            const newQuestions = [...questions];
            const option = newQuestions[qIndex].options[oIndex];
            newQuestions[qIndex].options.splice(oIndex, 1);
            newQuestions[qIndex].options.splice(oIndex - 1, 0, option);
            setQuestions(newQuestions);
            handleSelectCorrectAnswer(qIndex, newQuestions[qIndex].options.map((_, index) => index));
        }
    };

    const handleMoveOptionDown = (qIndex, oIndex) => {
        const newQuestions = [...questions];
        if (oIndex < newQuestions[qIndex].options.length - 1) {
            const option = newQuestions[qIndex].options[oIndex];
            newQuestions[qIndex].options.splice(oIndex, 1);
            newQuestions[qIndex].options.splice(oIndex + 1, 0, option);
            setQuestions(newQuestions);
            handleSelectCorrectAnswer(qIndex, newQuestions[qIndex].options.map((_, index) => index));
        }
    };
    if (!loaded) {
        return null;
    }

    return (
        <div className="survey-container">
            <h3>Создание Теста</h3>
            <form className="survey-form" onSubmit={handleSubmit}>
                <div className="form-box">
                    <div className="form-group">
                        <label htmlFor="title">Название</label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="description">Описание (не обязательно)</label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        ></textarea>
                    </div>
                </div>
                {questions.map((q, qIndex) => (
                    <div key={qIndex} className="question-box">
                        <div className="form-group">
                            <label htmlFor={`question-${qIndex}`}>Вопрос {qIndex + 1}</label>
                            <textarea
                                id={`question-${qIndex}`}
                                value={q.question}
                                onChange={(e) => handleQuestionChange(qIndex, 'question', e.target.value)}
                                required
                            ></textarea>
                        </div>
                        {q.type === 'single-choice' && (

                            <SingleChoiceQuestion
                                question={q}
                                handleOptionChange={handleOptionChange}
                                handleAddOption={handleAddOption}
                                handleDeleteOption={handleDeleteOption}
                                handleSelectCorrectAnswer={handleSelectCorrectAnswer}
                                qIndex={qIndex}
                                showSelectButton={selectedOption === 'test'}
                            />

                        )}
                        {q.type === 'multiple-choice' && (
                            <MultipleChoiceQuestion
                                question={q}
                                handleOptionChange={handleOptionChange}
                                handleAddOption={handleAddOption}
                                handleDeleteOption={handleDeleteOption}
                                handleSelectCorrectAnswer={handleSelectCorrectAnswer}
                                qIndex={qIndex}
                                showSelectButton={selectedOption === 'test'}
                            />
                        )}
                        {q.type === 'priority' && (
                            <PriorityQuestion
                                question={q}
                                handleOptionChange={handleOptionChange}
                                handleMoveOptionUp={handleMoveOptionUp}
                                handleMoveOptionDown={handleMoveOptionDown}
                                handleAddOption={handleAddOption}
                                handleDeleteOption={handleDeleteOption}
                                qIndex={qIndex}
                                handleUpdateCorrectAnswer={handleSelectCorrectAnswer}
                            />
                        )}
                        <button type="button" className="btn-delete-form" onClick={() => handleDeleteQuestion(qIndex)}>Удалить</button>
                    </div>
                ))}
                <div className="choose">
                    <button type="button" className="btn choose-one" onClick={() => handleAddQuestion('single-choice')}>
                        одиночный выбор
                    </button>
                    <button type="button" className="btn choose-any"
                            onClick={() => handleAddQuestion('multiple-choice')}>
                        множественный выбор
                    </button>
                    <button type="button" className="btn choose-rait test" onClick={() => handleAddQuestion('priority')}>
                        по приоритету
                    </button>

                </div>
                <button type="submit" className="btn btn-green">
                    Сохранить тест
                </button>
            </form>
        </div>

    );
}

export default Test;