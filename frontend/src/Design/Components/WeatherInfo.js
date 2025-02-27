import React, { useEffect, useState } from "react";

const WeatherInfo = () => {
  const [weather, setWeather] = useState(null);
  const [assume, setAssume] = useState("");

  useEffect(() => {
    fetch("http://localhost:5010/api/weather")
      .then((response) => response.json())
      .then((data) => {
        setWeather({
          temp_c: data.weather.temp_c,
          condition: data.weather.condition,
          wind_kph: data.fullData.current.wind_kph,
          pressure_in: data.fullData.current.pressure_in,
          humidity: data.fullData.current.humidity,
          cloud: data.fullData.current.cloud,
          dewpoint_c: data.fullData.current.dewpoint_c,
        });
        setAssume(data.assume);
      })
      .catch((error) => console.error("Error fetching weather:", error));
  }, []);

  return (
    <div style={styles.container}>
      <h2>Weather in Chilaw</h2>
      {weather ? (
        <div style={styles.card}>
          <p>
            <strong>Temperature:</strong> {weather.temp_c}°C
          </p>
          <p>
            <strong>Condition:</strong> {weather.condition}
          </p>
          <p>
            <strong>Wind Speed:</strong> {weather.wind_kph} km/h
          </p>
          <p>
            <strong>Pressure:</strong> {weather.pressure_in} in
          </p>
          <p>
            <strong>Humidity:</strong> {weather.humidity}%
          </p>
          <p>
            <strong>Cloud Cover:</strong> {weather.cloud}%
          </p>
          <p>
            <strong>Dew Point:</strong> {weather.dewpoint_c}°C
          </p>
          <hr />
          <p>
            <strong>Forecast:</strong> {assume}
          </p>
        </div>
      ) : (
        <p>Loading weather data...</p>
      )}
    </div>
  );
};

const styles = {
  container: {
    textAlign: "center",
    fontFamily: "Arial, sans-serif",
    marginTop: "20px",
  },
  card: {
    display: "inline-block",
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
    backgroundColor: "#f9f9f9",
    textAlign: "left",
    maxWidth: "400px",
  },
};

export default WeatherInfo;
