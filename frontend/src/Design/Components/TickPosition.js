import * as React from "react";
import Box from "@mui/material/Box";
import { LineChart } from "@mui/x-charts/LineChart";

// Custom value formatter to format the date
const valueFormatter = (date) =>
  date.toLocaleDateString("fr-FR", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

// Function to display the marks at specific hours (optional)
const showMark = (params) => {
  const { position } = params;
  return position.getHours() === 0;
};

// Chart configuration (you can customize as per your needs)
const config = {
  series: [{ data: [], showMark: showMark }],
  height: 300,
  topAxis: "topAxis",
  bottomAxis: "bottomAxis",
  leftAxis: null,
};

// Common xAxis configuration
const xAxisCommon = {
  scaleType: "time", // Using time scale for the X-axis
  valueFormatter, // Apply custom value formatter to show date and time
};

export default function TickPosition({ data }) {
  // Ensure timeData and y1Data are passed properly
  const { timeData, humidityData, rainData, soilMoistureData, tempData } = data;

  // Log the data to verify
  console.log("TickPosition Data:", data);

  // Check for valid data before rendering the chart
  if (!timeData || timeData.length === 0) {
    return <div>Error: No valid data available</div>;
  }

  const updatedConfig = {
    ...config,
    series: [
      { data: humidityData, showMark: showMark, name: "Humidity" },
      { data: rainData, showMark: showMark, name: "Rain" },
      { data: soilMoistureData, showMark: showMark, name: "Soil Moisture" },
      { data: tempData, showMark: showMark, name: "Temperature" },
    ],
  };

  return (
    <Box sx={{ width: "100%", maxWidth: 800 }}>
      <LineChart
        xAxis={[
          {
            ...xAxisCommon,
            id: "bottomAxis",
            scaleType: "point", // This will make the timeData points discrete on the axis
            data: timeData, // directly passing timeData here
            tickInterval: (time) => time.getHours() === 0,
          },
          {
            ...xAxisCommon,
            id: "topAxis",
            scaleType: "point", // This will add a second axis for the top with the same time data
            data: timeData, // explicitly pass the same data
          },
        ]}
        {...updatedConfig}
      />
    </Box>
  );
}
