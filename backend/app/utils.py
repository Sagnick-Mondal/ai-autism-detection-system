import numpy as np
import cv2
from app.config import IMAGE_SIZE


def preprocess_image(image_bytes: bytes) -> np.ndarray:
    """
    Converts raw image bytes to model-ready tensor.
    """
    image_array = np.frombuffer(image_bytes, np.uint8)
    image = cv2.imdecode(image_array, cv2.IMREAD_COLOR)

    if image is None:
        raise ValueError("Invalid image file")

    image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    image = cv2.resize(image, IMAGE_SIZE)
    image = image.astype("float32") / 255.0
    image = np.expand_dims(image, axis=0)

    return image
