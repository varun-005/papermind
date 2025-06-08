import React, { useState, useEffect } from 'react';
import { 
  List, 
  ListItem, 
  ListItemText, 
  ListItemSecondaryAction, 
  IconButton, 
  Typography, 
  Box, 
  Paper,
  Tooltip,
  Fade,
  Skeleton,
  Chip,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Divider,
  Zoom
} from '@mui/material';
import { 
  Delete as DeleteIcon, 
  QuestionAnswer as QuestionIcon,
  PictureAsPdf as PdfIcon,
  FolderOff as EmptyFolderIcon,
  Refresh as RefreshIcon,
  Info as InfoIcon,
  Error as ErrorIcon
} from '@mui/icons-material';
import { getDocuments, deleteDocument, Document } from '../services/api';
import { format } from 'date-fns';

interface DocumentListProps {
  onSelectDocument: (document: Document) => void;
  refreshTrigger: number;
}

const DocumentList: React.FC<DocumentListProps> = ({ onSelectDocument, refreshTrigger }) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<Document | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getDocuments();
      setDocuments(data);
    } catch (err) {
      console.error("Failed to fetch documents:", err);
      setError("Failed to load documents. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [refreshTrigger]);

  const handleDeleteClick = (doc: Document) => {
    setDocumentToDelete(doc);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!documentToDelete) return;

    try {
      setDeleteLoading(true);
      await deleteDocument(documentToDelete.id);
      setDocuments((prevDocs) =>
        prevDocs.filter((doc) => doc.id !== documentToDelete.id)
      );
      setDeleteDialogOpen(false);
      setDocumentToDelete(null);
    } catch (err) {
      console.error("Failed to delete document:", err);
      setError("Failed to delete document. Please try again.");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setDocumentToDelete(null);
  };

  const handleRefresh = () => {
    fetchDocuments();
  };

  const handleChatWithDocument = (doc: Document) => {
    onSelectDocument(doc);
    
    const questionFormElement = globalThis.document.getElementById('question-form');
    if (questionFormElement) {
      questionFormElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (loading && documents.length === 0) {
    return (
      <Paper 
        elevation={2} 
        sx={{ 
          p: 3, 
          display: "flex", 
          justifyContent: "center",
          borderRadius: 2,
          backgroundColor: 'rgba(19, 47, 76, 0.8)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <Box sx={{ textAlign: "center" }}>
          <CircularProgress size={40} sx={{ mb: 2 }} />
          <Typography variant="body1">Loading documents...</Typography>
        </Box>
      </Paper>
    );
  }

  if (error) {
    return (
      <Paper 
        elevation={2} 
        sx={{ 
          p: 3, 
          borderRadius: 2,
          backgroundColor: 'rgba(19, 47, 76, 0.8)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <ErrorIcon color="error" sx={{ mr: 1 }} />
          <Typography variant="h6" color="error">
            Error
          </Typography>
        </Box>
        <Typography variant="body1" gutterBottom>
          {error}
        </Typography>
        <Button
          startIcon={<RefreshIcon />}
          variant="outlined"
          color="primary"
          onClick={handleRefresh}
          sx={{ mt: 1 }}
        >
          Try Again
        </Button>
      </Paper>
    );
  }

  if (documents.length === 0) {
    return (
      <Fade in={true}>
        <Paper 
          elevation={2} 
          sx={{ 
            p: 3, 
            borderRadius: 2,
            backgroundColor: 'rgba(19, 47, 76, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <Box sx={{ textAlign: "center" }}>
            <PdfIcon sx={{ fontSize: 48, color: "#e53935", mb: 2, opacity: 0.8 }} />
            <Typography variant="body1" gutterBottom>
              No documents uploaded yet
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Upload a PDF document to get started
            </Typography>
          </Box>
        </Paper>
      </Fade>
    );
  }

  return (
    <Fade in={true}>
      <Paper
        elevation={2} 
        sx={{ 
          borderRadius: 2,
          backgroundColor: 'rgba(19, 47, 76, 0.8)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          overflow: 'hidden',
          position: 'relative',
        }}
        className="card-hover"
      >
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            p: 2, 
            backgroundColor: 'rgba(63, 81, 181, 0.1)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <Typography variant="subtitle1" fontWeight={500}>
            Your Documents ({documents.length})
          </Typography>
          <Tooltip title="Refresh documents">
            <IconButton onClick={handleRefresh} size="small" color="primary" className="hover-icon">
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>
        
        <List>
          {documents.map((doc, index) => (
            <Zoom 
              in={true} 
              style={{ transitionDelay: `${index * 50}ms` }} 
              key={doc.id}
            >
              <ListItem 
                sx={{ 
                  py: 1.5,
                  px: 2,
                  borderBottom: index < documents.length - 1 ? '1px solid rgba(255, 255, 255, 0.05)' : 'none',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: 'rgba(63, 81, 181, 0.1)',
                  },
                }}
                className="enhanced-list-item staggered-item"
                secondaryAction={
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title="Chat with this document">
                      <IconButton
                        edge="end"
                        aria-label="chat"
                        onClick={() => handleChatWithDocument(doc)}
                        size="small"
                        color="primary"
                        sx={{
                          transition: 'transform 0.2s ease, background-color 0.2s ease',
                          '&:hover': {
                            transform: 'scale(1.1)',
                            backgroundColor: 'rgba(63, 81, 181, 0.15)',
                          }
                        }}
                      >
                        <QuestionIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete document">
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => handleDeleteClick(doc)}
                        size="small"
                        color="error"
                        sx={{
                          transition: 'transform 0.2s ease, background-color 0.2s ease',
                          '&:hover': {
                            transform: 'scale(1.1)',
                            backgroundColor: 'rgba(244, 67, 54, 0.15)',
                          }
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                }
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mr: 1 }}>
                  <PdfIcon sx={{ color: '#e53935', mr: 1 }} className="pdf-icon" />
                </Box>
                <ListItemText
                  primary={
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        fontWeight: 500,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        maxWidth: { xs: '120px', sm: '180px', md: '250px' },
                      }}
                    >
                      {doc.filename}
                    </Typography>
                  }
                  secondary={
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{ fontSize: '0.75rem' }}
                    >
                      {format(new Date(doc.upload_date), "MMM d, yyyy")}
                    </Typography>
                  }
                />
              </ListItem>
            </Zoom>
          ))}
        </List>

        <Dialog
          open={deleteDialogOpen}
          onClose={handleDeleteCancel}
          PaperProps={{
            sx: {
              borderRadius: 2,
              backgroundColor: 'rgba(19, 47, 76, 0.95)',
              backgroundImage: 'none',
              boxShadow: '0 4px 30px rgba(0, 0, 0, 0.3)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }
          }}
        >
          <DialogTitle sx={{ pb: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <DeleteIcon color="error" />
              <Typography variant="h6">Delete Document</Typography>
            </Box>
          </DialogTitle>
          <DialogContent>
            <Typography variant="body1" gutterBottom>
              Are you sure you want to delete the document:{" "}
              <Box component="span" sx={{ fontWeight: 600 }}>
                {documentToDelete?.filename}
              </Box>
              ?
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button 
              onClick={handleDeleteCancel} 
              color="primary"
              variant="outlined"
              disabled={deleteLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteConfirm}
              color="error"
              variant="contained"
              disabled={deleteLoading}
              startIcon={deleteLoading ? <CircularProgress size={16} color="inherit" /> : <DeleteIcon />}
            >
              {deleteLoading ? "Deleting..." : "Delete"}
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Fade>
  );
};

export default DocumentList; 