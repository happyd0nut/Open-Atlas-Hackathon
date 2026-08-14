from fastapi import FastAPI, UploadFile, File, Form, HTTPException

from app.services.document_processor import process_pdf
from app.llm import analyze_document, test_llm_connection

app = FastAPI()


@app.get("/test-llm")
def test_llm():
    return {"message": test_llm_connection()}


@app.get("/api")
def root():
    return {"message": "Open Atlas backend is running"}

# uploading the pdf
@app.post("/api/upload")
async def upload_document(
    file: UploadFile = File(...),
    language: str = Form("English")
):
    if file.content_type != "application/pdf":
        raise HTTPException(
            status_code=400,
            detail="Only PDF files are supported right now."
        )
# read the file (will read it in bytes)
    file_bytes = await file.read()

    if not file_bytes:
        raise HTTPException(
            status_code=400,
            detail="The uploaded PDF is empty."
        )

    try:
        # Decide whether to use normal PDF extraction or OCR.
        result = process_pdf(file_bytes)
    except Exception as exc:
        raise HTTPException(
            status_code=400,
            detail=f"PDF processing failed: {str(exc)}"
        ) from exc

    extracted_text = result["text"]

    if not extracted_text.strip():
        raise HTTPException(
            status_code=400,
            detail="No readable text was found in the PDF."
        )

    try:
        # Analyze the extracted document text with DeepSeek.
        analysis = analyze_document(extracted_text, language)
    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Document analysis failed: {str(exc)}"
        ) from exc

    

    return {
        "filename": file.filename,
        "content_type": file.content_type,
        "extraction_method": result["method"],
        "text_length": len(extracted_text),
        "analysis": analysis,
        "message": "PDF processed and analyzed successfully"
    }
