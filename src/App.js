import { Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";
import { getData } from "./adapters/fetch";
import { URL_GET_ADRIATIC_DATABASE } from "./helpers/constants/api";
import Home from "./pages/Home";
import Card from "./components/Card";

function App() {
    let [hotelsData, setHotelsData] = useState([
        {
            amenities: {},
            availableDates: [],
            beachDistanceInMeters: 0,
            capacity: 0,
            id: 0,
            image: "",
            pricelistInEuros: [],
            title: "",
        },
    ]);

    useEffect(() => {
        try {
            getData(URL_GET_ADRIATIC_DATABASE).then((data) => {
                setHotelsData(data);
            });
        } catch (error) {
            throw new Error(error);
        }
    }, []);
    return (
        <Routes>
            <Route path="/" element={<Home hotelsData={hotelsData} />} />
            <Route path="hotel/:id" element={<Card />} />
        </Routes>
    );
}

export default App;
