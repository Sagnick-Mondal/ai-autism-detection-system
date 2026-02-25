# app/model.py

from app.config import MODEL_PATH, ASD_MODEL_PATH, AGE_MODEL_PATH
import threading
import tensorflow as tf

tf.config.optimizer.set_jit(True)
tf.config.threading.set_intra_op_parallelism_threads(1)
tf.config.threading.set_inter_op_parallelism_threads(1)

_emotion_model = None
_asd_model = None
_age_model = None

_emotion_model_lock = threading.Lock()
_asd_model_lock = threading.Lock()
_age_model_lock = threading.Lock()

def get_model():
    """
    Lazy-loads the Emotion model once.
    Thread-safe.
    """
    global _emotion_model

    if _emotion_model is None:
        with _emotion_model_lock:
            if _emotion_model is None:
                try:
                    import tensorflow as tf

                    print("Loading emotion model lazily...")
                    _emotion_model = tf.keras.models.load_model(
                        MODEL_PATH,
                        compile=False
                    )
                    print("Emotion model loaded successfully")

                except Exception as e:
                    print("❌ Emotion model loading failed")
                    raise RuntimeError(f"Emotion model load error: {e}")

    return _emotion_model


def get_asd_model():
    """
    Lazy-loads the ASD model once.
    Thread-safe.
    """
    global _asd_model

    if _asd_model is None:
        with _asd_model_lock:
            if _asd_model is None:
                try:
                    import tensorflow as tf

                    print("Loading ASD model lazily...")
                    _asd_model = tf.keras.models.load_model(
                        ASD_MODEL_PATH,
                        compile=False
                    )
                    print("ASD model loaded successfully")

                except Exception as e:
                    print("❌ ASD model loading failed")
                    raise RuntimeError(f"ASD model load error: {e}")

    return _asd_model

def get_age_model():
    global _age_model

    if _age_model is None:
        with _age_model_lock:
            if _age_model is None:
                try:
                    import tensorflow as tf

                    print("Loading Age model lazily...")
                    _age_model = tf.keras.models.load_model(
                        AGE_MODEL_PATH,
                        compile=False
                    )
                    print("Age model loaded successfully")

                except Exception as e:
                    print("❌ Age model loading failed")
                    raise RuntimeError(f"Age model load error: {e}")

    return _age_model
