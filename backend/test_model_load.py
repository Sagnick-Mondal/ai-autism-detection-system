print("Starting test...")

import tensorflow as tf
print("TensorFlow imported")

MODEL_PATH = "model/best_model.keras"

print("Loading model...")
model = tf.keras.models.load_model(MODEL_PATH, compile=False)
print("MODEL LOADED SUCCESSFULLY")

print("Model summary:")
model.summary()
