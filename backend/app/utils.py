# app/utils.py

import numpy as np
import cv2
from app.config import IMAGE_SIZE
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input
from tensorflow.keras.applications.efficientnet import preprocess_input as efficientnet_preprocess

def preprocess_image(image_bytes, return_original=False):
    import cv2
    import numpy as np

    np_arr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

    original = img.copy()

    img = cv2.resize(img, (224, 224))
    img = img / 255.0
    img = np.expand_dims(img.astype(np.float32), axis=0)

    if return_original:
        return img, original

    return img


def preprocess_asd_image(image_bytes: bytes) -> np.ndarray:
    """
    ASD model preprocessing (MobileNetV2).
    """
    image_array = np.frombuffer(image_bytes, np.uint8)
    image = cv2.imdecode(image_array, cv2.IMREAD_COLOR)

    if image is None:
        raise ValueError("Invalid image file")

    image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    image = cv2.resize(image, (224, 224))
    image = image.astype("float32")
    image = np.expand_dims(image, axis=0)

    # MobileNetV2 preprocessing
    image = preprocess_input(image)

    return image

def preprocess_age_image(image_bytes: bytes) -> np.ndarray:
    image_array = np.frombuffer(image_bytes, np.uint8)
    image = cv2.imdecode(image_array, cv2.IMREAD_COLOR)

    if image is None:
        raise ValueError("Invalid image file")

    image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    image = cv2.resize(image, (224, 224))
    image = image.astype("float32")
    image = np.expand_dims(image, axis=0)

    image = efficientnet_preprocess(image)

    return image
