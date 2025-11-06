import { useState, useRef } from "react";
import * as faceapi from "face-api.js";

export default function useCameraMood() {
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraMood, setCameraMood] = useState("");
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [modelLoaded, setModelLoaded] = useState(false);

  // Load models once
  async function loadModels() {
    const MODEL_URL = "/models"; // put models in public/models
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
      faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
    ]);
    setModelLoaded(true);
    console.log("✅ Face-api models loaded");
  }

  // Start webcam
  const startCamera = async () => {
    try {
      if (!modelLoaded) await loadModels();

      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      setCameraActive(true);
      await new Promise((r) => setTimeout(r, 100));
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      console.log("📷 Camera started");
    } catch (err) {
      console.error("Camera error:", err);
    }
  };

  // Stop webcam
  const stopCamera = () => {
    if (streamRef.current)
      streamRef.current.getTracks().forEach((t) => t.stop());
    if (videoRef.current) videoRef.current.srcObject = null;
    setCameraActive(false);
  };

  // Detect emotion from current frame
  const detectCameraMoodOnce = async () => {
    if (!videoRef.current || !modelLoaded) return null;

    const detections = await faceapi
      .detectSingleFace(
        videoRef.current,
        new faceapi.TinyFaceDetectorOptions()
      )
      .withFaceExpressions();

    if (detections && detections.expressions) {
      const entries = Object.entries(detections.expressions);
      const [expression, score] = entries.reduce((a, b) =>
        a[1] > b[1] ? a : b
      );
      setCameraMood(expression);
      console.log("Detected:", expression, score.toFixed(2));
      return expression;
    } else {
      console.log("No face detected");
      return null;
    }
  };

  return {
    videoRef,
    cameraMood,
    cameraActive,
    startCamera,
    stopCamera,
    detectCameraMoodOnce,
  };
}
