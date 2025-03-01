import React, { useEffect, useState } from "react";
import { Spinner, Card, Row, Col, Container } from "react-bootstrap";
import {
  FaTemperatureHigh,
  FaCloudSun,
  FaWind,
  FaTachometerAlt,
  FaTint,
  FaCloud,
  FaDumbbell,
} from "react-icons/fa";
import mainAsset from "../Assets/WeatherAssume.png";
import icon1 from "../Assets/icon (2).png";

const WeatherInfo = () => {
  const [weather, setWeather] = useState(null);
  const [assume, setAssume] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5010/api/weather")
      .then((response) => response.json())
      .then((data) => {
        setWeather({
          temp_c: data.weather.temp_c,
          condition: data.weather.condition,
          wind_kph: data.fullData.current.wind_kph,
          pressure_in: data.fullData.current.pressure_in,
          humidity: data.fullData.current.humidity,
          cloud: data.fullData.current.cloud,
          dewpoint_c: data.fullData.current.dewpoint_c,
        });
        setAssume(data.assume);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching weather:", error);
        setLoading(false);
      });
  }, []);

  return (
    <Container
      fluid
      className="py-4 rounded-5 my-5"
      style={{ backgroundColor: "#d2e3fc" }}
    >
      <Row className="justify-content-center ">
        {/* Left Side (4 Columns) */}
        <Col md={4} className="d-flex flex-column justify-content-between">
          <div className="px-5 py-4">
            <img src={icon1} alt="Weather Icon" className="" width="110px" />
            <h3 className="my-2">AI Powered</h3>
            <h1 className="mb-5">Weather Assume</h1>
            <p className="">
              We will provide the assumptions for the Weather update for next 7
              days
            </p>
            {!loading && <p>{weather.condition}</p>}
          </div>
          <img
            src={mainAsset}
            alt="Weather Icon"
            className="img-fluid mx-auto d-block px-4"
          />
        </Col>

        {/* Right Side (8 Columns) */}
        <Col md={8}>
          {loading ? (
            <div className="d-flex justify-content-center">
              <Spinner animation="border" variant="primary" />
            </div>
          ) : (
            <div className="p-4">
              {/* Weather Data (2x3 Grid) */}
              <Row>
                {[
                  {
                    icon: <FaTemperatureHigh size={30} />,
                    name: "Temperature",
                    value: `${weather.temp_c}°C`,
                  },
                  {
                    icon: <FaWind size={30} />,
                    name: "Wind Speed",
                    value: `${weather.wind_kph} km/h`,
                  },
                  {
                    icon: <FaTachometerAlt size={30} />,
                    name: "Pressure",
                    value: `${weather.pressure_in} in`,
                  },
                  {
                    icon: <FaTint size={30} />,
                    name: "Humidity",
                    value: `${weather.humidity}%`,
                  },
                  {
                    icon: <FaCloud size={30} />,
                    name: "Cloud Cover",
                    value: `${weather.cloud}%`,
                  },
                  {
                    icon: <FaDumbbell size={30} />,
                    name: "Dew Point",
                    value: `${weather.dewpoint_c}°C`,
                  },
                ].map((item, index) => (
                  <Col xs={6} md={4} key={index} className="mb-3">
                    <Card className="shadow-sm text-center py-3 rounded-4">
                      <Card.Body>
                        <div className="d-flex flex-column align-items-center">
                          {item.icon}
                          <h5 className="mb-1 mt-2">
                            <strong>{item.name}</strong>
                          </h5>
                          <p className="mb-0">{item.value}</p>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>

              {/* Condition & Forecast */}
              {/* <Card className="shadow-sm mt-3">
                <Card.Body>
                  <p className="pt-3 px-4">
                    <strong>Condition:</strong> {weather.condition}
                  </p>
                </Card.Body>
              </Card> */}
              {/* Condition & Forecast */}
              <Card className="shadow-sm mt-3 rounded-4">
                <Card.Body>
                  <p className="pt-3 px-4">
                    <strong>Forecast:</strong> {assume}
                  </p>
                </Card.Body>
              </Card>
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default WeatherInfo;
