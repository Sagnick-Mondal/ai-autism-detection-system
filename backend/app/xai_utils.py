import cv2
import base64
import numpy as np

def generate_heatmap(image_tensor):
    """
    image_tensor: (1, H, W, 3), normalized [0,1]
    """
    img = image_tensor[0]

    gray = np.mean(img, axis=-1)
    gray = np.clip(gray * 255, 0, 255).astype(np.uint8)

    heatmap = cv2.applyColorMap(gray, cv2.COLORMAP_JET)
    heatmap = cv2.cvtColor(heatmap, cv2.COLOR_BGR2RGB)

    _, buffer = cv2.imencode(".png", heatmap)
    return base64.b64encode(buffer).decode("utf-8")
