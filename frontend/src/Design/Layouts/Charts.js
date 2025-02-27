import React, { useEffect, useState } from "react";
import TickPosition from "../Components/TickPosition";

export default function Charts() {
  const [data, setData] = useState({
    timeData: [],
    humidityData: [],
    rainData: [],
    soilMoistureData: [],
    tempData: [],
  });

  useEffect(() => {
    const fetchData = () => {
      fetch("http://localhost:5010/api/data")
        .then((response) => response.json())
        .then((data) => {
          // Format the fetched data into timeData and other data
          const timeData = data.map((item) => new Date(item.timestamp)); // Convert timestamp string to Date objects
          const humidityData = data.map(
            (item) => item.data.device["0001"].data.humidity
          );
          const rainData = data.map(
            (item) => (item.data.device["0001"].data.rain ? 1 : 0) // Convert rain boolean to binary (1 for true, 0 for false)
          );
          const soilMoistureData = data.map(
            (item) => item.data.device["0001"].data.soilMoisture
          );
          const tempData = data.map(
            (item) => item.data.device["0001"].data.temp
          );

          // Log the data to verify the structure
          console.log("Fetched Data:", data);
          console.log("Formatted timeData:", timeData);
          console.log("Formatted humidityData:", humidityData);
          console.log("Formatted rainData:", rainData);
          console.log("Formatted soilMoistureData:", soilMoistureData);
          console.log("Formatted tempData:", tempData);

          // Set the state with the formatted data
          setData({
            timeData,
            humidityData,
            rainData,
            soilMoistureData,
            tempData,
          });
        })
        .catch((error) => console.error("Error fetching data:", error));
    };

    // Fetch data initially
    fetchData();

    // Set an interval to fetch data every 1 minute
    const intervalId = setInterval(fetchData, 60000); // 60000 ms = 1 minute

    // Cleanup the interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div>
      <TickPosition data={data} />
    </div>
  );
}
