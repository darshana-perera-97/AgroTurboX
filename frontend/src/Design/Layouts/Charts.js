import React, { useEffect, useState } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import TickPosition from "../Components/TickPosition"; // First Chart

export default function Charts() {
  const [data, setData] = useState({
    timeData: [],
    humidityData: [],
    rainData: [],
    soilMoistureData: [],
    tempData: [],
  });
  const [data2, setData2] = useState({
    timeData: [],
    humidityData: [],
    rainData: [],
    soilMoistureData: [],
    tempData: [],
  });

  useEffect(() => {
    const fetchData = () => {
      fetch("http://localhost:5010/api/data/latest")
        .then((response) => response.json())
        .then((data) => {
          // Reverse the order of the data array
          const reversedData = data.reverse();

          // Format the fetched data
          const timeData = reversedData.map((item) => new Date(item.timestamp));
          const humidityData = reversedData.map(
            (item) => item.data.device["0001"].data.humidity
          );
          const rainData = reversedData.map((item) =>
            item.data.device["0001"].data.rain ? 1 : 0
          );
          const soilMoistureData = reversedData.map(
            (item) => item.data.device["0001"].data.soilMoisture
          );
          const tempData = reversedData.map(
            (item) => item.data.device["0001"].data.temp
          );

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

    fetchData();
    const intervalId = setInterval(fetchData, 60000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const fetchData = () => {
      fetch("http://localhost:5010/api/data")
        .then((response) => response.json())
        .then((data) => {
          // Format the fetched data
          const timeData = data.map((item) => new Date(item.timestamp));
          const humidityData = data.map(
            (item) => item.data.device["0001"].data.humidity
          );
          const rainData = data.map((item) =>
            item.data.device["0001"].data.rain ? 1 : 0
          );
          const soilMoistureData = data.map(
            (item) => item.data.device["0001"].data.soilMoisture
          );
          const tempData = data.map(
            (item) => item.data.device["0001"].data.temp
          );

          setData2({
            timeData,
            humidityData,
            rainData,
            soilMoistureData,
            tempData,
          });
        })
        .catch((error) => console.error("Error fetching data:", error));
    };

    fetchData();
    const intervalId = setInterval(fetchData, 60000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div>
      <Tabs>
        <TabList>
          <Tab>Within 24 Hours</Tab>
          <Tab>Within last week</Tab>
        </TabList>

        <TabPanel>
          <TickPosition data={data} />
        </TabPanel>

        <TabPanel>
          <TickPosition data={data2} />
        </TabPanel>
      </Tabs>
    </div>
  );
}
