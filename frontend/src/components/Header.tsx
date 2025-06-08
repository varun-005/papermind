import React from 'react';
import { AppBar, Toolbar, Typography, Container, Box, Tooltip } from '@mui/material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

// Define the float animation keyframes in the index.css file instead
// This component just uses the animation

const Header: React.FC = () => {
  return (
    <AppBar 
      position="static" 
      color="primary"
      sx={{
        backgroundImage: 'linear-gradient(90deg, #0a1929 0%, #071426 100%)',
        position: 'relative',
        overflow: 'hidden',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      }}
    >
      {/* Animated background particles */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          overflow: 'hidden',
          zIndex: 0,
        }}
      >
        {[...Array(10)].map((_, i) => (
          <Box
            key={i}
            sx={{
              position: 'absolute',
              backgroundColor: 'rgba(63, 81, 181, 0.1)',
              borderRadius: '50%',
              width: `${Math.random() * 30 + 10}px`,
              height: `${Math.random() * 30 + 10}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `float ${Math.random() * 10 + 10}s infinite linear`,
              opacity: Math.random() * 0.5 + 0.1,
            }}
          />
        ))}
      </Box>
      
      <Container>
        <Toolbar disableGutters sx={{ py: 1, position: 'relative', zIndex: 1 }}>
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center',
              '&:hover .app-icon': {
                transform: 'rotate(10deg)',
              },
              '&:hover .star-icon': {
                transform: 'rotate(180deg) scale(1.2)',
              },
            }}
            className="fade-in"
          >
            <Box sx={{ position: 'relative' }}>
              <PictureAsPdfIcon 
                sx={{ 
                  mr: 1.5, 
                  fontSize: 32, 
                  transition: 'transform 0.5s ease',
                  color: '#e53935',
                }} 
                className="app-icon"
              />
              <AutoAwesomeIcon 
                sx={{ 
                  position: 'absolute', 
                  top: -8, 
                  right: 0, 
                  fontSize: 16, 
                  color: '#FFD700',
                  transition: 'transform 0.5s ease',
                }} 
                className="star-icon"
              />
            </Box>
            
            <Tooltip title="PDF Document AI Chat" arrow>
              <Typography
                variant="h5"
                noWrap
                component="div"
                sx={{ 
                  flexGrow: 1, 
                  display: { xs: 'flex' },
                  fontWeight: 600,
                  letterSpacing: '0.02em',
                  position: 'relative',
                  textShadow: '0 2px 10px rgba(0, 0, 0, 0.5)',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: -2,
                    left: 0,
                    width: '0%',
                    height: '2px',
                    backgroundColor: 'white',
                    transition: 'width 0.3s ease',
                  },
                  '&:hover::after': {
                    width: '100%',
                  },
                }}
                className="animated-underline"
              >
                PaperMind
              </Typography>
            </Tooltip>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header; 