import os
import fitz  # PyMuPDF
from dotenv import load_dotenv
import logging
import requests

# Load environment variables
load_dotenv()

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class PDFService:
    def __init__(self):
        # Check if OpenRouter API key is available
        self.api_key = os.getenv("OPENROUTER_API_KEY")
        self.api_base = os.getenv("OPENROUTER_API_BASE")
        if not self.api_key:
            logger.warning("OPENROUTER_API_KEY not found. AI features will be disabled.")
        if not self.api_base:
            self.api_base = "https://openrouter.ai/api/v1"
        
    def extract_text_from_pdf(self, pdf_path):
        """Extract text from PDF file"""
        try:
            logger.info(f"Extracting text from PDF: {pdf_path}")
            doc = fitz.open(pdf_path)
            text = ""

            for page_num, page in enumerate(doc):
                page_text = page.get_text()
                if page_text.strip():  # Only add non-empty pages
                    text += f"\n--- Page {page_num + 1} ---\n{page_text}"

            doc.close()

            if not text.strip():
                raise ValueError("No text content found in PDF")

            logger.info(f"Successfully extracted {len(text)} characters from PDF")
            return text

        except Exception as e:
            logger.error(f"Error extracting text from PDF {pdf_path}: {str(e)}")
            raise
    
    def process_document(self, pdf_path):
        """Process PDF document and extract text"""
        try:
            logger.info(f"Processing document: {pdf_path}")

            # Extract text from PDF
            text = self.extract_text_from_pdf(pdf_path)

            logger.info("Successfully processed document")
            return text

        except Exception as e:
            logger.error(f"Error processing document {pdf_path}: {str(e)}")
            raise

    def answer_question(self, document_text, question):
        """Answer question based on document content using OpenRouter"""
        try:
            logger.info(f"Answering question: {question[:100]}...")

            if not self.api_key:
                return "AI features are not available. Please configure OPENROUTER_API_KEY."

            # Truncate document text if too long (to fit within token limits)
            max_text_length = 8000  # Conservative limit for GPT models
            if len(document_text) > max_text_length:
                document_text = document_text[:max_text_length] + "..."
                logger.info("Document text truncated to fit token limits")

            # Create prompt for OpenRouter
            prompt = f"""Based on the following document content, please answer the question. If the answer cannot be found in the document, please say so.

Document content:
{document_text}

Question: {question}

Answer:"""

            # Call OpenRouter API
            headers = {
                "Authorization": f"Bearer {self.api_key}",
                "HTTP-Referer": "https://localhost:3000",  # Replace with your actual domain
                "X-Title": "PDF Q&A Application"
            }
            
            payload = {
                "model": "deepseek/deepseek-r1-0528:free",
                "messages": [
                    {"role": "system", "content": "You are a helpful assistant that answers questions based on provided document content."},
                    {"role": "user", "content": prompt}
                ],
                "max_tokens": 500,
                "temperature": 0.1
            }

            response = requests.post(
                f"{self.api_base}/chat/completions",
                headers=headers,
                json=payload
            )

            if response.status_code != 200:
                logger.error(f"OpenRouter API error: {response.text}")
                raise Exception("Failed to get response from OpenRouter API")

            answer = response.json()["choices"][0]["message"]["content"].strip()
            logger.info("Successfully generated answer")

            return answer

        except Exception as e:
            logger.error(f"Error answering question: {str(e)}")
            return f"Sorry, I encountered an error while processing your question: {str(e)}"