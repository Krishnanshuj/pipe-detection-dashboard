import React, { useState } from "react";
import { uploadImage } from "./Api";
import DiameterBarChart from "./components/DiameterBarChart";
import ColorPieChart from "./components/ColorPieChart";
import "./App.css";

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [confidence, setConfidence] = useState(0.25); 
  const [diameterCounts, setDiameterCounts] = useState({});
  const [colorCounts, setColorCounts] = useState({});
  const [annotatedImage, setAnnotatedImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select an image first!");
      return;
    }

    setLoading(true);
    try {
      const data = await uploadImage(selectedFile, confidence); 
      setDiameterCounts(data.diameter_counts);
      setColorCounts(data.color_counts);
      setAnnotatedImage(`data:image/jpeg;base64,${data.annotated_image}`);
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Error processing image. Check backend logs.");
    }
    setLoading(false);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Pipe Detection Dashboard</h1>
        <div className="upload-section">
          <input type="file" onChange={handleFileChange} accept="image/*" />

          
          <div className="slider-container">
            <label>
              Confidence Threshold: {Math.round(confidence * 100)}%
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={confidence}
              onChange={(e) => setConfidence(parseFloat(e.target.value))}
            />
          </div>

          <button onClick={handleUpload} disabled={loading}>
            {loading ? "Processing..." : "Upload & Detect"}
          </button>
        </div>
      </header>

      {annotatedImage && (
        <section className="detected-section">
          <h2>Detected Image</h2>
          <img src={annotatedImage} alt="Annotated" />
        </section>
      )}

      <div className="charts-grid">
        {diameterCounts && Object.keys(diameterCounts).length > 0 && (
          <div className="chart-container">
            <h2>Pipe Diameter Counts</h2>
            <DiameterBarChart data={diameterCounts} />
          </div>
        )}

        {colorCounts && Object.keys(colorCounts).length > 0 && (
          <div className="chart-container">
            <h2>Pipe Color Distribution</h2>
            <div className="pie-chart">
              <ColorPieChart data={colorCounts} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
