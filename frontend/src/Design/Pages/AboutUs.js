import React from "react";
import logo from "../Assets/Asset 4-assets.png";
import member1 from "../Assets/Asset 22-assets.png";
import member2 from "../Assets/Asset 21-assets.png";
import member3 from "../Assets/Asset 20-assets.png";
import member4 from "../Assets/Asset 19-assets.png";

function AboutUs() {
  return (
    <div className="container py-5">
      {/* Logo and Title */}
      <div className="text-center mb-5">
        <img src={logo} alt="Project Logo" width="280" className="mb-3" />
        <p className="text-muted">Empowering Innovation with Team Trojans</p>
      </div>

      {/* Description Section */}
      <div className="mb-4 text-center">
        <h2 className="mb-3">About Us</h2>
        <p>
          We are <strong>Team Trojans</strong>, a passionate group of innovators
          dedicated to pushing boundaries and creating impactful solutions. Our
          mission is to combine technology and creativity to solve real-world
          challenges.
        </p>
      </div>

      {/* Team Members Section */}
      <div className="text-center">
        <h3 className="mb-4 mt-5 pt-5">Meet Our Team</h3>
        <div className="row">
          {/* Member 1 */}
          <div className="col-md-3 col-sm-6 mb-4">
            <div className="card border-0 p-4">
              <img src={member1} alt="Member 1" className="card-img-top" />
            </div>
          </div>

          {/* Member 2 */}
          <div className="col-md-3 col-sm-6 mb-4">
            <div className="card border-0 p-4">
              <img src={member2} alt="Member 2" className="card-img-top" />
            </div>
          </div>

          {/* Member 3 */}
          <div className="col-md-3 col-sm-6 mb-4">
            <div className="card border-0 p-4">
              <img src={member3} alt="Member 3" className="card-img-top" />
            </div>
          </div>

          {/* Member 4 */}
          <div className="col-md-3 col-sm-6 mb-4">
            <div className="card border-0 p-4">
              <img src={member4} alt="Member 4" className="card-img-top" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutUs;
