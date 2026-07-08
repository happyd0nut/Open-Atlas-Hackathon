# Open-Atlas-Hackathon
## Contributors: Julia Lau & Angela Wang

### Running the Backend with Docker:

#### Create the Docker Image:
cd backend

docker build -t openatlas-backend .

#### Run:

docker run -p 8000:8000 openatlas-backend

#### Open in Browser

http://127.0.0.1:8000/docs

### Running the Backend before Docker:

#### In the backend folder:

source venv/bin/activate
  
python3 -m uvicorn app.main:app --reload
  
#### Open in browser:

http://127.0.0.1:8000/
  
http://127.0.0.1:8000/docs
  
#### on mac CTRL C to quit



### Build/Run Frontend with Docker Compose:

docker compose -f docker-compose.dev.yml up

### Running the Frontend (No Docker):

cd frontend
npm install
npm run dev

#### Open in browser:

http://localhost:5173/
