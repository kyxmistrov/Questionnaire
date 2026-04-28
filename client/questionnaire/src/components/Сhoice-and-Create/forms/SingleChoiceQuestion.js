import React, { useState, useEffect } from 'react';
import { TfiTrash } from "react-icons/tfi";
import { IoIosCheckmarkCircleOutline, IoIosCheckmarkCircle } from "react-icons/io";
import { TfiInfoAlt } from "react-icons/tfi";

function SingleChoiceQuestion({ question, handleOptionChange, handleAddOption, handleDeleteOption, qIndex, showSelectButton, handleSelectCorrectAnswer, hide=false }) {
    const [correctAnswerIndex, setCorrectAnswerIndex] = useState(question.correctAnswerIndices[0] || null);

    useEffect(() => {
        if (question.correctAnswerIndices.length > 0) {
            setCorrectAnswerIndex(question.correctAnswerIndices[0]);
        } else {
            setCorrectAnswerIndex(null);
        }
    }, [question.correctAnswerIndices]);

    const handleSelectAnswer = (qIndex, oIndex) => {
        if (correctAnswerIndex === oIndex) {
            setCorrectAnswerIndex(null);
            handleSelectCorrectAnswer(qIndex, []);
        } else {
            setCorrectAnswerIndex(oIndex);
            handleSelectCorrectAnswer(qIndex, [oIndex]);
        }
    };

    const handleDeleteAndRefresh = (oIndex) => {
        handleDeleteOption(qIndex, oIndex);

        // Update correct answer if the deleted option was the correct one
        if (correctAnswerIndex === oIndex) {
            setCorrectAnswerIndex(null);
            handleSelectCorrectAnswer(qIndex, []);
        } else if (correctAnswerIndex > oIndex) {
            setCorrectAnswerIndex(correctAnswerIndex - 1);
            handleSelectCorrectAnswer(qIndex, [correctAnswerIndex - 1]);
        } else {
            handleSelectCorrectAnswer(qIndex, [correctAnswerIndex]);
        }
    };

    return (
        <>
            {question.options.map((option, oIndex) => (
                <div key={oIndex} className="form-group option-group">
                    <div className="label-container">
                        <label className="option-label" htmlFor={`option-${oIndex}-${qIndex}`}>Вариант {oIndex + 1}</label>
                    </div>
                    <div className="input-group">
                        <input
                            readOnly={hide}
                            className={hide ? 'no-focus' : ''}
                            type="text"
                            id={`option-${oIndex}-${qIndex}`}
                            value={option}
                            onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                            required
                        />
                        {showSelectButton && (
                            <button
                                type="button"
                                className={`${correctAnswerIndex === oIndex ? "btn-correct-answer" : "btn-select-correct-answer"}`}
                                onClick={() => handleSelectAnswer(qIndex, oIndex)}
                            >
                                {correctAnswerIndex === oIndex ? <IoIosCheckmarkCircle size={30}/> :
                                    <IoIosCheckmarkCircleOutline size={30}/>}
                            </button>
                        )}
                        {question.options.length > 2 && !hide && (
                            <button
                                type="button"
                                className="btn-delete-option"
                                onClick={() => handleDeleteAndRefresh(oIndex)}
                            >
                                <TfiTrash size={20}/>
                            </button>
                        )}
                    </div>
                </div>
            ))}

            {!hide ? (
                <div><TfiInfoAlt/> <u>одиночный выбор</u>: доступен для выбора только один вариант ответа.</div>
                ): (
                <div><TfiInfoAlt/> <u>одиночный выбор</u>: выберите только один вариант ответа.</div>
            )}
            {!hide && (<button type="button" className="btn-add-option" onClick={() => handleAddOption(qIndex)}>
                Добавить вариант
            </button> )}

        </>
    );
}

export default SingleChoiceQuestion;
