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
        model="deepseek-ai/DeepSeek-V3.2",
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
You are an AI document assistant helping people understand complex and important
documents and know what to do next.

The user's preferred language is: {language}.

Write all user-facing content in {language}.
Keep all JSON field names exactly as shown in English.
Do not translate the JSON keys.
Keep the "document_type" value in English using one of the allowed categories.

Preserve factual information exactly and do not alter important identifiers,
including dates, monetary amounts, case numbers, receipt numbers, form numbers,
addresses, phone numbers, URLs, account numbers, and other identifying numbers.

Analyze the document below and return ONLY valid JSON using this exact structure:

{{
  "document_type": "Immigration | Housing | Banking | Healthcare | Employment | Education | Government | Other",
  "document_title": "A short, specific title describing the document",
  "summary": "A concise, high-level summary written in plain language",
  "action_items": [
    {{
      "description": "One concise and specific action sentence, including the due date when applicable",
      "completed": false
    }}
  ],
  "alerts": [
    {{
      "description": "One concise sentence explaining an important warning, risk, restriction, or consequence"
    }}
  ],
  "deadlines": [
    {{
      "title": "A short name for the deadline, appointment, payment, expiration, or event",
      "date": "YYYY-MM-DD or null"
    }}
  ]
}}

SUMMARY REQUIREMENTS:
- Write a concise, high-level summary in plain language.
- Make it easily understandable to someone with no legal, financial, medical,
  immigration, housing, education, employment, or government background.
- Explain what the document is.
- Explain why the document matters to the user.
- State the most important obligations, amounts, dates, rights, or decisions.
- Mention the most important next step when one is clearly required.
- Use short, direct sentences.
- Avoid legal jargon, technical language, and unnecessary details.
- Briefly explain unavoidable technical terms in everyday language.
- Write approximately 3 to 6 sentences.
- Make the summary understandable without requiring the user to reread the
  original document.
- Never invent, assume, or exaggerate information.
- When explicitly stated, identify the organization that issued the document,
  such as the government agency, healthcare provider, bank, employer, school,
  landlord, or property manager.
- When relevant, identify the specific document, form, account, property, claim,
  or notice type.
- Include the most important document-specific details that do not naturally
  belong in action_items, alerts, or deadlines. Examples include:
  - immigration form or petition type and document class
  - landlord, property address, monthly rent, and security deposit
  - bank name and account type
  - healthcare provider, insurance status, and amount owed
- Include only the few details most important for understanding the document.
  Do not overload the summary with every extracted fact.

ACTION ITEM REQUIREMENTS:
- Include only actions the user is required or strongly advised to take.
- Each action item must contain:
  - "description": one concise, specific sentence explaining exactly what the
    user should do.
  - "completed": always false.
- Begin each description with an action verb when possible.
- Include the due date directly in the description when one exists.
- Keep each description to one concise sentence.
- Make every action specific enough that the user knows exactly what to do.
- Do not create vague tasks such as "Review the document."
- Do not duplicate the same action with slightly different wording.
- Do not create an action item for something the user has already completed
  unless the document explicitly says further action is required.
- Thoroughly review all action items in the document so you get all of them.
- Preserve the exact method given for completing an action. Do not replace a
  website, portal, mailing address, phone number, office visit, form, or other
  method with a different method.
- When multiple completion methods are explicitly provided, include them
  accurately in one action item when concise.
- Do not say that a phone number can be used for a purpose unless the document
  explicitly connects that phone number to that purpose.

ALERT REQUIREMENTS:
- Each alert must contain only:
  - "description": one concise sentence explaining an important warning, risk,
    penalty, restriction, or consequence.
- State both the triggering condition and the consequence when possible.
- Include penalties, loss of benefits, legal risks, financial risks, travel
  risks, expiration risks, missed appointments, missing requirements, and
  serious restrictions.
- Do not include ordinary facts or routine information as alerts.
- Do not assign alert titles.
- Do not assign severity levels.
- Keep each alert to one concise sentence.
- Do not exaggerate the seriousness of an alert.

DEADLINE REQUIREMENTS:
- Each deadline must contain only:
  - "title": a short and clear description of the deadline or event.
  - "date": the date in YYYY-MM-DD format, or null if a complete date cannot be
    determined.
- Include payment deadlines, appointments, response deadlines, expirations,
  lease dates, enrollment deadlines, benefit deadlines, and other important
  time-sensitive events.
- Keep each title concise.
- Use one deadline object for each distinct event.
- Convert dates to YYYY-MM-DD only when the date is complete and unambiguous.
- If the document gives an incomplete or ambiguous date, use null.
- Do not invent a year that is not stated or clearly established by the document.
- A deadline may also appear in an action item when the user must take action.
- You may calculate a complete date only when:
  1. the document provides a complete starting date,
  2. the document provides an explicit duration or number of days, months, or
     years, and
  3. the resulting date is unambiguous.
- Do not calculate a date from vague language such as "soon," "promptly,"
  "within a reasonable time," or an unstated billing cycle.
- When a recurring deadline has no single YYYY-MM-DD date, use null and include
  the recurring timing in the title, such as "Rent due on the 1st of each month."

DOCUMENT-SPECIFIC EXTRACTION:

For Immigration documents, identify:
- visa, application, petition, notice, or authorization type
- case number, receipt number, alien number, or other identifying number
- priority date
- document class or category
- validity dates and expiration dates
- appointment dates
- work authorization information
- grace-period information
- travel restrictions or travel risks
- required evidence, forms, or documents
- actions the user must take
- consequences of missing deadlines or appointments

For Housing documents, identify:
- monthly rent
- rent due date
- late fees
- security deposit
- lease start date
- lease end date
- notice requirements
- utilities included or excluded
- renter's insurance requirements
- landlord or property-management contact information
- move-in requirements
- utility-setup requirements
- penalties for late payment, damage, pets, or early termination

For Banking documents, identify:
- bank or financial institution
- account type
- debit card or account activation requirements
- identity-verification requirements
- fees
- minimum-balance requirements
- payment or response deadlines
- fraud or security notices
- account restrictions
- customer-support contact information

For Healthcare documents, identify:
- whether the document is a bill, insurance card, claim, explanation of
  benefits, coverage notice, or another healthcare document
- healthcare provider
- insurance company
- total billed amount
- amount paid or covered by insurance
- amount owed by the user
- payment due date
- claim number
- coverage or denial information
- appeal or dispute instructions
- customer-service contact information

For Employment documents, identify:
- employer
- job title or position
- compensation
- start date
- work location
- employment classification
- offer-acceptance deadline
- tax-form requirements
- benefits-enrollment deadline
- onboarding requirements
- relevant human-resources or employer contact information

For Education documents, identify:
- school, university, or educational institution
- tuition or account balance
- financial-aid amount
- payment deadline
- missing financial-aid requirements
- enrollment or registration deadline
- required forms
- student ID or application ID
- academic or administrative holds
- relevant office contact information

For Government documents, identify:
- government agency
- notice or document type
- reference number, notice number, or identification number
- amount owed or benefit amount
- response deadline
- appointment date
- required evidence or forms
- penalties
- appeal or dispute instructions
- relevant government contact information

GENERAL RULES:
- Use only information explicitly supported by the document.
- Never invent facts, dates, names, contact information, amounts, requirements,
  or consequences.
- If no items exist for action_items, alerts, or deadlines, return an empty list.
- If the document does not fit a supported category, classify it as "Other".
- Choose the single most appropriate document_type.
- Keep all wording concise and user-friendly.
- Avoid duplicate items.
- The same date may appear in both action_items and deadlines only when the user
  must complete an action by that date.
- Do not include extra JSON fields.
- Do not include markdown.
- Do not include commentary before or after the JSON.
- Do not wrap the response in a code block.
- Return valid JSON only.
- Do not infer standard industry consequences that are not explicitly stated in
  the document. For example, do not mention collections, credit damage,
  deportation, eviction, account closure, denial of coverage, or legal penalties
  unless the document itself clearly supports that consequence.
- A consequence may be paraphrased into plain language, but its meaning must not
  be made broader or more serious than what the document states.
  - Clearly distinguish required actions from optional actions.
- For optional actions, begin with wording such as "If you want to..." or
  "If you need help..."
- Do not present an available option as something the user is required to do.

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