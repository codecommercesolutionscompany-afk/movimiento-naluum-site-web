import { Helmet } from 'react-helmet-async';

const SEOHelmet = ({ content }) => (
  <Helmet>
    <title>{content.title}</title>
    <meta name="description" content={content.description} />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="canonical" href={content.canonical} />
    <meta property="og:title" content={content.ogTitle || content.title} />
    <meta property="og:description" content={content.ogDescription || content.description} />
    <meta property="og:type" content="website" />
    <meta property="og:url" content={content.canonical} />
    <meta property="og:image" content={content.ogImage} />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={content.ogTitle || content.title} />
    <meta name="twitter:description" content={content.ogDescription || content.description} />
    <meta name="twitter:image" content={content.ogImage} />
  </Helmet>
);

export default SEOHelmet;
