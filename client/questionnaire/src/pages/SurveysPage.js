import React from 'react';
import Cards from "../components/Content/Cards";

function SurveysPage() {
    return (
        <div className="d-flex flex-column min-vh-100">
            <div className="nc-benefits">
                <div className="nc-benefits__wrapper">
                    <div className="row justify-content-center">
                        <Cards cardsPerPage={12} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SurveysPage;
