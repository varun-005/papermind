import React, { useState } from 'react';
import { 
  TextField, 
  Button, 
  Box, 
  Typography, 
  Paper, 
  CircularProgress,
  Alert,
  Fade,
  Chip,
  InputAdornment,
  Zoom,
} from '@mui/material';
import { 
  Chat as ChatIcon, 
  Send as SendIcon,
  PictureAsPdf as PdfIcon,
} from '@mui/icons-material';
import { askQuestion, Document, QuestionResponse } from '../services/api';

interface QuestionFormProps {
  document: Document | null;
  onAnswerReceived: (response: QuestionResponse) => void;
}

const QuestionForm: React.FC<QuestionFormProps> = ({ document, onAnswerReceived }) => {
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!document) {
      setError('Please select a document first');
      return;
    }
    
    if (!question.trim()) {
      setError('Please enter a question');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await askQuestion({
        document_id: document.id,
        question: question.trim()
      });
      
      onAnswerReceived(response);
      setQuestion('');
    } catch (err: any) {
      console.error('Error asking question:', err);
      
      // Handle different types of errors
      if (err.message.includes('timeout')) {
        setError('The AI is taking longer than expected. Please try asking a simpler question or try again in a moment.');
      } else if (err.message.includes('Network error')) {
        setError('Unable to connect to the server. Please check your internet connection.');
      } else if (err.response?.status === 413) {
        setError('Your question is too long. Please try a shorter question.');
      } else if (err.response?.status === 429) {
        setError('Too many requests. Please wait a moment before trying again.');
      } else {
        setError(err.response?.data?.detail || err.message || 'Failed to get an answer. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ mb: 4 }} id="question-form">
      <Typography 
        variant="h6" 
        gutterBottom 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1,
          mb: 2
        }}
        className="slide-in-left"
      >
        <ChatIcon color="primary" className="hover-icon" />
        <span className="animated-underline">Chat with Document</span>
      </Typography>

      <Zoom in={true} style={{ transitionDelay: '200ms' }}>
        <Paper 
          sx={{ 
            p: 3, 
            borderRadius: 2,
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            background: 'linear-gradient(to bottom right, rgba(19, 47, 76, 0.8), rgba(10, 25, 41, 1))',
            position: 'relative',
            overflow: 'hidden',
          }}
          className="card-hover"
        >
          <Box
            sx={{
              position: 'absolute',
              top: -50,
              right: -50,
              width: '150px',
              height: '150px',
              background: 'radial-gradient(circle at top right, rgba(63, 81, 181, 0.15), transparent 70%)',
              zIndex: 0,
              borderRadius: '50%',
            }}
          />
          
          {document ? (
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  mb: 2,
                  p: 1.5,
                  borderRadius: 1,
                  backgroundColor: 'rgba(63, 81, 181, 0.1)',
                  border: '1px solid rgba(63, 81, 181, 0.2)',
                }}
                className="fade-in"
              >
                <PdfIcon sx={{ color: '#e53935', mr: 1.5 }} className="hover-icon" />
                <Box>
                  <Typography variant="body1" fontWeight={500}>
                    {document.filename}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                    Selected document
                  </Typography>
                </Box>
                <Chip 
                  label="Active" 
                  size="small" 
                  color="success" 
                  variant="outlined"
                  sx={{ ml: 'auto', fontSize: '0.7rem' }}
                />
              </Box>

              <form onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  variant="outlined"
                  placeholder="Type your message here..."
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  error={!!error}
                  helperText={error}
                  disabled={loading}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      backdropFilter: 'blur(10px)',
                      transition: 'all 0.3s ease',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.08)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                      },
                      '&.Mui-focused': {
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(63, 81, 181, 0.5)',
                        boxShadow: '0 0 15px rgba(63, 81, 181, 0.2)',
                      }
                    }
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          {loading && <CircularProgress size={24} />}
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSubmit}
                            disabled={loading || !question.trim()}
                            endIcon={<SendIcon />}
                            sx={{
                              borderRadius: '20px',
                              px: 3,
                              background: 'linear-gradient(45deg, #3f51b5 30%, #009688 90%)',
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: '0 5px 15px rgba(63, 81, 181, 0.3)',
                              },
                              '&:active': {
                                transform: 'translateY(0)',
                              }
                            }}
                          >
                            Send
                          </Button>
                        </Box>
                      </InputAdornment>
                    ),
                  }}
                />
              </form>
            </Box>
          ) : (
            <Box sx={{ textAlign: 'center', py: 4, position: 'relative', zIndex: 1 }} className="pulse">
              <ChatIcon sx={{ fontSize: 48, color: 'primary.main', opacity: 0.7, mb: 2 }} />
              <Typography variant="body1" gutterBottom>
                Select a document to start chatting
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Click on the chat icon next to a document in your list
              </Typography>
            </Box>
          )}
        </Paper>
      </Zoom>
    </Box>
  );
};

export default QuestionForm; 