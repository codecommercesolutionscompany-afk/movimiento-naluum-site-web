import { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

// 📂 Layout
import Nav from './components/layout/nav/nav';
import Footer from './components/layout/footer/footer';

// 📂 UI / utilitarios
import ScrollToTop from './components/ui/scrollToTop/ScrollToTop';
// import ButtonBack from './components/ui/button_back/button_back';

// 📂 Tracking y métricas

// 📂 Páginas principales (Routers)
import Home from './routers/home/home';
const Services = lazy(() => import('./routers/services/services.router'));
const AboutMe = lazy(() => import('./routers/aboutMe/aboutMe.router'));
const Blog = lazy(() => import('./routers/blog/blog.router'));
const Contact = lazy(() => import('./routers/contact/contact.router'));
const Projects = lazy(() => import('./routers/projects/projects.router'));
const CalendarRouter = lazy(() => import('./routers/calendar.router/calendar.router'));
const Products = lazy(() => import('./routers/products/products.router'));


// 📂 Detalles (subpáginas de routers)
const ProductDetail = lazy(() => import('./routers/products/products_detail'));
const ServiceDetail = lazy(() => import('./routers/services/services_detail'));
const BlogDetail = lazy(() => import('./routers/blog/blog_detail'));
import NotFound from './routers/notFound/notFound';

import './App.scss';

const App = () => {
  const location = useLocation();
  
  const [currentPath, setCurrentPath] = useState(location.pathname);

  const transitioningRef = useRef(false);

  useEffect(() => {
    if (!document.startViewTransition || transitioningRef.current) {
      setCurrentPath(location.pathname);
      return;
    }

    transitioningRef.current = true;
    document.startViewTransition(() => {
      setCurrentPath(location.pathname);
    }).finished.finally(() => {
      transitioningRef.current = false;
    });
  }, [location.pathname]);



  return (
    <div className="App">
      <>
        <div className='App__nav'>
          <Nav />
        </div>

        {/* <div className='app__back-button'>
          <ButtonBack />
        </div> */}
      </>
  
      <ScrollToTop />

      <main id="view-root">
        <Suspense fallback={null}>
          <Routes location={{ ...location, pathname: currentPath }} key={currentPath}>
          <Route index path="/" element={<Home />} />
          <Route path="/proyectos/*" element={<Projects/>} />

          <Route path="/sobre-nosotros" element={<AboutMe />} />
          <Route path="/contacto" element={<Contact />} />
          <Route path="/calendario" element={<CalendarRouter />} />
          <Route path="/payment" element={<Navigate to="/productos" replace />} />
          <Route path="/checkout" element={<Navigate to="/productos" replace />} />
          <Route path="/carrito-de-compras" element={<Navigate to="/productos" replace />} />
          <Route path="/payment-status" element={<Navigate to="/" replace />} />
          <Route path="/movimiento-naluum" element={<Navigate to="/" replace />} />
          <Route path="/movimiento_naluum" element={<Navigate to="/" replace />} />
          <Route path="/nosotros" element={<Navigate to="/sobre-nosotros" replace />} />

          <Route path="/productos/*" element={<Products />}>
            <Route path=":id" element={<ProductDetail />} />
          </Route>
         
          <Route path="/servicios/*" element={<Services />}>
            <Route path=":id" element={<ServiceDetail />} />
          </Route>

          <Route path="/blog" element={<Blog />}>
            <Route path="/blog/:id" element={<BlogDetail />} />
          </Route>

          <Route path="*" element={<NotFound />} />

          </Routes>
        </Suspense>
      </main>

      <footer className='App__footer'>
        <Footer />
      </footer>
    </div>
  );
};
 
export default App;
