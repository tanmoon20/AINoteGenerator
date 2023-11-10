import { Card,
    CardBody,
    CardTitle,
    CardText,
    Button,
 } from "reactstrap";
import { Col, Row } from "reactstrap";
import tickIcon from "../../assets/images/logos/accept.png";


const PremiumPlan = () =>{
    return (
        <div>
            <Row style={{ display: "flex" , fontSize:"1.3rem"}}>
            <Col sm="6" style={{ flex: "1" }}>
                <Card style={{ height: "100%", margin: "1rem", backgroundColor: "primary", border: "4px solid #ddd" }}>
                    <CardBody style={{ padding: "2rem" }}>
                    <CardTitle tag="h2" style={{ fontWeight: "bold", fontSize: "48px", lineHeight: "0.7" }}>
                        Basic <br /><span style={{ fontSize: "24px" }}>(Free)</span>
                    </CardTitle>
                    <CardText>
                        <ul style={{ padding: "2"}}>
                            <br></br>
                            <p>
                                <img src={tickIcon} alt="Tick" style={{ width: "20px", marginRight: "7px"}} />
                                Summarize videos up to 20 minutes
                            </p>
                        <br />
                            <p>
                                <img src={tickIcon} alt="Tick" style={{ width: "20px", marginRight: "7px" }} />
                                Maximum 3 videos per day
                            </p>
                        <br></br>
                            <p>
                                <img src={tickIcon} alt="Tick" style={{ width: "20px", marginRight: "7px"}} />
                                Mind map to organize and structure the information
                            </p> 
                        </ul>
                    </CardText>
                    </CardBody>
                    <div className="d-flex justify-content-center align-items-center" style={{ height: '20vh' }}>
                        {/* <Button className="btn" outline color="primary" size="lg">
                            Current Plan
                        </Button> */}
                    </div>
                </Card>
                </Col>

                <Col sm="6" style={{ flex: "1" }}>
                    <Card color="white" style={{height:"100%", margin:"1rem"}}>
                        <CardBody style={{padding:"2rem"}}>
                            <CardTitle tag="h2" style={{ fontWeight: "bold", fontSize: "48px", lineHeight: "0.7" }}>
                                Pro <br /><span style={{ fontSize: "24px" }}>($8.00 per month)</span>
                            </CardTitle>
                            <CardText>
                                <ul style={{padding:"2rem"}}>
                                    <p>
                                        <img src={tickIcon} alt="Tick" style={{ width: "20px", marginRight: "7px"}} />
                                        Summarize videos with no time limit
                                    </p> <br></br>
                                    <p>
                                        <img src={tickIcon} alt="Tick" style={{ width: "20px", marginRight: "7px"}} />
                                        Unlimited videos
                                    </p> <br></br>
                                    <p>
                                        <img src={tickIcon} alt="Tick" style={{ width: "20px", marginRight: "7px"}} />
                                        Mind map to organize and structure the information
                                    </p> 
                                    <br></br>
                                    <p style={{ marginBottom: "24px"}}>
                                        <img src={tickIcon} alt="Tick" style={{ width: "20px", marginRight: "7px"}} />
                                        Flash card to aid in learning 
                                    </p>
                                </ul>
                            </CardText>
                            <div style={{ display: "flex", justifyContent: "center" }}>
                                {/* <Button className="btn" color="primary" size="lg">
                                    Upgrade now!
                                </Button> */}
                            </div>
                        </CardBody>
                    </Card>
                </Col>

                <Col sm="6" style={{ flex: "1" }}>
                    <Card color="white" style={{height:"100%" , margin:"1rem"}}> 
                        <CardBody style={{padding:"2rem"}}>

                            <CardTitle tag="h2" style={{ fontWeight: "bold", fontSize: "48px", lineHeight: "0.7" }}>
                               Premium <br /><span style={{ fontSize: "24px" }}>($20.00 per month)</span>
                            </CardTitle>

                            <CardText>
                                <ul style={{padding:"2rem"}}>
                                    <p>
                                        <img src={tickIcon} alt="Tick" style={{ width: "20px", marginRight: "7px"}} />
                                        All features from Pro
                                    </p>
                                    <br></br>
                                    <p style={{ marginBottom: "245px"}}>
                                        <img src={tickIcon} alt="Tick" style={{ width: "20px", marginRight: "7px"}} />
                                        More accurate summarization powered by latest AI model!
                                    </p>
                                </ul>
                            </CardText>

                            <div style={{ display: "flex", justifyContent: "center"}}>
                                <Button className="btn" outline color="primary" size="lg">
                                    Current Plan
                                </Button>
                            </div>
                            
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </div>
    )
}

export default  PremiumPlan;