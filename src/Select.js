import axios from "axios";
import React, { useEffect, useState } from "react";
import Select from "react-select";

const SelectC = () => {
    const [cities, setCities] = useState([]);
    useEffect(() => {
        fetchCities();
    }, []);
    const fetchCities = async () => {
        try {
            const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=London&appid=${process.env.REACT_APP_API_KEY}`)
            const cityList = response.data.map(city => ({
                value: city.name,
                label: city.name
            }));
            setCities(cityList);

        }
        catch (error) {
            console.log(error);
        }
    };
    const handleInputChange = selectedOption => {
        setCities(selectedOption.value);
    };
    return (

        <Select
            options={cities}
            onChange={handleInputChange}
            placeholder="Select a city"
        />

    );


}
export default SelectC;