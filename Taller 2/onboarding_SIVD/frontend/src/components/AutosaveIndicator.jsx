/**
 * Indicador de guardado automático mostrando estado y acción manual.
 * @param {Object} props
 * @param {Date|null} props.lastSavedAt - Fecha del último guardado exitoso.
 * @param {Function} props.onManualSave - Callback para forzar guardado inmediato.
 * @param {boolean} props.isSaving - Indica si hay un guardado en progreso.
 * @returns {JSX.Element}
 */
import { useI18n } from '../i18n/I18nProvider.jsx'

const AutosaveIndicator = ({ lastSavedAt, onManualSave, isSaving }) => {
  const { t, locale } = useI18n()
  const formattedDate = lastSavedAt
    ? new Intl.DateTimeFormat(locale === 'es' ? 'es-ES' : 'en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }).format(lastSavedAt)
    : null

  return (
    <div className="autosave" role="status" aria-live="polite">
      <span>
        {isSaving && t('autosave.saving')}
        {!isSaving && formattedDate && t('autosave.lastSaved', { time: formattedDate })}
        {!isSaving && !formattedDate && t('autosave.help')}
      </span>
      <button type="button" className="link-button" onClick={onManualSave} disabled={isSaving}>
        {t('buttons.saveNow')}
      </button>
    </div>
  );
};

export default AutosaveIndicator;

