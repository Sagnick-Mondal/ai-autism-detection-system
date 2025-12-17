from app.config import MODEL_PATH
import threading

_model = None
_model_lock = threading.Lock()


def get_model():
    """
    Lazy-loads the TensorFlow model once.
    Thread-safe.
    """
    global _model

    if _model is None:
        with _model_lock:
            if _model is None:
                try:
                    import tensorflow as tf

                    print("Loading model lazily...")
                    _model = tf.keras.models.load_model(
                        MODEL_PATH,
                        compile=False
                    )
                    print("Model loaded successfully")

                except Exception as e:
                    print("❌ Model loading failed")
                    raise RuntimeError(f"Model load error: {e}")

    return _model
