import tensorflow as tf
import numpy as np
import cv2
import base64
from io import BytesIO
from PIL import Image

LAST_CONV_LAYER = "top_conv"


def array_to_base64(img_array):
    img = Image.fromarray(img_array.astype(np.uint8))
    buffer = BytesIO()
    img.save(buffer, format="PNG")
    return base64.b64encode(buffer.getvalue()).decode("utf-8")


def overlay_heatmap(original, heatmap):
    heatmap = cv2.resize(heatmap, (original.shape[1], original.shape[0]))
    heatmap = np.uint8(255 * heatmap)
    heatmap = cv2.applyColorMap(heatmap, cv2.COLORMAP_JET)
    return cv2.addWeighted(original, 0.6, heatmap, 0.4, 0)


# ----------------------------
# 1️⃣ GradCAM
# ----------------------------
def gradcam(model, img_tensor):
    grad_model = tf.keras.models.Model(
        [model.inputs],
        [model.get_layer(LAST_CONV_LAYER).output, model.output]
    )

    with tf.GradientTape() as tape:
        conv_output, predictions = grad_model(img_tensor)
        loss = predictions[:, 0]

    grads = tape.gradient(loss, conv_output)
    weights = tf.reduce_mean(grads, axis=(1, 2))
    cam = tf.reduce_sum(tf.multiply(weights[:, None, None, :], conv_output), axis=-1)

    denom = tf.reduce_max(cam[0])
    heatmap = tf.maximum(cam[0], 0) / (denom + 1e-8)
    return heatmap.numpy()


# ----------------------------
# 2️⃣ GradCAM++
# ----------------------------
def gradcam_plus(model, img_tensor):
    grad_model = tf.keras.models.Model(
        [model.inputs],
        [model.get_layer(LAST_CONV_LAYER).output, model.output]
    )

    with tf.GradientTape() as tape:
        conv_output, predictions = grad_model(img_tensor)
        loss = predictions[:, 0]

    grads = tape.gradient(loss, conv_output)
    grads_power_2 = grads ** 2
    grads_power_3 = grads ** 3

    sum_activations = tf.reduce_sum(conv_output, axis=(1, 2))
    alpha = grads_power_2 / (2 * grads_power_2 + sum_activations[:, None, None, :] * grads_power_3 + 1e-8)

    weights = tf.reduce_sum(alpha * tf.nn.relu(grads), axis=(1, 2))
    cam = tf.reduce_sum(weights[:, None, None, :] * conv_output, axis=-1)

    heatmap = tf.maximum(cam[0], 0) / tf.reduce_max(cam[0])
    return heatmap.numpy()


# ----------------------------
# 3️⃣ Saliency Map
# ----------------------------
def saliency(model, img_tensor):
    with tf.GradientTape() as tape:
        tape.watch(img_tensor)
        predictions = model(img_tensor)
        loss = predictions[:, 0]

    grads = tape.gradient(loss, img_tensor)
    saliency_map = tf.reduce_max(tf.abs(grads), axis=-1)[0]
    saliency_map = saliency_map / tf.reduce_max(saliency_map)
    return saliency_map.numpy()


# ----------------------------
# 4️⃣ SmoothGrad
# ----------------------------
def smoothgrad(model, img_tensor, samples=20, noise_level=0.1):
    accumulated = np.zeros_like(img_tensor[0])

    for _ in range(samples):
        noise = tf.random.normal(shape=img_tensor.shape, stddev=noise_level)
        noisy_img = img_tensor + noise

        with tf.GradientTape() as tape:
            tape.watch(noisy_img)
            predictions = model(noisy_img)
            loss = predictions[:, 0]

        grads = tape.gradient(loss, noisy_img)
        accumulated += grads[0].numpy()

    smooth = np.mean(np.abs(accumulated), axis=-1)
    smooth = smooth / np.max(smooth)
    return smooth


# ----------------------------
# MASTER FUNCTION
# ----------------------------
def generate_all_xai(model, img_tensor, original_image):
    img_tensor = tf.convert_to_tensor(img_tensor)

    g1 = gradcam(model, img_tensor)
    g2 = gradcam_plus(model, img_tensor)
    g3 = saliency(model, img_tensor)
    g4 = smoothgrad(model, img_tensor)

    img_np = original_image.copy()

    return {
        "gradcam": array_to_base64(overlay_heatmap(img_np, g1)),
        "gradcampp": array_to_base64(overlay_heatmap(img_np, g2)),
        "saliency": array_to_base64(overlay_heatmap(img_np, g3)),
        "smoothgrad": array_to_base64(overlay_heatmap(img_np, g4)),
        "best_method": "gradcam"
    }