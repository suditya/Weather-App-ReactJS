import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/WeatherApp.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const WeatherApp = () => {
  const [location, setLocation] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fullLocation, setFullLocation] = useState('');
  const apiKey = "bbdb2e8468b64185adf70717231507";
  const [icon, setIcon] = useState('');

  const fetchWeatherData = async () => {
    try {
      setLoading(true);
      let city = '';
      if (location.length == 0) {
        // setLocation("Barcelona")
        city = "Barcelona";
      }
      else city = location;
      const response = await axios.get(
        `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&aqi=no`
      );
      
      const data = response.data;
      let fullLocation = `${data.location.name}, ${data.location.region}, ${data.location.country}`;
      setFullLocation(fullLocation);

      let iconUrl = data.current.condition.icon;
      setIcon(`http:${iconUrl}`);

      const temperature = data.current.temp_c;
      const humidity = data.current.humidity;
      const condition = data.current.condition.text;
      
      setWeatherData({ temperature, humidity, condition });
    } catch (error) {
      toast.error(`Error fetching weather data`, {
        position: toast.POSITION.TOP_RIGHT
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (location.trim() !== '') {
      fetchWeatherData();
    } else {
      toast.error('Please enter a valid location.', {
        position: toast.POSITION.TOP_RIGHT
      });
    }
  };

  useEffect(() => {
    fetchWeatherData();
  }, []);

  return (
    <div className="container">
      <div className="weather-app-container">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? 'Loading...' : 'Get Weather'}
          </button>
        </form>
        {weatherData && (
          <div className="weather-data-container">
            <h2>{fullLocation} <span><img
              src={icon}
              alt="Weather Icon"
              className="weather-icon"
              align="center"
            /></span> </h2>
            <p>Weather Condition: <span className=''> {weatherData.condition} </span>
            <img
              src={icon}
              alt="Weather Icon"
              className="weather-icon"
              align="center"
            />
            </p>
            <p>Temperature: <span className='value'>{weatherData.temperature}°C 🌡️</span> </p>
            <p>Humidity: <span className='value'>{weatherData.humidity} &#128167;</span></p>
          </div>
        )}

        <ToastContainer />
      </div>
    </div>
  );
};

export default WeatherApp;
