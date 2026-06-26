import { Helmet } from 'react-helmet-async';

const SEOHelmet = ({
  title = 'Residencia Formativa por Rol | Madre Selva 2026',
  description = 'Convocatoria para personas con base previa que buscan aprendizaje aplicado, convivencia y aporte concreto en comunidad.',
  keywords = 'Madre Selva, Movimiento Na Luum, residencia formativa, intercambio formativo, Misiones',
  author = 'Madre Selva / Movimiento Na Luum',
  url = 'https://movimientonaluum.org/programa-intercambio-formativo',
  image = '',
}) => (
  <Helmet>
    <title>{title}</title>
    <meta name="description" content={description} />
    <meta name="keywords" content={keywords} />
    <meta name="author" content={author} />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="canonical" href={url} />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:type" content="website" />
    <meta property="og:url" content={url} />
    {image ? <meta property="og:image" content={image} /> : null}
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={title} />
    <meta name="twitter:description" content={description} />
    {image ? <meta name="twitter:image" content={image} /> : null}
  </Helmet>
);

export default SEOHelmet;
