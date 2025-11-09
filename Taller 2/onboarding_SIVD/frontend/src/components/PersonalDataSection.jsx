/**
 * Componente de sección de datos personales.
 * @param {Object} props
 * @param {Function} props.register - Método de react-hook-form para registrar campos.
 * @param {Object} props.errors - Mapa de errores de validación actual.
 * @param {boolean} props.disabled - Indica si los campos deben estar deshabilitados.
 * @returns {JSX.Element}
 */
import { useI18n } from '../i18n/I18nProvider.jsx'

const PersonalDataSection = ({ register, errors, disabled }) => {
  const { t } = useI18n()

  return (
    <fieldset className="fieldset">
      <legend className="fieldset__legend">{t('formSections.personal')}</legend>
      <div className="form__grid form__grid--two">
        <label className="form__field">
          <span>{t('form.labels.firstName')}</span>
          <input
            type="text"
            autoComplete="given-name"
            {...register('firstName')}
            disabled={disabled}
            aria-invalid={Boolean(errors.firstName)}
            aria-describedby={errors.firstName ? 'error-firstName' : undefined}
          />
          {errors.firstName && (
            <small id="error-firstName" className="form__error">
              {errors.firstName.message}
            </small>
          )}
        </label>

        <label className="form__field">
          <span>{t('form.labels.middleName')}</span>
          <input
            type="text"
            autoComplete="additional-name"
            {...register('middleName')}
            disabled={disabled}
            aria-invalid={Boolean(errors.middleName)}
            aria-describedby={errors.middleName ? 'error-middleName' : undefined}
          />
          {errors.middleName && (
            <small id="error-middleName" className="form__error">
              {errors.middleName.message}
            </small>
          )}
        </label>

        <label className="form__field">
          <span>{t('form.labels.lastName')}</span>
          <input
            type="text"
            autoComplete="family-name"
            {...register('lastName')}
            disabled={disabled}
            aria-invalid={Boolean(errors.lastName)}
            aria-describedby={errors.lastName ? 'error-lastName' : undefined}
          />
          {errors.lastName && (
            <small id="error-lastName" className="form__error">
              {errors.lastName.message}
            </small>
          )}
        </label>

        <label className="form__field">
          <span>{t('form.labels.birthDate')}</span>
          <input
            type="date"
            max={new Date().toISOString().split('T')[0]}
            {...register('birthDate')}
            disabled={disabled}
            aria-invalid={Boolean(errors.birthDate)}
            aria-describedby={errors.birthDate ? 'error-birthDate' : undefined}
          />
          {errors.birthDate && (
            <small id="error-birthDate" className="form__error">
              {errors.birthDate.message}
            </small>
          )}
        </label>

        <label className="form__field">
          <span>{t('form.labels.documentType')}</span>
          <select
            {...register('documentType')}
            disabled={disabled}
            aria-invalid={Boolean(errors.documentType)}
            aria-describedby={errors.documentType ? 'error-documentType' : undefined}
          >
            <option value="ID">{t('form.documentTypes.ID')}</option>
            <option value="Passport">{t('form.documentTypes.Passport')}</option>
            <option value="DriverLicense">{t('form.documentTypes.DriverLicense')}</option>
          </select>
          {errors.documentType && (
            <small id="error-documentType" className="form__error">
              {errors.documentType.message}
            </small>
          )}
        </label>

        <label className="form__field">
          <span>{t('form.labels.documentNumber')}</span>
          <input
            type="text"
            autoComplete="off"
            {...register('documentNumber')}
            disabled={disabled}
            aria-invalid={Boolean(errors.documentNumber)}
            aria-describedby={errors.documentNumber ? 'error-documentNumber' : undefined}
          />
          {errors.documentNumber && (
            <small id="error-documentNumber" className="form__error">
              {errors.documentNumber.message}
            </small>
          )}
        </label>
      </div>
    </fieldset>
  )
}

export default PersonalDataSection

