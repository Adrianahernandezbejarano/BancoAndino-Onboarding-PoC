/**
 * Componente de sección de información laboral.
 * @param {Object} props
 * @param {Function} props.register - Registro de campos de react-hook-form.
 * @param {Object} props.errors - Errores de validación presentes en la sección.
 * @param {Function} props.watch - Función watch de react-hook-form para escuchar cambios.
 * @param {boolean} props.disabled - Determina si los campos deben estar deshabilitados.
 * @returns {JSX.Element}
 */
import { useI18n } from '../i18n/I18nProvider.jsx'

const EmploymentDataSection = ({ register, errors, watch, disabled }) => {
  const { t } = useI18n()
  const employmentStatus = watch('employmentStatus')

  return (
    <fieldset className="fieldset">
      <legend className="fieldset__legend">{t('formSections.employment')}</legend>
      <div className="form__grid form__grid--two">
        <label className="form__field">
          <span>{t('form.labels.employmentStatus')}</span>
          <select
            {...register('employmentStatus')}
            disabled={disabled}
            aria-invalid={Boolean(errors.employmentStatus)}
            aria-describedby={
              errors.employmentStatus ? 'error-employmentStatus' : undefined
            }
          >
            <option value="employed">{t('form.employmentStatus.employed')}</option>
            <option value="selfEmployed">{t('form.employmentStatus.selfEmployed')}</option>
            <option value="student">{t('form.employmentStatus.student')}</option>
            <option value="unemployed">{t('form.employmentStatus.unemployed')}</option>
            <option value="retired">{t('form.employmentStatus.retired')}</option>
          </select>
          {errors.employmentStatus && (
            <small id="error-employmentStatus" className="form__error">
              {errors.employmentStatus.message}
            </small>
          )}
        </label>

        {(employmentStatus === 'employed' || employmentStatus === 'selfEmployed') && (
          <label className="form__field">
            <span>{t('form.labels.employerName')}</span>
            <input
              type="text"
              autoComplete="organization"
              {...register('employerName')}
              disabled={disabled}
              aria-invalid={Boolean(errors.employerName)}
              aria-describedby={
                errors.employerName ? 'error-employerName' : undefined
              }
            />
            {errors.employerName && (
              <small id="error-employerName" className="form__error">
                {errors.employerName.message}
              </small>
            )}
          </label>
        )}

        {employmentStatus === 'employed' && (
          <label className="form__field">
            <span>{t('form.labels.position')}</span>
            <input
              type="text"
              autoComplete="organization-title"
              {...register('position')}
              disabled={disabled}
              aria-invalid={Boolean(errors.position)}
              aria-describedby={errors.position ? 'error-position' : undefined}
            />
            {errors.position && (
              <small id="error-position" className="form__error">
                {errors.position.message}
              </small>
            )}
          </label>
        )}

        {employmentStatus === 'employed' && (
          <label className="form__field">
            <span>{t('form.labels.employmentStartDate')}</span>
            <input
              type="date"
              max={new Date().toISOString().split('T')[0]}
              {...register('employmentStartDate')}
              disabled={disabled}
              aria-invalid={Boolean(errors.employmentStartDate)}
              aria-describedby={
                errors.employmentStartDate ? 'error-employmentStartDate' : undefined
              }
            />
            {errors.employmentStartDate && (
              <small id="error-employmentStartDate" className="form__error">
                {errors.employmentStartDate.message}
              </small>
            )}
          </label>
        )}
      </div>
    </fieldset>
  );
};

export default EmploymentDataSection;

