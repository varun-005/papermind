import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_root():
    """Test the root endpoint"""
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Welcome to PDF Q&A API"}

def test_get_documents():
    """Test getting documents list"""
    response = client.get("/documents/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_upload_invalid_file():
    """Test uploading a non-PDF file"""
    # Create a fake text file
    files = {"file": ("test.txt", "This is not a PDF", "text/plain")}
    response = client.post("/documents/", files=files)
    assert response.status_code == 400
    assert "Only PDF files are allowed" in response.json()["detail"]

def test_ask_question_without_document():
    """Test asking a question without a valid document"""
    response = client.post("/questions/", json={
        "document_id": 999,
        "question": "What is this about?"
    })
    assert response.status_code == 404
    assert "Document not found" in response.json()["detail"]
