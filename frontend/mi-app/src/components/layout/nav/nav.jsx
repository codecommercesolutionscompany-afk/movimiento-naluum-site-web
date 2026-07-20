import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { ChevronDown, Menu, X } from 'lucide-react';
import { ContextJsonLoadContext } from '../../../context/context_json_load/context_json_load_context';
import './nav.scss';

const MOBILE_BREAKPOINT = 1100;

const Nav = () => {
  const { listaRutas } = useContext(ContextJsonLoadContext);
  const menuItems = listaRutas?.['Movimiento Naluum'] || [];
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProjectsOpen, setIsProjectsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navRef = useRef(null);
  const projectsButtonRef = useRef(null);
  const projectsMenuRef = useRef(null);
  const menuButtonRef = useRef(null);
  const previousBodyOverflowRef = useRef('');
  const scrollFrameRef = useRef(null);

  const closeProjectsMenu = useCallback((restoreFocus = false) => {
    setIsProjectsOpen(false);
    if (restoreFocus) {
      window.requestAnimationFrame(() => projectsButtonRef.current?.focus());
    }
  }, []);

  const closeMobileMenu = useCallback((restoreFocus = false) => {
    setIsMobileMenuOpen(false);
    closeProjectsMenu(false);
    if (restoreFocus) {
      window.requestAnimationFrame(() => menuButtonRef.current?.focus());
    }
  }, [closeProjectsMenu]);

  useEffect(() => {
    const updateScrollState = () => {
      scrollFrameRef.current = null;
      const nextScrolledState = window.scrollY > 24;
      setIsScrolled((currentScrolledState) => (
        currentScrolledState === nextScrolledState ? currentScrolledState : nextScrolledState
      ));
    };

    const handleScroll = () => {
      if (scrollFrameRef.current === null) {
        scrollFrameRef.current = window.requestAnimationFrame(updateScrollState);
      }
    };

    updateScrollState();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollFrameRef.current !== null) window.cancelAnimationFrame(scrollFrameRef.current);
    };
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`);
    const updateViewport = () => {
      setIsMobile(mediaQuery.matches);
      if (!mediaQuery.matches) closeMobileMenu(false);
    };

    updateViewport();
    mediaQuery.addEventListener('change', updateViewport);
    return () => mediaQuery.removeEventListener('change', updateViewport);
  }, [closeMobileMenu]);

  useEffect(() => {
    closeMobileMenu(false);
  }, [location.pathname, closeMobileMenu]);

  useEffect(() => {
    if (!isMobileMenuOpen && !isProjectsOpen) return undefined;

    const handlePointerDown = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        closeMobileMenu(false);
        closeProjectsMenu(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        if (isProjectsOpen) closeProjectsMenu(true);
        else closeMobileMenu(true);
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMobileMenuOpen, isProjectsOpen, closeMobileMenu, closeProjectsMenu]);

  useEffect(() => {
    if (!isMobile || !isMobileMenuOpen) return undefined;

    previousBodyOverflowRef.current = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousBodyOverflowRef.current;
    };
  }, [isMobile, isMobileMenuOpen]);

  const isProjectsActive = location.pathname.startsWith('/proyectos');
  const isHomeRoute = location.pathname === '/';
  const isSolidHeader = !isHomeRoute || isScrolled || isMobileMenuOpen || isProjectsOpen;

  const handleProjectsButtonClick = () => {
    setIsProjectsOpen((isOpen) => !isOpen);
  };

  const handleProjectsButtonKeyDown = (event) => {
    if (event.key !== 'ArrowDown') return;

    event.preventDefault();
    setIsProjectsOpen(true);
    window.requestAnimationFrame(() => projectsMenuRef.current?.querySelector('a')?.focus());
  };

  const handleProjectsMenuKeyDown = (event) => {
    const projectLinks = Array.from(projectsMenuRef.current?.querySelectorAll('a') || []);
    const currentIndex = projectLinks.indexOf(document.activeElement);

    if (event.key === 'Escape') {
      event.preventDefault();
      closeProjectsMenu(true);
      return;
    }

    if (event.key === 'ArrowDown' && currentIndex >= 0) {
      event.preventDefault();
      projectLinks[(currentIndex + 1) % projectLinks.length]?.focus();
    }

    if (event.key === 'ArrowUp' && currentIndex >= 0) {
      event.preventDefault();
      projectLinks[(currentIndex - 1 + projectLinks.length) % projectLinks.length]?.focus();
    }
  };

  const renderProjectsMenu = (item) => (
    <ul
      id="projects-menu"
      ref={projectsMenuRef}
      className="nav__projects-menu"
      role="menu"
      aria-label="Proyectos"
      onKeyDown={handleProjectsMenuKeyDown}
    >
      {item.subItems?.map((subItem) => (
        <li key={subItem.path} role="none">
          <NavLink
            to={subItem.path}
            role="menuitem"
            className={({ isActive }) => `nav__projects-link${isActive ? ' nav__projects-link--active' : ''}`}
            onClick={() => closeMobileMenu(false)}
          >
            {subItem.name}
          </NavLink>
        </li>
      ))}
    </ul>
  );

  return (
    <header className={`site-header${isHomeRoute ? '' : ' site-header--internal'}`} ref={navRef}>
      <a className="skip-link" href="#main-content">Saltar al contenido</a>
      <nav className={`nav${isSolidHeader ? ' nav--solid' : ''}${isScrolled ? ' nav--scrolled' : ''}`} aria-label="Navegación principal">
        <div className="nav__content">
          <NavLink
            to="/"
            className="nav__logo-link"
            aria-label="Ir al inicio de Movimiento Naluum"
            onClick={() => closeMobileMenu(false)}
          >
            <img src="/img/branding/logo-naluum-transparente.svg" alt="Movimiento Naluum" />
          </NavLink>

          <button
            ref={menuButtonRef}
            className="nav__hamburger"
            type="button"
            aria-label={isMobileMenuOpen ? 'Cerrar menú principal' : 'Abrir menú principal'}
            aria-expanded={isMobileMenuOpen}
            aria-controls="primary-navigation"
            onClick={() => setIsMobileMenuOpen((isOpen) => !isOpen)}
          >
            {isMobileMenuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>

          <div
            id="primary-navigation"
            className={`nav__menu${isMobileMenuOpen ? ' nav__menu--open' : ''}`}
          >
            <ul className="nav__menu-list">
              {menuItems.map((item) => {
                const isProjects = item.type === 'dropdown';

                if (isProjects) {
                  return (
                    <li key={item.name} className="nav__menu-item nav__menu-item--projects">
                      <button
                        ref={projectsButtonRef}
                        type="button"
                        className={`nav__menu-link nav__projects-trigger${isProjectsActive ? ' nav__menu-link--active' : ''}`}
                        aria-haspopup="menu"
                        aria-expanded={isProjectsOpen}
                        aria-controls="projects-menu"
                        onClick={handleProjectsButtonClick}
                        onKeyDown={handleProjectsButtonKeyDown}
                      >
                        <span>Proyectos</span>
                        <ChevronDown className={isProjectsOpen ? 'nav__chevron nav__chevron--open' : 'nav__chevron'} aria-hidden="true" />
                      </button>
                      {isProjectsOpen ? renderProjectsMenu(item) : null}
                    </li>
                  );
                }

                return (
                  <li key={item.path} className="nav__menu-item">
                    <NavLink
                      to={item.path}
                      end={item.path === '/'}
                      className={({ isActive }) => `nav__menu-link${isActive ? ' nav__menu-link--active' : ''}`}
                      onClick={() => closeMobileMenu(false)}
                    >
                      {item.name}
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </nav>

      {isMobile && isMobileMenuOpen ? <div className="nav__overlay" aria-hidden="true" onClick={() => closeMobileMenu(true)} /> : null}
    </header>
  );
};

export default Nav;
