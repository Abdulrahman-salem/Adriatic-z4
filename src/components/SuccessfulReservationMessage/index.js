import React from "react";
import { useNavigate } from "react-router-dom";
import "./index.scss"

function SuccessfulReservationMessage(props) {
    const {
        apartmentName,
        reservationDates,
        numberOfMaxPeople,
        reservationPrice,
    } = props;
    console.log(props);
    const navigate = useNavigate();

    function handleReturnToHomePage(e) {
        navigate(`/`);
    }

    return (
        <article className="successful-reservation-container">
            <p>Uspješno ste rezervirali smještaj [{apartmentName}]</p>
            <p>termin boravka: {reservationDates}</p>
            <p>broj osoba: {numberOfMaxPeople}</p>
            <p>ukupna cijena: {reservationPrice}</p>
            <button onClick={handleReturnToHomePage} className="back-home-btn">
                Povratak na početnu stranicu
            </button>
        </article>
    );
}

export default SuccessfulReservationMessage;
