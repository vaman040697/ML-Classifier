// URL to your model folder containing model.json, metadata.json, and weights.bin
const URL = "./tm-my-image-model/";
let model, labelContainer, maxPredictions;

async function init() {
  const modelURL = URL + "model.json";
  const metadataURL = URL + "metadata.json";

  // Load the model and metadata
  console.log("Loading model...");
  model = await tmImage.load(modelURL, metadataURL);
  console.log("Model loaded successfully.");
  maxPredictions = model.getTotalClasses();

  // Setup label container for displaying predictions
  labelContainer = document.getElementById("label-container");
  labelContainer.innerHTML = "Drag & Drop an Image to Classify";
}

// Function to set up drag-and-drop functionality
function setupDragAndDrop() {
  const dropArea = document.getElementById("drop-area");

  ["dragenter", "dragover", "dragleave", "drop"].forEach(eventName => {
    dropArea.addEventListener(eventName, preventDefaults, false);
  });

  dropArea.addEventListener("drop", handleDrop, false);
  console.log("Drag-and-drop setup completed.");
}

// Prevent default drag behaviors
function preventDefaults(e) {
  e.preventDefault();
  e.stopPropagation();
}

// Handle dropped images
async function handleDrop(e) {
  e.preventDefault();
  console.log("File dropped! Processing...");
  
  const file = e.dataTransfer.files[0];
  if (!file) {
    console.log("No file detected!");
    return;
  }

  if (!file.type.startsWith('image/')) {
    console.log("File is not an image!");
    return;
  }

  console.log("File accepted:", file.name);

  const reader = new FileReader();
  reader.onload = async function(event) {
    const img = new Image();
    img.src = event.target.result;
    
    img.onload = () => {
      console.log("Image loaded! Running prediction...");
      predict(img);
    };
    
    // Display the image
    const imageContainer = document.getElementById("image-container");
    imageContainer.innerHTML = ''; // Clear previous image
    imageContainer.appendChild(img);
  };
  reader.readAsDataURL(file);
}

// Run prediction
async function predict(image) {
  const predictions = await model.predict(image);
  
  // Get the highest confidence prediction
  let bestPrediction = predictions.reduce((prev, current) => 
    prev.probability > current.probability ? prev : current
  );

  const confidence = (bestPrediction.probability * 100).toFixed(2);
  const resultText = `🍎 Fruit: ${bestPrediction.className} (${confidence}%)`;

  console.log("Prediction:", resultText);
  
  // Update label container
  labelContainer.innerHTML = resultText;
}

// Initialize everything when the page loads
window.addEventListener("load", () => {
  console.log("Initializing model and drag-and-drop...");
  init();
  setupDragAndDrop();
});
