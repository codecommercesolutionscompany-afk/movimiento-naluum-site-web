import { Helmet } from 'react-helmet-async';

const SEOHelmet = ({ title, description, canonical, image }) => (
  <Helmet>
    <title>{title}</title>
    <meta name="description" content={description} />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    {canonical ? <link rel="canonical" href={canonical} /> : null}
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:type" content="website" />
    {canonical ? <meta property="og:url" content={canonical} /> : null}
    {image ? <meta property="og:image" content={image} /> : null}
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={title} />
    <meta name="twitter:description" content={description} />
    {image ? <meta name="twitter:image" content={image} /> : null}
  </Helmet>
);

export default SEOHelmet;
