import React from 'react';
import "../Forms.css";
import { TfiInfoAlt } from "react-icons/tfi";

function TextQuestion({ question, handleQuestionChange, qIndex, hide=false }) {
    const handleChange = (e) => {
        // Обновляем состояние userAnswers для текущего вопроса
        handleQuestionChange(qIndex, 'correctAnswer', e.target.value);
    };

    return (
        <div className="form-group">
            <label htmlFor={`answer-${qIndex}`}>Ответ</label>
            <textarea
                id={`answer-${qIndex}`}
                value={question.correctAnswer} // Используем значение из userAnswers для текстового ответа
                onChange={handleChange}
                required
                readOnly={!hide} // Делаем поле только для чтения, если hide=true
                className={!hide ? "disabled" : ""} // Добавляем класс "disabled", если hide=true
            ></textarea>
            {!hide ? (
                <div><TfiInfoAlt /> <u>свободный</u>: при прохождении ответ записывается своими словами.</div>
            ) : (
                <div><TfiInfoAlt /> <u>свободный</u>: ответ записывается своими словами.</div>
            )}
        </div>
    );
}

export default TextQuestion;
