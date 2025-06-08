import React from 'react';
import { Paper, Typography, Box, Divider, Fade, Chip, Zoom } from '@mui/material';
import { QuestionResponse } from '../services/api';
import { QuestionAnswer as QuestionIcon, AutoAwesome as AnswerIcon, LightbulbOutlined as LightbulbIcon } from '@mui/icons-material';

interface AnswerDisplayProps {
  response: QuestionResponse | null;
}

const AnswerDisplay: React.FC<AnswerDisplayProps> = ({ response }) => {
  if (!response) {
    return null;
  }

  // Function to highlight keywords in the answer
  const highlightKeywords = (text: string): JSX.Element => {
    // Simple regex to find potential keywords (capitalized words, technical terms, etc.)
    const keywords = [
      'important', 'significant', 'key', 'main', 'critical', 'essential',
      'primary', 'major', 'fundamental', 'crucial', 'vital', 'core'
    ];
    
    const regex = new RegExp(`\\b(${keywords.join('|')})\\b`, 'gi');
    
    const parts = text.split(regex);
    
    return (
      <>
        {parts.map((part, i) => {
          if (keywords.some(keyword => part.toLowerCase() === keyword.toLowerCase())) {
            return <span key={i} className="answer-highlight">{part}</span>;
          }
          return <span key={i}>{part}</span>;
        })}
      </>
    );
  };

  return (
    <Zoom in={!!response} timeout={500} style={{ transitionDelay: '200ms' }}>
      <Paper 
        sx={{ 
          p: 3, 
          mb: 4,
          borderRadius: 2,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          overflow: 'hidden',
          position: 'relative',
          background: 'linear-gradient(135deg, rgba(19, 47, 76, 0.8) 0%, rgba(10, 25, 41, 0.95) 100%)',
          backdropFilter: 'blur(10px)',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)',
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)',
          }
        }}
        className="card-hover"
      >
        <Box
          sx={{
            position: 'absolute',
            top: -50,
            right: -50,
            width: '200px',
            height: '200px',
            background: 'radial-gradient(circle at center, rgba(63, 81, 181, 0.15), transparent 70%)',
            borderRadius: '50%',
            animation: 'pulse 4s infinite ease-in-out',
          }}
        />
        
        <Box
          sx={{
            position: 'absolute',
            bottom: -30,
            left: -30,
            width: '150px',
            height: '150px',
            background: 'radial-gradient(circle at center, rgba(0, 150, 136, 0.15), transparent 70%)',
            borderRadius: '50%',
            animation: 'pulse 4s infinite ease-in-out',
            animationDelay: '2s',
          }}
        />
        
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Typography 
            variant="h6" 
            gutterBottom 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1,
              color: 'primary.main',
              fontWeight: 600,
              background: 'linear-gradient(45deg, #3f51b5, #009688)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
            className="slide-in-left"
          >
            <AnswerIcon className="hover-icon" /> 
            <span className="animated-underline">AI Insights</span>
          </Typography>
          
          <Box
            sx={{ 
              mb: 2,
              backgroundColor: 'rgba(63, 81, 181, 0.1)',
              p: 2,
              borderRadius: 2,
              position: 'relative',
              border: '1px solid rgba(63, 81, 181, 0.2)',
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: 'rgba(63, 81, 181, 0.15)',
                transform: 'translateY(-2px)',
                boxShadow: '0 5px 15px rgba(0, 0, 0, 0.2)',
              }
            }}
            className="scale-in"
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <QuestionIcon sx={{ color: 'primary.main', mr: 1, fontSize: 20 }} className="hover-icon" />
              <Typography variant="subtitle2" color="primary" fontWeight={500}>
                Your Question
              </Typography>
            </Box>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              {response.question}
            </Typography>
          </Box>
          
          <Divider sx={{ my: 2, borderColor: 'rgba(255, 255, 255, 0.1)' }} />
          
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <AnswerIcon sx={{ color: 'secondary.main', mr: 1, fontSize: 20 }} className="hover-icon" />
                <Typography variant="subtitle2" color="secondary" fontWeight={500}>
                  AI Response
                </Typography>
              </Box>
              <Chip 
                icon={<LightbulbIcon sx={{ fontSize: '0.8rem !important' }} />}
                label="AI Generated" 
                size="small" 
                color="secondary" 
                variant="outlined"
                sx={{ 
                  fontSize: '0.7rem',
                  background: 'rgba(0, 150, 136, 0.1)',
                  borderColor: 'rgba(0, 150, 136, 0.3)',
                  '& .MuiChip-icon': {
                    color: '#009688',
                  }
                }}
                className="pulse"
              />
            </Box>
            <Typography 
              variant="body1" 
              sx={{ 
                whiteSpace: 'pre-wrap',
                lineHeight: 1.8,
                letterSpacing: '0.01em',
                '& .answer-highlight': {
                  background: 'linear-gradient(120deg, rgba(0, 150, 136, 0.2) 0%, rgba(63, 81, 181, 0.2) 100%)',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  margin: '0 2px',
                  fontWeight: 500,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background: 'linear-gradient(120deg, rgba(0, 150, 136, 0.3) 0%, rgba(63, 81, 181, 0.3) 100%)',
                    transform: 'translateY(-1px)',
                  }
                }
              }}
              className="fade-in"
            >
              {highlightKeywords(response.answer)}
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Zoom>
  );
};

export default AnswerDisplay; 