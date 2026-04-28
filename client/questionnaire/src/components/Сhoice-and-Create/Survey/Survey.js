import React, { useState, useEffect } from 'react';
import { TfiTrash } from "react-icons/tfi";
import { useNavigate } from 'react-router-dom';
import '../Forms.css';
import MultipleChoiceQuestion from '../forms/MultipleChoiceQuestion';
import SingleChoiceQuestion from '../forms/SingleChoiceQuestion';
import PriorityQuestion from "../forms/PriorityQuestion";
import TextQuestion from "../forms/TextQuestion";
import { useAuth } from '../../../AuthContext';
import axios from "axios";

function Survey({ selectedOption }) {
    const [loaded, setLoaded] = useState(false);
    const [title, setTitle] = useState('');
    const { isAuthenticated, user } = useAuth();
    const [description, setDescription] = useState('');
    const [questions, setQuestions] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const savedTest = JSON.parse(localStorage.getItem('survey'));
        if (savedTest) {
            setTitle(savedTest.title);
            setDescription(savedTest.description);
            setQuestions(savedTest.questions);
        }
        setLoaded(true);
    }, []);

    useEffect(() => {
        if (loaded) {
            localStorage.setItem('survey', JSON.stringify({ title, description, questions }));
        }
    }, [title, description, questions, loaded]);

    const handleSubmit = (event) => {
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
        console.log('Анкета:', testData);

        axios.post('http://localhost:8080/api/tests/create', testData, {
            params: { userId: user.id, type: 'Анкета'}
        })
            .then(response => {
                alert('Анкета успешно сохранена!');
                localStorage.removeItem('survey');
                localStorage.removeItem('selectedOption');
                navigate('/');
            })
            .catch(error => {
                console.error('Ошибка при сохранении анкеты:', error);
                alert('Произошла ошибка при сохранении анкеты.');
            });
    };

    const handleAddQuestion = (type) => {
        let newQuestion;
        if (type === 'text') {
            newQuestion = { type, question: '', options: [''] };
        } else {
            newQuestion = { type, question: '', options: ['', ''], correctAnswerIndices: [] };
        }
        setQuestions([...questions, newQuestion]);
    };

    const handleQuestionChange = (index, field, value) => {
        const newQuestions = [...questions];
        if (field === 'options') {
            newQuestions[index].options = value;
        } else {
            newQuestions[index][field] = value;
        }
        setQuestions(newQuestions);
    };

    const handleOptionChange = (qIndex, oIndex, value) => {
        const newQuestions = [...questions];
        newQuestions[qIndex].options[oIndex] = value;

        if (newQuestions[qIndex].correctAnswerIndices && newQuestions[qIndex].correctAnswerIndices.includes(oIndex)) {
            newQuestions[qIndex].correctAnswer = newQuestions[qIndex].options.filter((_, idx) => newQuestions[qIndex].correctAnswerIndices.includes(idx));
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
            <h3>Создание Анкеты/Опроса</h3>
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
                        {q.type === 'text' && (
                            <TextQuestion
                                question={q}
                                handleQuestionChange={handleQuestionChange}
                                qIndex={qIndex}
                                handleDeleteQuestion={handleDeleteQuestion}
                            />
                        )}
                        {q.type === 'text' && (
                            <button type="button" className="btn-delete-form text"
                                    onClick={() => handleDeleteQuestion(qIndex)}>
                                Удалить
                            </button>
                        )}

                        {q.type !== 'text' && (
                            <button type="button" className="btn-delete-form"
                                    onClick={() => handleDeleteQuestion(qIndex)}>
                                Удалить
                            </button>
                        )}
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
                    <button type="button" className="btn choose-rait" onClick={() => handleAddQuestion('priority')}>
                        по приоритету
                    </button>
                    <button type="button" className="btn choose-text" onClick={() => handleAddQuestion('text')}>
                        свободный
                    </button>
                </div>
                <button type="submit" className="btn btn-green">
                    Сохранить
                </button>
            </form>
        </div>
    );
}

export default Survey;
