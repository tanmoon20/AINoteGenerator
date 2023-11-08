import { Col, Row } from "reactstrap";
import MindMap from "../openai_js/MindMap"
import VideoUpload from "../openai_js/Forms";
import BlackLogo from "../assets/images/logos/xtremelogo.png";


const Starter = () => {
  return (
    <div>
      <div className="container text-center">
        <div className="row align-items-center">
          <div className="col">
            <img  src={BlackLogo} alt="BlackLogo"/>
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
      
    </div>
  );
};

export default Starter;
