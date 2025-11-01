/**
 * Panel de resultados de validación para formularios o documentos.
 * @param {Object} props
 * @param {string} props.title - Encabezado del resultado mostrado.
 * @param {Object} props.result - Información de estado, mensaje y datos de la validación.
 * @returns {JSX.Element}
 */
import { useI18n } from '../i18n/I18nProvider.jsx'

const ValidationResult = ({ title, result }) => {
  const { t } = useI18n()

  if (!result.status) {
    return (
      <div className="result result--empty">
        <p>{t('sections.results.empty', { title: title.toLowerCase() })}</p>
      </div>
    )
  }

  const isSuccess = result.status === 'success'
  const statusLabel = t(`validation.status.${isSuccess ? 'success' : 'error'}`)

  return (
    <div className={`result ${isSuccess ? 'result--success' : 'result--error'}`}>
      <header className="result__header">
        <h3>{title}</h3>
        <span className="result__status">{statusLabel}</span>
      </header>
      {result.message && <p className="result__message">{result.message}</p>}

      {result.data && typeof result.data === 'object' && (
        <pre className="result__payload">{JSON.stringify(result.data, null, 2)}</pre>
      )}
    </div>
  )
}

export default ValidationResult;

