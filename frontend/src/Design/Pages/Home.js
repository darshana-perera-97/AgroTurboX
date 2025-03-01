import React from "react";
import Charts from "../Layouts/Charts";
import LastData from "../Components/LastData";
import HumidityDonutChart from "../Components/HumidityDonutChart";
import Land from "../Layouts/Land";
import WeatherInfo from "../Components/WeatherInfo";
import LandingSection from "../Layouts/LandingSection";

export default function Home() {
  return (
    <div>
      <LandingSection />
      <div className="container">
        <div className="row mt-5">
          <h1 className="mt-5">Live Device Update</h1>
        </div>

        <LastData />
      </div>
      <div className="pink-background pb-5 my-5 mt-5">
        <div className="container mt-5 mb-5">
          <div className="row mt-5">
            <h1 className="mt-5 mb-5 pt-5">Device Updates</h1>
          </div>
          <div className="row g-3 align-items-stretch">
            <div className="col-md-7 d-flex">
              <div className="w-100 p-3 border rounded-4 bg-white">
                <Charts />
              </div>
            </div>
            <div className="col-md-1 d-flex"></div>
            <div className="col-md-4 d-flex">
              <div className="w-100 p-3 border rounded-4 bg-white d-flex justify-content-center align-items-center">
                <HumidityDonutChart />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container mt-4">
        {/* <div className="row"><LastData /></div> */}
        <div className="row mt-5">
          <h1 className="mt-5">AI Powered Weather Assume</h1>
        </div>

        {/* <Land /> */}
        <WeatherInfo />
      </div>
    </div>
  );
}
