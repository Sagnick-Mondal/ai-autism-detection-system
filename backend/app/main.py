# app/main.py

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import numpy as np

from app.schemas import PredictionResponse, ASDResponse
from app.validators.image_gate import validate_human_face
from app.model import get_model, get_asd_model
from app.utils import preprocess_image, preprocess_asd_image
from app.schemas import PredictionResponse
from app.config import EMOTIONS, ASD_THRESHOLD
from app.xai_utils import generate_heatmap


app = FastAPI(title="AutiSense AI Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/check-asd", response_model=ASDResponse)
async def check_asd(file: UploadFile = File(...)):
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")

    image_bytes = await file.read()

    # 1️⃣ Face validation
    gate = validate_human_face(image_bytes)

    if not gate["has_human_face"]:
        raise HTTPException(400, "No human face detected")

    if not gate["face_large_enough"]:
        raise HTTPException(400, "Face too small for analysis")

    if not gate["face_clear"]:
        raise HTTPException(400, "Face is blurry or unclear")

    # 2️⃣ ASD inference
    try:
        asd_image = preprocess_asd_image(image_bytes)
        asd_model = get_asd_model()
        prediction = float(asd_model.predict(asd_image, verbose=0)[0][0])
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"ASD inference failed: {e}")

    # Model predicts probability of NON-ASD
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

@app.post("/predict-emotion", response_model=PredictionResponse)
async def predict_emotion(file: UploadFile = File(...)):
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")

    image_bytes = await file.read()

    try:
        image = preprocess_image(image_bytes)
        model = get_model()
        predictions = model.predict(image, verbose=0)[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Emotion inference failed: {e}")

    idx = int(np.argmax(predictions))
    confidence = float(predictions[idx] * 100)

    try:
        heatmap_base64 = generate_heatmap(image)
        heatmap_data_url = f"data:image/png;base64,{heatmap_base64}"
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Heatmap generation failed: {e}")

    return PredictionResponse(
        emotion=EMOTIONS[idx],
        confidence=confidence,
        heatmap=heatmap_data_url,
    )

@app.post("/predict-safe", response_model=PredictionResponse)
async def predict_safe(file: UploadFile = File(...)):
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")

    image_bytes = await file.read()

    # ----------------------------
    # 1. Face Validation
    # ----------------------------
    gate = validate_human_face(image_bytes)

    if not gate["has_human_face"]:
        raise HTTPException(400, "No human face detected")

    if not gate["face_large_enough"]:
        raise HTTPException(400, "Face too small for analysis")

    if not gate["face_clear"]:
        raise HTTPException(400, "Face is blurry or unclear")

    # ----------------------------
    # 2. ASD Check
    # ----------------------------
    try:
        asd_image = preprocess_asd_image(image_bytes)
        asd_model = get_asd_model()
        prediction = asd_model.predict(asd_image, verbose=0)[0][0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"ASD inference failed: {e}")

    # Model predicts probability of NON-ASD
    if prediction >= ASD_THRESHOLD:
        raise HTTPException(
            status_code=400,
            detail="Not autistic. Please give a photo with autistic child."
        )

    # ----------------------------
    # 3. Emotion Prediction
    # ----------------------------
    try:
        image = preprocess_image(image_bytes)
        model = get_model()
        predictions = model.predict(image, verbose=0)[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Emotion inference failed: {e}")

    idx = int(np.argmax(predictions))
    confidence = float(predictions[idx] * 100)

    # ----------------------------
    # 4. Heatmap
    # ----------------------------
    try:
        heatmap_base64 = generate_heatmap(image)
        heatmap_data_url = f"data:image/png;base64,{heatmap_base64}"
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Heatmap generation failed: {e}")

    return PredictionResponse(
        emotion=EMOTIONS[idx],
        confidence=confidence,
        heatmap=heatmap_data_url,
    )


@app.post("/predict", response_model=PredictionResponse)
async def predict(file: UploadFile = File(...)):
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")

    image_bytes = await file.read()

    try:
        image = preprocess_image(image_bytes)
        model = get_model()
        predictions = model.predict(image, verbose=0)[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Inference failed: {e}")

    idx = int(np.argmax(predictions))
    confidence = float(predictions[idx] * 100)

    try:
        heatmap_base64 = generate_heatmap(image)
        heatmap_data_url = f"data:image/png;base64,{heatmap_base64}"
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Heatmap generation failed: {e}")

    return PredictionResponse(
        emotion=EMOTIONS[idx],
        confidence=confidence,
        heatmap=heatmap_data_url,
    )