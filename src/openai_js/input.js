import { API } from 'aws-amplify';
import {useState} from 'react'
import {Card, CardBody} from "reactstrap";
import OpenAI from "openai";

const API_KEY = "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"; //secure -> env variable

const InputCard = () => {
    const[text, setText] = useState("");
    const[summarizedText, setSummarizedText] = useState("")

    async function callOpenAIAPI(){
        console.log("Calling the OpenAIAPI");
 
        const APIBody = {
            "model": "gpt-3.5-turbo",
            "messages": [
                {role: "user", content: "Summarize content you are provided with" + text}
                // {role: "user", content: "Create a mindmap you are provided with in bullet point outline." + text}
            ],
            "temperature": 0,
            "max_tokens": 1024,
            "top_p":1.0,
            "frequency_penalty":0.0,
            "presence_penalty":0.0
        }
        
        await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type":"application/json",
                "Authorization":"Bearer "+API_KEY
            },
            body: JSON.stringify(APIBody)
        }).then((data) => {
            return data.json();
        }).then((data) => {
            console.log(data);
            setSummarizedText(data.choices[0].message.content);
        });
    }
    console.log(text);

    return (
        <Card>
            <CardBody className="d-grid gap-3">
                <div>
                    <textarea
                        onChange={(e) => setText(e.target.value)}
                        placeholder='Paste your text here!'
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