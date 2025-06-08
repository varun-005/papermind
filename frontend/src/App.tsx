import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Typography,
  Box,
  CssBaseline,
  ThemeProvider,
  createTheme,
  Alert,
  Snackbar,
  Button,
  Zoom,
} from "@mui/material";
import Header from "./components/Header";
import DocumentUpload from "./components/DocumentUpload";
import DocumentList from "./components/DocumentList";
import QuestionForm from "./components/QuestionForm";
import AnswerDisplay from "./components/AnswerDisplay";
import ErrorBoundary from "./components/ErrorBoundary";
import { Document, QuestionResponse, checkBackendStatus } from "./services/api";
import { Refresh as RefreshIcon, AutoAwesome as SparkleIcon } from "@mui/icons-material";
import './animations.css';

// Create a custom dark theme with blue accents
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      light: '#6573c3',
      main: '#3f51b5',
      dark: '#2c387e',
      contrastText: '#fff',
    },
    secondary: {
      light: '#33ab9f',
      main: '#009688',
      dark: '#00695f',
      contrastText: '#fff',
    },
    background: {
      default: '#0a1929',
      paper: '#132f4c',
    },
    text: {
      primary: '#ffffff',
      secondary: '#b0b8c4',
    },
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
      letterSpacing: '0.02em',
    },
    h6: {
      fontWeight: 500,
      letterSpacing: '0.01em',
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: '#132f4c',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 16px',
        },
        contained: {
          boxShadow: '0 3px 10px rgba(0, 0, 0, 0.2)',
        },
        outlined: {
          borderColor: 'rgba(255, 255, 255, 0.2)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: 'linear-gradient(90deg, #0a1929 0%, #071426 100%)',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(255, 255, 255, 0.2)',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(255, 255, 255, 0.3)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        outlined: {
          borderColor: 'rgba(255, 255, 255, 0.2)',
        },
      },
    },
  },
});

function App() {
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(
    null
  );
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [response, setResponse] = useState<QuestionResponse | null>(null);
  const [backendConnected, setBackendConnected] = useState<boolean | null>(null);
  const [showConnectionAlert, setShowConnectionAlert] = useState(false);

  // Check backend connectivity
  useEffect(() => {
    const checkConnection = async () => {
      const isConnected = await checkBackendStatus();
      setBackendConnected(isConnected);
      setShowConnectionAlert(!isConnected);
    };

    checkConnection();
    
    // Set up periodic checks
    const intervalId = setInterval(checkConnection, 30000); // Check every 30 seconds
    
    return () => clearInterval(intervalId);
  }, []);

  const handleDocumentUpload = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleSelectDocument = (document: Document) => {
    setSelectedDocument(document);
    setResponse(null);
  };

  const handleAnswerReceived = (response: QuestionResponse) => {
    setResponse(response);
  };

  const handleRetryConnection = () => {
    setBackendConnected(null); // Set to loading state
    checkBackendStatus().then(isConnected => {
      setBackendConnected(isConnected);
      setShowConnectionAlert(!isConnected);
      if (isConnected) {
        // Refresh documents if connection is restored
        setRefreshTrigger(prev => prev + 1);
      }
    });
  };

  return (
    <ErrorBoundary>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Header />
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Zoom in={true} style={{ transitionDelay: '100ms' }}>
            <Box sx={{ mb: 4, textAlign: 'center' }}>
              <Box sx={{ position: 'relative', display: 'inline-block' }}>
                <Typography 
                  variant="h4" 
                  component="h1" 
                  gutterBottom
                  sx={{
                    background: 'linear-gradient(45deg, #3f51b5 30%, #009688 90%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontWeight: 700,
                    position: 'relative',
                    zIndex: 1,
                    textShadow: '0 2px 10px rgba(63, 81, 181, 0.3)',
                  }}
                  className="scale-in"
                >
                  PaperMind
                </Typography>
                <SparkleIcon 
                  sx={{ 
                    position: 'absolute',
                    top: -15,
                    right: -20,
                    fontSize: 24,
                    color: '#FFD700',
                  }}
                  className="pulse"
                />
              </Box>
              <Typography 
                variant="subtitle1" 
                color="text.secondary" 
                sx={{ maxWidth: '700px', mx: 'auto', mb: 2 }}
                className="fade-in"
              >
                Transform your PDFs into intelligent, conversational knowledge bases
              </Typography>
            </Box>
          </Zoom>

          {backendConnected === false && (
            <Alert 
              severity="error" 
              sx={{ mb: 3 }}
              action={
                <Button 
                  color="inherit" 
                  size="small" 
                  onClick={handleRetryConnection}
                  startIcon={<RefreshIcon />}
                >
                  Retry
                </Button>
              }
              className="shake"
            >
              Cannot connect to the backend server. Please make sure the server is running at http://localhost:8000
            </Alert>
          )}

          <Grid container spacing={4}>
            <Grid item xs={12} md={5}>
              <Box>
                <DocumentUpload onUploadSuccess={handleDocumentUpload} />
                <Typography 
                  variant="h6" 
                  gutterBottom 
                  sx={{ mt: 3, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}
                  className="slide-in-left"
                >
                  <span className="animated-underline">Your Documents</span>
                </Typography>
                <DocumentList
                  onSelectDocument={handleSelectDocument}
                  refreshTrigger={refreshTrigger}
                />
              </Box>
            </Grid>

            <Grid item xs={12} md={7}>
              <QuestionForm
                document={selectedDocument}
                onAnswerReceived={handleAnswerReceived}
              />
              <AnswerDisplay response={response} />
            </Grid>
          </Grid>
        </Container>

        <Snackbar 
          open={showConnectionAlert} 
          autoHideDuration={6000} 
          onClose={() => setShowConnectionAlert(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert 
            severity="warning" 
            variant="filled"
            sx={{ width: '100%' }}
          >
            Backend server connection failed. Some features may not work properly.
          </Alert>
        </Snackbar>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
