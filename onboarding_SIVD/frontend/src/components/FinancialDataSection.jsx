import { useI18n } from '../i18n/I18nProvider.jsx'

const DECIMAL_ALLOWED_REGEX = /[0-9.,]/
const DIGIT_REGEX = /[0-9]/

const sanitizeDecimal = (value) => value.replace(/[^0-9.,]/g, '')
const sanitizeDigits = (value) => value.replace(/[^0-9]/g, '')

/**
 * Componente de sección de datos financieros.
 * @param {Object} props
 * @param {Function} props.register - Función para registrar campos en react-hook-form.
 * @param {Object} props.errors - Detalle de errores de validación para los campos financieros.
 * @param {boolean} props.disabled - Indica si los campos deben mostrarse deshabilitados.
 * @returns {JSX.Element}
 */
const FinancialDataSection = ({ register, errors, disabled }) => {
  const { t } = useI18n()
  const monthlyIncomeField = register('monthlyIncome')
  const monthlyExpensesField = register('monthlyExpenses')
  const accountLast4Field = register('accountNumberLast4')

  const handleBeforeInput = (event, allowDecimal) => {
    if (!event.data) {
      return
    }
    const regex = allowDecimal ? DECIMAL_ALLOWED_REGEX : DIGIT_REGEX
    if (!regex.test(event.data)) {
      event.preventDefault()
    }
  }

  const handleChange = (event, originalOnChange, sanitizer) => {
    const sanitized = sanitizer(event.target.value)
    if (sanitized !== event.target.value) {
      event.target.value = sanitized
    }
    originalOnChange(event)
  }

  return (
    <fieldset className="fieldset">
      <legend className="fieldset__legend">{t('formSections.financial')}</legend>
      <div className="form__grid form__grid--two">
        <label className="form__field">
          <span>{t('form.labels.monthlyIncome')}</span>
          <input
            type="text"
            inputMode="decimal"
            placeholder={t('form.placeholders.monthlyIncome')}
            {...monthlyIncomeField}
            onBeforeInput={(event) => handleBeforeInput(event, true)}
            onChange={(event) =>
              handleChange(event, monthlyIncomeField.onChange, sanitizeDecimal)
            }
            disabled={disabled}
            aria-invalid={Boolean(errors.monthlyIncome)}
            aria-describedby={errors.monthlyIncome ? 'error-monthlyIncome' : undefined}
          />
          {errors.monthlyIncome && (
            <small id="error-monthlyIncome" className="form__error">
              {errors.monthlyIncome.message}
            </small>
          )}
        </label>

        <label className="form__field">
          <span>{t('form.labels.monthlyExpenses')}</span>
          <input
            type="text"
            inputMode="decimal"
            placeholder={t('form.placeholders.monthlyExpenses')}
            {...monthlyExpensesField}
            onBeforeInput={(event) => handleBeforeInput(event, true)}
            onChange={(event) =>
              handleChange(event, monthlyExpensesField.onChange, sanitizeDecimal)
            }
            disabled={disabled}
            aria-invalid={Boolean(errors.monthlyExpenses)}
            aria-describedby={errors.monthlyExpenses ? 'error-monthlyExpenses' : undefined}
          />
          {errors.monthlyExpenses && (
            <small id="error-monthlyExpenses" className="form__error">
              {errors.monthlyExpenses.message}
            </small>
          )}
        </label>

        <label className="form__field">
          <span>{t('form.labels.bankName')}</span>
          <input
            type="text"
            autoComplete="organization"
            {...register('bankName')}
            disabled={disabled}
            aria-invalid={Boolean(errors.bankName)}
            aria-describedby={errors.bankName ? 'error-bankName' : undefined}
          />
          {errors.bankName && (
            <small id="error-bankName" className="form__error">
              {errors.bankName.message}
            </small>
          )}
        </label>

        <label className="form__field">
          <span>{t('form.labels.accountType')}</span>
          <select
            {...register('accountType')}
            disabled={disabled}
            aria-invalid={Boolean(errors.accountType)}
            aria-describedby={errors.accountType ? 'error-accountType' : undefined}
          >
            <option value="savings">{t('form.accountTypes.savings')}</option>
            <option value="checking">{t('form.accountTypes.checking')}</option>
          </select>
          {errors.accountType && (
            <small id="error-accountType" className="form__error">
              {errors.accountType.message}
            </small>
          )}
        </label>

        <label className="form__field">
          <span>{t('form.labels.accountNumberLast4')}</span>
          <input
            type="text"
            inputMode="numeric"
            maxLength={4}
            placeholder={t('form.placeholders.accountNumberLast4')}
            {...accountLast4Field}
            onBeforeInput={(event) => handleBeforeInput(event, false)}
            onChange={(event) =>
              handleChange(event, accountLast4Field.onChange, sanitizeDigits)
            }
            disabled={disabled}
            aria-invalid={Boolean(errors.accountNumberLast4)}
            aria-describedby={
              errors.accountNumberLast4 ? 'error-accountNumberLast4' : undefined
            }
          />
          {errors.accountNumberLast4 && (
            <small id="error-accountNumberLast4" className="form__error">
              {errors.accountNumberLast4.message}
            </small>
          )}
        </label>
      </div>
      <p className="fieldset__helper" role="note">
        {t('form.helper.financial')}
      </p>
    </fieldset>
  )
}

export default FinancialDataSection

