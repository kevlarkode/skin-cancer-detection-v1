const progressBar = document.querySelector(".progress-bar");

// Loading the model when page loads
let model;
(async () => {
  tf.loadModel("./model/model.json").then((model) => {
    window.model = model;
  });
  progressBar.style.display = "none";
})();

// handle submit image event
const handleImagePrediction = async () => {
  model_processArray(imageSelect.files);
};

// helper functions for changing image preview
const model_delay = () => {
  return new Promise((resolve) => setTimeout(resolve, 200));
};
const model_delayedLog = async (item, dataURL) => {
  await model_delay();
  imagePreview.src = dataURL;
  //   console.log(dataURL);
};

// helper function for handling multiple imputs
const model_processArray = async (fileList) => {
  for (let item of fileList) {
    let reader = new FileReader();
    let file = undefined;

    reader.onload = async () => {
      let dataURL = reader.result;
      await model_delayedLog(item, dataURL);
      let fname = file.name;

      await model_makePrediction(fname, dataURL);
    };

    file = item;
    reader.readAsDataURL(file);
  }
};

// make prection for an imput image
const model_makePrediction = async (fname, dataURL) => {
  let image = imagePreview;
  //   console.log(image);

  // Pre-process the image
  let tensor = tf.fromPixels(image).resizeNearestNeighbor([224, 224]).toFloat();

  let offset = tf.scalar(127.5);

  tensor = tensor.sub(offset).div(offset).expandDims();

  // Pass the tensor to the model and call predict on it.
  // Predict returns a tensor.
  // data() loads the values of the output tensor and returns
  // a promise of a typed array when the computation is complete.
  // Notice the await and async keywords are used together.
  let predictions = await window.model.predict(tensor).data();
  let top5 = Array.from(predictions)
    .map((p, i) => {
      // this is Array.map
      return {
        probability: p,
        className: TARGET_CLASSES[i], // we are selecting the value from the obj
      };
    })
    .sort((a, b) => {
      return b.probability - a.probability;
    })
    .slice(0, 3);

  let res = ``;
  top5.forEach((p) => {
    const elem = `<span style="color:yellow">${p.className}</span>`;
    const val = (p.probability * 100).toFixed(3);
    res += `${elem}: ${val}%` + `<br>`;
  });
  clfnRes.innerHTML = res;
};
