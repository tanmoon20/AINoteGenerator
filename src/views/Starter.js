import React from "react";
import { Col, Row, Button } from "reactstrap";
import VideoUpload from "../openai_js/Forms";
import whiteLogo from "../assets/images/logos/xtremelogowhite-L.png";

const Starter = () => {
  return (
    <div>
      <div className="container text-center">
        <div className="row align-items-center">
          <div className="col">
            <img  src={whiteLogo} className="img-fluid" alt="WhiteLogo"/>
            <h1>
              <span className="bold-text" style={{ color: 'white' }}> AI Video Summarizer: Your Shortcut to the Highlights! </span>
            </h1>
          </div>
        </div>
      </div>

      {/*Upload & Summarize Button*/}
      <Row>
        <Col lg="12">
          <VideoUpload />
        </Col>
      </Row>   

    </div>
  );
};

export default Starter;
