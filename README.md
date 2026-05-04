Backend Setup
git clone https://github.com/Bot-Manav/Knock-Knock.git
cd Knock-Knock/backend

python -m venv venv

# Windows
venv\Scripts\activate

# Mac/Linux
source venv/bin/activate

pip install -r requirements.txt
playwright install

uvicorn main:app --reload
Backend runs on:
http://localhost:8000

🌐 Frontend Setup
cd ../frontend
npm install
npm run dev

Frontend runs on:
http://localhost:5173