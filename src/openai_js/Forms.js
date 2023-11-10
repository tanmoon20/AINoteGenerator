import React, { useState } from 'react';
import { Storage } from 'aws-amplify';
import AWS from 'aws-sdk';
import { Col, Row } from "reactstrap";
import {Card, CardBody, Button} from "reactstrap";
import MindMap from './mindmap/MindMap';
import FlashCard from './FlashCard/QnA';

AWS.config.update({ region: 'us-east-1' });
const API_KEY = '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'; //secure -> env variable

function VideoUpload() {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    setSuccessText("Video is selected successfully. Next, press the Upload Video Button.")
  };

  const handleUpload = async () => {
    if (selectedFile) {
      try {
        setSuccessText("Loading... Uploading...")
        await Storage.put(selectedFile.name, selectedFile);
        setSuccessText("Uploaded Successfully. Please wait for about 1 minutes before pressing the fetching file button.")
        console.log('Video uploaded successfully.');
      } catch (error) {
        console.error('Error uploading video:', error);
      }
    }
  };

  const [fileText, setFileText] = useState('');
  const [SuccessText, setSuccessText] = useState('');
  let filetimeText = '';
  const [loadingTranscribe, setLoadingTranscribe] = useState(false);
  const [loadingSummarized, setLoadingSummarized] = useState(false);
  const [loadingMindMapqna, setLoadingMindMapqna] = useState(false);


  const handleButtonClick = async () => {
    setSuccessText("")
    setLoadingTranscribe(true);
    const AWS = require('aws-sdk');


    AWS.config.update({
      region: 'us-east-1', // Replace with your desired region
      accessKeyId: 'AKIASVSPLFEQ4QUUEV4X', // Add your access key ID here
      secretAccessKey:  'pX03Z3399rsbU9QzUaBVuadSimqDz0lQhLFnfqej'// Add your secret access key here
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
      let beginningLayout = '<div class="row "><div class ="col-lg-12"><div class = "card"><div class="d-grid gap-3 card-body ">'
      let beginningTable = '<table class="table table-borderless table-sm table-responsive"><tbody>'
      let endTable = '</tbody></table>'
      let endLayout = '</div></div></div></div>'
      let timestampSentence='<h5>Timestamp:</h5>';
      timestampSentence = timestampSentence + beginningTable

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const startTime = parseFloat(item.start_time);
        const endTime = parseFloat(item.end_time);
        const content = item.alternatives[0].content;

        // console.log(`Start Time: ${startTime}`);
        // console.log(`End Time: ${endTime}`);
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
          timestamp = '<td style="width: 15%">'+timestamp+"</td>"
          sentence = "<td>"+sentence+"</td>"
          timestampSentence=timestampSentence+"<tr>"+timestamp+sentence+"</tr>";
          sentence='';
          if (i != items.length-1){
            const startTime = parseFloat(items[i+1].start_time);
            timestamp=startTime;
          }

        } 
      }
      timestampSentence = timestampSentence + endTable
      // console.log("timestampSentence: ",timestampSentence)
      // console.log("transcript ",transcript)
      setFileText(transcript);
      filetimeText=timestampSentence;
      filetimeText = beginningLayout + filetimeText + endLayout;
      document.getElementById('filetimeText').innerHTML=filetimeText;
      callOpenAIAPISummarize(transcript);
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
  const[mindMapQnAText, setMindMapQnAText] = useState("")

  async function callOpenAIAPISummarize(text){
    setLoadingSummarized(true);
    console.log("call open ai api summarized");
    if(text == "")
    {
      console.log("empty text summarized");
    }
    else
    {
      console.log("Calling the OpenAIAPI");
      // console.log(text)

      const APIBody = {
          "model": "gpt-3.5-turbo",
          "messages": [
              {role: "user", content: "Make it short, summarize content you are provided with.\n" + text}
          ],
          "temperature": 0,
          "max_tokens": 1024,
          "top_p":1.0,
          "frequency_penalty":0.0,
          "presence_penalty":0.0
      }
      
      try{  
        await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type":"application/json",
                "Authorization":"Bearer "+ API_KEY
            },
            body: JSON.stringify(APIBody)
        }).then((data) => {
            return data.json();
        }).then((data) => {
            console.log(data);
            setSummarizedText(data.choices[0].message.content);
        //     setSummarizedText("I commented the calling open ai code to save free credit, line 101-113 in forms.js")
            {callOpenAIAPIMindMapQnA(data.choices[0].message.content)}
        //     callOpenAIAPIMindMapQnA("I commented the calling open ai code to save free credit, line 101-113 in forms.js")
        });
      }catch(e){
        console.log(e);
      }finally{
        setLoadingSummarized(false);
      }
    }
  }

  async function callOpenAIAPIMindMapQnA(text){
    setLoadingMindMapqna(true);
    console.log("call open ai api mindmap");
    if(text == "")
    {
      console.log("empty text mindmap");
    }
    else
    {
      console.log("Calling the OpenAIAPI");

      const APIBody = {
          "model": "gpt-3.5-turbo",
          "messages": [
            {role: "user", content: "Generate a mindmap with bullet point outline, no bold and potential Q&A in Q: A: format from the given information.\n" + text}
            // {role: "user", content: "Generate a mind map with bullet point outline."}
          ],
          "temperature": 0,
          "max_tokens": 1024,
          "top_p":1.0,
          "frequency_penalty":0.0,
          "presence_penalty":0.0
      }
      
      try{  
        await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type":"application/json",
                "Authorization":"Bearer "+ API_KEY
            },
            body: JSON.stringify(APIBody)
        }).then((data) => {
            return data.json();
        }).then((data) => {
            console.log(data);
            setMindMapQnAText(data.choices[0].message.content);
        });
        // setMindMapQnAText("Hello\n- Jupiter\n  - Fifth planet from the Sun\n  - Largest planet in the Solar System\n  - Gas giant\n  - Mass is one-thousandth that of the Sun\n  - Mass is two-and-a-half times that of all other planets combined\n  - Brightest objects visible to the naked eye in the night sky\n  - Known to ancient civilizations since before recorded history\n  - Named after the Roman god Jupiter\n  - Can be bright enough to cast visible shadows when viewed from Earth\n  - On average, the third-brightest natural object in the night sky after the Moon and Venus\nQ:Today a good day\nA:Yes")
      }catch(e){
        console.log(e);
      }finally{
        setLoadingMindMapqna(false);
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
      <div id = "selectVideoDiv">

      </div>
      <div style={{color:'white'}}>
        {SuccessText}
      </div>
      <div>
        {loadingTranscribe && <p style={{color:'white'}}> LoadingTranscribe...</p>}
        {loadingSummarized && <p style={{color:'white'}}> LoadingSummarized...</p>}
        {loadingMindMapqna && <p style={{color:'white'}}> LoadingMindMap and FlashCard...</p>}
      </div>
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
      <div id='filetimeText'></div>

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

        {/* Generate MindMap */}
        {mindMapQnAText &&
          <div>
            <MindMap fileText={mindMapQnAText}/>

            <div>
              <Row>
                <Col lg="12">
                  <FlashCard fileText={mindMapQnAText}/>
                </Col>
              </Row>

              <div className="d-flex justify-content-center align-items-center" style={{ height: '5vh' }}>
                <Button className="btn" color="primary" size="lg">
                  Save as PDF
                </Button>
              </div>
            </div>
          </div>
        }

      </div>
       : null}
    </div>

  );
}

export default VideoUpload;
