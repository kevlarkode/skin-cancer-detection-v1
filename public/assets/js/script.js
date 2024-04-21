const imageSelect = document.querySelector("#upload-image");
const imagePreview = document.querySelector("#upload-preview");
const uploadBtn = document.querySelector("#upload-btn");
const clfnRes = document.querySelector(".clfn-res");
const resultImgMask = document.querySelector(".results-div img");
const areaAffectedRes = document.querySelector(".seg-res-area");
const inputFilename = document.querySelector(".input-filename");

const defaultImage = "/assets/imgs/image-upload-default.webp";
const loadingImage = "/assets/imgs/loading-img-1.gif";

let selectedFile = "";

// change preview image after processing
const previewImage = (base64EncodedImage) => {
  imagePreview.src = base64EncodedImage;
};

// input image conversion to base64 (Base64 encoding is a way to convert binary data, such as images, into a text format.)
const compressImageAtClient = (file) => {
  try {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const imgElement = document.createElement("img");
      imgElement.src = event.target.result;

      imgElement.onload = (e) => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 800;

        const scaleSize = MAX_WIDTH / e.target.width;
        canvas.width = MAX_WIDTH;
        canvas.height = e.target.height * scaleSize;

        const ctx = canvas.getContext("2d");

        ctx.drawImage(e.target, 0, 0, canvas.width, canvas.height);

        const srcEncoded = ctx.canvas.toDataURL(e.target, "image/jpeg");

        // previewing compressed image
        previewImage(srcEncoded);
        // saving the compressed image in a variable
        selectedFile = srcEncoded;
      };
    };
  } catch (err) {
    console.error(err);
  }
};

// uploading image for prediction
const uploadImage = async (base64EncodedImage) => {
  try {
    imagePreview.src = loadingImage;
    await handleImagePrediction();

    setTimeout(() => {
      resultImgMask.src = base64EncodedImage;
      areaAffectedRes.textContent = `Area affected : 0.00%`;
    }, 750);
    // imagePreview.src = defaultImage;
    // window.location = '/';
  } catch (err) {
    console.error(err);
    alert("Something went wrong!");
    window.location = "/";
  }
};

// handle submit file event
const handleSubmitFile = () => {
  if (!selectedFile) {
    alert("Input an image!");
    return;
  }

  uploadImage(selectedFile);
};

// event listner for image input by user
imageSelect.addEventListener("change", (event) => {
  inputFilename.innerText = `Filename : ${event.target.files[0].name}`;
  clfnRes.innerHTML = `???????`;
  resultImgMask.src = "./assets/imgs/default-mask-img.png";
  areaAffectedRes.textContent = `Area affected : ???%`;
  compressImageAtClient(event.target.files[0]);
});

// event listner for upload button 
uploadBtn.addEventListener("click", () => {
  handleSubmitFile();
});
