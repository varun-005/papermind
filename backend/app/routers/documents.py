from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
from sqlalchemy.orm import Session
from typing import List
import os
import shutil
from app.models.database import get_db, Document
from app.models.schemas import Document as DocumentSchema
from app.services.pdf_service import PDFService

router = APIRouter(prefix="/documents", tags=["documents"])
pdf_service = PDFService()

# In-memory storage for document texts
document_texts = {}

@router.post("/", response_model=DocumentSchema, status_code=status.HTTP_201_CREATED)
async def upload_document(file: UploadFile = File(...), db: Session = Depends(get_db)):
    """Upload a PDF document"""
    # Check if file is a PDF
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")
    
    # Create uploads directory if it doesn't exist
    os.makedirs("uploads", exist_ok=True)
    
    # Save file to disk
    file_path = f"uploads/{file.filename}"
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # Create document in database
    db_document = Document(filename=file.filename, file_path=file_path)
    db.add(db_document)
    db.commit()
    db.refresh(db_document)
    
    # Process document and extract text
    try:
        document_text = pdf_service.process_document(file_path)
        document_texts[db_document.id] = document_text
    except Exception as e:
        # If processing fails, delete document from database
        db.delete(db_document)
        db.commit()
        raise HTTPException(status_code=500, detail=f"Failed to process document: {str(e)}")
    
    return db_document

@router.get("/", response_model=List[DocumentSchema])
async def get_documents(db: Session = Depends(get_db)):
    """Get all documents"""
    documents = db.query(Document).all()
    return documents

@router.get("/{document_id}", response_model=DocumentSchema)
async def get_document(document_id: int, db: Session = Depends(get_db)):
    """Get document by ID"""
    document = db.query(Document).filter(Document.id == document_id).first()
    if document is None:
        raise HTTPException(status_code=404, detail="Document not found")
    return document

@router.delete("/{document_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_document(document_id: int, db: Session = Depends(get_db)):
    """Delete document by ID"""
    document = db.query(Document).filter(Document.id == document_id).first()
    if document is None:
        raise HTTPException(status_code=404, detail="Document not found")
    
    # Delete file from disk
    if os.path.exists(document.file_path):
        os.remove(document.file_path)
    
    # Remove document text from memory
    if document_id in document_texts:
        del document_texts[document_id]
    
    # Delete document from database
    db.delete(document)
    db.commit()
    
    return None 