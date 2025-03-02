import React from "react";
import image from "../Assets/ai.png";

const LandingSection = () => {
  return (
    <section className="landing-section d-flex align-items-center">
      <div className="container py-5">
        <div className="row align-items-center py-5">
          {/* Left Content */}
          <div className="col-md-6 text-white">
            <h1 style={{ fontSize: "60px", fontWeight: "200" }}>AgroTurboX</h1>
            <h2 className="fw-bold mb-4">
              AI-Powered Crop Harvest Optimization
            </h2>
            <p className="lead">
              AgroTurboX revolutionizes agriculture by leveraging AI-driven
              weather predictions and real-time IoT sensor data to optimize crop
              yield. By analyzing temperature, humidity, soil quality, and
              weather forecasts, it provides farmers with actionable insights to
              enhance productivity and sustainability.
            </p>
            <a href="#features" className="btn btn-primary btn-lg">
              View Data
            </a>
          </div>

          {/* Right Image */}
          <div className="col-md-6 text-center">
            <img src={image} alt="IoT Device" className="img-fluid" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandingSection;
