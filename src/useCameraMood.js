import { useState, useRef, useCallback, useEffect } from "react";
import * as faceapi from "face-api.js";

export default function useCameraMood() {
  const videoRef = useRef(null);
  const [cameraMood, setCameraMood] = useState("neutral");
  const [cameraActive, setCameraActive] = useState(false);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [autoDetection, setAutoDetection] = useState(false); // NEW flag
  const detectionIntervalRef = useRef(null);

  // ✅ Load face-api models
  useEffect(() => {
    const loadModels = async () => {
      try {
        const MODEL_URL = "/models";
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
        ]);
        setModelsLoaded(true);
        console.log("✅ Models loaded successfully!");
      } catch (err) {
        console.error("❌ Model loading error:", err);
      }
    };
    loadModels();
  }, []);

  // ✅ Start camera (no auto mood detection)
  const startCamera = useCallback(async () => {
    try {
      console.log("🎥 Requesting camera...");
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => videoRef.current.play();
      }

      setCameraActive(true);
      console.log("✅ Camera started (no auto detection).");
    } catch (err) {
      console.error("Camera start error:", err);
      alert("Could not access camera. Please allow permission.");
    }
  }, []);

  // ✅ Start manual mood detection (only when called manually)
  const detectCameraMoodOnce = useCallback(async () => {
    if (!modelsLoaded || !cameraActive || !videoRef.current) {
      console.warn("Cannot detect mood yet — camera or models not ready.");
      return;
    }

    try {
      const result = await faceapi
        .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceExpressions();

      if (result?.expressions) {
        const mood = Object.keys(result.expressions).reduce((a, b) =>
          result.expressions[a] > result.expressions[b] ? a : b
        );
        setCameraMood(mood);
        console.log("🎭 Manual camera mood detected:", mood);
      }
    } catch (err) {
      console.error("❌ Camera mood detection failed:", err);
    }
  }, [cameraActive, modelsLoaded]);

  // ✅ Stop camera and detection
  const stopCamera = useCallback(() => {
    console.log("🛑 Stopping camera...");
    setCameraActive(false);
    setAutoDetection(false);

    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current);
      detectionIntervalRef.current = null;
    }

    const stream = videoRef.current?.srcObject;
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
  }, []);

  useEffect(() => {
    return () => stopCamera();
  }, [stopCamera]);

  return {
    videoRef,
    cameraMood,
    cameraActive,
    modelsLoaded,
    startCamera,
    stopCamera,
    detectCameraMoodOnce, // expose manual detection function
  };
}