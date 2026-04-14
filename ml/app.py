from flask import Flask, request, jsonify
from flask_cors import CORS
import base64, cv2, os
import numpy as np
from deepface import DeepFace
from numpy.linalg import norm

app = Flask(__name__)
CORS(app) 

EMB_PATH = "embeddings"
TEMP_IMG = "temp/live.jpg"
THRESHOLD = 0.35

os.makedirs(EMB_PATH, exist_ok=True)
os.makedirs("temp", exist_ok=True)

def cosine_sim(a, b):
    return np.dot(a, b) / (norm(a) * norm(b))
 
@app.route("/register", methods=["POST"])
def register():
    try:
        data = request.json
        patient_uid = data["patientUid"]
        images = data["images"]  # list of 3 base64 images

        vectors = []
        for i, image in enumerate(images):
            img_data = base64.b64decode(image.split(",")[1])
            img = cv2.imdecode(np.frombuffer(img_data, np.uint8), cv2.IMREAD_COLOR)
            img_path = f"temp/{patient_uid}_{i}.jpg"
            cv2.imwrite(img_path, img)

            emb = DeepFace.represent(
                img_path=img_path,
                model_name="VGG-Face",
                detector_backend="retinaface",
                enforce_detection=False
            )[0]["embedding"]

            vectors.append(emb)

        # ✅ average of 3 photos
        avg_vector = np.mean(vectors, axis=0)
        np.save(f"{EMB_PATH}/{patient_uid}.npy", avg_vector)

        return jsonify({"status": "SUCCESS", "message": "Face registered successfully"})

    except Exception as e:
        return jsonify({"status": "ERROR", "message": str(e)}), 500

# ✅ Search patient by face
@app.route("/identify", methods=["POST"])
def identify():
    try:
        data = request.json
        image = data["image"]

        img_data = base64.b64decode(image.split(",")[1])
        img = cv2.imdecode(np.frombuffer(img_data, np.uint8), cv2.IMREAD_COLOR)
        cv2.imwrite(TEMP_IMG, img)

        live_emb = DeepFace.represent(
            img_path=TEMP_IMG,
            model_name="VGG-Face",
            detector_backend="retinaface",
            enforce_detection=False
        )[0]["embedding"]

        best_match = None
        best_score = -1

        for file in os.listdir(EMB_PATH):
            if not file.endswith(".npy"):
                continue
            db_emb = np.load(os.path.join(EMB_PATH, file))
            score = cosine_sim(live_emb, db_emb)

            if score > best_score:
                best_score = score
                best_match = file.replace(".npy", "")

        if best_score > THRESHOLD:
            return jsonify({
                "status": "MATCH_FOUND",
                "patientUid": best_match,
                "confidence": round(best_score * 100, 2)
            })
        else:
            return jsonify({"status": "NO_MATCH"})

    except Exception as e:
        return jsonify({"status": "ERROR", "message": str(e)}), 500

if __name__ == "__main__":
    app.run(port=5001, debug=False)