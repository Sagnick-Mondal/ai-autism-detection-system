from fastapi import FastAPI, UploadFile, File, Query
from fastapi.middleware.cors import CORSMiddleware
import tensorflow as tf
from PIL import Image
import numpy as np
import io
import base64
from xai_utils import generate_gradcam, generate_gradcam_plus_plus, generate_smoothgrad

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # for development, allow all
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model
model = tf.keras.models.load_model("emotion_model.keras")
EMOTIONS = ["Happy", "Sad", "Angry", "Surprised", "Neutral"]  # adjust as per your model


@app.get("/")
def home():
    return {"message": "Emotion detection backend is running!"}


@app.post("/predict")
async def predict(
    file: UploadFile = File(...),
    method: str = Query("gradcam", enum=["gradcam", "gradcam++", "smoothgrad"])
):
    try:
        # Read and preprocess image
        image_bytes = await file.read()
        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        image = image.resize((640, 640))
        img_array = np.array(image) / 255.0
        img_array = np.expand_dims(img_array, axis=0)

        # Model prediction
        predictions = model.predict(img_array)
        predicted_class = int(np.argmax(predictions, axis=1))
        confidence = float(np.max(predictions))

        # Generate explanation
        if method == "gradcam":
            overlay, heatmap = generate_gradcam(model, img_array)
        elif method == "gradcam++":
            overlay, heatmap = generate_gradcam_plus_plus(model, img_array)
        else:
            overlay, heatmap = generate_smoothgrad(model, img_array)

        # Convert overlay to base64 for sending to frontend
        _, buffer = cv2.imencode(".png", overlay)
        overlay_base64 = base64.b64encode(buffer).decode("utf-8")

        return {
            "emotion": EMOTIONS[predicted_class] if predicted_class < len(EMOTIONS) else f"Class {predicted_class}",
            "confidence": round(confidence * 100, 2),
            "method_used": method,
            "explanation_image": overlay_base64
        }

    except Exception as e:
        return {"error": str(e)}
