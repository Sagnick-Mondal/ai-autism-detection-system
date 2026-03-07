import cv2
import numpy as np
from PIL import Image
import io

# Use OpenCV's built-in haarcascades paths
CASCADE_PATH = cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
CASCADE_ALT_PATH = cv2.data.haarcascades + "haarcascade_frontalface_alt2.xml"
CASCADE_PROFILE_PATH = cv2.data.haarcascades + "haarcascade_profileface.xml"

face_cascade = cv2.CascadeClassifier(CASCADE_PATH)
face_cascade_alt = cv2.CascadeClassifier(CASCADE_ALT_PATH)
profile_cascade = cv2.CascadeClassifier(CASCADE_PROFILE_PATH)

def _is_blurry(gray_img, threshold=40.0):
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
        try:
            # Fallback to Pillow if cv2.imdecode fails (common with some webp/heic or stripped headers)
            pil_img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
            # Convert RGB to BGR for OpenCV
            img = cv2.cvtColor(np.array(pil_img), cv2.COLOR_RGB2BGR)
        except Exception as e:
            return {
                "has_human_face": False,
                "face_clear": False,
                "face_large_enough": False,
                "reason": f"Invalid image format or decoding error: {e}"
            }
            
    if img is None:
        return {
            "has_human_face": False,
            "face_clear": False,
            "face_large_enough": False,
            "reason": "Invalid image (cv2 & PIL failed)"
        }

    h, w, _ = img.shape
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    # Detect faces with multiple classifiers and leniency levels
    cascades = [face_cascade, face_cascade_alt, profile_cascade]
    faces = ()
    for cascade in cascades:
        if cascade.empty(): continue
        # strict
        faces = cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(40, 40))
        if len(faces) > 0: break
        
        # lenient
        faces = cascade.detectMultiScale(gray, scaleFactor=1.05, minNeighbors=3, minSize=(30, 30))
        if len(faces) > 0: break
        
        # very lenient
        faces = cascade.detectMultiScale(gray, scaleFactor=1.01, minNeighbors=1, minSize=(20, 20))
        if len(faces) > 0: break
        
        # flipped for profile cascades (since they typically only look one way)
        flipped = cv2.flip(gray, 1)
        faces_fl = cascade.detectMultiScale(flipped, scaleFactor=1.05, minNeighbors=2, minSize=(30, 30))
        if len(faces_fl) > 0:
            faces = []
            for (fx, fy, fw, fh) in faces_fl:
                faces.append([w - fx - fw, fy, fw, fh])
            break

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
    face_large_enough = face_area > 0.05  # 5% of image

    face_roi = gray[y:y+fh, x:x+fw]
    face_clear = not _is_blurry(face_roi)

    return {
        "has_human_face": True,
        "face_clear": face_clear,
        "face_large_enough": face_large_enough,
        "reason": "Face detected"
    }
