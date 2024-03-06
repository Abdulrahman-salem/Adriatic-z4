import React from "react";
import { useNavigate } from "react-router-dom";
import "./index.scss";

function Cards({ hotelsData }) {
    const navigate = useNavigate();

    function handleClickPrikaziVise(e, hotelData) {
        e.preventDefault();
        navigate(`/hotel/${hotelData.id}`, { state: { hotelData: hotelData } });
    }
    return (
        <article className="cards-container">
            {hotelsData?.map((data) => {
                return (
                    <section key={data.id} className="card-container">
                        <picture>
                            <img
                                src={data.image}
                                alt="Basic img of the apartment"
                                width="auto"
                                height="auto"
                            />
                        </picture>
                        <h3 className="card-title">{data.title}</h3>
                        <p className="number-max-people">
                            max broj osoba: <span>{data.capacity}</span>
                        </p>
                        {data.beachDistanceInMeters && (
                            <p>{data.beachDistanceInMeters} m do plaža</p>
                        )}
                        <button
                            className="card-btn"
                            onClick={(e) => {
                                handleClickPrikaziVise(e, data);
                            }}
                        >
                            prikaži dodatne informacije
                        </button>
                    </section>
                );
            })}
        </article>
    );
}

export default Cards;
