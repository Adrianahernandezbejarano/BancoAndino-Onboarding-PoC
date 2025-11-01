import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

/**
 * Cliente axios preconfigurado para consumir la API de validación.
 * @type {import('axios').AxiosInstance}
 */
export const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Solicita validación de datos de formulario al backend.
 * @param {Object} payload - Datos del formulario digital.
 * @returns {Promise<Object>} Respuesta del servicio.
 */
export const validateForm = async (payload) => {
  const { data } = await apiClient.post('/validation/form', payload);
  return data;
};

/**
 * Envía un documento y metadatos asociados para validación.
 * @param {File} file - Archivo seleccionado por el usuario.
 * @param {Object} metadata - Campos adicionales enviados junto al documento.
 * @returns {Promise<Object>} Resultado de la validación del documento.
 */
export const validateDocument = async (file, metadata) => {
  const formData = new FormData();
  formData.append('document', file);
  Object.entries(metadata || {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, value);
    }
  });

  const { data } = await apiClient.post('/validation/document', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return data;
};

