import { Card,
    CardBody,
    CardTitle,
    CardText,
    Button,
 } from "reactstrap";
 import { Col, Row } from "reactstrap";

const PremiumPlan = () =>{
    return (
        <div>
            <Row style={{ display: "flex" , fontSize:"1.3rem"}}>
            <Col sm="6" style={{ flex: "1" }}>
                <Card style={{ height: "100%", margin: "1rem", backgroundColor: "white", border: "1px solid #ddd" }}>
                    <CardBody style={{ padding: "2rem" }}>
                    <CardTitle tag="h3">
                        Basic <br />(Free)
                    </CardTitle>
                    <CardText>
                        <ul style={{ padding: "2rem" }}>
                        <li>Summarize videos up to 20 minutes</li>
                        <br />
                        <li>Maximum 3 videos per day</li>
                        </ul>
                    </CardText>
                    </CardBody>
                </Card>
                </Col>
                <Col sm="6" style={{ flex: "1" }}>
                    <Card color="light" style={{height:"100%", margin:"1rem"}}>
                        <CardBody style={{padding:"2rem"}}>
                            <CardTitle tag="h3" >
                            Pro <br></br>($8.00 per month)
                            </CardTitle>
                            <CardText>
                                <ul style={{padding:"2rem"}}>
                                    <li>
                                    Summarize videos with no time limit
                                    </li> <br></br>
                                    <li>
                                    Unlimited videos
                                    </li> <br></br>
                                    <li>
                                    Mind map to organize and structure the information
                                    </li> <br></br>
                                    <li>
                                    Flash card to aid in learning 
                                    </li> <br></br>
                                </ul>
                            </CardText>
                            <div style={{ display: "flex", justifyContent: "center" }}>
                                <Button color="light-primary">Upgrade now!</Button>
                            </div>
                        </CardBody>
                    </Card>
                </Col>
                <Col sm="6" style={{ flex: "1" }}>
                    <Card color="warning" style={{height:"100%" , margin:"1rem"}}> 
                        <CardBody style={{padding:"2rem"}}>
                            <CardTitle tag="h3">
                            Premium <br></br>($20.00 per month)
                            </CardTitle>
                            <CardText>
                                <ul style={{padding:"2rem"}}>
                                    <li>All features from Pro</li><br></br>
                                    <li>More accurate summarization powered by latest AI model!</li>
                                </ul>
                            </CardText>
                            <div style={{ display: "flex", justifyContent: "center" }}>
                                <Button color="light-primary">Upgrade now!</Button>
                            </div>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </div>
    )
}

export default  PremiumPlan;