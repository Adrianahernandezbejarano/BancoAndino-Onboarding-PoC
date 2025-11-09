import { useI18n } from '../i18n/I18nProvider.jsx'

/**
 * Componente de sección de datos de contacto.
 * @param {Object} props
 * @param {Function} props.register - Registro de campos proporcionado por react-hook-form.
 * @param {Object} props.errors - Errores asociados a los campos de contacto.
 * @param {boolean} props.disabled - Controla el estado disabled de los campos.
 * @returns {JSX.Element}
 */
const ContactDataSection = ({ register, errors, disabled }) => {
  const { t } = useI18n()

  return (
    <fieldset className="fieldset">
      <legend className="fieldset__legend">{t('formSections.contact')}</legend>
      <div className="form__grid form__grid--two">
        <label className="form__field">
          <span>{t('form.labels.email')}</span>
          <input
            type="email"
            autoComplete="email"
            {...register('email')}
            disabled={disabled}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? 'error-email' : undefined}
          />
          {errors.email && (
            <small id="error-email" className="form__error">
              {errors.email.message}
            </small>
          )}
        </label>

        <label className="form__field">
          <span>{t('form.labels.phone')}</span>
          <input
            type="tel"
            placeholder={t('form.placeholders.phone')}
            autoComplete="tel"
            inputMode="tel"
            {...register('phone')}
            disabled={disabled}
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={errors.phone ? 'error-phone' : undefined}
          />
          {errors.phone && (
            <small id="error-phone" className="form__error">
              {errors.phone.message}
            </small>
          )}
        </label>

        <label className="form__field">
          <span>{t('form.labels.addressLine1')}</span>
          <input
            type="text"
            autoComplete="address-line1"
            {...register('addressLine1')}
            disabled={disabled}
            aria-invalid={Boolean(errors.addressLine1)}
            aria-describedby={errors.addressLine1 ? 'error-addressLine1' : undefined}
          />
          {errors.addressLine1 && (
            <small id="error-addressLine1" className="form__error">
              {errors.addressLine1.message}
            </small>
          )}
        </label>

        <label className="form__field">
          <span>{t('form.labels.addressLine2')}</span>
          <input
            type="text"
            autoComplete="address-line2"
            {...register('addressLine2')}
            disabled={disabled}
            aria-invalid={Boolean(errors.addressLine2)}
            aria-describedby={errors.addressLine2 ? 'error-addressLine2' : undefined}
          />
          {errors.addressLine2 && (
            <small id="error-addressLine2" className="form__error">
              {errors.addressLine2.message}
            </small>
          )}
        </label>

        <label className="form__field">
          <span>{t('form.labels.city')}</span>
          <input
            type="text"
            autoComplete="address-level2"
            {...register('city')}
            disabled={disabled}
            aria-invalid={Boolean(errors.city)}
            aria-describedby={errors.city ? 'error-city' : undefined}
          />
          {errors.city && (
            <small id="error-city" className="form__error">
              {errors.city.message}
            </small>
          )}
        </label>

        <label className="form__field">
          <span>{t('form.labels.country')}</span>
          <input
            type="text"
            autoComplete="country"
            {...register('country')}
            disabled={disabled}
            aria-invalid={Boolean(errors.country)}
            aria-describedby={errors.country ? 'error-country' : undefined}
          />
          {errors.country && (
            <small id="error-country" className="form__error">
              {errors.country.message}
            </small>
          )}
        </label>

        <label className="form__field">
          <span>{t('form.labels.postalCode')}</span>
          <input
            type="text"
            autoComplete="postal-code"
            {...register('postalCode')}
            disabled={disabled}
            aria-invalid={Boolean(errors.postalCode)}
            aria-describedby={errors.postalCode ? 'error-postalCode' : undefined}
          />
          {errors.postalCode && (
            <small id="error-postalCode" className="form__error">
              {errors.postalCode.message}
            </small>
          )}
        </label>
      </div>
    </fieldset>
  )
}

export default ContactDataSection

