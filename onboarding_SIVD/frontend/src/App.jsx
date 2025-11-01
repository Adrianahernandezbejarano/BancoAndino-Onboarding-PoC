import Layout from './components/Layout';
import SectionCard from './components/SectionCard';
import FormValidationForm from './components/FormValidationForm';
import DocumentUpload from './components/DocumentUpload';
import ValidationResult from './components/ValidationResult';
import { useValidation } from './hooks/useValidation';
import { useI18n } from './i18n/I18nProvider.jsx';
import './styles/app.css';

const App = () => {
  const { t } = useI18n();
  const {
    formResult,
    documentResult,
    isSubmitting,
    handleFormValidation,
    handleDocumentValidation,
  } = useValidation();

  return (
    <Layout>
      <div className="grid">
        <SectionCard
          title={t('sections.form.title')}
          description={t('sections.form.description')}
        >
          <FormValidationForm
            onValidate={handleFormValidation}
            disabled={isSubmitting}
          />
        </SectionCard>

        <SectionCard
          title={t('sections.document.title')}
          description={t('sections.document.description')}
        >
          <DocumentUpload
            onValidate={handleDocumentValidation}
            disabled={isSubmitting}
          />
        </SectionCard>

        <SectionCard
          title={t('sections.results.title')}
          description={t('sections.results.description')}
        >
          <div className="results">
            <ValidationResult title={t('sections.form.shortTitle')} result={formResult} />
            <ValidationResult
              title={t('sections.document.shortTitle')}
              result={documentResult}
            />
          </div>
        </SectionCard>
      </div>
    </Layout>
  );
};

export default App;
