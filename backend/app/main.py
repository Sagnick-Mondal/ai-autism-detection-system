# app/main.py

from contextlib import asynccontextmanager
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import numpy as np

from app.schemas import PredictionResponse, ASDResponse
from app.validators.image_gate import validate_human_face
from app.model import get_model, get_asd_model, get_age_model
from app.utils import preprocess_image, preprocess_asd_image, preprocess_age_image
from app.config import EMOTIONS, ASD_THRESHOLD, AGE_THRESHOLD
from app.xai_utils import generate_heatmap
from app.xai import generate_all_xai

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    print("Preloading models...")
    get_age_model()
    get_asd_model()
    get_model()
    print("All models loaded successfully.")
    yield
    # Shutdown
    pass

app = FastAPI(title="AutiSense AI Backend", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health():
    return {"status": "ok"}

@app.get("/warmup")
def warmup():
    get_age_model()
    get_asd_model()
    get_model()
    return {"status": "models_loaded"}
# -----------------------------------------
# 1️⃣ AGE CHECK
# -----------------------------------------
@app.post("/check-age")
async def check_age(file: UploadFile = File(...)):
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")

    image_bytes = await file.read()

    gate = validate_human_face(image_bytes)

    if not gate["has_human_face"] and gate["reason"] == "Invalid or corrupted image file":
        raise HTTPException(400, "Invalid or corrupted image file")

    if not gate["has_human_face"] and gate["reason"] == "No human face detected":
        raise HTTPException(400, "No human face detected")

    if not gate["face_large_enough"]:
        raise HTTPException(400, "Face too small for analysis")

    if not gate["face_clear"]:
        raise HTTPException(400, "Face is blurry or unclear")

    try:
        age_image = preprocess_age_image(image_bytes)
        age_model = get_age_model()
        prediction = float(age_model.predict(age_image, verbose=0)[0][0])
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Age inference failed: {e}")

    if prediction >= AGE_THRESHOLD:
        raise HTTPException(
            status_code=400,
            detail="This model evaluates children only. Kindly provide an image of a child."
        )

    return {"is_child": True}


# -----------------------------------------
# 2️⃣ ASD CHECK
# -----------------------------------------
@app.post("/check-asd", response_model=ASDResponse)
async def check_asd(file: UploadFile = File(...)):
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")

    image_bytes = await file.read()

    gate = validate_human_face(image_bytes)

    if not gate["has_human_face"] and gate["reason"] == "Invalid or corrupted image file":
        raise HTTPException(400, "Invalid or corrupted image file")

    if not gate["has_human_face"] and gate["reason"] == "No human face detected":
        raise HTTPException(400, "No human face detected")

    if not gate["face_large_enough"]:
        raise HTTPException(400, "Face too small for analysis")

    if not gate["face_clear"]:
        raise HTTPException(400, "Face is blurry or unclear")

    try:
        asd_image = preprocess_asd_image(image_bytes)
        asd_model = get_asd_model()
        prediction = float(asd_model.predict(asd_image, verbose=0)[0][0])
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"ASD inference failed: {e}")


    non_autism_prob = prediction
    autism_prob = 1 - prediction

    if non_autism_prob >= ASD_THRESHOLD:
        raise HTTPException(
            status_code=400,
            detail="Not autistic. Please give a photo with autistic child."
        )

    return ASDResponse(
        is_autistic=True,
        autism_probability=round(autism_prob * 100, 2),
        non_autism_probability=round(non_autism_prob * 100, 2),
    )


# -----------------------------------------
# 3️⃣ EMOTION PREDICTION (FINAL FIXED)
# -----------------------------------------
@app.post("/predict-emotion")
async def predict_emotion(file: UploadFile = File(...)):
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")

    image_bytes = await file.read()

    try:
        # Preprocess image
        image_tensor, original_image = preprocess_image(
            image_bytes,
            return_original=True
        )

        model = get_model()

        # Run prediction
        predictions = model.predict(image_tensor, verbose=0)[0]

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Emotion inference failed: {str(e)}"
        )

    # -------------------------
    # Predicted Emotion
    # -------------------------
    idx = int(np.argmax(predictions))
    predicted_emotion = EMOTIONS[idx]

    # -------------------------
    # Probabilities for Pie Chart
    # -------------------------
    probabilities = {
        EMOTIONS[i]: round(float(predictions[i] * 100), 2)
        for i in range(len(predictions))
    }

    try:
        # -------------------------
        # Generate All XAI Maps
        # -------------------------
        xai_results = generate_all_xai(
            model=model,
            img_tensor=image_tensor,
            original_image=original_image
        )

        # -------------------------
        # Compute Focus Strength (Best Method Logic)
        # -------------------------
        def compute_focus_strength(heatmap_base64):
            import base64
            import numpy as np
            import cv2

            img_data = base64.b64decode(heatmap_base64)
            np_arr = np.frombuffer(img_data, np.uint8)
            img = cv2.imdecode(np_arr, cv2.IMREAD_GRAYSCALE)

            return float(np.mean(img))

        focus_scores = {
            method: compute_focus_strength(xai_results[method])
            for method in ["gradcam", "gradcampp", "saliency", "smoothgrad"]
        }

        best_method = max(focus_scores, key=focus_scores.get)

        best_heatmap_data_url = (
            f"data:image/png;base64,{xai_results[best_method]}"
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"XAI generation failed: {str(e)}"
        )

    # -------------------------
    # FINAL RESPONSE
    # -------------------------
    return {
        "emotion": predicted_emotion,
        "best_method": best_method,
        "heatmap": best_heatmap_data_url,
        "probabilities": probabilities,
        "xai_scores": focus_scores,  # ✅ THIS WAS MISSING
        "xai": {
            "gradcam": f"data:image/png;base64,{xai_results['gradcam']}",
            "gradcampp": f"data:image/png;base64,{xai_results['gradcampp']}",
            "saliency": f"data:image/png;base64,{xai_results['saliency']}",
            "smoothgrad": f"data:image/png;base64,{xai_results['smoothgrad']}",
        }
    }