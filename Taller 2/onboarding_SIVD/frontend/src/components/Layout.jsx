import { useI18n } from '../i18n/I18nProvider.jsx'

/**
 * Contenedor principal de la aplicación con encabezado y contenido.
 * @param {Object} props
 * @param {string} [props.brand] - Nombre comercial mostrado en el encabezado.
 * @param {string} [props.title] - Título principal de la vista.
 * @param {string} [props.subtitle] - Subtítulo descriptivo opcional.
 * @param {React.ReactNode} props.children - Contenido a renderizar en el layout.
 * @returns {JSX.Element}
 */
const Layout = ({ brand, title, subtitle, children }) => {
  const { t } = useI18n()
  const resolvedBrand = brand ?? t('brand.name')
  const resolvedTitle = title ?? t('layout.pageTitle')
  const resolvedSubtitle = subtitle ?? t('layout.pageSubtitle')

  return (
    <div className="layout">
      <div className="layout__brand">
        <span className="layout__brand-badge">{resolvedBrand}</span>
        <span className="layout__brand-divider" aria-hidden="true" />
        <p className="layout__brand-copy">{t('brand.tagline')}</p>
      </div>
      <header className="layout__header">
        <h1>{resolvedTitle}</h1>
        {resolvedSubtitle && <p>{resolvedSubtitle}</p>}
      </header>
      <main className="layout__content">{children}</main>
    </div>
  )
}

export default Layout

