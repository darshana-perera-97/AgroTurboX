import React, { useState, useEffect } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const HumidityDonutChart = () => {
  const [humidity, setHumidity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to fetch latest data
  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:5010/api/data/last");
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const result = await response.json();
      const humidityValue = result?.data?.device?.["0001"]?.data?.humidity || 0;
      setHumidity(humidityValue);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(); // Fetch initially

    // Auto-refresh every 1 minute (60000ms)
    const interval = setInterval(fetchData, 60000);

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (humidity === null) return <div>No data available.</div>;

  const chartData = {
    datasets: [
      {
        data: [humidity, 100 - humidity],
        backgroundColor: ["#36A2EB", "#E0E0E0"],
        hoverBackgroundColor: ["#1E88E5", "#BDBDBD"],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "70%",
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true },
    },
  };

  // Custom plugin to add text inside the donut chart
  const textCenter = {
    id: "textCenter",
    beforeDraw(chart) {
      const { width } = chart;
      const { height } = chart;
      const ctx = chart.ctx;

      ctx.restore();
      const fontSize = (height / 200).toFixed(2);
      ctx.font = `${fontSize}em sans-serif`;
      ctx.textBaseline = "middle";

      const text = "Humidity";
      const textX = Math.round((width - ctx.measureText(text).width) / 2);
      const textY = height / 2;

      ctx.fillStyle = "#333"; // Text color
      ctx.fillText(text, textX, textY);
      ctx.save();
    },
  };

  return (
    <div style={{ width: "300px", height: "300px", textAlign: "center" }}>
      <Doughnut
        data={chartData}
        options={chartOptions}
        plugins={[textCenter]}
      />
    </div>
  );
};

export default HumidityDonutChart;
