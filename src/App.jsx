import { Oval } from "react-loader-spinner";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFrown } from "@fortawesome/free-solid-svg-icons";
import "./App.css";

function App() {
  const [input, setInput] = useState("");
  const [weather, setWeather] = useState({
    loading: false,
    data: {},
    forecast: [], // Ajouter pour stocker les prévisions
    error: false,
  });
  const [favorites, setFavorites] = useState([]);

  const toDateFunction = () => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const WeekDays = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const currentDate = new Date();
    const date = `${WeekDays[currentDate.getDay()]} ${currentDate.getDate()} ${
      months[currentDate.getMonth()]
    }`;
    return date;
  };

  async function fetchWeather(specCity) {
    setWeather({ ...weather, loading: true });

    const currentWeatherUrl = "https://api.openweathermap.org/data/2.5/weather";
    const forecastUrl = "https://api.openweathermap.org/data/2.5/forecast";
    const api_key = "f00c38e0279b7bc85480c3fe775d518c";

    try {
      const weatherResponse = await axios.get(currentWeatherUrl, {
        params: {
          q: specCity,
          units: "metric",
          appid: api_key,
        },
      });

      const forecastResponse = await axios.get(forecastUrl, {
        params: {
          q: specCity,
          units: "metric",
          appid: api_key,
        },
      });

      const filteredForecast = forecastResponse.data.list
        .filter((item) => item.dt_txt.includes("12:00:00"))
        .slice(0, 7);

      setWeather({
        data: weatherResponse.data,
        forecast: filteredForecast,
        loading: false,
        error: false,
      });
    } catch (error) {
      setWeather({ ...weather, data: {}, forecast: [], error: true });
      setInput("");
    }
  }

  const search = async (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      setInput("");
      fetchWeather(input);
    }
  };
  const addToFavorites = () => {
    const city = weather.data.name;
    if (city && !favorites.includes(city)) {
      const newFavorites = [...favorites, city];
      setFavorites(newFavorites);
      localStorage.setItem("favorites", JSON.stringify(newFavorites));
    }
  };

  useEffect(function () {
    fetchWeather("Marrakech");
  }, []);

  return (
    <div className="App">
      <nav>
        <h1 className="app-name">Weather Application</h1>
        {favorites.length > 0 && (
          <div className="favorites">
            {/* <h3>Villes favorites :</h3> */}
            <ul>
              {favorites.map((city, index) => (
                <a
                  key={index}
                  onClick={(e) => {
                    e.preventDefault();
                    fetchWeather(city);
                  }}
                >
                  {city}
                </a>
              ))}
            </ul>
          </div>
        )}
        <div className="search-bar">
          <input
            type="text"
            className="city-search"
            placeholder="Entrez le nom de la ville..."
            name="query"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyPress={search}
          />
        </div>
      </nav>
      <div className="weather">
        {/* Error message */}
        <div className="loading-error">
          {weather.loading && !weather.length > 0 && (
            <Oval type="Oval" color="white" height={50} width={50} />
          )}
          {weather.error && (
            <span className="error-message">
              {/* <FontAwesomeIcon icon={faFrown} /> */}
              <FontAwesomeIcon icon={faFrown} size="2x" />
              <span>city not found.</span>
            </span>
          )}
        </div>
        <div className="weather--left">
          {weather && weather.data.weather && weather.data.main && (
            <>
              <button onClick={addToFavorites}>Add to favorites</button>
              <div className="weather-left-temp">
                <img
                  className="weather-img"
                  src={`https://openweathermap.org/img/wn/${weather.data.weather[0].icon}@2x.png`}
                  alt={weather.data.weather[0].description}
                />
                <p className="tempurature">
                  {Math.round(weather.data.main.temp)}°C
                </p>
              </div>
              {/* {weather.loading && (
                <Oval type="Oval" color="white" height={50} width={50} />
              )} */}
              <h2>
                {weather.data.name}, {weather.data.sys.country}
              </h2>
              <span className="weather-date">{toDateFunction()}</span>
              <p className="weather-wind">
                <span>Wind speed</span> <br /> {weather.data.wind.speed} m/s
              </p>
              <p></p>
            </>
          )}
        </div>
        <div className="weather--right">
          {weather.forecast?.length > 0 && (
            <>
              {/* <div className="forecast-container"> */}
              {/* <div className="forecast-grid"> */}
              {weather.forecast.map((item, index) => (
                <div key={index} className="forecast-item">
                  <p className="forecast-item--day">
                    {new Date(item.dt_txt).toLocaleDateString("fr-FR", {
                      weekday: "long",
                      day: "numeric",
                    })}
                  </p>
                  <hr />
                  <img
                    src={`https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
                    alt={item.weather[0].description}
                  />
                  <p>{Math.round(item.main.temp)}°C</p>
                </div>
              ))}
              {/* </div> */}
              {/* </div> */}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
