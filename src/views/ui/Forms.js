import React, { useState } from 'react';
import { Storage } from 'aws-amplify';
import AWS from 'aws-sdk';

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
  const [loading, setLoading] = useState(false);

  const handleButtonClick = async () => {
    setLoading(true);
    const AWS = require('aws-sdk');

    AWS.config.update({
      region: process.env.REACT_APP_region, // Replace with your desired region
      accessKeyId: process.env.REACT_APP_accessKeyId, // Add your access key ID here
      secretAccessKey: process.env.REACT_APP_secretAccessKey // Add your secret access key here
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

    } catch (error) {
      console.error('Error fetching file:', error);
    } finally {
      setLoading(false);
    }
  };


  // useEffect(() => {
  //   // Fetch the JSON content when the component loads (optional)
  //   handleButtonClick();
  // }, []);

  return (
    <div>
      <input type="file" accept="video/*" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload Video</button>
      <br></br>

      <button onClick={handleButtonClick} disabled={loading}>
        Fetch File from S3
      </button>
      {loading && <p>Loading...</p>}
      {fileText && <div>{fileText}</div>}
      <p></p>
      <div id='filetimeText'></div>

    </div>
    
  );
}

export default VideoUpload;
