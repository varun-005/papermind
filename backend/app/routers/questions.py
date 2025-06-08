from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.models.database import get_db, Document
from app.models.schemas import QuestionRequest, QuestionResponse
from app.services.pdf_service import PDFService
from app.routers.documents import document_texts

router = APIRouter(prefix="/questions", tags=["questions"])
pdf_service = PDFService()

@router.post("/", response_model=QuestionResponse)
async def ask_question(request: QuestionRequest, db: Session = Depends(get_db)):
    """Ask a question about a document"""
    # Check if document exists
    document = db.query(Document).filter(Document.id == request.document_id).first()
    if document is None:
        raise HTTPException(status_code=404, detail="Document not found")
    
    # Check if document has been processed
    if request.document_id not in document_texts:
        # Process document if not already processed
        try:
            document_text = pdf_service.process_document(document.file_path)
            document_texts[document.id] = document_text
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to process document: {str(e)}")

    # Get document text
    document_text = document_texts[request.document_id]

    # Answer question
    try:
        answer = pdf_service.answer_question(document_text, request.question)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to answer question: {str(e)}")
    
    return QuestionResponse(
        answer=answer,
        document_id=request.document_id,
        question=request.question
    ) 