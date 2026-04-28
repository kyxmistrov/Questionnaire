import React, { useState, useEffect } from 'react';
import ChooseWay from "../components/Сhoice-and-Create/ChooseWay";
import Survey from "../components/Сhoice-and-Create/Survey/Survey";
import Test from "../components/Сhoice-and-Create/Test/Test";


function CreatePage() {
    const [selectedOption, setSelectedOption] = useState(() => {
        return localStorage.getItem('selectedOption') || null;
    });

    useEffect(() => {
        if (selectedOption !== null) {
            localStorage.setItem('selectedOption', selectedOption);
        } else {
            localStorage.removeItem('selectedOption');
        }
    }, [selectedOption]);

    const handleReset = () => {
        const confirmed = window.confirm('Вы действительно хотите прекратить создание? Это сбросит весь процесс.');
        if (confirmed) {
            setSelectedOption(null);
            localStorage.removeItem('survey');
            localStorage.removeItem('test');
        }
    };

    return (
        <div className="d-flex flex-column min-vh-100">
            {selectedOption && (
                <button onClick={handleReset} className="btn btn-md btn-circle btn-red m-3 align-self-start">
                    Отменить выбор
                </button>
            )}
            {!selectedOption && <ChooseWay onOptionSelect={setSelectedOption} />}
            {selectedOption === 'survey' && <Survey selectedOption={selectedOption} />}
            {selectedOption === 'test' && <Test selectedOption={selectedOption} />}


        </div>
    );
}

export default CreatePage;
