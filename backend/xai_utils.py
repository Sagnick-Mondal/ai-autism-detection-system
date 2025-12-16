import numpy as np
import tensorflow as tf
import cv2


def generate_gradcam(model, img_array, last_conv_layer_name=None, alpha=0.4):
    """
    Grad-CAM implementation.
    Returns overlay image (RGB) and raw heatmap.
    """
    if last_conv_layer_name is None:
        for layer in reversed(model.layers):
            if len(layer.output_shape) == 4:
                last_conv_layer_name = layer.name
                break

    grad_model = tf.keras.models.Model(
        [model.inputs],
        [model.get_layer(last_conv_layer_name).output, model.output]
    )

    with tf.GradientTape() as tape:
        conv_outputs, predictions = grad_model(img_array)
        pred_index = tf.argmax(predictions[0])
        loss = predictions[:, pred_index]

    grads = tape.gradient(loss, conv_outputs)
    pooled_grads = tf.reduce_mean(grads, axis=(0, 1, 2))

    conv_outputs = conv_outputs[0]
    heatmap = conv_outputs @ pooled_grads[..., tf.newaxis]
    heatmap = tf.squeeze(heatmap)
    heatmap = tf.maximum(heatmap, 0) / tf.reduce_max(heatmap)

    heatmap = heatmap.numpy()
    return overlay_heatmap(img_array, heatmap, alpha)


def generate_gradcam_plus_plus(model, img_array, last_conv_layer_name=None, alpha=0.4):
    """
    Grad-CAM++ implementation.
    """
    if last_conv_layer_name is None:
        for layer in reversed(model.layers):
            if len(layer.output_shape) == 4:
                last_conv_layer_name = layer.name
                break

    grad_model = tf.keras.models.Model(
        [model.inputs],
        [model.get_layer(last_conv_layer_name).output, model.output]
    )

    with tf.GradientTape() as tape1:
        with tf.GradientTape() as tape2:
            with tf.GradientTape() as tape3:
                conv_outputs, predictions = grad_model(img_array)
                pred_index = tf.argmax(predictions[0])
                loss = predictions[:, pred_index]
            grads = tape3.gradient(loss, conv_outputs)
        first_derivative = tape2.gradient(loss, conv_outputs)
    second_derivative = tape1.gradient(first_derivative, conv_outputs)

    global_sum = np.sum(conv_outputs, axis=(0, 1, 2))
    alpha_num = second_derivative
    alpha_denom = 2.0 * second_derivative + np.sum(conv_outputs * grads, axis=(0, 1, 2))
    alpha_denom = np.where(alpha_denom != 0.0, alpha_denom, 1e-10)

    alphas = alpha_num / alpha_denom
    weights = np.sum(alphas * np.maximum(grads, 0), axis=(0, 1, 2))

    heatmap = np.sum(weights * conv_outputs, axis=-1)
    heatmap = np.maximum(heatmap, 0) / np.max(heatmap)

    return overlay_heatmap(img_array, heatmap, alpha)


def generate_smoothgrad(model, img_array, num_samples=25, noise_level=0.2):
    """
    SmoothGrad implementation: averages gradients over noisy copies of the input.
    Returns overlay image and averaged heatmap.
    """
    img = img_array[0]
    grads_list = []
    for _ in range(num_samples):
        noisy_img = img + noise_level * np.random.normal(size=img.shape)
        noisy_img = np.clip(noisy_img, 0, 1)
        noisy_img = np.expand_dims(noisy_img, axis=0)

        with tf.GradientTape() as tape:
            tape.watch(noisy_img)
            predictions = model(noisy_img)
            pred_index = tf.argmax(predictions[0])
            loss = predictions[:, pred_index]

        grads = tape.gradient(loss, noisy_img)[0]
        grads_list.append(grads)

    avg_grads = np.mean(np.array(grads_list), axis=0)
    heatmap = np.mean(np.abs(avg_grads), axis=-1)
    heatmap = (heatmap - np.min(heatmap)) / (np.max(heatmap) + 1e-8)

    return overlay_heatmap(np.expand_dims(img, axis=0), heatmap, alpha=0.4)


def overlay_heatmap(img_array, heatmap, alpha=0.4):
    """Helper function to overlay heatmap on image."""
    heatmap = cv2.resize(heatmap, (img_array.shape[2], img_array.shape[1]))
    heatmap_uint8 = np.uint8(255 * heatmap)
    heatmap_colored = cv2.applyColorMap(heatmap_uint8, cv2.COLORMAP_JET)

    img = (img_array[0] * 255).astype(np.uint8)
    overlay = cv2.addWeighted(img, 1 - alpha, heatmap_colored, alpha, 0)

    return overlay, heatmap_colored
