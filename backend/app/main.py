from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import documents, questions
import os

app = FastAPI(title="PDF Q&A API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(documents.router)
app.include_router(questions.router)

# Create upload directory if it doesn't exist
os.makedirs("uploads", exist_ok=True)

@app.get("/")
async def root():
    return {"message": "Welcome to PDF Q&A API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True) 