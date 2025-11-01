import { useEffect, useRef, useState, useCallback } from 'react';

const DEFAULT_STORAGE_KEY = 'digital-form-draft';

/**
 * Hook para persistir y restaurar borradores de formularios con autosave.
 * @param {Object} params
 * @param {Function} params.getValues - Obtiene los valores actuales del formulario.
 * @param {Function} params.reset - Restablece el formulario con datos almacenados.
 * @param {string} [params.storageKey] - Clave de almacenamiento en localStorage.
 * @param {number} [params.intervalMs] - Intervalo de guardado automático en milisegundos.
 * @returns {{lastSavedAt: Date|null, persistDraft: Function, clearDraft: Function}}
 */
export const useFormPersistence = ({
  getValues,
  reset,
  storageKey = DEFAULT_STORAGE_KEY,
  intervalMs = 30000,
}) => {
  const [lastSavedAt, setLastSavedAt] = useState(null);
  const isRestoredRef = useRef(false);

  useEffect(() => {
    if (isRestoredRef.current) {
      return;
    }

    try {
      const serialized = window.localStorage.getItem(storageKey);
      if (serialized) {
        const parsed = JSON.parse(serialized);
        const { __lastSavedAt, ...values } = parsed;
        reset(values, {
          keepDefaultValues: true,
        });
        if (__lastSavedAt) {
          setLastSavedAt(new Date(__lastSavedAt));
        }
      }
    } catch (error) {
      console.warn('No se pudo restaurar el borrador del formulario.', error);
    } finally {
      isRestoredRef.current = true;
    }
  }, [reset, storageKey]);

  const persistDraft = useCallback(() => {
    try {
      const values = getValues();
      const timestamp = new Date().toISOString();
      window.localStorage.setItem(
        storageKey,
        JSON.stringify({
          ...values,
          __lastSavedAt: timestamp,
        })
      );
      setLastSavedAt(new Date(timestamp));
    } catch (error) {
      console.warn('No se pudo guardar el borrador del formulario.', error);
    }
  }, [getValues, storageKey]);

  useEffect(() => {
    const autosaveId = window.setInterval(persistDraft, intervalMs);
    return () => window.clearInterval(autosaveId);
  }, [intervalMs, persistDraft]);

  const clearDraft = useCallback(() => {
    window.localStorage.removeItem(storageKey);
    setLastSavedAt(null);
  }, [storageKey]);

  return {
    lastSavedAt,
    persistDraft,
    clearDraft,
  };
};

export default useFormPersistence;

