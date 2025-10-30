import { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";

export default function useCameraMood() {
  const videoRef = useRef(null);
  const [cameraMood, setCameraMood] = useState("neutral");

  // ✅ Load models + start webcam
  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = "/models"; // ✅ Vite public folder reference
      await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
      await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
    };

    const startCamera = async () => {
      await loadModels();

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" }
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;

          // ✅ Ensure video starts after metadata loads
          videoRef.current.onloadedmetadata = () => {
            videoRef.current.play();
          };
        }
      } catch (err) {
        console.error("Camera error:", err);
      }
    };

    startCamera();
  }, []);

  // ✅ Detect mood every 800ms
  useEffect(() => {
    const detectMood = async () => {
      if (!videoRef.current) return;

      const result = await faceapi
        .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceExpressions();

      if (result?.expressions) {
        const { expressions } = result;
        const mood = Object.keys(expressions).reduce((a, b) =>
          expressions[a] > expressions[b] ? a : b
        );

        setCameraMood(mood);
      }
    };

    const interval = setInterval(detectMood, 800);
    return () => clearInterval(interval);
  }, []);

  return { videoRef, cameraMood };
}
