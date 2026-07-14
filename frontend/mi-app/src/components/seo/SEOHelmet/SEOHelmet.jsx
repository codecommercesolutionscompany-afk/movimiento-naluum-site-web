// src/components/SEOHelmet.jsx
import { Helmet } from "react-helmet";

const SEOHelmet = ({
    // Título que se muestra en la pestaña del navegador y en Google
    title = "Mi Empresa - Soluciones digitales simples",

    // Descripción que aparece en los resultados de búsqueda
    description = "Somos una empresa que potencia pequeños negocios con soluciones tecnológicas accesibles y efectivas.",

    // Palabras clave separadas por coma (opcional, no muy relevante hoy)
    keywords = "tecnología, software, negocios, soluciones digitales, emprendimientos",

    // Autor de la página (tu nombre o el de la empresa)
    author = "Neyen Frandino",

    // URL completa de la página (importante para compartir en redes)
    url = "https://miempresa.com",

    // Imagen que se muestra cuando se comparte el sitio (debe estar alojada en la web)
    image = new URL('/img/blog/permacultura-portada.webp', window.location.origin).href,
    }) => {
        
    return (
        <Helmet>
        {/* 👇 Título de la pestaña */}
        <title>{title}</title>

        {/* 👇 Descripción para motores de búsqueda */}
        <meta name="description" content={description} />

        {/* 👇 Palabras clave (no tan relevantes para Google, pero pueden servir) */}
        <meta name="keywords" content={keywords} />

        {/* 👇 Autor del sitio o página */}
        <meta name="author" content={author} />

        {/* 👇 Escalado para móviles (siempre debe estar) */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        {/* 🌐 Open Graph - para mejorar cómo se ve al compartir en redes como Facebook o LinkedIn */}
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={url} />
        <meta property="og:image" content={image} />

        {/* 🐦 Twitter Card - para que se vea bien al compartir en Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={image} />
        </Helmet>
    );
};

export default SEOHelmet;
