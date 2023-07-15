import React, { useState,useEffect } from 'react';
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
 

  const fetchDefaultWeather = async () => {
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

      let obj = response.data.location;
      console.log(obj)
      let fullLocation = `${obj.name},${obj.region},${obj.country}`
    
     
      setFullLocation(fullLocation);
      console.log(fullLocation, " full location", obj)

      let iconUrl = response.data.current.condition.icon;
      setIcon(`http:${iconUrl}`);

      const temperature = response.data.current.temp_c;
      const humidity = response.data.current.humidity;
      const condition = response.data.current.condition.text;
      // await getFlagEmoji(obj.country);
      setWeatherData({ temperature, humidity, condition });
    } catch (err) {

      toast.error(`Error fetching weather data, please check the country name properly typed or maybe due to API `, {
        position: toast.POSITION.TOP_RIGHT
      });
    } finally {
      setLoading(false);
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    fetchDefaultWeather()
  };
  useEffect(() => {

    fetchDefaultWeather();
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
            <h2>{fullLocation} </h2>
            <p>Temperature: <span className='value'>{weatherData.temperature}°C 🌡️</span> </p>
            <p>Humidity: <span className='value'>{weatherData.humidity} &#128167;</span></p>
            <p>Weather Condition: <span className=''> {weatherData.condition} </span><img
              src={icon}
              alt="Weather Icon"
              className="weather-icon"
              align="center"
            /></p>
           
          </div>
        )}

        <ToastContainer />
      </div>
    </div>
  );
};

export default WeatherApp;
