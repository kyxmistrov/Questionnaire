import React from 'react';
import './chooseWay.css';
import { LuPlusCircle } from "react-icons/lu";
import {useLocation} from "react-router-dom";
import {useAuth} from "../../AuthContext";

function ChooseWay({ onOptionSelect }) {
    return (
        <div className="d-flex flex-column">
            <div className="choose-way-container">
                <div className="choose-way-row">
                    <div className="choose-way empty">
                        <div className="img emp"></div>
                        <div className="margin-25"></div>
                        <div className="title">Пустая анкета</div>
                        <div className="margin-10"></div>
                        <div className="comment">Анкета может содержать разные виды вопросов. Данные доступны создателю анкеты.</div>
                        <div className="margin-30"></div>
                        <button className="btn btn-md btn-circle btn-green" onClick={() => onOptionSelect('survey')}>
                            <LuPlusCircle size={20} style={{marginBottom: 2, marginRight: 5}}/>Создать анкету
                        </button>
                    </div>

                    <div className="choose-way empty">
                        <div className="img test"></div>
                        <div className="margin-25"></div>
                        <div className="title">Пустой тест</div>
                        <div className="margin-10"></div>
                        <div className="comment">Тест состоит из вопросов с ответами. За ответы начисляются баллы.</div>
                        <div className="margin-30"></div>
                        <button className="btn btn-md btn-circle btn-green" onClick={() => onOptionSelect('test')}>
                            <LuPlusCircle size={20} style={{marginBottom: 2, marginRight: 5}}/>Создать тест
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ChooseWay;
