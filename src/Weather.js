import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Weather.css';
import { FaSearch } from "react-icons/fa";
import sunnyBg from './sunnyBg.jpg';
import rainyBg from './rainyBg.jpg';
import cloudyBg from './cloudyBg.jpg';
import night_clear from './night_clear.jpg';
import image from './image.jpg';

const Weather = () => {
    const [city, setCity] = useState('');
    const [weatherData, setWeatherData] = useState(null);
    const [backgroundImage, setBackgroundImage] = useState(null);
    const fetchData = async () => {
        try {
            const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${process.env.REACT_APP_API_KEY}`);
            setWeatherData(response.data);
        } catch (error) {
            console.log(error);
        }
    }


    useEffect(() => {
        fetchData();
    }, []);
    useEffect(() => {
        if (weatherData && weatherData.weather && weatherData.weather[0]) {
            const conditionWords = weatherData.weather[0].main.toLowerCase().split(" ");
            let condition = "default"; // Default condition if none matches
            if (conditionWords.includes("clear")) {
                const currentTime = new Date().getTime() / 1000;
                const sunrise = weatherData.sys.sunrise;
                const sunset = weatherData.sys.sunset;
                if (currentTime >= sunrise && currentTime <= sunset) {
                    condition = "sunny";
                } else {
                    condition = "night";
                }
            } else if (conditionWords.includes("rain") || conditionWords.includes("shower")) {
                condition = "rainy";
            } else if (conditionWords.includes("clouds")) {
                condition = "cloudy";
            }
            switch (condition) {
                case 'sunny':
                    setBackgroundImage(sunnyBg);
                    break;
                case 'night':
                    setBackgroundImage(night_clear);
                    break;
                case 'rainy':
                    setBackgroundImage(rainyBg);
                    break;
                case 'cloudy':
                    setBackgroundImage(cloudyBg);
                    break;
                default:
                    setBackgroundImage(image);
                    break;
            }
        }
    }, [weatherData]);
    const handleInputChange = (e) => {
        setCity(e.target.value);
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        fetchData();
    }
    return (
        <div className='weather' style={{ backgroundImage: `url(${backgroundImage})` }} >
            <div className='card'>
                <h1>SkyCast</h1>
                <form onSubmit={handleSubmit} className='flexform'>
                    <input type='text' placeholder='Enter City' value={city} onChange={handleInputChange} />
                    <button type='submit'> Get Weather <FaSearch /></button>
                </form>
                {weatherData ? (<>

                    <h2>{weatherData.name}</h2>
                    <div className='flex'>
                        <p>Temperature : {weatherData.main.temp}°C </p>
                        <p>Description : {weatherData.weather[0].description} </p>
                    </div>
                    <div className='flex'>
                        <p>Feels like : {weatherData.main.feels_like} °C</p>
                        <p>Humidity : {weatherData.main.humidity} % </p>
                    </div>
                    <div className='flex'>
                        <p>Pressure : {weatherData.main.pressure} hPa </p>
                        <p>Wind Speed : {weatherData.wind.speed} m/s </p>
                    </div>
                    <div className='flex'>
                        <p>Sunrise : {new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString()}</p>
                        <p>Sunset : {new Date(weatherData.sys.sunset * 1000).toLocaleTimeString()}</p>
                    </div>
                </>)
                    : (<p>Loading Weather data...</p>)}
            </div>
        </div>
    );
}

export default Weather;
