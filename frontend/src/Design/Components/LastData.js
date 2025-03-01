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
    default: "default.png",
  };

  const cardColors = ["#FFCC80", "#81D4FA", "#A5D6A7", "#EF9A9A"]; // 4 Different colors

  return (
    <div className="container data">
      <h2>Last Data Entry</h2>
      <p>
        <strong>Timestamp:</strong> {data.timestamp}
      </p>
      <div className="card-container">
        {Object.entries(sensorData).map(([key, value], index) => (
          <div
            key={key}
            className="card d-flex"
            style={{ backgroundColor: cardColors[index % cardColors.length] }}
          >
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
        ))}
      </div>
    </div>
  );
};

export default LastData;
