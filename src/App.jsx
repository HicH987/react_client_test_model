import axios from "axios";
import React, { useRef, useState } from "react";
import Webcam from "react-webcam";
import "./App.css";

function AppFA() {
  const [result, setResult] = useState(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const webcamRef = useRef(null);
  const intervalRef = useRef(null);

  const startVideoStream = () => {
    setIsStreaming(true);
    intervalRef.current = setInterval(() => {
      captureFrame();
    }, 1000);
  };

  const stopVideoStream = () => {
    setIsStreaming(false);
    clearInterval(intervalRef.current);
  };

  const captureFrame = async () => {
    const dataURL = webcamRef.current.getScreenshot();
    const blob = await fetch(dataURL).then((res) => res.blob());
    const formData = new FormData();
    formData.append("file", blob, "image.jpg");

    axios
      .post("http://localhost:5000/classify_exercise", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((response) => {
        setResult(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="container">
      <h3>Test with fastapi</h3>
      <Webcam
        audio={false}
        mirrored={true}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
      />
      <br />
      {isStreaming ? (
        <button onClick={stopVideoStream}>Stop Video</button>
      ) : (
        <button onClick={startVideoStream}>Start Video</button>
      )}
      {result !== null && isStreaming ? (
        <p>
          <strong>The predicted exercise is:</strong> {result.label} <br />
          <strong>The probability:</strong> {result.proba}
        </p>
      ) : (
        <></>
      )}
    </div>
  );
}

export default AppFA;
