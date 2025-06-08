import React, { useState, useCallback } from "react";
import {
  Button,
  Box,
  Typography,
  CircularProgress,
  Alert,
  Paper,
  Fade,
  Zoom,
  IconButton,
} from "@mui/material";
import {
  CloudUpload as CloudUploadIcon,
  PictureAsPdf as PdfIcon,
  CheckCircleOutline as CheckIcon,
  Close as CloseIcon,
  AutoAwesome as AutoAwesomeIcon,
} from "@mui/icons-material";
import { uploadDocument } from "../services/api";

interface DocumentUploadProps {
  onUploadSuccess: () => void;
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({ onUploadSuccess }) => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const validateFile = (file: File): boolean => {
    if (file.type !== "application/pdf") {
      setError("Please upload a PDF file");
      return false;
    }

    // Check file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      setError("File size must be less than 10MB");
      return false;
    }

    return true;
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const selectedFile = event.target.files[0];

      if (validateFile(selectedFile)) {
        setFile(selectedFile);
        setError(null);
      } else {
        setFile(null);
      }
    }
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  }, []);

  const handleDragOut = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];

      if (validateFile(droppedFile)) {
        setFile(droppedFile);
        setError(null);
      } else {
        setFile(null);
      }
    }
  }, []);

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file to upload");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await uploadDocument(file);

      setSuccess(true);
      setFile(null);
      onUploadSuccess();

      // Reset success message after 5 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 5000);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to upload document");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseError = () => {
    setError(null);
  };

  const handleCloseSuccess = () => {
    setSuccess(false);
  };

  return (
    <Box sx={{ mb: 4 }} className="fade-in">
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
        <PdfIcon sx={{ color: '#e53935' }} className="hover-icon" />
        <span className="animated-underline">Upload PDF Document</span>
      </Typography>

      <Zoom in={true} style={{ transitionDelay: '150ms' }}>
        <Paper
          elevation={2}
          sx={{
            p: 3,
            border: dragActive ? "2px dashed #3f51b5" : "2px dashed rgba(255, 255, 255, 0.2)",
            borderRadius: 2,
            backgroundColor: dragActive
              ? "rgba(63, 81, 181, 0.15)"
              : "transparent",
            cursor: "pointer",
            transition: "all 0.3s ease",
            "&:hover": {
              borderColor: "#3f51b5",
              backgroundColor: "rgba(63, 81, 181, 0.1)",
              transform: "translateY(-4px)",
              boxShadow: "0 6px 20px rgba(0, 0, 0, 0.2)",
            },
            position: 'relative',
            overflow: 'hidden',
          }}
          onDragEnter={handleDragIn}
          onDragLeave={handleDragOut}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className="card-hover"
        >
          {dragActive && (
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(63, 81, 181, 0.15)',
                zIndex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                animation: 'pulse 1.5s infinite ease-in-out',
              }}
            >
              <Typography variant="h6" color="primary" fontWeight={600}>
                Drop your PDF here
              </Typography>
            </Box>
          )}
          
          <input
            accept="application/pdf"
            style={{ display: "none" }}
            id="raised-button-file"
            type="file"
            onChange={handleFileChange}
            disabled={loading}
          />

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
              position: 'relative',
              zIndex: 0,
            }}
          >
            {!file ? (
              <>
                <CloudUploadIcon
                  sx={{ 
                    fontSize: 56, 
                    color: "primary.main", 
                    mb: 1,
                    opacity: 0.9,
                    transition: 'transform 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                    }
                  }}
                  className="hover-icon"
                />
                <Typography
                  variant="body1"
                  color="text.primary"
                  textAlign="center"
                  fontWeight={500}
                >
                  Drag and drop your PDF file here
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  textAlign="center"
                >
                  Maximum file size: 10MB
                </Typography>
              </>
            ) : (
              <>
                <Box 
                  sx={{ 
                    backgroundColor: 'rgba(63, 81, 181, 0.15)', 
                    borderRadius: '50%',
                    width: 80,
                    height: 80,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 1,
                    animation: 'scaleIn 0.5s ease forwards',
                  }}
                  className="pulse"
                >
                  <PdfIcon
                    sx={{ fontSize: 48, color: "#e53935" }}
                    className="hover-icon"
                  />
                </Box>
                <Typography
                  variant="body1"
                  color="text.primary"
                  textAlign="center"
                  fontWeight={500}
                  className="slide-in-right"
                >
                  {file.name}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  textAlign="center"
                  className="fade-in"
                  sx={{ animationDelay: '0.2s' }}
                >
                  {(file.size / (1024 * 1024)).toFixed(2)} MB
                </Typography>
              </>
            )}

            <Box sx={{ width: '100%', mt: 1 }} className="floating-label-container">
              <label htmlFor="raised-button-file" style={{ width: "100%" }}>
                <Button
                  variant="outlined"
                  component="span"
                  startIcon={<CloudUploadIcon />}
                  disabled={loading}
                  fullWidth
                  sx={{ mb: 1 }}
                  className="floating-label-container"
                >
                  {file ? "Change File" : "Select PDF File"}
                </Button>
              </label>

              {file && (
                <Fade in={!!file} timeout={500}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleUpload}
                    disabled={loading}
                    fullWidth
                    sx={{ mt: 1 }}
                  >
                    {loading ? (
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <CircularProgress size={20} sx={{ mr: 1, color: 'white' }} />
                        Processing...
                      </Box>
                    ) : (
                      <>
                        <span>Upload Document</span>
                        <span className="floating-label" style={{ position: 'absolute', top: '-18px', fontSize: '0.7rem', right: '10px' }}>
                          Ready to upload
                        </span>
                      </>
                    )}
                  </Button>
                </Fade>
              )}
            </Box>
          </Box>

          {loading && (
            <Box 
              sx={{ 
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(19, 47, 76, 0.9)',
                borderRadius: 2,
                zIndex: 2,
              }}
              className="fade-in"
            >
              <Box
                sx={{
                  position: 'relative',
                  width: 60,
                  height: 60,
                  animation: 'float 3s infinite ease-in-out',
                }}
              >
                <PdfIcon 
                  sx={{ 
                    fontSize: 60,
                    color: '#e53935',
                    animation: 'pulse 2s infinite',
                  }}
                />
                <AutoAwesomeIcon 
                  sx={{ 
                    position: 'absolute',
                    top: -10,
                    right: -10,
                    fontSize: 20,
                    color: '#FFD700',
                    animation: 'sparkle 1.5s infinite ease-in-out',
                  }}
                />
              </Box>
              <Typography 
                variant="body1" 
                sx={{ 
                  mt: 2,
                  fontWeight: 500,
                  background: 'linear-gradient(45deg, #3f51b5, #009688)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
                className="pulse"
              >
                Transforming Document...
              </Typography>
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ mt: 1 }}
                className="fade-in"
              >
                Building your knowledge base
              </Typography>
            </Box>
          )}
        </Paper>
      </Zoom>

      {error && (
        <Fade in={!!error}>
          <Alert 
            severity="error" 
            sx={{ mt: 2 }}
            className="shake"
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={handleCloseError}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            }
          >
            {error}
          </Alert>
        </Fade>
      )}

      {success && (
        <Fade in={!!success}>
          <Alert 
            severity="success" 
            sx={{ mt: 2 }}
            icon={<CheckIcon fontSize="inherit" className="pulse" />}
            action={
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button 
                  color="inherit" 
                  size="small" 
                  onClick={() => {
                    setSuccess(false);
                    document.getElementById('raised-button-file')?.click();
                  }}
                >
                  Upload Another
                </Button>
                <IconButton
                  aria-label="close"
                  color="inherit"
                  size="small"
                  onClick={handleCloseSuccess}
                >
                  <CloseIcon fontSize="inherit" />
                </IconButton>
              </Box>
            }
          >
            Document uploaded successfully!
          </Alert>
        </Fade>
      )}
    </Box>
  );
};

export default DocumentUpload;
