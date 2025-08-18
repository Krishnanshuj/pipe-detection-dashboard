from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from detector import detect_and_count
 
import cv2
import numpy as np
import base64

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "Pipe Detection Backend is running!"}


@app.post("/process_image")
async def process_image(
    file: UploadFile = File(...),
    conf_threshold: float = Form(0.25)
    ):
    contents = await file.read()
    npimg = np.frombuffer(contents, np.uint8)
    image = cv2.imdecode(npimg, cv2.IMREAD_COLOR)

  
    result_data = detect_and_count(image, conf_threshold=conf_threshold)

   
    from backend import model  
    results = model(image, conf=conf_threshold)
    annotated_image = results[0].plot()

    
    _, buffer = cv2.imencode('.jpg', annotated_image)
    img_base64 = base64.b64encode(buffer).decode("utf-8")

    return {
        "diameter_counts": result_data["diameter_counts"],
        "color_counts": result_data["color_counts"],
        "annotated_image": img_base64
    }
