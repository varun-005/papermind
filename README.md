# PaperMind

A full-stack application that transforms your PDFs into intelligent, conversational knowledge bases. Chat with your documents using natural language processing.

## 🚀 Features

- **📄 PDF Upload**: Drag-and-drop or click to upload PDF documents (up to 10MB)
- **📋 Document Management**: View and manage uploaded documents
- **💬 Smart Chat**: Engage in natural conversations with your documents
- **🤖 AI-Powered Insights**: Get intelligent answers based on document content using OpenAI
- **📱 Responsive Design**: Works on desktop and mobile devices
- **⚡ Real-time Processing**: Fast document processing and chat responses
- **🔒 Error Handling**: Comprehensive error handling and user feedback
- **🎨 Modern UI**: Sleek dark theme with animations and interactive elements

## 🛠 Tech Stack

### Backend

- **FastAPI**: Modern, fast web framework for building APIs
- **LangChain**: Framework for developing applications with LLMs
- **OpenAI GPT**: For natural language processing and question answering
- **SQLite**: Lightweight database for storing document metadata
- **PyMuPDF**: PDF text extraction
- **FAISS**: Vector similarity search

### Frontend

- **React.js**: Modern JavaScript library for building user interfaces
- **TypeScript**: Type-safe JavaScript
- **Material-UI (MUI)**: React component library
- **Axios**: HTTP client for API requests

## 📋 Prerequisites

- **Python 3.8+**
- **Node.js 16+**
- **OpenAI API Key** (required for AI functionality)

## 🚀 Quick Start

### Option 1: Docker (Recommended)

1. **Clone the repository**:

   ```bash
   git clone <repository-url>
   cd fullstackpy
   ```

2. **Set up environment variables**:

   ```bash
   cp backend/.env.example backend/.env
   # Edit backend/.env and add your OpenAI API key
   ```

3. **Run with Docker Compose**:

   ```bash
   # For production
   docker-compose up -d

   # For development with hot reload
   docker-compose -f docker-compose.dev.yml up
   ```

4. **Access the application**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

### Option 2: Manual Setup

#### Backend Setup

1. **Navigate to backend directory**:

   ```bash
   cd backend
   ```

2. **Create virtual environment** (recommended):

   ```bash
   # On Windows:
   python -m venv venv
   venv\Scripts\activate

   # On macOS/Linux:
   python -m venv venv
   source venv/bin/activate
   ```

3. **Install dependencies**:

   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables**:

   ```bash
   cp .env.example .env
   # Edit .env file and add your OpenAI API key:
   # OPENAI_API_KEY=your_openai_api_key_here
   ```

5. **Start the server**:

   ```bash
   # On Windows:
   python -m uvicorn app.main:app --reload

   # On macOS/Linux:
   uvicorn app.main:app --reload
   ```

   The API will be available at http://localhost:8000

#### Frontend Setup

1. **Navigate to frontend directory**:

   ```bash
   cd frontend
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Start the development server**:

   ```bash
   npm start
   ```

   The application will be available at http://localhost:3000

## 📖 API Documentation

After starting the backend server, you can access the interactive API documentation:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### Main Endpoints

- `POST /documents/` - Upload a PDF document
- `GET /documents/` - Get all uploaded documents
- `GET /documents/{id}` - Get a specific document
- `DELETE /documents/{id}` - Delete a document
- `POST /questions/` - Ask a question about a document

## 🏗 Application Structure

```
papermind/
├── backend/                 # FastAPI backend
│   ├── app/
│   │   ├── main.py         # Main FastAPI application
│   │   ├── routers/        # API route handlers
│   │   │   ├── documents.py
│   │   │   └── questions.py
│   │   ├── models/         # Database models and schemas
│   │   │   ├── database.py
│   │   │   └── schemas.py
│   │   └── services/       # Business logic
│   │       └── pdf_service.py
│   ├── tests/              # Backend tests
│   ├── requirements.txt    # Python dependencies
│   ├── Dockerfile         # Docker configuration
│   └── .env.example       # Environment variables template
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── DocumentUpload.tsx
│   │   │   ├── DocumentList.tsx
│   │   │   ├── QuestionForm.tsx
│   │   │   ├── AnswerDisplay.tsx
│   │   │   ├── Header.tsx
│   │   │   └── ErrorBoundary.tsx
│   │   ├── services/       # API service functions
│   │   │   └── api.ts
│   │   ├── App.tsx         # Main application component
│   │   └── index.tsx       # Application entry point
│   ├── public/             # Static files
│   ├── package.json        # Node.js dependencies
│   ├── Dockerfile         # Docker configuration
│   └── nginx.conf         # Nginx configuration
├── docker-compose.yml      # Production Docker setup
├── docker-compose.dev.yml  # Development Docker setup
└── README.md              # This file
```

## 🎯 Usage

1. **Upload a PDF Document**:

   - Drag and drop a PDF file onto the upload area, or click to select
   - Wait for the document to be processed (text extraction and vectorization)
   - The document will appear in your documents list

2. **Chat with Documents**:

   - Select a document from the list by clicking the chat icon
   - Type your message in the chat form
   - Click "Send Message" to get an AI-generated response
   - Continue the conversation with follow-up questions

3. **Manage Documents**:
   - View all uploaded documents with upload dates
   - Delete documents you no longer need
   - Switch between documents to chat with different content

## 🧪 Testing

### Backend Tests

```bash
cd backend
pytest tests/
```

### Frontend Tests

```bash
cd frontend
npm test
```

## 🚀 Deployment

### Production Deployment with Docker

1. **Build and run**:

   ```bash
   docker-compose up -d
   ```

2. **Environment Variables**:
   Make sure to set your OpenAI API key in the environment or `.env` file

### Manual Production Deployment

#### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

#### Frontend

```bash
cd frontend
npm run build
# Serve the build folder with a web server like nginx
```

## 🔧 Configuration

### Environment Variables

#### Backend (.env)

```env
OPENAI_API_KEY=your_openai_api_key_here
DATABASE_URL=sqlite:///./pdf_qa.db
HOST=0.0.0.0
PORT=8000
DEBUG=False
ALLOWED_ORIGINS=http://localhost:3000
MAX_FILE_SIZE=10485760
UPLOAD_DIR=uploads
```

## 🐛 Troubleshooting

### Common Issues

1. **Backend Connection Issues**:

   - Make sure the backend server is running at http://localhost:8000
   - Check for error messages in the console
   - Try running the backend with `python -m uvicorn app.main:app --reload`
   - Verify that no other service is using port 8000

2. **OpenAI API Key Error**:

   - Make sure you have set the `OPENAI_API_KEY` environment variable
   - Verify your API key is valid and has sufficient credits

3. **PDF Processing Fails**:

   - Ensure the PDF contains extractable text (not just images)
   - Check file size is under 10MB limit

4. **CORS Errors**:

   - Verify the frontend URL is included in `ALLOWED_ORIGINS`
   - Check that both frontend and backend are running

5. **Database Issues**:
   - The SQLite database is created automatically
   - Check file permissions in the backend directory

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- OpenAI for providing the GPT API
- LangChain for the NLP framework
- Material-UI for the React components
- FastAPI for the excellent web framework
