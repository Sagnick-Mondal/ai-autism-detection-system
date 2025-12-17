import tensorflow as tf
from pathlib import Path

MODEL_PATH = Path("model/best_model.keras")

_model = None


def get_model():
    global _model

    if _model is None:
        print("🔄 Loading model lazily...")
        _model = tf.keras.models.load_model(MODEL_PATH)
        print("✅ Model loaded successfully")

    return _model
