from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import numpy as np
from app.validators.image_gate import validate_human_face
from app.model import get_model
from app.utils import preprocess_image
from app.schemas import PredictionResponse
from app.config import EMOTIONS
from app.xai_utils import generate_heatmap  # ✅ your function

app = FastAPI(title="AutiSense AI Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # tighten later
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/predict-safe", response_model=PredictionResponse)
async def predict_safe(file: UploadFile = File(...)):
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")

    image_bytes = await file.read()

    gate = validate_human_face(image_bytes)

    if not gate["has_human_face"]:
        raise HTTPException(400, "No human face detected")

    if not gate["face_large_enough"]:
        raise HTTPException(400, "Face too small for analysis")

    if not gate["face_clear"]:
        raise HTTPException(400, "Face is blurry or unclear")

    # ---- ORIGINAL PREDICT LOGIC BELOW ----
    image = preprocess_image(image_bytes)
    model = get_model()
    predictions = model.predict(image, verbose=0)[0]

    idx = int(np.argmax(predictions))
    confidence = float(predictions[idx] * 100)

    heatmap_base64 = generate_heatmap(image)
    heatmap_data_url = f"data:image/png;base64,{heatmap_base64}"

    return PredictionResponse(
        emotion=EMOTIONS[idx],
        confidence=confidence,
        heatmap=heatmap_data_url,
    )

@app.post("/predict", response_model=PredictionResponse)
async def predict(file: UploadFile = File(...)):
    # ----------------------------
    # 1. Validate input
    # ----------------------------
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")

    image_bytes = await file.read()

    try:
        image = preprocess_image(image_bytes)  # (1, H, W, 3)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

    # ----------------------------
    # 2. Inference
    # ----------------------------
    try:
        model = get_model()
        predictions = model.predict(image, verbose=0)[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Inference failed: {e}")

    idx = int(np.argmax(predictions))
    confidence = float(predictions[idx] * 100)

    # ----------------------------
    # 3. Heatmap (XAI)
    # ----------------------------
    try:
        heatmap_base64 = generate_heatmap(image)
        heatmap_data_url = f"data:image/png;base64,{heatmap_base64}"
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Heatmap generation failed: {e}")

    # ----------------------------
    # 4. Response
    # ----------------------------
    return PredictionResponse(
        emotion=EMOTIONS[idx],
        confidence=confidence,
        heatmap=heatmap_data_url,
    )
