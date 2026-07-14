import { useEffect, useState, useContext, useCallback, lazy, Suspense } from "react";
import { Outlet, useParams, useLocation, useNavigate } from "react-router-dom";

// ------------------------------
// 📂 SEO y Meta
import SEOHelmet from "../../components/seo/SEOHelmet/SEOHelmet";

// ------------------------------
// 📂 Layout
import Header from "../../components/layout/header/header";

// ------------------------------
// 📂 Context
import { ContextJsonLoadContext } from "../../context/context_json_load/context_json_load";

// ------------------------------
// 📂 Lazy Loading - Mejora performance
const TestimonialCard = lazy(() => import("../../components/seccion/testimonial_card/testimonial_card"));
const CatalogFilter = lazy(() => import("../../components/seccion/catalog_filter/catalog_filter"));
const FAQ = lazy(() => import("../../components/seccion/FAQ/FAQ"));
const CtaImgCuentaRgresiva = lazy(() => import("../../components/seccion/cta_img_cuenta_rgresiva/cta_img_cuenta_rgresiva"));
const MessageFinal = lazy(() => import("../../components/seccion/message_final/message_final"));
const FadeInOnView = lazy(() => import('../../components/seccion/fadeInOnView/fadeInOnView'));
const Grid = lazy(() => import("../../components/seccion/grid/grid"));

// ------------------------------
// 📂 Styles
import "./products.router.scss";


// ------------------------------
// Loading Component
const LoadingSpinner = () => (
  <div className="loading-spinner" aria-label="Cargando contenido">
    <div className="spinner"></div>
  </div>
);

// ------------------------------
// SEO Configuration
const SEO_CONFIG = {
  products: {
    title: "Productos Ecológicos y Naturales | Naluum - Bienestar Sostenible",
    description: "Descubre nuestra selección de productos ecológicos: alimentos orgánicos, cosmética natural y artículos sostenibles. Cuida tu salud y el planeta con Naluum.",
    keywords: "productos ecológicos, alimentos orgánicos, cosmética natural, productos sostenibles, bienestar natural, productos eco-friendly, tienda ecológica, productos biodegradables",
    image: "/img/products/productos-portada.webp",
    type: "website",
    structuredData: {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": "Productos Ecológicos Naluum",
      "description": "Catálogo de productos naturales y sostenibles",
      "url": "https://naluum.com/productos",
      "mainEntity": {
        "@type": "ItemList",
        "numberOfItems": "10",
        "itemListElement": []
      }
    }
  },

  productDetail: (product) => ({
    title: `${product?.name || 'Producto'} - Naluum | Productos Ecológicos`,
    description: product?.description || "Producto natural y sostenible de alta calidad. Elaborado con ingredientes orgánicos certificados.",
    keywords: `${product?.category || ''}, producto ecológico, natural, orgánico, sostenible, ${product?.tags?.join(', ') || ''}`,
    image: product?.image || "/img/products/productos-portada.webp",
    type: "product",
    price: product?.price,
    availability: product?.stock > 0 ? "InStock" : "OutOfStock",
    structuredData: {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": product?.name,
      "description": product?.description,
      "image": product?.image,
      "brand": {
        "@type": "Brand",
        "name": "Naluum"
      },
      "offers": {
        "@type": "Offer",
        "url": `https://naluum.com/productos/${product?.id}`,
        "priceCurrency": "USD",
        "price": product?.price,
        "availability": product?.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
      }
    }
  })
};

// ------------------------------
// Animation Configuration
const getAnimationProps = () => {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  
  return {
    direction: "up",
    duration: prefersReducedMotion ? 0 : 800,
    delay: prefersReducedMotion ? 0 : 200,
    distance: prefersReducedMotion ? 0 : 30,
    easing: prefersReducedMotion ? 'linear' : "ease-out",
    speed: prefersReducedMotion ? 'instant' : "normal"
  };
};

// ------------------------------
// Timer Configuration
// const timerProps = {
//   img: '/img/shared/manos-plantines.webp',
//   titles: {
//     main: "",
//     subtitle: "Festival Eco de la Tierra",
//   },
//   text: " lorem ipsum dolor sit amet, con sectetuer adipiscing elit, sed diam nonummy nibh euis mod tincidunt ut laoreet dolore magna aliquam erat volutpat.",
//   buttonText: "Quiero participar",
//   timer: {
//     targetDate: "2025-09-23T18:59:59"
//   },
//   link : "/servicios/laboratorios-alimentacion-viva"
// };


// ------------------------------
// Main Component
const Products = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { products, FAQ: faqData, timerProps } = useContext(ContextJsonLoadContext);

  const animationProps = getAnimationProps();
  const isExactProductsRoute = location.pathname === "/productos" || location.pathname === "/productos/";

  // Handle product modal/navigation
  const handleOpenModal = useCallback((status, e, item) => {
    if (!item?.id) return;
    
    // Track event for analytics
    if (window.gtag) {
      window.gtag('event', 'view_item', {
        currency: 'USD',
        value: item.price,
        items: [{
          item_id: item.id,
          item_name: item.name,
          item_category: item.category,
          price: item.price
        }]
      });
    }
    
    navigate(`/productos/${item.id}`, { 
      state: { from: 'catalog' }
    });
  }, [navigate]);

  // Initialize visibility animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
      setIsLoading(false);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Filter products
  useEffect(() => {
    if (products?.length > 0) {
      setFilteredProducts(products);
      
      // Update structured data for SEO
      if (window.structuredData) {
        window.structuredData.update({
          numberOfItems: products.length,
          itemListElement: products.slice(0, 10).map((product, index) => ({
            "@type": "Product",
            "position": index + 1,
            "name": product.name,
            "description": product.description,
            "image": product.image
          }))
        });
      }
    }
  }, [products]);

  // Get selected product for SEO
  useEffect(() => {
    if (id && products) {
      const product = products.find(p => p.id === id);
      setSelectedProduct(product);
    }
  }, [id, products]);

  // Generate SEO data
  const getSEOData = () => {
    if (id && selectedProduct) {
      return SEO_CONFIG.productDetail(selectedProduct);
    }
    return SEO_CONFIG.products;
  };

  const seoData = getSEOData();


  return (
    <div className={`products__container ${isVisible ? "visible" : ""}`}>
      <SEOHelmet
        title={seoData.title}
        description={seoData.description}
        keywords={seoData.keywords}
        author="Naluum"
        url={`https://naluum.com${location.pathname}`}
        image={seoData.image}
        type={seoData.type}
        structuredData={seoData.structuredData}
        price={seoData.price}
        availability={seoData.availability}
      />
      {isExactProductsRoute && !id && (
        <>
          <Header>
            <header className="products--header__container" role="banner">
              <div className="products--header__img">
                <img 
                  src="/img/products/productos-portada.webp"
                  alt="Productos ecológicos y naturales de Naluum" 
                  loading="eager"
                  width="1920"
                  height="600"
                />
              </div>
 
              <div className="products--header__content">
                <div className="products--header__content--title">
                  <h1>
                    <span>NUESTROS PRODUCTOS</span>
                    <span className="sr-only">Ecológicos y Sostenibles</span>
                  </h1>
                </div>

                <div className="products--header__content--subtitle">
                  <p>Alimentos y productos que nacen de la tierra, pensados para cuidar tu bienestar y el del planeta.</p>
                </div>
              </div>

              <div className="scroll-indicator" aria-hidden="true">
                <div className="mouse"></div>
                {/* <span className="sr-only">Desplázate hacia abajo para ver más</span> */}
              </div>
            </header>
          </Header>

          <main className="products--content"  role="main">
            {/* Breadcrumb for SEO */}
 
            <section className="products--content--filters" aria-label="Filtros de productos">
              <style>
                {`
                  .products--content--filters::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background-image: url(/img/backgrounds/textura-papel.webp);
                    background-repeat: no-repeat;
                    background-size: cover;
                    background-position: bottom;
                    transform: rotate(180deg);
                    opacity: 1;
                    z-index: -1;
                  }
                `}
              </style>
              <h2 className="sr-only">Filtrar productos</h2>
              <Suspense fallback={<LoadingSpinner />}>
                <CatalogFilter
                  items={products}
                  onFilteredItems={setFilteredProducts}
                  ariaLabel="Filtros de catálogo de productos"
                />
              </Suspense>
            </section>

            <section className="products--content--grid" aria-label="Catálogo de productos">
              <style>
                {`
                  .products--content--grid::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background-image: url(/img/backgrounds/textura-papel.webp);
                    background-repeat: no-repeat;
                    background-size: cover;
                    background-position: bottom;
                    transform: rotate(180deg);
                    opacity: 1;
                    z-index: -1;
                  }
                `}
              </style>
              <h2 className="sr-only">Lista de productos disponibles</h2>
              <Suspense fallback={<LoadingSpinner />}>
                <Grid
                  items={filteredProducts}
                  gridType="products"
                  slice={10}
                  setIsOpen={handleOpenModal}
                  variant="minimal"
                  ariaLabel="Grid de productos ecológicos"
                />
              </Suspense>
              
              {filteredProducts.length === 0 && !isLoading && (
                <div className="no-products-message" role="status" aria-live="polite">
                  <p>No se encontraron productos con los filtros seleccionados.</p>
                </div>
              )}
            </section>

            <section className="products--content--testimonials" aria-label="Testimonios de clientes">
              <style>
                  {`
                    .products--content--testimonials::before {
                      content: '';
                      position: absolute;
                      inset: 0;
                      background-image: url(/img/backgrounds/textura-papel.webp);
                      background-repeat: no-repeat;
                      background-size: cover;
                      background-position: bottom;
                      transform: rotate(0deg);
                      opacity: 1;
                      z-index: -1;
                    }
                  `}
                </style>
              <h2 className="sr-only">Lo que dicen nuestros clientes</h2>
              <Suspense fallback={<LoadingSpinner />}>
                <TestimonialCard typeTestimonial="productos_madreSelva" />
              </Suspense>
            </section>

            <Suspense fallback={<LoadingSpinner />}>
              <FadeInOnView {...animationProps}>
                <section className="products--content--CTA-cuenta-rgresiva" aria-label="Evento próximo">
                  <h2 className="sr-only">Próximo evento especial</h2>
                  <CtaImgCuentaRgresiva {...timerProps} />
                </section>
              </FadeInOnView>
            </Suspense>

            <Suspense fallback={<LoadingSpinner />}>
              <FadeInOnView {...animationProps}>
                <section className="products--content--faq" aria-label="Preguntas frecuentes">
                  <h2 className="sr-only">Preguntas frecuentes sobre nuestros productos</h2>
                  <FAQ faqs={faqData} defaultCategory="productos" />
                </section>
              </FadeInOnView>
            </Suspense>

            <Suspense fallback={<LoadingSpinner />}>
              <FadeInOnView {...animationProps}>
                <footer className="products--content--message_final" role="contentinfo">
                  <MessageFinal indexMessage={4} />
                </footer>
              </FadeInOnView>
            </Suspense>
          </main>
        </>
      )}
      
      <Suspense fallback={<LoadingSpinner />}>
        <Outlet context={{ selectedProduct }} />
      </Suspense>
    </div>

  );
};



export default Products;
