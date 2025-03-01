import React, { useState, useEffect } from "react";
const LastData = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:5010/api/data/last");

      if (response.ok) {
        const result = await response.json();
        setData(result);
        setError(null);
      } else {
        throw new Error("Failed to fetch data");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => {
      fetchData();
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (
    !data ||
    !data.data ||
    !data.data.device ||
    !data.data.device["0001"] ||
    !data.data.device["0001"].data
  ) {
    return <div>No data available.</div>;
  }

  const sensorData = data.data.device["0001"].data;

  const iconMap = {
    humidity: "humidity.png",
    rain: "rain.png",
    soilMoisture: "soil.png",
    temp: "temperature.png",
    gasQuality: "gas.png", // New icon for gas quality
    default: "default.png",
  };

  // Calculate gas quality
  const gasQuality = ((sensorData.mqValue / 1024) * 100).toFixed(2);

  return (
    <div className="container data">
      <h2>Last Data Entry</h2>
      <p>
        <strong>Timestamp:</strong> {data.timestamp}
      </p>
      <div className="card-container">
        {/* Map through the sensor data and display each value */}
        {Object.entries(sensorData).map(([key, value], index) => {
          // Skip "mqValue" since we handle it separately
          if (key === "mqValue") return null;

          return (
            <div key={key} className="card d-flex card-hover">
              <div>
                <img
                  src={`/icons/${iconMap[key] || iconMap.default}`}
                  alt={key}
                  className="card-icon"
                />
              </div>
              <div className="card-content">
                <h3>{key}</h3>
                <p>
                  {typeof value === "boolean" ? (value ? "Yes" : "No") : value}
                </p>
              </div>
            </div>
          );
        })}

        

        {/* MQ Value Card */}
        <div className="card d-flex card-hover">
          <div>
            <img
              src={`/icons/${iconMap["gasQuality"] || iconMap.default}`}
              alt="mqValue"
              className="card-icon"
            />
          </div>
          <div className="card-content">
            <h3>MQ Value</h3>
            <p>{sensorData.mqValue}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LastData;
