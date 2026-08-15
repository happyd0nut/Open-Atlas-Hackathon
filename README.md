# Open-Atlas-Hackathon

## Contributors: Julia Lau & Angela Wang

### 0. Create .env Files:

#### Backend:

Create an file named '.env' inside the folder ./backend containing the following variables:

* SUPABASE_URL=enter your Supabase Database URL here
* SUPABASE_ANON_KEY=enter your Supabase anon key here (publishable)
* CLERK_SECRET_KEY=enter you Clerk secret key here
* VITE_CLERK_PUBLISHABLE_KEY=enter your Clerk publishable key here
* FEATHERLESS_API_KEY=enter your featherless api key here

#### Frontend:

Create an file named '.env' inside the folder ./frontend containing the following variables:

* VITE_SUPABASE_URL=enter your Supabase Database Vite URL here
* VITE_SUPABASE_PUBLISHABLE_KEY=enter your Supabase publishable Vite key here (publishable)
* CLERK_SECRET_KEY=enter you Clerk secret key here
* VITE_CLERK_PUBLISHABLE_KEY=enter your Clerk publishable key here
* FEATHERLESS_API_KEY=enter your featherless api key here

### 1. Running Frontend & Backend with Docker Compose (Preferred Method):

**In root directory:**

docker compose down -v
docker compose up --build

### 2. Backend with Docker:

**Create the Docker Image:**

cd backend
docker build -t openatlas-backend .

**Run:**

docker run -p 8000:8000 openatlas-backend

**Open in Browser**

http://127.0.0.1:8000/docs

### 3. Backend (No Docker):

**In the backend folder:**

source venv/bin/activate
python3 -m uvicorn app.main:app --reload

**Open in browser:**

http://127.0.0.1:8000/
http://127.0.0.1:8000/docs
on mac CTRL C to quit

### 4. Frontend with Docker:

docker compose -f docker-compose.dev.yml down -v
(-v removes volumes too, including node_modules)

docker compose -f docker-compose.dev.yml up --build
(--build reruns npm ci from package.json)

### 5. Frontend (No Docker):

cd frontend
npm install
npm run dev

**Open in browser:
**http://localhost:5173/
