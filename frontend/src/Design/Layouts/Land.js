import React, { useRef, useState, useEffect } from "react";
import config from "../config"; // Import the backend URL

export default function Land() {
  const canvasRef = useRef(null);
  const [points, setPoints] = useState([]);
  const [devices, setDevices] = useState({});

  // Fetch device data from API when the component mounts
  useEffect(() => {
    fetch(`${config.BACKEND_URL}/api/data`)
      .then((res) => res.json())
      .then((data) => {
        const deviceMap = {};
        data.forEach((entry) => {
          Object.keys(entry.data.device).forEach((deviceID) => {
            deviceMap[deviceID] = entry.data.device[deviceID].data;
          });
        });
        setDevices(deviceMap);
      })
      .catch((err) => console.error("Error fetching device data:", err));
  }, []);

  // Fetch points data from the backend on component mount
  useEffect(() => {
    fetch(`${config.BACKEND_URL}/api/points`)
      .then((res) => res.json())
      .then((data) => {
        if (data && Array.isArray(data)) {
          setPoints(data); // Set points if available
        }
      })
      .catch((err) => console.error("Error fetching points:", err));
  }, []);

  // Render the canvas and handle click event
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      points.forEach((point) => {
        drawRadarEffect(ctx, point);
        drawPoint(ctx, point.x, point.y, point.name);
      });

      requestAnimationFrame(animate);
    };

    animate();
  }, [points]);

  const handleCanvasClick = async (event) => {
    if (Object.keys(devices).length === 0) {
      alert("No devices available!");
      return;
    }

    const deviceID = prompt(
      `Select a device: \n${Object.keys(devices).join("\n")}`
    );

    if (!deviceID || !devices[deviceID]) {
      alert("Invalid device selection.");
      return;
    }

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Check if the clicked point already exists
    const isDuplicate = points.some(
      (point) => Math.abs(point.x - x) < 10 && Math.abs(point.y - y) < 10
    );

    if (isDuplicate) {
      alert("A point already exists at this location.");
      return;
    }

    const name = `Device ${deviceID}`;

    // Add the new point
    const newPoint = {
      x,
      y,
      name,
      radius: 5,
      alpha: 1,
      deviceID,
      data: devices[deviceID],
    };

    setPoints((prevPoints) => [...prevPoints, newPoint]);

    // Send data to the backend to store the new point
    fetch(`${config.BACKEND_URL}/api/add-point`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newPoint),
    }).catch((err) => console.error("Error saving point:", err));
  };

  const deletePoint = (index) => {
    const point = points[index];
    setPoints(points.filter((_, i) => i !== index));

    // Delete point from backend
    fetch(`${config.BACKEND_URL}/api/delete-point`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        x: point.x,
        y: point.y,
        name: point.name,
      }),
    }).catch((err) => console.error("Error deleting point:", err));
  };

  const drawPoint = (ctx, x, y, name) => {
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "black";
    ctx.font = "14px Arial";
    ctx.fillText(name, x + 10, y - 8);
  };

  const drawRadarEffect = (ctx, point) => {
    point.radius += 0.5;
    if (point.radius > 40) point.radius = 5;

    ctx.strokeStyle = `rgba(0, 200, 0, 0.3)`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(point.x, point.y, point.radius, 0, Math.PI * 2);
    ctx.stroke();
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Canvas Section */}
      <canvas
        ref={canvasRef}
        width={window.innerWidth / 2}
        height={window.innerHeight}
        onClick={handleCanvasClick}
        style={{ border: "1px solid black", cursor: "crosshair" }}
      />

      {/* Sidebar with List of Points */}
      <div style={{ width: "50%", padding: "20px", overflowY: "auto" }}>
        <h3>Marked Points</h3>
        <ul>
          {points.length > 0 ? (
            points.map((point, index) => (
              <li key={index} style={{ marginBottom: "8px" }}>
                <strong>{point.name}</strong> ({Math.round(point.x)},{" "}
                {Math.round(point.y)})
                <br />
                🌡 Temp: {point.data.temp}°C | 💧 Humidity: {point.data.humidity}
                %<br />
                🌱 Soil Moisture: {point.data.soilMoisture}% | ☔ Rain:{" "}
                {point.data.rain ? "Yes" : "No"}
                <br />
                <button
                  onClick={() => deletePoint(index)}
                  style={{
                    marginTop: "5px",
                    padding: "4px 8px",
                    backgroundColor: "red",
                    color: "white",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  ❌ Delete
                </button>
              </li>
            ))
          ) : (
            <p>No points available.</p>
          )}
        </ul>
      </div>
    </div>
  );
}
