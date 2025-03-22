import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css"; // Bootstrap CSS
import {
  FaTint,
  FaCloudRain,
  FaTemperatureHigh,
  FaWater,
  FaGasPump,
  FaExclamationTriangle,
} from "react-icons/fa";
import config from "../config"; // Import the backend URL

const LastData = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const response = await fetch(`${config.BACKEND_URL}/api/data/last`);

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
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div className="text-center mt-4">Loading...</div>;
  if (error)
    return <div className="text-center mt-4 text-danger">Error: {error}</div>;

  if (
    !data ||
    !data.data ||
    !data.data.device ||
    !data.data.device["0001"] ||
    !data.data.device["0001"].data
  ) {
    return <div className="text-center mt-4">No data available.</div>;
  }

  const sensorData = data.data.device["0001"].data;
  const gasQuality = ((sensorData.mqValue / 1024) * 100).toFixed(2);

  // Map sensor names to custom names
  const nameMap = {
    humidity: "Humidity Level",
    rainDetected: "Rain Detected",
    rainIntensity: "Rain Intensity",
    raindropValue: "Raindrop Value",
    soilDry: "Soil Dryness",
    soilMoisture: "Soil Moisture Level",
    temp: "Temperature",
    gasQuality: "Air Quality (Gas Level)",
  };

  // Map sensor names to React Icons
  const iconColor = "#144884"; // Dark blue color for icons
  const iconMap = {
    humidity: <FaTint size={40} color={iconColor} className="img-fluid" />,
    rainDetected: (
      <FaCloudRain size={40} color={iconColor} className="img-fluid" />
    ),
    rainIntensity: (
      <FaCloudRain size={40} color={iconColor} className="img-fluid" />
    ),
    raindropValue: (
      <FaCloudRain size={40} color={iconColor} className="img-fluid" />
    ),
    soilMoisture: <FaWater size={40} color={iconColor} className="img-fluid" />,
    temp: (
      <FaTemperatureHigh size={40} color={iconColor} className="img-fluid" />
    ),
    gasQuality: <FaGasPump size={40} color={iconColor} className="img-fluid" />,
    default: (
      <FaExclamationTriangle
        size={40}
        color={iconColor}
        className="img-fluid"
      />
    ),
  };

  return (
    <div className="container-fluid mt-4 pb-5">
      <h3 className="mb-4 text-center text-primary">Latest Sensor Data</h3>

      {/* Responsive Grid */}
      <div className="row g-3">
        {Object.entries(sensorData).map(([key, value]) => {
          if (key === "mqValue") return null; // Skip raw mqValue, we use Gas Quality

          return (
            <div
              key={key}
              className="col-12 col-md-6 col-lg-3 d-flex justify-content-center"
            >
              <div className="card shadow-sm p-3 text-center w-100">
                <div className="mx-auto">{iconMap[key] || iconMap.default}</div>
                <div className="card-body">
                  <h6 className="card-title fw-semibold text-secondary">
                    {nameMap[key] || key}
                  </h6>
                  <p className="card-text fs-5 fw-bold text-dark">
                    {typeof value === "boolean"
                      ? value
                        ? "Yes"
                        : "No"
                      : value}
                  </p>
                </div>
              </div>
            </div>
          );
        })}

        {/* Gas Quality Card */}
        <div className="col-12 col-md-6 col-lg-3 d-flex justify-content-center">
          <div className="card shadow-sm p-3 text-center w-100">
            <div className="mx-auto">{iconMap["gasQuality"]}</div>
            <div className="card-body">
              <h6 className="card-title fw-semibold text-secondary">
                {nameMap["gasQuality"]}
              </h6>
              <p className="card-text fs-5 fw-bold text-dark">{gasQuality} %</p>
            </div>
          </div>
        </div>
      </div>

      <p className="text-end mt-3 pb-5 text-muted small">
        Device Updated on: <strong>{data.timestamp}</strong>
      </p>
    </div>
  );
};

export default LastData;
