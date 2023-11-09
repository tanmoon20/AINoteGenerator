import React from "react";
import { Col, Row, Button } from "reactstrap";
import MindMap from "../openai_js/MindMap"
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

      {/* Generate MindMap */}
      <Row>
        <Col lg="12">
          <MindMap />
        </Col>
      </Row>

      
      <div className="d-flex justify-content-center align-items-center" style={{ height: '5vh' }}>
      <Button className="btn" color="primary" size="lg">
        Save as PDF
      </Button>
      </div>
    </div>
  );
};

export default Starter;
