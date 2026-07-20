import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';

const SITE_URL = 'https://movimientonaluum.org/';
const DEFAULT_TITLE = 'Movimiento Naluum | Permacultura, comunidad y regeneración';
const DEFAULT_DESCRIPTION = 'Movimiento Naluum reúne personas, proyectos y territorios para aprender, compartir y regenerar desde la permacultura, con experiencias vivas en comunidad.';
const DEFAULT_IMAGE = `${SITE_URL}img/branding/movimiento-naluum-og.jpg`;

const SEOHelmet = ({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  keywords,
  author = 'Movimiento Naluum',
  url,
  canonical,
  robots = 'index, follow',
  image = DEFAULT_IMAGE,
  imageAlt = 'Movimiento Naluum: permacultura, comunidad y regeneración',
  imageWidth,
  imageHeight,
  type = 'website',
  locale = 'es_AR',
  siteName = 'Movimiento Naluum',
  jsonLd,
}) => (
  <Helmet>
    <title>{title}</title>
    <meta name="description" content={description} />
    {keywords ? <meta name="keywords" content={keywords} /> : null}
    <meta name="author" content={author} />
    <meta name="robots" content={robots} />
    {canonical ? <link rel="canonical" href={canonical} /> : null}

    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:type" content={type} />
    {url ? <meta property="og:url" content={url} /> : null}
    <meta property="og:site_name" content={siteName} />
    <meta property="og:locale" content={locale} />
    <meta property="og:image" content={image} />
    <meta property="og:image:alt" content={imageAlt} />
    {imageWidth ? <meta property="og:image:width" content={String(imageWidth)} /> : null}
    {imageHeight ? <meta property="og:image:height" content={String(imageHeight)} /> : null}

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={title} />
    <meta name="twitter:description" content={description} />
    <meta name="twitter:image" content={image} />
    <meta name="twitter:image:alt" content={imageAlt} />

    {jsonLd ? <script type="application/ld+json">{JSON.stringify(jsonLd)}</script> : null}
  </Helmet>
);

SEOHelmet.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  keywords: PropTypes.string,
  author: PropTypes.string,
  url: PropTypes.string,
  canonical: PropTypes.string,
  robots: PropTypes.string,
  image: PropTypes.string,
  imageAlt: PropTypes.string,
  imageWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  imageHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  type: PropTypes.string,
  locale: PropTypes.string,
  siteName: PropTypes.string,
  jsonLd: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};

export default SEOHelmet;
