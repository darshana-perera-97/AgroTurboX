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
    humidity: <FaTint size={40} color={iconColor} />,
    rainDetected: <FaCloudRain size={40} color={iconColor} />,
    rainIntensity: <FaCloudRain size={40} color={iconColor} />,
    raindropValue: <FaCloudRain size={40} color={iconColor} />,
    soilMoisture: <FaWater size={40} color={iconColor} />,
    temp: <FaTemperatureHigh size={40} color={iconColor} />,
    gasQuality: <FaGasPump size={40} color={iconColor} />,
    default: <FaExclamationTriangle size={40} color={iconColor} />,
  };

  return (
    <div className="mt-4 pb-5">
      {/* 4X2 Grid */}
      <div className="row row-cols-4 g-3">
        {Object.entries(sensorData).map(([key, value]) => {
          if (key === "mqValue") return null; // Skip raw mqValue, we use Gas Quality

          return (
            <div key={key} className="col">
              <div className="card text-center shadow-sm p-3 pt-5">
                <div className="mx-auto">{iconMap[key] || iconMap.default}</div>
                <div className="card-body">
                  <h5 className="card-title">{nameMap[key] || key}</h5>
                  <p className="card-text">
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
        <div className="col">
          <div className="card text-center shadow-sm p-3 pt-5">
            <div className="mx-auto">{iconMap["gasQuality"]}</div>
            <div className="card-body">
              <h5 className="card-title">{nameMap["gasQuality"]}</h5>
              <p className="card-text">{gasQuality} %</p>
            </div>
          </div>
        </div>
      </div>
      <p className="text-end mt-3 pb-5">
        {" "}
        Device Updated on : {data.timestamp}
      </p>
    </div>
  );
};

export default LastData;
