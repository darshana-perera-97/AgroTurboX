import React, { useRef, useState, useEffect } from "react";

export default function Land() {
  const canvasRef = useRef(null);
  const [points, setPoints] = useState([]);
  const [devices, setDevices] = useState({});

  // Fetch device data from API when the component mounts
  useEffect(() => {
    fetch("http://localhost:5010/api/data")
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched data:", data); // Check if data is fetched correctly
        const deviceMap = {};
        data.forEach((entry) => {
          Object.keys(entry.data.device).forEach((deviceID) => {
            deviceMap[deviceID] = entry.data.device[deviceID].data;
          });
        });
        console.log("Processed devices:", deviceMap); // Check the device map
        setDevices(deviceMap);
      })
      .catch((err) => console.error("Error fetching device data:", err));
  }, []);

  // Fetch points data from the backend on component mount
  useEffect(() => {
    fetch("http://localhost:5010/api/points")
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
        drawRadarEffect(ctx, point); // Enhanced radar effect
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

    console.log("Devices available:", devices); // Log the devices

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
    const name = `Device ${deviceID}`;

    setPoints([
      ...points,
      { x, y, name, radius: 5, alpha: 1, deviceID, data: devices[deviceID] },
    ]);

    // Send data to the backend to store the new point
    fetch("http://localhost:5010/api/add-point", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        x,
        y,
        name,
        deviceID,
        data: devices[deviceID],
      }),
    }).catch((err) => console.error("Error saving point:", err));
  };

  const deletePoint = (index) => {
    const point = points[index];
    setPoints(points.filter((_, i) => i !== index));

    // Delete point from backend
    fetch("http://localhost:5010/api/delete-point", {
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
    const maxRadius = 40;
    const numCircles = 3; // Number of radar rings
    const speed = 0.5;

    // Draw multiple circles with varying alpha and radius
    for (let i = 0; i < numCircles; i++) {
      const radius = point.radius + i * (maxRadius / numCircles);
      const alpha = 1 - i * 0.2; // Fade the circles

      ctx.strokeStyle = `rgba(0, 200, 0, ${alpha})`;
      ctx.lineWidth = 2 + i; // Increase thickness for each ring
      ctx.beginPath();
      ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Update the radius to expand the radar effect
    point.radius += speed;
    if (point.radius > maxRadius) point.radius = 5; // Reset the radius after max size
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
              <li key={index}>
                {point.name} ({point.x.toFixed(2)}, {point.y.toFixed(2)})
                <button
                  onClick={() => deletePoint(index)}
                  style={{
                    marginLeft: "10px",
                    backgroundColor: "red",
                    color: "white",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Delete
                </button>
              </li>
            ))
          ) : (
            <li>No points available</li>
          )}
        </ul>
      </div>
    </div>
  );
}
