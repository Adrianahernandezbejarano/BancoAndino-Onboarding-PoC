/**
 * Contenedor de sección con encabezado, cuerpo y acción opcional.
 * @param {Object} props
 * @param {string} props.title - Título de la sección.
 * @param {string} [props.description] - Descripción breve bajo el título.
 * @param {React.ReactNode} [props.action] - Elemento de acción en el pie de la tarjeta.
 * @param {React.ReactNode} props.children - Contenido principal de la sección.
 * @returns {JSX.Element}
 */
const SectionCard = ({ title, description, action, children }) => (
  <section className="section-card">
    <header className="section-card__header">
      <h2>{title}</h2>
      {description && <p>{description}</p>}
    </header>
    <div className="section-card__body">{children}</div>
    {action && <footer className="section-card__footer">{action}</footer>}
  </section>
);

export default SectionCard;

