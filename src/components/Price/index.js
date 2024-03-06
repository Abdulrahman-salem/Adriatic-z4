import React, { useEffect, useState } from "react";
import "./index.scss";

function Price({
    pricelistInEuros,
    isReserved,
    onReservation,
    availableDates,
}) {
    const [priceSelectedDate, setPriceSelectedDate] = useState(0);
    const [checkInDateString, setCheckInDateString] = useState("");
    const [checkOutDateString, setCheckOutDateString] = useState("");
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(0);
    const [minDate, setMinDate] = useState("");
    const [maxDate, setMaxDate] = useState("");
    const [numberOfReservedNights, setNumberOfReservedNights] = useState("");

    useEffect(() => {
        let intervalsStart = [];
        let intervalsEnd = [];
        let prices = [];

        pricelistInEuros.forEach((item) => {
            prices.push(item.pricePerNight);
            intervalsStart.push(new Date(item.intervalStart));
            intervalsEnd.push(new Date(item.intervalEnd));
        });

        const firstDate = new Date(Math.min(...intervalsStart));
        const lastDate = new Date(Math.max(...intervalsEnd));

        setMinPrice(Math.min(...prices));
        setMaxPrice(Math.max(...prices));
        setMinDate(firstDate.toISOString().split("T")[0]);
        setMaxDate(lastDate.toISOString().split("T")[0]);
    }, [pricelistInEuros]);

    function checkIfDateReserved(objectParameter) {
        let { date, isForCheckIn, isForCheckOut } = objectParameter;
        let checkInDate = new Date(checkInDateString);
        let checkOutDate = new Date(checkOutDateString);
        let selectedDate = new Date(date);

        let isFindReserve = false;
        let result = {
            isReserved: false,
            date: "",
            message: "",
        };

        let availableDatesString = `dostupni datumi:\n ${availableDates
            .map((dates) => {
                return `  ${dates.intervalStart} - ${dates.intervalEnd}\n `;
            })
            .join("")}`;

        availableDates.map((date, index) => {
            let intervalStart = new Date(date.intervalStart);
            let intervalEnd = new Date(date.intervalEnd);
            let dateConditions = {
                isDateEqualToIntervalEnd:
                    selectedDate.getTime() === intervalEnd.getTime(),

                isDateAreNotBetweenIntervalStartAndIntervalEnd: !(
                    selectedDate >= intervalStart && selectedDate <= intervalEnd
                ),

                isCheckOutDateAreNotBetweenIntervalStartAndIntervalEnd: !(
                    checkOutDate <= intervalEnd && checkOutDate > intervalStart
                ),

                isCheckInDateAreNotBetweenIntervalStartAndIntervalEnd: !(
                    checkInDate < intervalEnd && checkInDate >= intervalStart
                ),
            };

            // ckeck if the date is between intervals
            if (
                !dateConditions.isDateAreNotBetweenIntervalStartAndIntervalEnd
            ) {
                if (isFindReserve === false) {
                    isFindReserve = true;

                    if (isForCheckIn) {
                        // check if the date is equal to intervalEnd
                        if (dateConditions.isDateEqualToIntervalEnd) {
                            result.isReserved = true;
                            result.date = intervalEnd.toLocaleDateString("hr");
                            result.message = `Smještaj je zauzet ${result.date}`;
                        }
                        // check if checkOutDate is not Invalid date
                        // if checkOutDate not Invalid date check if it in the same interval width selectedDate
                        else if (
                            !isNaN(checkOutDate.getTime()) &&
                            dateConditions.isCheckOutDateAreNotBetweenIntervalStartAndIntervalEnd
                        ) {
                            result.isReserved = true;
                            result.date = selectedDate.toLocaleDateString("hr");
                            result.message = `Smještaj nije dostupan ${result.date} ${availableDatesString}`;
                        }
                    } else if (isForCheckOut) {
                        // check if checkInDate is not Invalid date
                        // if checkInDate not Invalid date check if it in the same interval width selectedDate
                        if (
                            !isNaN(checkInDate.getTime()) &&
                            dateConditions.isCheckInDateAreNotBetweenIntervalStartAndIntervalEnd
                        ) {
                            result.isReserved = true;
                            result.date = selectedDate.toLocaleDateString("hr");
                            result.message = `Smještaj nije dostupan ${result.date} ${availableDatesString}`;
                        }
                    }
                }
            }
            // check if it's the last loop and isFindReserve still false
            else if (
                index === availableDates.length - 1 &&
                isFindReserve === false
            ) {
                result.isReserved = true;
                result.date = selectedDate.toLocaleDateString("hr");
                result.message = `Smještaj nije dostupan ${result.date} 
                \n${availableDatesString}`;
            }
        });
        return result;
    }

    function handleCheckIn(e) {
        e.preventDefault();
        let parametersForFunctionCheckIfDateReserved = {
            date: e.target.value,
            isForCheckIn: true,
            isForCheckOut: false,
        };
        let reservedDate = checkIfDateReserved(
            parametersForFunctionCheckIfDateReserved
        );

        if (reservedDate.isReserved) {
            setCheckInDateString("");
            setPriceSelectedDate(0);
            return alert(reservedDate.message);
        }

        if (e.target.value === checkOutDateString) {
            setCheckInDateString("");
            setPriceSelectedDate(0);
            return alert(`Morate odabrati barem jednu noć`);
        }

        return setCheckInDateString(e.target.value);
    }

    function handleCheckOut(e) {
        e.preventDefault();
        let parametersForFunctionCheckIfDateReserved = {
            date: e.target.value,
            isForCheckIn: false,
            isForCheckOut: true,
        };
        let reservedDate = checkIfDateReserved(
            parametersForFunctionCheckIfDateReserved
        );

        if (reservedDate.isReserved) {
            setCheckOutDateString("");
            setPriceSelectedDate(0);
            return alert(reservedDate.message);
        }

        if (e.target.value === checkInDateString) {
            setCheckOutDateString("");
            setPriceSelectedDate(0);
            return alert(`Morate odabrati barem jednu noć`);
        }

        return setCheckOutDateString(e.target.value);
    }
    useEffect(() => {
        if (checkInDateString && checkOutDateString) {
            let totalPrice = 0;
            let checkInDate = new Date(checkInDateString);
            let checkOutDate = new Date(checkOutDateString);

            pricelistInEuros.map((item) => {
                let intervalStart = new Date(item.intervalStart);
                let intervalEnd = new Date(item.intervalEnd);

                if (
                    checkInDate <= intervalEnd &&
                    checkOutDate >= intervalStart
                ) {
                    let numberReservedNightsInTheMonth =
                        (Math.min(checkOutDate, intervalEnd) -
                            Math.max(checkInDate, intervalStart)) /
                        (1000 * 60 * 60 * 24);

                    totalPrice +=
                        numberReservedNightsInTheMonth * item.pricePerNight;
                }
            });

            setPriceSelectedDate(totalPrice);

            let numberOfNights =
                (checkOutDate - checkInDate) / (1000 * 60 * 60 * 24);
            setNumberOfReservedNights(numberOfNights);
        }
    }, [checkInDateString, checkOutDateString, pricelistInEuros]);

    function handleClickOnReserve(e) {
        e.preventDefault();
        return onReservation({
            isReserved: !isReserved,
            reservationDates: `Od ${checkInDateString} do ${checkOutDateString}`,
            reservationPrice: priceSelectedDate,
        });
    }

    return (
        <section className="price-container">
            <p>
                CIJENE ({minPrice} € - {maxPrice} €) po noćenju
            </p>
            <p> Unesite datum koji želite rezervirati kako biste vidjeli cijenu rezervacije </p>
            <form>
                <label>Datum </label>
                <label htmlFor="date">Od {""}</label>

                <input
                    type="date"
                    name="date"
                    min={minDate}
                    max={checkOutDateString ? checkOutDateString : maxDate}
                    onChange={handleCheckIn}
                />
                <label htmlFor="date"> Do {""}</label>

                <input
                    type="date"
                    name="date"
                    min={checkInDateString ? checkInDateString : minDate}
                    max={maxDate}
                    onChange={handleCheckOut}
                />
            </form>

            {priceSelectedDate ? (
                <>
                    <p className="reservation-last-price">
                        Cijena za {numberOfReservedNights} noć ( od{" "}
                        {checkInDateString} do {checkOutDateString} ) je{" "}
                        <span className="last-price">
                            {priceSelectedDate} €
                        </span>
                    </p>
                    <button
                        className="reservation-btn"
                        onClick={handleClickOnReserve}
                    >
                        Rezerviraj
                    </button>
                </>
            ) : null}
        </section>
    );
}

export default Price;
