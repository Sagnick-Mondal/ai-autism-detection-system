🧠 AutiSense – Explainable Emotion Recognition System

AutiSense is a web-based AI system for facial emotion recognition, specifically designed with a focus on autistic children. The system not only predicts emotions from facial images but also explains why a particular emotion was predicted using Explainable AI (XAI) techniques such as heatmap visualizations and dynamic textual explanations.

This project was developed as a Final Year B.Tech Project.

✨ Key Features

🎭 Facial Emotion Recognition (6 emotions)

🔥 Explainable AI (XAI) using heatmaps

🧠 Dynamic, confidence-aware explanations

🔁 Smooth toggle between original image & heatmap

⚡ Fast, scalable backend inference

🌐 Fully deployed (Frontend + Backend)

🧩 Emotions Detected

The system classifies facial expressions into the following categories:

Angry

Disgust

Fear

Happy

Sad

Surprise

🧠 Explainable AI (XAI)

AutiSense integrates interpretability directly into the prediction pipeline.

🔍 Heatmap Visualization

Highlights facial regions that most influenced the prediction

Warm colors (red/yellow): strong influence

Cool colors (blue): low influence

📝 Dynamic Explanation

Instead of static text, the system generates explanations dynamically based on:

predicted emotion

confidence score

attention distribution in the heatmap

Example:

“The model strongly focused on the mouth and cheek regions. This pattern aligns with known facial expression characteristics of happiness. The predicted confidence of 92.4% reflects how clearly these features were detected.”

This improves trust, transparency, and interpretability, which is especially important in healthcare-oriented AI systems.

🏗️ System Architecture
[ User Uploads Image ]
            |
            v
[ Next.js Frontend ]
            |
            v
[ FastAPI Backend ]
            |
   -------------------
   | Emotion Model  |
   | Heatmap (XAI)  |
   | Explanation    |
   -------------------
            |
            v
[ Result Page with XAI ]

🧪 Dataset

The model was trained using:

Autistic Children Emotions Dataset
Author: Dr. Fatma M. Talaat

This dataset contains labeled facial emotion images of autistic children and was selected to ensure domain relevance and ethical applicability.

🛠️ Tech Stack
Frontend

Next.js (App Router)

TypeScript

Tailwind CSS

Framer Motion

Backend

FastAPI

TensorFlow / Keras

OpenCV

NumPy

🚀 Deployment

Frontend: Vercel

Backend: Render

The frontend communicates securely with the backend API for real-time inference and explanation generation.

⚙️ Local Setup (Optional)
Backend
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload

Frontend
cd frontend
npm install
npm run dev

⚠️ Limitations

Performance depends on image quality and face visibility

Designed for research and educational use, not medical diagnosis

Heatmaps indicate attention, not absolute causality

🎓 Academic Relevance

This project demonstrates:

Practical application of Deep Learning

Responsible AI through Explainability (XAI)

Human-centric AI design for sensitive domains

End-to-end system deployment

It is suitable for:

Final year evaluation

Project demonstrations

Research extensions

📜 License

This project is released under the MIT License, allowing free use, modification, and distribution with attribution.

🙌 Acknowledgements

Dr. Fatma M. Talaat for the dataset

Open-source communities behind TensorFlow, FastAPI, and Next.js