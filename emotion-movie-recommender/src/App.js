import React, { useState, useRef } from "react";
import axios from "axios";
import "./App.css";

const API_KEY = "ff3ceee9e1ed50e288e25381f7a5a81f";
const API_URL = "https://api.themoviedb.org/3";

function App() {
  const [movies, setMovies] = useState([]);
  const [cameraActive, setCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Function to start the camera
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraActive(true);
    } catch (error) {
      console.error("Error accessing webcam:", error);
    }
  };

  // Function to capture an image
  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      context.drawImage(videoRef.current, 0, 0, 200, 150);
      setCapturedImage(canvasRef.current.toDataURL("image/png"));
      stopCamera(); // Stop camera after capturing
      fetchMovies(); // Fetch movies after capturing mood (mocked for now)
    }
  };

  // Function to stop the camera
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      let tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
    }
    setCameraActive(false);
  };

  // Fetch movies from TMDb based on mood (mocked mood for now)
  const fetchMovies = async () => {
    try {
      const response = await axios.get(`${API_URL}/discover/movie`, {
        params: {
          api_key: API_KEY,
          sort_by: "popularity.desc",
          with_genres: "35", // Example: Fetching comedy movies for "happy" mood
        },
      });
      setMovies(response.data.results);
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  };

  return (
    <div className="app">
      <h1 className="title">🎬 MoodFlix</h1>
      <button className="capture-button" onClick={startCamera}>Capture Mood</button>

      {/* Camera Preview & Capture Button */}
      {cameraActive && (
        <div className="camera-container">
          <video ref={videoRef} autoPlay playsInline className="camera-feed" width="200" height="150"></video>
          <button className="capture-button" onClick={captureImage}>Snap</button>
        </div>
      )}

      {/* Display Captured Image */}
      {capturedImage && (
        <div className="captured-image-container">
          <img src={capturedImage} alt="Captured Mood" className="captured-image" />
        </div>
      )}
      <canvas ref={canvasRef} style={{ display: "none" }} width="200" height="150"></canvas>
      
      {/* Movie Suggestions */}
      <div className="movie-list">
        {movies.map((movie) => (
          <div key={movie.id} className="movie-card">
            <img
              src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
              alt={movie.title}
              className="movie-image"
            />
            <p className="movie-title">{movie.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
