import { useEffect, useRef } from 'react';

const DEFAULT_DELAY = 300;

/**
 * Hook para ejecutar validaciones con retardo controlado.
 * @param {Object} params
 * @param {Function} params.watch - Observa cambios de campos en el formulario.
 * @param {Function} params.trigger - Dispara validaciones específicas.
 * @param {number} [params.delay] - Tiempo de debounce en milisegundos.
 */
export const useDebouncedValidation = ({ watch, trigger, delay = DEFAULT_DELAY }) => {
  const timersRef = useRef({});

  useEffect(() => {
    const subscription = watch((_, { name }) => {
      if (!name) {
        return;
      }

      window.clearTimeout(timersRef.current[name]);
      timersRef.current[name] = window.setTimeout(() => {
        trigger(name);
      }, delay);
    });

    return () => {
      subscription.unsubscribe();
      Object.values(timersRef.current).forEach((timerId) => window.clearTimeout(timerId));
      timersRef.current = {};
    };
  }, [delay, trigger, watch]);
};

export default useDebouncedValidation;

