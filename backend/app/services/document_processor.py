# decides which method to use, pdf processing or OCR

from app.services.pdf_extractor import extract_text_from_pdf
from app.services.ocr import run_ocr_on_pdf


def process_pdf(file_bytes: bytes) -> dict:
    extracted_text = extract_text_from_pdf(file_bytes)

    if extracted_text and len(extracted_text) >= 50: #if the extract text from pdf processing is over 50 characters, use that
        return {
            "text": extracted_text,
            "method": "pdf_text"
        }

    ocr_text = run_ocr_on_pdf(file_bytes) #else, use OCR

    return {
        "text": ocr_text,
        "method": "ocr"
    }