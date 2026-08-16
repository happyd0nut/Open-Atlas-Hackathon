# Importing os to interact with the operating system so we can see .env and access the key
import os 
import json
from typing import Any

# So python can read .env
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

api_key = os.getenv("FEATHERLESS_API_KEY")

if not api_key:
    raise RuntimeError(
        "FEATHERLESS_API_KEY is missing."
    )

client = OpenAI(
    api_key=api_key,
    base_url="https://api.featherless.ai/v1",
)


def test_llm_connection() -> str:
    """Send a basic message to verify that Featherless is working."""

    response = client.chat.completions.create(
        model="Qwen/Qwen3-8B",
        messages=[
            {
                "role": "user",
                "content": "Reply with exactly: Featherless is connected.",
            }
        ],
    )

    content = response.choices[0].message.content

    if not content:
        raise RuntimeError("The model returned an empty response.")

    return content

# analyze the text we have extracted from pdf / ocr processing
def analyze_document(document_text: str, language: str = "English") -> dict[str, Any]:
    """
    Analyze extracted document text with DeepSeek and return structured JSON
    that matches the frontend sections.
    """

    if not document_text.strip():
        raise ValueError("Document text cannot be empty.")

# prompt that gets sent to our model
    prompt = f"""
    You are an AI document assistant that helps users understand important documents
    and know what to do next.

    LANGUAGE:
    The user's preferred language is {language}.
    - Write all user-facing content in {language}.
    - Keep JSON keys and document_type values in English.

    ACCURACY:
    - Use only information explicitly supported by the document.
    - Never invent or assume facts, dates, names, amounts, requirements, contact
      information, or consequences.
    - Preserve important information accurately, including dates, monetary amounts,
      case/receipt/form/account numbers, addresses, phone numbers, and URLs.
    - Do not infer standard consequences such as eviction, deportation, collections,
      credit damage, account closure, denial of coverage, or legal penalties unless
      the document explicitly supports them.
    - Clearly distinguish required actions from optional actions.
    - For optional actions, use wording such as "If you want to..." or
      "If you need help..."

    Return ONLY valid JSON with exactly this structure:

    {{
      "document_type": "Immigration | Housing | Banking | Healthcare | Employment | Education | Government | Other",
      "document_title": "Short, specific document title",
      "summary": "Plain-language summary",
      "action_items": [
        {{
          "description": "Specific action the user should take",
          "completed": false
        }}
      ],
      "alerts": [
        {{
          "description": "Important warning, risk, restriction, or consequence"
        }}
      ],
      "deadlines": [
        {{
          "title": "Short deadline or event name",
          "date": "YYYY-MM-DD or null"
        }}
      ]
    }}

    SUMMARY:
    - Write 3-6 short sentences in plain language.
    - Explain what the document is, why it matters, and the most important details.
    - Include key obligations, amounts, dates, rights, decisions, and the most
      important next step when applicable.
    - Identify the issuing organization and specific document/form/notice when stated.
    - Briefly explain unavoidable technical terms.
    - Include only the most important information; do not overload the summary.

    ACTION ITEMS:
    - Include all actions the user is required or strongly advised to take.
    - Begin with an action verb when possible.
    - Make each item one concise, specific sentence.
    - Include the due date when applicable.
    - Preserve the exact completion method stated in the document (website, portal,
      address, phone number, office visit, form, etc.).
    - Do not create vague, duplicate, or already-completed tasks unless further
      action is explicitly required.

    ALERTS:
    - Include only important warnings, risks, penalties, restrictions, or consequences.
    - State the triggering condition and consequence when possible.
    - Include serious issues such as loss of benefits, financial/legal/travel risks,
      expirations, missed appointments, or missing requirements only when supported.
    - Keep each alert to one concise sentence and do not exaggerate.

    DEADLINES:
    - Include important payment, appointment, response, expiration, lease,
      enrollment, benefit, and other time-sensitive dates.
    - Use one object per distinct event.
    - Use YYYY-MM-DD only for complete, unambiguous dates; otherwise use null.
    - Never invent a missing year.
    - You may calculate a date only when the document provides a complete starting
      date and an explicit duration that produces an unambiguous result.
    - For recurring deadlines without one specific date, use null and describe the
      recurrence in the title (example: "Rent due on the 1st of each month").

    DOCUMENT-SPECIFIC DETAILS:
    Extract relevant information when present:

    - Immigration: document/form/petition type, case/receipt/alien numbers, priority
      date, class/category, validity/expiration dates, appointments, work
      authorization, grace periods, travel restrictions, required evidence/forms,
      required actions, and stated consequences.

    - Housing: rent, due date, late fees, deposit, lease dates, notice requirements,
      utilities, renter's insurance, landlord/property contact information, move-in
      and utility requirements, and stated penalties.

    - Banking: institution, account type, activation or identity-verification
      requirements, fees, minimum balances, deadlines, security notices,
      restrictions, and support contact information.

    - Healthcare: document type, provider, insurer, billed/covered/owed amounts,
      payment deadline, claim number, coverage/denial information, appeal/dispute
      instructions, and customer-service information.

    - Employment: employer, position, compensation, start date, location,
      classification, acceptance deadline, tax requirements, benefits deadlines,
      onboarding requirements, and relevant contacts.

    - Education: institution, tuition/balance, financial aid, payment/enrollment
      deadlines, missing requirements, forms, student/application ID, holds, and
      relevant contacts.

    - Government: agency, notice type, reference/notice numbers, amount owed or
      benefit amount, deadlines, appointments, required evidence/forms, stated
      penalties, appeal/dispute instructions, and relevant contacts.

    FINAL RULES:
    - Choose exactly one document_type; use "Other" when necessary.
    - If there are no action_items, alerts, or deadlines, return an empty list.
    - Keep wording concise, plain, and user-friendly.
    - Avoid duplicate information when possible.
    - Do not add JSON fields.
    - Return valid JSON only: no markdown, code fences, or commentary.

    DOCUMENT TEXT:
    {document_text}
    """
# this sends to Featherless which sends to deepseek and gets a response
    response = client.chat.completions.create(
        model="deepseek-ai/DeepSeek-V3.2",
        # the message we are sending the system
        messages=[
            {
                "role": "system",
                "content": (
                    "You accurately classify important documents and extract "
                    "structured information. You use plain language, never invent "
                    "facts, and return valid JSON only."
                ),
            },
            {
                "role": "user",
                "content": prompt,
            },
        ],
        # temperature controls how creative the AI is and we don't want the AI to be creative at all
        temperature=0,
    )
# give us the first message the AI generated
    content = response.choices[0].message.content

    if not content:
        raise RuntimeError("The model returned an empty response.")

    # Some models may still wrap JSON in a code fence despite being told not to.
    cleaned_content = content.strip()

    # just to ensure the returned response is in teh correct format

    if cleaned_content.startswith("```json"):
        cleaned_content = cleaned_content.removeprefix("```json").strip()
    elif cleaned_content.startswith("```"):
        cleaned_content = cleaned_content.removeprefix("```").strip()

    if cleaned_content.endswith("```"):
        cleaned_content = cleaned_content.removesuffix("```").strip()

    try:
        # converts the text we have into a data structure that frontend can actually use
        result = json.loads(cleaned_content)
    except json.JSONDecodeError as exc:
        raise RuntimeError(
            "The model did not return valid JSON. "
            f"Raw response: {content}"
        ) from exc

    return result