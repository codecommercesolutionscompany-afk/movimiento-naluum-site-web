import { Helmet } from 'react-helmet-async';

const SEOHelmet = ({
  title = 'Voluntariado en Madre Selva | Otoño–Invierno 2026',
  description = 'Viví una semana de voluntariado en Madre Selva, Misiones. Elegí una fecha disponible y avanzá con tu reserva por WhatsApp.',
  keywords = 'voluntariado madre selva, voluntariado otoño invierno, voluntariado en naturaleza, agrofloresta, huerta, vida comunitaria, aprendizaje práctico, voluntariado misiones',
  author = 'Madre Selva / Movimiento Na Luum',
  url = 'https://movimientonaluum.org/voluntariado-otono-invierno/',
  image = '',
  imageAlt = '',
  ogDescription = description,
  twitterDescription = description,
  robots = 'index, follow',
  siteName = 'Movimiento Naluum',
  locale = 'es_AR',
}) => (
  <Helmet>
    <title>{title}</title>
    <meta name="description" content={description} />
    <meta name="robots" content={robots} />
    <meta name="keywords" content={keywords} />
    <meta name="author" content={author} />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="canonical" href={url} />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={ogDescription} />
    <meta property="og:type" content="website" />
    <meta property="og:url" content={url} />
    <meta property="og:site_name" content={siteName} />
    <meta property="og:locale" content={locale} />
    {image ? (
      <>
        <meta property="og:image" content={image} />
        <meta property="og:image:secure_url" content={image} />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        {imageAlt ? <meta property="og:image:alt" content={imageAlt} /> : null}
      </>
    ) : null}
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={title} />
    <meta name="twitter:description" content={twitterDescription} />
    {image ? <meta name="twitter:image" content={image} /> : null}
    {image && imageAlt ? <meta name="twitter:image:alt" content={imageAlt} /> : null}
  </Helmet>
);

export default SEOHelmet;
