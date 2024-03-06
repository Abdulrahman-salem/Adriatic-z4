import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import SuccessfulReservationMessage from "../SuccessfulReservationMessage";
import Price from "../Price";
import "./index.scss";

function Card() {
    // const navigation = useNavigation();
    // const navigate = useNavigate();
    //   const navigate = useNavigate();

    const [isReserved, setIsReserved] = useState(false);
    const [reservationDates, setReservationDates] = useState("");
    const [reservationPrice, setReservationPrice] = useState(0);

    const { state } = useLocation();

    const {
        amenities,
        availableDates,
        beachDistanceInMeters,
        capacity,
        id,
        image,
        pricelistInEuros,
        title,
    } = state.hotelData;

    function onReservation(e) {
        setReservationDates(e.reservationDates)
        setReservationPrice(e.reservationPrice)
        setIsReserved(e.isReserved);
    }

    return (
        <>
            <header></header>
            <main className="card-page-main">
                <article className="apartment-data-container">
                    <div>
                        <picture className="apartment-img-container">
                            <img
                                src={image}
                                alt="Basic img of the apartment"
                                width="auto"
                                height="auto"
                            />
                        </picture>
                        <Price
                            pricelistInEuros={pricelistInEuros}
                            availableDates={availableDates}
                            onReservation={onReservation}
                            isReserved={isReserved}
                        />
                    </div>
                    <div>
                        <h1 className="apartment-name">{title}</h1>
                        <p>max broj osoba: {capacity}</p>
                        {beachDistanceInMeters && (
                            <p>
                                Udaljenost do plaža: {beachDistanceInMeters} m
                            </p>
                        )}
                        <section>
                            <p>Pogodnosti</p>
                            <p>
                                Klima: {amenities.airConditioning ? "Da" : "Ne"}
                            </p>
                            <p>
                                Parkirno mjesto:{" "}
                                {amenities.parkingSpace ? "Da" : "Ne"}
                            </p>
                            <p>
                                Kućni ljubimci: {amenities.pets ? "Da" : "Ne"}
                            </p>
                            <p>Bazen: {amenities.pool ? "Da" : "Ne"}</p>
                            <p>Televizor: {amenities.tv ? "Da" : "Ne"}</p>
                            <p>Wifi: {amenities.wifi ? "Da" : "Ne"}</p>
                        </section>
                    </div>
                </article>
            </main>
                {isReserved && <SuccessfulReservationMessage apartmentName={title} reservationDates={reservationDates} numberOfMaxPeople={capacity}  reservationPrice={reservationPrice} />}
            <footer></footer>
        </>
    );
}

export default Card;
