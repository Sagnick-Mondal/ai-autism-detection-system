import cv2
import numpy as np
from pathlib import Path

# Use OpenCV's built-in haarcascades path
CASCADE_PATH = cv2.data.haarcascades + "haarcascade_frontalface_default.xml"

face_cascade = cv2.CascadeClassifier(CASCADE_PATH)

if face_cascade.empty():
    raise RuntimeError(f"Failed to load Haar cascade from {CASCADE_PATH}")


def _is_blurry(gray_img, threshold=80.0):
    """
    Variance of Laplacian method.
    Lower value = blurrier image.
    """
    variance = cv2.Laplacian(gray_img, cv2.CV_64F).var()
    return variance < threshold


def validate_human_face(image_bytes: bytes) -> dict:
    # Decode image
    np_img = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(np_img, cv2.IMREAD_COLOR)

    if img is None:
        return {
            "has_human_face": False,
            "face_clear": False,
            "face_large_enough": False,
            "reason": "Invalid image"
        }

    h, w, _ = img.shape
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    # Detect faces
    faces = face_cascade.detectMultiScale(
        gray,
        scaleFactor=1.1,
        minNeighbors=5,
        minSize=(60, 60)
    )

    if len(faces) == 0:
        return {
            "has_human_face": False,
            "face_clear": False,
            "face_large_enough": False,
            "reason": "No human face detected"
        }

    # Pick largest face
    x, y, fw, fh = max(faces, key=lambda f: f[2] * f[3])

    face_area = (fw * fh) / (w * h)
    face_large_enough = face_area > 0.08  # 8% of image

    face_roi = gray[y:y+fh, x:x+fw]
    face_clear = not _is_blurry(face_roi)

    return {
        "has_human_face": True,
        "face_clear": face_clear,
        "face_large_enough": face_large_enough,
        "reason": "Face detected"
    }
