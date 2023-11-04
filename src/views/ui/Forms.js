import React, { useState } from 'react';
import { Storage } from 'aws-amplify';
import AWS from 'aws-sdk';
import { Col, Row } from "reactstrap";
import {Card, CardBody} from "reactstrap";

const API_KEY = "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"; //secure -> env variable

function VideoUpload() {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (selectedFile) {
      try {
        await Storage.put(selectedFile.name, selectedFile);
        console.log('Video uploaded successfully.');
      } catch (error) {
        console.error('Error uploading video:', error);
      }
    }
  };

  const [fileText, setFileText] = useState('');
  const [loadingTranscribe, setLoadingTranscribe] = useState(false);
  const [loadingSummarized, setLoadingSummarized] = useState(false);

  const handleButtonClick = async () => {
    setLoadingTranscribe(true);
    const AWS = require('aws-sdk');

    AWS.config.update({
      region: 'us-east-1', // Replace with your desired region
      accessKeyId: 'AKIASVSPLFEQ4QUUEV4X', // Add your access key ID here
      secretAccessKey: 'pX03Z3399rsbU9QzUaBVuadSimqDz0lQhLFnfqej' // Add your secret access key here
    });

    // Replace 'your-s3-bucket-name' and 'your-s3-key' with the actual bucket name and key
    const bucketName = 'outputtranscribefromvideo';
    const objectKey = 'VideotoTextjson123.json';

    const s3 = new AWS.S3();
    const params = {
      Bucket: bucketName,
      Key: objectKey
    };

    try {
      const data = await s3.getObject(params).promise();
      const jsonString = data.Body.toString('utf-8')
      const jsonData = JSON.parse(jsonString);
      const transcript = jsonData.results.transcripts[0].transcript;

      console.log("transcript ",transcript)
      setFileText(transcript);
      console.log("filetext",fileText);
      callOpenAIAPI(transcript);
    } catch (error) {
      console.error('Error fetching file:', error);
    }finally{
      setLoadingTranscribe(false);
    }
  };

  // useEffect(() => {
  //   // Fetch the JSON content when the component loads (optional)
  //   handleButtonClick();
  // }, []);

  // call openai api
  const[summarizedText, setSummarizedText] = useState("")

  async function callOpenAIAPI(text){
    setLoadingSummarized(true);
    console.log("call open ai api");
    if(text == "")
    {
      console.log("empty text");
    }
    else
    {
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
      
      try{  
        // await fetch("https://api.openai.com/v1/chat/completions", {
        //     method: "POST",
        //     headers: {
        //         "Content-Type":"application/json",
        //         "Authorization":"Bearer "+ API_KEY
        //     },
        //     body: JSON.stringify(APIBody)
        // }).then((data) => {
        //     return data.json();
        // }).then((data) => {
        //     console.log(data);
        //     setSummarizedText(data.choices[0].message.content);
        // });
        setSummarizedText("I commented the calling open ai code to save free credit, line 101-113 in forms.js")
      }catch(e){
        console.log(e);
      }finally{
        setLoadingSummarized(false);
      }
    }
  }


  return (
    <div>
      <input type="file" accept="video/*" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload Video</button>
      <br></br>

      <button onClick={() => {handleButtonClick()}} disabled={loadingTranscribe || loadingSummarized}>
        Fetch File from S3
      </button>
      {/* {console.log(loadingTranscribe || loadingSummarized)} */}
      {loadingTranscribe && <p> loadingTranscribe...</p>}
      {loadingSummarized && <p> loadingSummarized...</p>}
      {fileText && <div> 
        {fileText} </div>}

      {summarizedText !== "" ?
      <div className='mt-3'>
        <Row>
          <Col lg="12">
            <Card>
              <CardBody className="d-grid gap-3">
                <div>
                    <h5>Summarized Text:</h5> 
                    {summarizedText} 
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
       : null}
    </div>
  );
}

export default VideoUpload;
