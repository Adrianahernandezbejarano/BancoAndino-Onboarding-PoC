import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import isEmail from 'validator/lib/isEmail';
import PersonalDataSection from './PersonalDataSection';
import ContactDataSection from './ContactDataSection';
import FinancialDataSection from './FinancialDataSection';
import EmploymentDataSection from './EmploymentDataSection';
import AutosaveIndicator from './AutosaveIndicator';
import useFormPersistence from '../hooks/useFormPersistence';
import useDebouncedValidation from '../hooks/useDebouncedValidation';
import { useI18n } from '../i18n/I18nProvider.jsx';

const E164_REGEX = /^\+?[1-9]\d{7,14}$/;
const FINANCIAL_REGEX = /^\d+([,.]\d{1,2})?$/;

const getMajorityDate = () => {
  const date = new Date();
  date.setFullYear(date.getFullYear() - 18);
  return date;
};

const createValidationSchema = (t) =>
  yup.object({
    firstName: yup
      .string()
      .trim()
      .min(2)
      .max(50)
      .required(t('form.errors.firstNameRequired')),
    middleName: yup.string().trim().max(50).nullable(),
    lastName: yup
      .string()
      .trim()
      .min(2)
      .max(50)
      .required(t('form.errors.lastNameRequired')),
    birthDate: yup
      .date()
      .max(getMajorityDate(), t('form.errors.birthDateAge'))
      .required(t('form.errors.birthDateRequired')),
    documentType: yup
      .string()
      .oneOf(['ID', 'Passport', 'DriverLicense'])
      .required(t('form.errors.documentTypeRequired')),
    documentNumber: yup
      .string()
      .trim()
      .required(t('form.errors.documentNumberRequired'))
      .when('documentType', (documentType, schema) => {
        switch (documentType) {
          case 'ID':
            return schema.matches(/^[0-9]{6,10}$/u, t('form.errors.documentNumberId'));
          case 'Passport':
            return schema.matches(/^[A-Z0-9]{6,9}$/iu, t('form.errors.documentNumberPassport'));
          case 'DriverLicense':
            return schema.matches(/^[A-Z0-9-]{5,15}$/iu, t('form.errors.documentNumberDriver'));
          default:
            return schema;
        }
      }),
    email: yup
      .string()
      .trim()
      .required(t('form.errors.emailRequired'))
      .test('is-rfc5322-email', t('form.errors.emailInvalid'), (value) =>
        value ? isEmail(value, { allow_utf8_local_part: true }) : false
      ),
    phone: yup
      .string()
      .trim()
      .matches(E164_REGEX, t('form.errors.phoneInvalid'))
      .required(t('form.errors.phoneRequired')),
    addressLine1: yup
      .string()
      .trim()
      .max(120)
      .required(t('form.errors.addressRequired')),
    addressLine2: yup.string().trim().max(120).nullable(),
    city: yup.string().trim().max(80).required(t('form.errors.cityRequired')),
    country: yup.string().trim().max(80).required(t('form.errors.countryRequired')),
    postalCode: yup.string().trim().max(15).nullable(),
    employmentStatus: yup
      .string()
      .oneOf(['employed', 'selfEmployed', 'student', 'unemployed', 'retired'])
      .required(t('form.errors.employmentStatusRequired')),
    employerName: yup
      .string()
      .trim()
      .max(100)
      .nullable()
      .when('employmentStatus', {
        is: (value) => ['employed', 'selfEmployed'].includes(value),
        then: (schema) => schema.required(t('form.errors.employerNameRequired')),
      }),
    position: yup
      .string()
      .trim()
      .max(80)
      .nullable()
      .when('employmentStatus', {
        is: 'employed',
        then: (schema) => schema.required(t('form.errors.positionRequired')),
      }),
    employmentStartDate: yup
      .date()
      .max(new Date(), t('form.errors.employmentDateInvalid'))
      .nullable()
      .when('employmentStatus', {
        is: 'employed',
        then: (schema) => schema.required(t('form.errors.employmentStartDateRequired')),
      }),
    monthlyIncome: yup
      .string()
      .required(t('form.errors.monthlyIncomeRequired'))
      .matches(FINANCIAL_REGEX, t('form.errors.monthlyIncomeInvalid'))
      .transform((value) => (value ? value.replace(/\s+/g, '') : value)),
    monthlyExpenses: yup
      .string()
      .required(t('form.errors.monthlyExpensesRequired'))
      .matches(FINANCIAL_REGEX, t('form.errors.monthlyExpensesInvalid'))
      .transform((value) => (value ? value.replace(/\s+/g, '') : value)),
    bankName: yup
      .string()
      .trim()
      .max(80)
      .required(t('form.errors.bankNameRequired')),
    accountType: yup
      .string()
      .oneOf(['savings', 'checking'])
      .required(t('form.errors.accountTypeRequired')),
    accountNumberLast4: yup
      .string()
      .matches(/^\d{4}$/u, t('form.errors.accountNumberLast4Invalid'))
      .required(t('form.errors.accountNumberLast4Required')),
    consent: yup
      .boolean()
      .oneOf([true], t('form.errors.consentRequired'))
      .required(t('form.errors.consentRequired')),
  });

const defaultValues = {
  firstName: '',
  middleName: '',
  lastName: '',
  birthDate: '',
  documentType: 'ID',
  documentNumber: '',
  email: '',
  phone: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  country: '',
  postalCode: '',
  employmentStatus: 'employed',
  employerName: '',
  position: '',
  employmentStartDate: '',
  monthlyIncome: '',
  monthlyExpenses: '',
  bankName: '',
  accountType: 'savings',
  accountNumberLast4: '',
  consent: false,
};

const STORAGE_KEY = 'digital-form-draft';

const sanitizeCurrency = (value) => value.replace(',', '.');

/**
 * Formulario digital integral con validación en tiempo real y autosave.
 * @param {Object} props
 * @param {Function} props.onValidate - Callback ejecutado al enviar el formulario.
 * @param {boolean} props.disabled - Bandera que deshabilita la interacción con los campos.
 * @returns {JSX.Element}
 */
const FormValidationForm = ({ onValidate, disabled }) => {
  const { t } = useI18n();
  const resolver = useMemo(() => yupResolver(createValidationSchema(t)), [t]);
  const [isSavingDraft, setIsSavingDraft] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    watch,
    trigger,
    formState: { errors },
  } = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues,
    resolver,
  });

  useDebouncedValidation({ watch, trigger, delay: 300 });

  const { lastSavedAt, persistDraft } = useFormPersistence({
    getValues,
    reset,
    storageKey: STORAGE_KEY,
  });

  const submitHandler = async (values) => {
    const payload = {
      ...values,
      monthlyIncome: sanitizeCurrency(values.monthlyIncome),
      monthlyExpenses: sanitizeCurrency(values.monthlyExpenses),
    };

    await onValidate(payload);
    persistDraft();
  };

  const handleManualSave = () => {
    setIsSavingDraft(true);
    persistDraft();
    window.setTimeout(() => setIsSavingDraft(false), 400);
  };

  return (
    <form className="form form--digital" onSubmit={handleSubmit(submitHandler)} noValidate>
      <AutosaveIndicator
        lastSavedAt={lastSavedAt}
        onManualSave={handleManualSave}
        isSaving={isSavingDraft}
      />

      <PersonalDataSection register={register} errors={errors} disabled={disabled} />
      <ContactDataSection register={register} errors={errors} disabled={disabled} />
      <EmploymentDataSection
        register={register}
        errors={errors}
        watch={watch}
        disabled={disabled}
      />
      <FinancialDataSection register={register} errors={errors} disabled={disabled} />

      <label className="form__checkbox">
        <input
          type="checkbox"
          {...register('consent')}
          aria-invalid={Boolean(errors.consent)}
          aria-describedby={errors.consent ? 'error-consent' : undefined}
          disabled={disabled}
        />
        <span>{t('form.labels.consent')}</span>
      </label>
      {errors.consent && (
        <small id="error-consent" className="form__error">
          {errors.consent.message}
        </small>
      )}

      <div className="form__actions">
        <button className="button" type="submit" disabled={disabled}>
          {t('buttons.validateForm')}
        </button>
      </div>
    </form>
  );
};

export default FormValidationForm;

