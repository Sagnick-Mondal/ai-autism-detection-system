import tensorflow as tf
from functools import lru_cache
import os

MODEL_PATH = os.path.join("model", "best_model.keras")

_model = None

def get_model():
    global _model
    if _model is None:
        print("Loading model lazily...")
        _model = tf.keras.models.load_model(MODEL_PATH)
        print("Model loaded")
    return _model
