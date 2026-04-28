import React, { useState, useEffect } from 'react';
import './content.css';
import { Link } from "react-router-dom";
import Cards from "./Cards";

function Content() {
    const [linkText, setLinkText] = useState('Перейти к созданию опроса прямо сейчас');
    const [linkPath, setLinkPath] = useState('/create');

    useEffect(() => {
        const survey = localStorage.getItem('survey');
        const test = localStorage.getItem('test');

        if (test) {
            setLinkText('Продолжить создавать тест');
            setLinkPath('/create');
        } else if (survey) {
            setLinkText('Продолжить создавать опрос');
            setLinkPath('/create');
        }
    }, []);

    return (
        <div>
            <div className="content-background position-relative overflow-hidden p-3 p-md-5 m-md-3 text-center bg-body-tertiary">
                <div className="col-md-11 p-lg-5 mx-auto my-5">
                    <h2 className="fw-normal text-muted mb-3">
                        ПРОСТОЙ И УДОБНЫЙ СЕРВИС ПОМОЖЕТ ВАМ СОЗДАТЬ ОПРОС И ПРОВЕСТИ ИССЛЕДОВАНИЕ
                    </h2>
                    <div className="d-flex gap-3 justify-content-center lead fw-normal">
                        <Link className="icon-link" to={linkPath}>
                            {linkText}
                            <svg className="bi">
                                <use xlinkHref="#chevron-right"></use>
                            </svg>
                        </Link>
                    </div>
                </div>
            </div>

            <div className="container container-xxl">
                <h2 className="text-center nc-title-h2 con">
                    С нашим сервисом вы можете
                </h2>
                <div className="nc-benefits">
                    <div className="nc-benefits__wrapper">
                        <div className="row justify-content-center">
                            <div className="col-12 col-sm-6 col-md-4 d-flex align-items-stretch">
                                <div className="card nc-benefits__item text-center">
                                    <img src="https://cdn.anketolog.ru/img/new-constructor/benefit-1.svg"
                                         alt="benefit-1" className="card-img-top nc-benefits__img no-select"/>
                                    <div className="card-body">
                                        <h5 className="card-title nc-benefits__title">Создать опрос</h5>
                                        <p className="card-text nc-benefits__text">
                                            Удобный конструктор анкет и тестов.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 col-sm-6 col-md-4 d-flex align-items-stretch">
                                <div className="card nc-benefits__item text-center">
                                    <img src="https://cdn.anketolog.ru/img/new-constructor/benefit-2.svg"
                                         alt="benefit-2" className="card-img-top nc-benefits__img no-select"/>
                                    <div className="card-body">
                                        <h5 className="card-title nc-benefits__title">Собрать ответы</h5>
                                        <p className="card-text nc-benefits__text">
                                            Эффективный способ сбора ответов.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 col-sm-12 col-md-4 d-flex align-items-stretch">
                                <div className="card nc-benefits__item text-center">
                                    <img src="https://cdn.anketolog.ru/img/new-constructor/benefit-3.svg"
                                         alt="benefit-3" className="card-img-top nc-benefits__img no-select"/>
                                    <div className="card-body">
                                        <h5 className="card-title nc-benefits__title">Получить результат</h5>
                                        <p className="card-text nc-benefits__text">
                                            Ознокамление с результатами.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="nc-benefits">
                <div className="nc-benefits__wrapper">
                    <div className="row justify-content-center">
                        <Cards cardsPerPage={8} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Content;
