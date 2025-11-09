import { useState, useCallback } from 'react';
import {
  validateForm as validateFormRequest,
  validateDocument as validateDocumentRequest,
} from '../services/api';

const initialState = {
  status: null,
  message: null,
  data: null,
};

/**
 * Hook para gestionar validaciones de formulario y documentos desde la UI.
 * @returns {Object} Estado y acciones para ejecutar validaciones desde el frontend.
 */
export const useValidation = () => {
  const [formResult, setFormResult] = useState(initialState);
  const [documentResult, setDocumentResult] = useState(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFormValidation = useCallback(async (payload) => {
    setIsSubmitting(true);
    try {
      const response = await validateFormRequest(payload);
      setFormResult({
        status: response.status,
        message: response.message,
        data: response.data,
      });
      return response;
    } catch (error) {
      const response = error.response?.data || {
        status: 'error',
        message: error.message,
      };
      setFormResult({
        status: response.status,
        message: response.message,
        data: response.details || null,
      });
      throw response;
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const handleDocumentValidation = useCallback(async (file, metadata) => {
    setIsSubmitting(true);
    try {
      const response = await validateDocumentRequest(file, metadata);
      setDocumentResult({
        status: response.status,
        message: response.message,
        data: response.validation,
      });
      return response;
    } catch (error) {
      const response = error.response?.data || {
        status: 'error',
        message: error.message,
      };
      setDocumentResult({
        status: response.status,
        message: response.message,
        data: response.details || null,
      });
      throw response;
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const resetResults = () => {
    setFormResult(initialState);
    setDocumentResult(initialState);
  };

  return {
    formResult,
    documentResult,
    isSubmitting,
    handleFormValidation,
    handleDocumentValidation,
    resetResults,
  };
};

