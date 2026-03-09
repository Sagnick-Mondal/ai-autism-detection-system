import cv2
import numpy as np

CASCADE_PATH = cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
face_cascade = cv2.CascadeClassifier(CASCADE_PATH)

if face_cascade.empty():
    raise RuntimeError(f"Failed to load Haar cascade from {CASCADE_PATH}")


def _is_blurry(gray_img, threshold=50.0):
    variance = cv2.Laplacian(gray_img, cv2.CV_64F).var()
    return variance < threshold


def validate_human_face(image_bytes: bytes) -> dict:

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

    faces = face_cascade.detectMultiScale(
        gray,
        scaleFactor=1.1,
        minNeighbors=6,
        minSize=(80, 80)
    )

    if len(faces) == 0:
        return {
            "has_human_face": False,
            "face_clear": False,
            "face_large_enough": False,
            "reason": "No human face detected"
        }

    # pick largest detected region
    x, y, fw, fh = max(faces, key=lambda f: f[2] * f[3])

    face_area_ratio = (fw * fh) / (w * h)

    # -------------------------------------------------
    # Reject false positives (cat faces etc.)
    # -------------------------------------------------
    if face_area_ratio < 0.02:
        return {
            "has_human_face": False,
            "face_clear": False,
            "face_large_enough": False,
            "reason": "No human face detected"
        }

    # -------------------------------------------------
    # Face detected but too small for ML model
    # -------------------------------------------------
    if face_area_ratio < 0.06:
        return {
            "has_human_face": True,
            "face_clear": False,
            "face_large_enough": False,
            "reason": "Face too small for analysis"
        }

    # -------------------------------------------------
    # Blur check
    # -------------------------------------------------
    face_roi = gray[y:y+fh, x:x+fw]

    if face_roi.size == 0:
        return {
            "has_human_face": False,
            "face_clear": False,
            "face_large_enough": False,
            "reason": "Face detection error"
        }

    if _is_blurry(face_roi):
        return {
            "has_human_face": True,
            "face_clear": False,
            "face_large_enough": True,
            "reason": "Face is blurry or unclear"
        }

    return {
        "has_human_face": True,
        "face_clear": True,
        "face_large_enough": True,
        "reason": "Face detected"
    }