FROM python:3.11-slim

WORKDIR /app

RUN apt-get update && apt-get install -y \
    #ocr tool that reads text from those images
    tesseract-ocr \
    #ocr tool that converts PDF pages into images
    poppler-utils \ 
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY app ./app

EXPOSE 8000

CMD ["python3", "-m", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]