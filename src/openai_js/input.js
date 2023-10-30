import { API } from 'aws-amplify';
import {useState} from 'react'
import {Card, CardBody} from "reactstrap";

const API_KEY = "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"; //secure -> env variable

const InputCard = () => {
    const[text, setText] = useState("");
    const[summarizedText, setSummarizedText] = useState("")

    async function callOpenAIAPI(){
        console.log("Calling the OpenAIAPI");
 
        const APIBody = {
            "model": "gpt-3.5-turbo",
            "messages": [{"role": "user", "content": "Hello, how are you?"}]
        }
        
        await fetch("https://chatgpt-api.shn.hk/v1/", {
            method: "POST",
            // headers: {
            //     "Content-Type":"application/json",
            //     "Authorization":"Bearer "+API_KEY
            // },
            body: JSON.stringify(APIBody)
        }).then((data) => {
            return data.json();
        }).then((data) => {
            console.log(data);
        });
    }
    console.log(text);

    return (
        <Card>
            <CardBody className="d-grid gap-3">
                <div>
                    <textarea
                        onChange={(e) => setText(e.target.value)}
                        placeholder='Paste your tweet here!'
                        cols={50}
                        rows={10}
                        />
                </div>
                <div>
                    <button onClick={callOpenAIAPI}>Get Summarized Text From OpenAI API</button>
                    {summarizedText !== "" ?
                        <h3>Summarized: {summarizedText}</h3>    
                        :
                        null
                    }
                </div>
            </CardBody>
        </Card>
    )
}

export default InputCard