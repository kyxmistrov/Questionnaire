import React, { useState, useEffect } from 'react';
import { TfiInfoAlt, TfiTrash } from "react-icons/tfi";
import { IoIosCheckmarkCircleOutline, IoIosCheckmarkCircle } from "react-icons/io";

function MultipleChoiceQuestion({ question, handleOptionChange, handleAddOption, handleDeleteOption, qIndex, handleSelectCorrectAnswer, showSelectButton ,hide=false }) {
    const [options, setOptions] = useState(question.options || []);
    const [correctAnswers, setCorrectAnswers] = useState(question.correctAnswerIndices || []);

    useEffect(() => {
        setOptions(question.options || []);
        setCorrectAnswers(question.correctAnswerIndices || []);
    }, [question]);

    const handleSelectAnswer = (qIndex, oIndex) => {
        let updatedCorrectAnswers = [...correctAnswers];
        if (updatedCorrectAnswers.includes(oIndex)) {
            updatedCorrectAnswers = updatedCorrectAnswers.filter(index => index !== oIndex);
        } else {
            updatedCorrectAnswers.push(oIndex);
        }
        setCorrectAnswers(updatedCorrectAnswers);
        handleSelectCorrectAnswer(qIndex, updatedCorrectAnswers);
    };

    const handleDeleteAndRefresh = (oIndex) => {
        handleDeleteOption(qIndex, oIndex);

        // Update correct answer indices after deletion
        let updatedCorrectAnswers = correctAnswers.filter(index => index !== oIndex);

        // Adjust indices greater than deleted index
        updatedCorrectAnswers = updatedCorrectAnswers.map(index => {
            if (index > oIndex) {
                return index - 1;
            }
            return index;
        });

        setCorrectAnswers(updatedCorrectAnswers);
        handleSelectCorrectAnswer(qIndex, updatedCorrectAnswers);
    };

    return (
        <>
            {options.map((option, oIndex) => (
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
                                className={`${correctAnswers.includes(oIndex) ? "btn-correct-answer" : "btn-select-correct-answer"}`}
                                onClick={() => handleSelectAnswer(qIndex, oIndex)}
                            >
                                {correctAnswers.includes(oIndex) ? <IoIosCheckmarkCircle size={30}/> : <IoIosCheckmarkCircleOutline size={30}/>}
                            </button>
                        )}
                        {options.length > 2  && !hide && (
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
                <div><TfiInfoAlt/> <u>множественный выбор</u>: можно выбрать несколько вариантов ответа.</div>
            ): (
                <div><TfiInfoAlt/> <u>множественный выбор</u>: можно выбрать несколько вариантов ответа.</div>
            )}
            {!hide && (<button type="button" className="btn-add-option" onClick={() => handleAddOption(qIndex)}>
                Добавить вариант
            </button>
            )}
        </>
    );
}

export default MultipleChoiceQuestion;
