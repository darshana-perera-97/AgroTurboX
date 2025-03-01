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

  // Custom plugin to display text inside the chart
  const textCenterPlugin = {
    id: "textCenter",
    afterDraw(chart) {
      const {
        ctx,
        chartArea: { width, height },
      } = chart;
      ctx.save();
      ctx.font = "bold 18px Arial";
      ctx.fillStyle = "#000";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(`${humidity}%`, width / 2, height / 2);
      ctx.restore();
    },
  };

  return (
    <div style={{ width: "300px", height: "300px", textAlign: "center" }}>
      <Doughnut
        data={chartData}
        options={chartOptions}
        plugins={[textCenterPlugin]}
      />
    </div>
  );
};

export default HumidityDonutChart;
