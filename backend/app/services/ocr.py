# handles scanned PDFs/images that need to be read with OCR

# pdf -> turn every page into an image -> look at the image -> recognize letters with OCR -> return text

from io import BytesIO
#take the pdf bytes that python reads and turn each page into an image
from pdf2image import convert_from_bytes
#image -> look at every letter -> guess the word -> return text
import pytesseract


#takes bytes and returns a long string to be sent to the LLM
def run_ocr_on_pdf(file_bytes: bytes) -> str:
    images = convert_from_bytes(file_bytes, dpi=300)
    text_parts = []

    #looping over images
    for image in images:
        page_text = pytesseract.image_to_string(image) #what text it sees on the image
        if page_text:
            text_parts.append(page_text) #add to string

    return "\n".join(text_parts).strip()