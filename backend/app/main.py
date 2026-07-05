from fastapi import FastAPI, UploadFile, File, HTTPException
from app.services.document_processor import process_pdf

app = FastAPI()


@app.get("/")
def root():
    return {"message": "Open Atlas backend is running"}


@app.post("/upload")
async def upload_document(file: UploadFile = File(...)):
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Only PDF files are supported right now.")

    file_bytes = await file.read()

    result = process_pdf(file_bytes) #decides if we should use pdf processing or OCR

    return {
        "filename": file.filename,
        "content_type": file.content_type,
        "extraction_method": result["method"],
        "text_preview": result["text"][:3000], #limits so that only the first 3000 characters are returned
        "text_length": len(result["text"]),
        "message": "PDF processed successfully"
    }