import { useRef, useState } from 'react';
import { useI18n } from '../i18n/I18nProvider.jsx';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIME_TYPES = ['application/pdf', 'image/jpeg', 'image/png'];

/**
 * Componente de carga y validación de documentos.
 * @param {Object} props
 * @param {Function} props.onValidate - Callback al enviar un documento válido.
 * @param {boolean} props.disabled - Deshabilita la interacción cuando es verdadero.
 * @returns {JSX.Element}
 */
const DocumentUpload = ({ onValidate, disabled }) => {
  const { t } = useI18n();
  const fileInputRef = useRef(null);
  const [metadata, setMetadata] = useState({ documentType: 'ID' });
  const [errorMessage, setErrorMessage] = useState(null);

  const handleMetadataChange = (event) => {
    const { name, value } = event.target;
    setMetadata((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const file = fileInputRef.current?.files?.[0];
    if (!file) {
      setErrorMessage(t('documents.errors.noFile'));
      return;
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      setErrorMessage(t('documents.errors.invalidType'));
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setErrorMessage(t('documents.errors.tooLarge'));
      return;
    }

    setErrorMessage(null);
    await onValidate(file, metadata);
    event.target.reset();
    setMetadata({ documentType: metadata.documentType || 'ID' });
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <div className="form__grid">
        <label className="form__field">
          <span>{t('documents.labels.file')}</span>
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            ref={fileInputRef}
            disabled={disabled}
            onChange={() => setErrorMessage(null)}
          />
        </label>

        <label className="form__field">
          <span>{t('documents.labels.type')}</span>
          <select
            name="documentType"
            value={metadata.documentType}
            onChange={handleMetadataChange}
            disabled={disabled}
          >
            <option value="ID">{t('form.documentTypes.ID')}</option>
            <option value="Passport">{t('form.documentTypes.Passport')}</option>
            <option value="DriverLicense">{t('form.documentTypes.DriverLicense')}</option>
          </select>
        </label>

        <label className="form__field">
          <span>{t('documents.labels.userId')}</span>
          <input
            type="text"
            name="userId"
            placeholder={t('form.placeholders.userId')}
            value={metadata.userId || ''}
            onChange={handleMetadataChange}
            disabled={disabled}
          />
        </label>
      </div>

      {errorMessage && (
        <div className="form__error" role="alert">
          {errorMessage}
        </div>
      )}

      <button className="button" type="submit" disabled={disabled}>
        {t('buttons.validateDocument')}
      </button>
    </form>
  );
};

export default DocumentUpload;

