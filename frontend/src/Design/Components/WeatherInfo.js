import React, { useEffect, useState } from "react";
import { Spinner, Card, Row, Col } from "react-bootstrap";
import {
  FaTemperatureHigh,
  FaCloudSun,
  FaWind,
  FaTachometerAlt,
  FaTint,
  FaCloud,
  FaDumbbell,
} from "react-icons/fa";

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
        setLoading(false); // Set loading to false once data is fetched
      })
      .catch((error) => {
        console.error("Error fetching weather:", error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Weather in Chilaw</h2>
      {loading ? (
        <div className="d-flex justify-content-center">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <Row className="justify-content-center">
          {/* Card for weather summary */}
          <Col sm={12} md={8} lg={6}>
            <Card className="shadow-lg border-light mb-4">
              <Card.Body>
                <Card.Title className="text-center mb-3">
                  <h3>Weather Details</h3>
                </Card.Title>

                <Row>
                  {/* Temperature */}
                  <Col xs={12} md={6}>
                    <Card className="mb-3 shadow-sm">
                      <Card.Body>
                        <div className="d-flex align-items-center">
                          <FaTemperatureHigh size={30} className="mr-3" />
                          <div>
                            <p className="mb-0">
                              <strong>Temperature:</strong> {weather.temp_c}°C
                            </p>
                          </div>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>

                  {/* Wind Speed */}
                  <Col xs={12} md={6}>
                    <Card className="mb-3 shadow-sm">
                      <Card.Body>
                        <div className="d-flex align-items-center">
                          <FaWind size={30} className="mr-3" />
                          <div>
                            <p className="mb-0">
                              <strong>Wind Speed:</strong> {weather.wind_kph}{" "}
                              km/h
                            </p>
                          </div>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>

                <Row>
                  {/* Pressure */}
                  <Col xs={12} md={6}>
                    <Card className="mb-3 shadow-sm">
                      <Card.Body>
                        <div className="d-flex align-items-center">
                          <FaTachometerAlt size={30} className="mr-3" />
                          <div>
                            <p className="mb-0">
                              <strong>Pressure:</strong> {weather.pressure_in}{" "}
                              in
                            </p>
                          </div>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>

                  {/* Humidity */}
                  <Col xs={12} md={6}>
                    <Card className="mb-3 shadow-sm">
                      <Card.Body>
                        <div className="d-flex align-items-center">
                          <FaTint size={30} className="mr-3" />
                          <div>
                            <p className="mb-0">
                              <strong>Humidity:</strong> {weather.humidity}%
                            </p>
                          </div>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>

                <Row>
                  {/* Cloud Cover */}
                  <Col xs={12} md={6}>
                    <Card className="mb-3 shadow-sm">
                      <Card.Body>
                        <div className="d-flex align-items-center">
                          <FaCloud size={30} className="mr-3" />
                          <div>
                            <p className="mb-0">
                              <strong>Cloud Cover:</strong> {weather.cloud}%
                            </p>
                          </div>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>

                  {/* Dew Point */}
                  <Col xs={12} md={6}>
                    <Card className="mb-3 shadow-sm">
                      <Card.Body>
                        <div className="d-flex align-items-center">
                          <FaDumbbell size={30} className="mr-3" />
                          <div>
                            <p className="mb-0 icon" >
                              <strong>Dew Point:</strong> {weather.dewpoint_c}°C
                            </p>
                          </div>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>

                {/* Weather Condition in a New Card */}
                <Row>
                  <Col xs={12}>
                    <Card className="mb-3 shadow-sm">
                      <Card.Body>
                        <div className="d-flex align-items-center">
                          <FaCloudSun size={30} className="mr-3" />
                          <div>
                            <p className="mb-0">
                              <strong>Condition:</strong> {weather.condition}
                            </p>
                          </div>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>

                <hr />
                {/* Forecast */}
                <div className="text-center">
                  <p>
                    <strong>Forecast:</strong> {assume}
                  </p>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </div>
  );
};

export default WeatherInfo;
