import {Card, CardBody} from "reactstrap";
import {useState} from 'react'


const MindMap = (props) =>{
    const[mindMap, setMindMap] = useState("");

    // const input = props.input;
    const input = "- Jupiter\n  - Fifth planet from the Sun\n  - Largest planet in the Solar System\n  - Gas giant\n  - Mass is one-thousandth that of the Sun\n  - Mass is two-and-a-half times that of all other planets combined\n  - Brightest objects visible to the naked eye in the night sky\n  - Known to ancient civilizations since before recorded history\n  - Named after the Roman god Jupiter\n  - Can be bright enough to cast visible shadows when viewed from Earth\n  - On average, the third-brightest natural object in the night sky after the Moon and Venus";

    function generateMindMap(){
        console.log(input);
        
        let startPos = 0;
        let newlinePos = 0;
        
        while(startPos != -1)
        {
            newlinePos = input.indexOf("\n", startPos + 1)
            startPos = input.indexOf("-", startPos + 1)
            console.log("newline " + newlinePos)
            console.log("hierarchy " + (startPos - newlinePos))
            console.log(startPos);
        }
    }

    return (
        <Card>
            <CardBody className="d-grid gap-3">
                <div>
                    <button onClick={generateMindMap}>Get MindMap From OpenAI API</button>
                    {/* {mindMap !== "" ?
                        <h3>mindMap: {mindMap}</h3>    
                        :
                        null
                    } */}
                </div>
            </CardBody>
        </Card>
    )
};

export default MindMap