import React from 'react';
import {TfiArrowUp, TfiArrowDown, TfiTrash, TfiInfoAlt} from "react-icons/tfi";

function PriorityQuestion({ question, handleOptionChange, handleMoveOptionUp, handleMoveOptionDown, handleAddOption, handleDeleteOption, qIndex, handleUpdateCorrectAnswer ,hide=false }) {

    React.useEffect(() => {
        const correctAnswerIndices = question.options.map((_, index) => index);
        handleUpdateCorrectAnswer(qIndex, correctAnswerIndices);
    }, [question.options]);

    const handleOptionTextChange = (index, value) => {
        handleOptionChange(qIndex, index, value);
        const correctAnswerIndices = question.options.map((_, index) => index);
        handleUpdateCorrectAnswer(qIndex, correctAnswerIndices);
    };

    const handleDeleteAndRefresh = (oIndex) => {
        handleDeleteOption(qIndex, oIndex);
        const correctAnswerIndices = question.options.map((_, index) => index);
        handleUpdateCorrectAnswer(qIndex, correctAnswerIndices);
    };

    return (
        <>
            {question.options.map((option, oIndex) => (
                <div key={oIndex} className="form-group option-group">
                    <div className="label-container">
                        <label className="option-label"
                               htmlFor={`option-${oIndex}-${qIndex}`}>Вариант {oIndex + 1}</label>
                    </div>
                    <div className="input-group">
                        <input
                            readOnly={hide}
                            className={hide ? 'no-focus' : ''}
                            type="text"
                            id={`option-${oIndex}-${qIndex}`}
                            value={option}
                            onChange={(e) => handleOptionTextChange(oIndex, e.target.value)}
                            required
                        />
                        <button
                            type="button"
                            className="btn btn-move-option"
                            onClick={() => handleMoveOptionUp(qIndex, oIndex)}
                            disabled={oIndex === 0}
                        >
                            <TfiArrowUp size={20}/>
                        </button>
                        <button
                            type="button"
                            className="btn btn-move-option"
                            onClick={() => handleMoveOptionDown(qIndex, oIndex)}
                            disabled={oIndex === question.options.length - 1}
                        >
                            <TfiArrowDown size={20}/>
                        </button>
                        {question.options.length > 2  && !hide && (
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
                <div><TfiInfoAlt/> <u>по приоритету</u>: при прохождении необходимо будет расставить варианты ответа в правильной последовательности.</div>
                ):(
                    <div><TfiInfoAlt/> <u>по приоритету</u>: необходимо расставить варианты ответа в правильной последовательности.</div>
            )}
            {!hide && (
                <button type="button" className="btn-add-option" onClick={() => handleAddOption(qIndex)}>
                Добавить вариант
                 </button>
            )}
        </>
    );
}

export default PriorityQuestion;
