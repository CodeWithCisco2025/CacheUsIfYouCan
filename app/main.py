from fastapi import FastAPI, UploadFile, File
from fastapi.responses import StreamingResponse
import pandas as pd
import joblib
from io import BytesIO
from utils import preprocess_input

# Load saved model artifacts
kmeans = joblib.load("kmeans_model.pkl")
scaler = joblib.load("scaler.pkl")
feature_columns = joblib.load("feature_columns.pkl")
cluster_label_map = joblib.load("cluster_label_map.pkl")

app = FastAPI(title="KMeans Bad Request Detector API")

@app.post("/predict-bad/")
async def detect_bad_requests(file: UploadFile = File(...)):
    df = pd.read_csv(file.file)

    # Preprocess (encode + scale)
    X_processed = preprocess_input(df, feature_columns, scaler)

    # Predict cluster
    clusters = kmeans.predict(X_processed)
    labels = [cluster_label_map[c] for c in clusters]

    # Add predictions
    df["Predicted_Label"] = labels

    # Filter bad requests
    bad_requests = df[df["Predicted_Label"] == 0]

    # Output as CSV
    buffer = BytesIO()
    bad_requests.to_csv(buffer, index=False)
    buffer.seek(0)

    return StreamingResponse(buffer, media_type="text/csv", headers={
        "Content-Disposition": "attachment; filename=bad_requests.csv"
    })
