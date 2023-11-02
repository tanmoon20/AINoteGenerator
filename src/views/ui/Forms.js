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
  const [loading, setLoading] = useState(false);

  const handleButtonClick = async () => {
    setLoading(true);
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

    </div>
    
  );
}

export default VideoUpload;
