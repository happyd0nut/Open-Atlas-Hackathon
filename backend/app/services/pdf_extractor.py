# handles normal PDFs with selectable text

# When a user uploads a pdf, python only reads it as a bunch of bytes. This converts it to readable words, one long string that can be sent to the AI to read.
# PDF -> bytes -> pretend its a file (BytesIO) -> PDF reader -> page 1 text, page 2 text, page 3 text -> one long string -> send that text to LLM
from pypdf import PdfReader
from io import BytesIO

#function where we take the bytes of a pdf and will return the text of it
def extract_text_from_pdf(file_bytes: bytes) -> str:
    reader = PdfReader(BytesIO(file_bytes))

    text_parts = []

    #reader represents the pdf. Loops through every page in the pdf, extracts only the text on the page, adds it to one long string to be returned
    for page in reader.pages:
        page_text = page.extract_text()
        if page_text:
            text_parts.append(page_text)

    return "\n".join(text_parts).strip()