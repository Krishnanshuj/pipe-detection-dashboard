import os
import cv2
import numpy as np
from ultralytics import YOLO


MODEL_PATH = os.path.join(os.path.dirname(__file__), "models", "best.pt")
_model = None

def get_model():
    global _model
    if _model is None:
        
        _model = YOLO(MODEL_PATH)
    return _model


PIPE_CLASSES = ["pipe1", "pipe2", "pipe3", "pipe4", "pipe5"]


COLOR_RANGES = {
    "red": [(0, 50, 50), (10, 255, 255)],
    "yellow": [(20, 50, 50), (35, 255, 255)],
    "green": [(40, 50, 50), (80, 255, 255)],
    "blue": [(100, 50, 50), (130, 255, 255)],
    "black": [(0, 0, 0), (180, 255, 30)],
    "white": [(0, 0, 200), (180, 30, 255)],
}

def detect_dominant_color(image):
    """Fast average color detection instead of KMeans."""
    
    if image.shape[0] > 50 or image.shape[1] > 50:
        image = cv2.resize(image, (50, 50))

    avg_color = image.mean(axis=(0, 1)).astype(int)  
    return tuple(avg_color)

def classify_color_from_bgr(bgr_color):
    """Classify pipe color based on average BGR."""
    hsv_color = cv2.cvtColor(np.uint8([[bgr_color]]), cv2.COLOR_BGR2HSV)[0][0]
    for color_name, (lower, upper) in COLOR_RANGES.items():
        if all(lower[i] <= hsv_color[i] <= upper[i] for i in range(3)):
            return color_name
    return "unknown"

def detect_and_count(image, conf_threshold=0.25):
    """Run YOLO detection and count pipes by diameter & color."""
    model = get_model()
    
    results = model.predict(image, conf=conf_threshold, imgsz=256, device="cpu")[0]

    diameter_counts = {cls: 0 for cls in PIPE_CLASSES}
    color_counts = {}

    for box in results.boxes:
        if box.conf < conf_threshold:
            continue
        class_id = int(box.cls)
        cls_name = PIPE_CLASSES[class_id]
        diameter_counts[cls_name] += 1

        
        x1, y1, x2, y2 = map(int, box.xyxy[0])
        cropped = image[y1:y2, x1:x2]

        if cropped.size == 0:
            continue

        
        avg_color = detect_dominant_color(cropped)
        color_name = classify_color_from_bgr(avg_color)
        color_counts[color_name] = color_counts.get(color_name, 0) + 1

    return {
        "diameter_counts": diameter_counts,
        "color_counts": color_counts
    }

