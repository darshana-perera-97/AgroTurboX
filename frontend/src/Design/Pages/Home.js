import React from "react";
import Charts from "../Layouts/Charts";
import LastData from "../Components/LastData";
import HumidityDonutChart from "../Components/HumidityDonutChart";
import Land from "../Layouts/Land";
import WeatherInfo from "../Components/WeatherInfo";

export default function Home() {
  return (
    <div className="container mt-4">
      <div className="row">
        <LastData />
      </div>
      <div className="row g-3 align-items-stretch">
        {" "}
        {/* `align-items-stretch` makes them equal height */}
        <div className="col-md-7 d-flex">
          <div className="w-100 p-3 border rounded bg-white">
            {" "}
            {/* Wrapper to ensure equal height */}
            <Charts />
          </div>
        </div>
        <div className="col-md-1 d-flex"></div>
        <div className="col-md-4 d-flex">
          <div className="w-100 p-3 border rounded bg-white d-flex justify-content-center align-items-center">
            <HumidityDonutChart />
          </div>
        </div>
      </div>

      <Land />
      <WeatherInfo />
    </div>
  );
}
