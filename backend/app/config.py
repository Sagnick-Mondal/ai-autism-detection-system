from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

MODEL_PATH = BASE_DIR / "model" / "best_model.keras"

IMAGE_SIZE = (224, 224)

EMOTIONS = [
    "Angry",
    "Disgust",
    "Fear",
    "Happy",
    "Sad",
    "Surprise",
]


# ASD model
ASD_MODEL_PATH = BASE_DIR / "model" / "final_asd_model.keras"

# Model predicts probability of NON-ASD
# >= 0.6  → Non-Autistic
# < 0.6   → Autistic
ASD_THRESHOLD = 0.6
