const modelURL = "./model.json";
const metadataURL = "./metadata.json";
let model, maxPredictions;

async function loadModel() {
    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();
    console.log("Model Loaded Successfully!");
}

async function predict(imageElement) {
    const prediction = await model.predict(imageElement);
    let resultsHTML = "<h3>Predictions:</h3>";

    prediction.forEach(pred => {
        resultsHTML += `<p>${pred.className}: ${(pred.probability * 100).toFixed(2)}%</p>`;
    });

    document.getElementById("results").innerHTML = resultsHTML;
}

function handleFileUpload(file) {
    const reader = new FileReader();
    reader.onload = function(event) {
        const img = document.getElementById("image-preview");
        img.src = event.target.result;
        img.hidden = false;

        img.onload = function() {
            predict(img);
        };
    };
    reader.readAsDataURL(file);
}

document.getElementById("drop-area").addEventListener("click", () => {
    document.getElementById("fileInput").click();
});

document.getElementById("fileInput").addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file) {
        handleFileUpload(file);
    }
});

document.getElementById("drop-area").addEventListener("dragover", (event) => {
    event.preventDefault();
});

document.getElementById("drop-area").addEventListener("drop", (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
        handleFileUpload(file);
    }
});

loadModel(); // Load the model when the page loads
