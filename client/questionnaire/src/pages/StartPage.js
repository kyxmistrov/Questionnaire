import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import axios from 'axios';
import SingleChoiceQuestion from '../components/Сhoice-and-Create/forms/SingleChoiceQuestion';
import MultipleChoiceQuestion from '../components/Сhoice-and-Create/forms/MultipleChoiceQuestion';
import PriorityQuestion from '../components/Сhoice-and-Create/forms/PriorityQuestion';
import TextQuestion from "../components/Сhoice-and-Create/forms/TextQuestion";
import './StartPage.css';

const StartPage = () => {
    const location = useLocation();
    const { id, title: initialTitle, type } = location.state;
    const { user } = useAuth() || { user: { name: 'Гость' } };

    const [loaded, setLoaded] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [questions, setQuestions] = useState([]);
    const [userAnswers, setUserAnswers] = useState([]);
    const [selectedOption, setSelectedOption] = useState('');
    const navigate = useNavigate();
    const [globalOption, setGlobalOption] = useState('');

    const hide = true;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/tests/${id}`);
                const testData = response.data;

                // Преобразование данных с перемешиванием вариантов ответов
                const formattedQuestions = testData.questions.map(q => {
                    // Перемешиваем варианты ответов
                    const shuffledOptions = q.options[0].option_text.sort(() => Math.random() - 0.5);

                    return {
                        type: q.type,
                        question: q.question_text,
                        options: shuffledOptions,
                        correctAnswerIndices: q.correct_answer_indices.map(answer => shuffledOptions.indexOf(answer)),
                        correctAnswer: q.correct_answer_indices
                    };
                });

                const initialUserAnswers = testData.questions.map(q => ({
                    type: q.type,
                    question: q.question_text,
                    options: q.options[0].option_text,
                    correctAnswerIndices: [],
                    correctAnswer: []
                }));

                setTitle(testData.title);
                setDescription(testData.description);
                setQuestions(formattedQuestions);
                setUserAnswers(initialUserAnswers);

                const normalizedType = type.toLowerCase();
                const option = normalizedType === 'тест' ? 'test' : 'survey';

                setSelectedOption('test' );
                setGlobalOption(option)

                setLoaded(true);
            } catch (error) {
                console.error('Ошибка при загрузке данных теста:', error);
                // Добавьте обработку ошибки, если необходимо
            }
        };

        fetchData();
    }, [id, type]);


    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!user) {
            navigate('/login');
            return;
        }

        const normalizedType = type.toLowerCase();
        const option = normalizedType === 'тест' ? 'test' : 'survey';//сделать типа глобальной

        try {
            let totalScore = 0;
            const results = []; // Массив для хранения результатов

            // Проверяем, все ли поля заполнены для всех вопросов, кроме вопросов типа "priority"
            const allFieldsFilled = questions.every((q, index) => {
                if (q.type === 'priority') {
                    return true; // Для вопросов типа "priority" не требуется заполнение полей
                } else if (q.type === 'text') {
                    return userAnswers[index].question.trim() !== ''; // Проверка текстового ответа
                } else {
                    // Для вопросов с выбором ответа
                    return userAnswers[index].correctAnswerIndices.length > 0;
                }
            });

            if (!allFieldsFilled) {
                const confirmContinue = window.confirm('Не все вопросы заполнены. Желаете завершить?');
                if (!confirmContinue) {
                    return; // Если пользователь отказывается завершить, прерываем сохранение
                }
            }

            // Проверяем правильность ответов и подсчитываем баллы
            const isCorrect = userAnswers.map((userQ, index) => {
                let score = 0;
                let correct = false;

                if (option === 'test' && questions[index].type === 'priority') {
                    // Сравниваем последовательности для вопросов типа "priority" только для тестов
                    const isSequenceCorrect = userQ.correctAnswer.every((val, i) => {
                        const isCorrect = val === questions[index].correctAnswer[i];
                        return isCorrect;
                    });

                    if (isSequenceCorrect) {
                        score = 1; // За правильную последовательность ставим 1 балл
                        totalScore++; // Увеличиваем общий балл
                    }

                    correct = isSequenceCorrect;
                } else if (option === 'test') {
                    // Для остальных типов вопросов в тесте сравниваем множества ответов
                    const userAnswerSorted = [...userQ.correctAnswer].sort();
                    const correctAnswerSorted = [...questions[index].correctAnswer].sort();
                    correct = (
                        userAnswerSorted.length === correctAnswerSorted.length &&
                        userAnswerSorted.every((answer, i) => answer === correctAnswerSorted[i])
                    );

                    if (correct) {
                        score = 1; // За полное совпадение множеств ставим 1 балл
                        totalScore++; // Увеличиваем общий балл
                    }
                } else {
                    // Для опроса просто фиксируем, что ответ был выбран
                    correct = true;
                }

                // Записываем результат для текущего вопроса
                results.push({
                    question: questions[index].question,
                    userAnswer: userQ.correctAnswer,
                    correctAnswer: questions[index].correctAnswer,
                    score: correct ? score : 0,
                    type: option
                });

                return correct;
            });

            /*// Выводим результаты в консоль
            console.log('Questions and User Answers:');
            results.forEach((result, index) => {
                console.log(`Question ${index + 1}: ${result.question}`);
                console.log(`User Answer: ${result.userAnswer}`);
                console.log(`Correct Answer: ${result.correctAnswer}`);
                console.log(`Score: ${result.score}`);
                console.log(`Type: ${result.type}`);
            });
            */

            const response = await axios.post('http://localhost:8080/api/tests/add_test_result', {
                test_id: id,
                user_id: user.id,
                user_name: user.name,
                total_score: totalScore,
                results: JSON.stringify(results)
            });

            if (option === 'test') {
                if (isCorrect.every(correct => correct)) {
                    alert(`Спасибо за прохождение!\nРезультаты теста успешно сохранены.\nИтоговый балл: ${totalScore}`);
                } else {
                    alert(`Спасибо за прохождение!\nНе все ответы верны.\nИтоговый балл: ${totalScore}`);
                }
            }else {
                alert(`Спасибо за прохождение!`);
            }
            localStorage.removeItem('customStorageKey');
            navigate('/');
        } catch (error) {
            alert('Произошла ошибка при сохранении теста.');

        }
    };






    const handleAddQuestion = (type) => {
        setQuestions([...questions, { type, question: '', options: ['', ''], correctAnswerIndices: [], correctAnswer: [] }]);
        setUserAnswers([...userAnswers, { type, question: '', options: ['', ''], correctAnswerIndices: [], correctAnswer: [] }]);
    };

    const handleQuestionChange = (index, field, value) => {
        const newQuestions = [...questions];
        newQuestions[index][field] = value;
        setQuestions(newQuestions);

        const newUserAnswers = [...userAnswers];
        newUserAnswers[index][field] = value;
        setUserAnswers(newUserAnswers);
    };

    const handleOptionChange = (qIndex, oIndex, value) => {
        const newQuestions = [...questions];
        newQuestions[qIndex].options[oIndex] = value;
        setQuestions(newQuestions);

        const newUserAnswers = [...userAnswers];
        newUserAnswers[qIndex].options[oIndex] = value;
        setUserAnswers(newUserAnswers);
    };

    const handleDeleteQuestion = (index) => {
        const newQuestions = [...questions];
        newQuestions.splice(index, 1);
        setQuestions(newQuestions);

        const newUserAnswers = [...userAnswers];
        newUserAnswers.splice(index, 1);
        setUserAnswers(newUserAnswers);
    };

    const handleAddOption = (qIndex) => {
        const newQuestions = [...questions];
        newQuestions[qIndex].options.push('');
        setQuestions(newQuestions);

        const newUserAnswers = [...userAnswers];
        newUserAnswers[qIndex].options.push('');
        setUserAnswers(newUserAnswers);
    };

    const handleDeleteOption = (qIndex, oIndex) => {
        const newQuestions = [...questions];
        newQuestions[qIndex].options.splice(oIndex, 1);
        setQuestions(newQuestions);

        const newUserAnswers = [...userAnswers];
        newUserAnswers[qIndex].options.splice(oIndex, 1);
        setUserAnswers(newUserAnswers);
    };

    const handleSelectCorrectAnswer = (qIndex, correctAnswerIndices) => {
        const newUserAnswers = [...userAnswers];
        newUserAnswers[qIndex].correctAnswerIndices = correctAnswerIndices;
        newUserAnswers[qIndex].correctAnswer = correctAnswerIndices.map(index => newUserAnswers[qIndex].options[index]);
        setUserAnswers(newUserAnswers);
    };

    const handleMoveOptionUp = (qIndex, oIndex) => {
        if (oIndex > 0) {
            const newQuestions = [...questions];
            const option = newQuestions[qIndex].options[oIndex];
            newQuestions[qIndex].options.splice(oIndex, 1);
            newQuestions[qIndex].options.splice(oIndex - 1, 0, option);
            setQuestions(newQuestions);

            const newUserAnswers = [...userAnswers];
            newUserAnswers[qIndex].options = newQuestions[qIndex].options;
            setUserAnswers(newUserAnswers);

            const correctAnswerIndices = newUserAnswers[qIndex].options.map((_, index) => index);
            handleSelectCorrectAnswer(qIndex, correctAnswerIndices);
        }
    };

    const handleMoveOptionDown = (qIndex, oIndex) => {
        const newQuestions = [...questions];
        if (oIndex < newQuestions[qIndex].options.length - 1) {
            const option = newQuestions[qIndex].options[oIndex];
            newQuestions[qIndex].options.splice(oIndex, 1);
            newQuestions[qIndex].options.splice(oIndex + 1, 0, option);
            setQuestions(newQuestions);

            const newUserAnswers = [...userAnswers];
            newUserAnswers[qIndex].options = newQuestions[qIndex].options;
            setUserAnswers(newUserAnswers);

            const correctAnswerIndices = newUserAnswers[qIndex].options.map((_, index) => index);
            handleSelectCorrectAnswer(qIndex, correctAnswerIndices);
        }
    };

    const handleReset = () => {
        const confirmed = window.confirm('Вы действительно хотите выйти?');
        if (confirmed) {
            localStorage.removeItem('customStorageKey');
            navigate('/');
        }
    };

    useEffect(() => {
        if (loaded) {
            localStorage.setItem('customStorageKey', JSON.stringify({ title, description, questions }));//видно всем!!!
        }
    }, [title, description, questions, loaded]);

    if (!loaded) {
        return null;
    }

    return (
        <div className="d-flex flex-column">
            <button onClick={handleReset} className="btn btn-md btn-circle btn-red m-3 align-self-start">
                Выход
            </button>
            <div className="label-container">
                {globalOption === 'test' ? (
                    <h3>Вы проходите: {title}</h3>
                ) : (
                    <h3>Вы заполяете: {title}</h3>
                )}
            </div>
            <div className="survey-container">
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
                                readOnly={hide}
                                className={hide ? 'no-focus' : ''}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="description">Описание</label>
                            <textarea
                                id="description"
                                value={description}
                                readOnly={hide}
                                className={hide ? 'no-focus' : ''}
                                onChange={(e) => setDescription(e.target.value)}
                            ></textarea>
                        </div>
                    </div>
                    {questions.map((q, qIndex) => (
                        <div key={qIndex} className="question-box">
                            <div className="form-group">
                                <label htmlFor={`question-${qIndex}`}>Вопрос {qIndex + 1}</label>
                                <textarea
                                    readOnly={hide}
                                    className={hide ? 'no-focus' : ''}
                                    id={`question-${qIndex}`}
                                    value={q.question}
                                    onChange={(e) => handleQuestionChange(qIndex, 'question', e.target.value)}
                                    required
                                ></textarea>
                            </div>
                            {q.type === 'single-choice' && (
                                <SingleChoiceQuestion
                                    question={userAnswers[qIndex]}
                                    handleOptionChange={handleOptionChange}
                                    handleAddOption={handleAddOption}
                                    handleDeleteOption={handleDeleteOption}
                                    handleSelectCorrectAnswer={handleSelectCorrectAnswer}
                                    qIndex={qIndex}
                                    showSelectButton={selectedOption === 'test'}
                                    hide={hide}
                                />
                            )}
                            {q.type === 'multiple-choice' && (
                                <MultipleChoiceQuestion
                                    question={userAnswers[qIndex]}
                                    handleOptionChange={handleOptionChange}
                                    handleAddOption={handleAddOption}
                                    handleDeleteOption={handleDeleteOption}
                                    handleSelectCorrectAnswer={handleSelectCorrectAnswer}
                                    qIndex={qIndex}
                                    showSelectButton={selectedOption === 'test'}
                                    hide={hide}
                                />
                            )}
                            {q.type === 'priority' && (
                                <PriorityQuestion
                                    question={userAnswers[qIndex]}
                                    handleOptionChange={handleOptionChange}
                                    handleMoveOptionUp={handleMoveOptionUp}
                                    handleMoveOptionDown={handleMoveOptionDown}
                                    handleAddOption={handleAddOption}
                                    handleDeleteOption={handleDeleteOption}
                                    qIndex={qIndex}
                                    handleUpdateCorrectAnswer={handleSelectCorrectAnswer}
                                    hide={hide}
                                />
                            )}
                            {q.type === 'text' && (
                                <TextQuestion
                                    question={userAnswers[qIndex]}
                                    handleQuestionChange={handleQuestionChange}
                                    qIndex={qIndex}
                                    handleDeleteQuestion={handleDeleteQuestion}
                                    hide={hide}
                                />
                            )}
                        </div>
                    ))}
                    <button type="submit" className="btn btn-green">
                        Завершить заполнение
                    </button>
                </form>
            </div>
        </div>
    );
};

export default StartPage;
