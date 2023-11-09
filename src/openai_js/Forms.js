import React, { useState } from 'react';
import { Storage } from 'aws-amplify';
import AWS from 'aws-sdk';
import { Col, Row, Button } from "reactstrap";
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
  let filetimeText = '';
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
      
      //const items = jsonData.results.items[1].start_time;
      const items = jsonData.results.items;
      let timestamp='';
      let sentence='';
      let timestampSentence='Timestamp<br>';

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const startTime = parseFloat(item.start_time);
        const endTime = parseFloat(item.end_time);
        const content = item.alternatives[0].content;

        console.log(`Start Time: ${startTime}`);
        console.log(`End Time: ${endTime}`);
        //console.log(`Content: ${content}`);
        if (i==0){
          timestamp+=startTime;
        }
        sentence+=content+' ';

        // Check if this item is the start of a new sentence 
        if (content == ".") {
          timestamp+=' - ';
          const endTime = parseFloat(items[i-1].end_time);
          timestamp+=endTime;
          timestampSentence=timestampSentence+timestamp+' '+sentence+'<br>';
          sentence='';
          if (i != items.length-1){
            const startTime = parseFloat(items[i+1].start_time);
            timestamp=startTime;
          }

        } 
      }
      console.log("timestampSentence: ",timestampSentence)
      console.log("transcript ",transcript)
      setFileText(transcript);
      filetimeText=timestampSentence;
      document.getElementById('filetimeText').innerHTML=filetimeText;

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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '10vh' }}>
        <label htmlFor="fileInput" className="file-input-label">
          <Button className="btn" color="primary" size="lg" onClick={() => document.getElementById('fileInput').click()}>
            Select Video
          </Button>
        </label>
        <input
          type="file"
          id="fileInput"
          accept="video/*"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
       <div style={{ margin: '80px' }}></div>
        <Button className="btn" color="primary" size="lg" onClick={handleUpload} style={{ color: 'white' }}>
          Upload Video
        </Button>
        <div style={{ margin: '80px' }}></div> {/* Add space between the buttons */}
          <Button className="btn" color="primary" size="lg" onClick={handleButtonClick} disabled={loadingTranscribe || loadingSummarized} style={{ color: 'white' }}>
            Fetch File from S3
          </Button>
        </div>

      {/* {console.log(loadingTranscribe || loadingSummarized)} */}
      {loadingTranscribe && <p> loadingTranscribe...</p>}
      {loadingSummarized && <p> loadingSummarized...</p>}
      {fileText && 
      <div className = "mt-3">
        <Row>
          <Col lg="12">
            <Card>
              <CardBody className="d-grid gap-3">
                <div>
                    <h5>Transcript:</h5>
                    {fileText}
                    
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div> 
      
      }

      {/* display timestamp */}

      <div>
        <Row>
          <Col lg="12">
            <Card>
              <CardBody className="d-grid gap-3">
                <div id='filetimeText'></div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>

      {summarizedText !== "" ?
      <div>
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
