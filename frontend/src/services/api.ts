import axios, { AxiosError } from 'axios';

const API_URL = 'http://localhost:8000';
const MAX_RETRIES = 2;
const RETRY_DELAY = 1000; // 1 second

// Different timeout values for different operations
const TIMEOUTS = {
  DEFAULT: 10000,      // 10 seconds
  UPLOAD: 30000,       // 30 seconds
  QUESTION: 60000,     // 60 seconds
  STATUS_CHECK: 5000   // 5 seconds
};

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: TIMEOUTS.DEFAULT,
});

// Add request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.code === 'ECONNABORTED') {
      // Timeout error
      console.error('Request timeout:', error.config?.url);
      return Promise.reject(new Error('Request timed out. Please try again.'));
    }
    
    if (!error.response) {
      // Network error
      console.error('Network error:', error.message);
      return Promise.reject(new Error('Network error. Please check your connection.'));
    }
    
    // Server error
    console.error('API Response Error:', error);
    return Promise.reject(error);
  }
);

export interface Document {
  id: number;
  filename: string;
  file_path: string;
  upload_date: string;
}

export interface QuestionRequest {
  document_id: number;
  question: string;
}

export interface QuestionResponse {
  answer: string;
  document_id: number;
  question: string;
}

// Helper function for retries with timeout handling
const withRetry = async <T>(fn: () => Promise<T>, retries = MAX_RETRIES): Promise<T> => {
  try {
    return await fn();
  } catch (error) {
    if (error instanceof Error && error.message.includes('timeout')) {
      throw error; // Don't retry timeouts
    }
    if (retries > 0) {
      console.log(`Retrying... (${MAX_RETRIES - retries + 1}/${MAX_RETRIES})`);
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      return withRetry(fn, retries - 1);
    }
    throw error;
  }
};

export const uploadDocument = async (file: File): Promise<Document> => {
  const formData = new FormData();
  formData.append('file', file);
  
  return withRetry(async () => {
    try {
      const response = await axios.post(`${API_URL}/documents/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: TIMEOUTS.UPLOAD,
      });
      
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        console.error('Upload error response:', axiosError.response.data);
      } else if (axiosError.request) {
        console.error('Upload error - no response received');
      }
      throw error;
    }
  });
};

export const getDocuments = async (): Promise<Document[]> => {
  return withRetry(async () => {
    const response = await api.get('/documents/');
    return response.data;
  });
};

export const getDocument = async (id: number): Promise<Document> => {
  return withRetry(async () => {
    const response = await api.get(`/documents/${id}`);
    return response.data;
  });
};

export const deleteDocument = async (id: number): Promise<void> => {
  return withRetry(async () => {
    await api.delete(`/documents/${id}`);
  });
};

export const askQuestion = async (request: QuestionRequest): Promise<QuestionResponse> => {
  return withRetry(async () => {
    try {
      const response = await api.post('/questions/', request, {
        timeout: TIMEOUTS.QUESTION, // Use longer timeout for questions
      });
      return response.data;
    } catch (error) {
      if (error instanceof Error && error.message.includes('timeout')) {
        throw new Error('The AI is taking longer than expected to process your question. Please try again or ask a simpler question.');
      }
      throw error;
    }
  });
};

// Check if backend is available
export const checkBackendStatus = async (): Promise<boolean> => {
  try {
    await axios.get(`${API_URL}/`, { timeout: TIMEOUTS.STATUS_CHECK });
    return true;
  } catch (error) {
    console.error('Backend connection error:', error);
    return false;
  }
};

export default api; 