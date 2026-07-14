import { useState, useCallback, useEffect, useRef, useContext } from 'react';
import { ContextJsonLoadContext } from '../../../context/context_json_load/context_json_load';
import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  User,
  Folder,
  Calendar,
  MessageCircle,
  Briefcase,
  ChevronDown,
  Menu,
  X,
  Store,
  Package,
  BookOpen,
  PenTool,
  Leaf,
  Star,
  Globe
} from 'lucide-react';

import './Nav.scss';

const iconMap = {
  HomeIcon: Home,
  UserIcon: User,
  FolderIcon: Folder,
  CalendarIcon: Calendar,
  MessageCircleIcon: MessageCircle,
  BriefcaseIcon: Briefcase,
  StoreIcon: Store,
  PackageIcon: Package,
  BookOpenIcon: BookOpen,
  PenToolIcon: PenTool,
  LeafIcon: Leaf,
  StarIcon: Star,
  GlobeIcon: Globe
};

const Nav = () => {
  const { listaRutas, projects } = useContext(ContextJsonLoadContext);
  const listRouters = listaRutas;
  
  if (!listRouters) return null;
  
  const [isScroll, setIsScroll] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  const navRef = useRef(null);
  const dropdownTimeoutRef = useRef(null);
  const location = useLocation();

  // Handle scroll
  useEffect(() => {
    const handleScroll = () => setIsScroll(window.scrollY > 0);
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Detect screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Close mobile menu on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target) && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
        setOpenDropdown(null);
      }
    };

    if (isMobile) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isMobile, isMobileMenuOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isMobile && isMobileMenuOpen ? 'hidden' : 'unset';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobile, isMobileMenuOpen]);

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (dropdownTimeoutRef.current) {
        clearTimeout(dropdownTimeoutRef.current);
      }
    };
  }, []);

  const isActiveRoute = useCallback((item) => {
    const currentPath = location.pathname;
    
    if (item.type === 'single') {
      return currentPath === item.path;
    }
    
    if (item.type === 'dropdown' || item.type === 'mega-dropdown') {
      if (item.subItems) {
        return item.subItems.some(subItem => currentPath === subItem.path);
      }
    }
    
    return false;
  }, [location.pathname]);

  const isActiveDropdownItem = useCallback((subItemPath) => {
    return location.pathname === subItemPath;
  }, [location.pathname]);

  const renderIcon = useCallback((iconName) => {
    const IconComponent = iconMap[iconName];
    return IconComponent ? <IconComponent size={isMobile ? 20 : 18} /> : null;
  }, [isMobile]);

  const handleMouseEnter = useCallback((index, item) => {
    const hasDropdown = item.type === 'dropdown' || item.type === 'mega-dropdown';
    
    if (hasDropdown && !isMobile) {
      if (dropdownTimeoutRef.current) {
        clearTimeout(dropdownTimeoutRef.current);
        dropdownTimeoutRef.current = null;
      }
      setOpenDropdown(index);
    }
  }, [isMobile]);

  const handleMouseLeave = useCallback(() => {
    if (!isMobile) {
      if (dropdownTimeoutRef.current) {
        clearTimeout(dropdownTimeoutRef.current);
      }
      
      dropdownTimeoutRef.current = setTimeout(() => {
        setOpenDropdown(null);
      }, 150);
    }
  }, [isMobile]);

  const handleDropdownMouseEnter = useCallback(() => {
    if (!isMobile && dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
      dropdownTimeoutRef.current = null;
    }
  }, [isMobile]);

  const handleDropdownMouseLeave = useCallback(() => {
    if (!isMobile) {
      dropdownTimeoutRef.current = setTimeout(() => {
        setOpenDropdown(null);
      }, 150);
    }
  }, [isMobile]);

  const handleClick = useCallback((e, item, index) => {
    const hasDropdown = item.type === 'dropdown' || item.type === 'mega-dropdown';
    
    if (hasDropdown) {
      e.preventDefault();
      if (isMobile) {
        setOpenDropdown(openDropdown === index ? null : index);
      }
    } else if (isMobile) {
      setIsMobileMenuOpen(false);
      setOpenDropdown(null);
    }
  }, [isMobile, openDropdown]);

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(prev => !prev);
    if (isMobileMenuOpen) {
      setOpenDropdown(null);
    }
  }, [isMobileMenuOpen]);

  const handleDropdownLinkClick = useCallback(() => {
    if (isMobile) {
      setIsMobileMenuOpen(false);
      setOpenDropdown(null);
    }
  }, [isMobile]);

  // Función para obtener la imagen del item
  const getItemImage = useCallback((item, subItem) => {
    // Si es el dropdown de proyectos y tenemos la data de proyectos
    if (item.name === 'Proyectos' && projects?.projects) {
      const matchedProject = projects.projects.find(p => p.name === subItem.name);
      if (matchedProject) {
        // Retornar la primera imagen o el logo
        return matchedProject.images?.[0] || matchedProject.logo || '/img/shared/personas-trabajando.webp';
      }
    }
    
    // Para otros dropdowns, usar la imagen del subItem
    return subItem.image || '/img/shared/personas-trabajando.webp';
  }, [projects]);

  // Función para obtener el logo (solo para proyectos)
  const getProjectLogo = useCallback((item, subItem) => {
    if (item.name === 'Proyectos' && projects?.projects) {
      const matchedProject = projects.projects.find(p => p.name === subItem.name);
      return matchedProject?.logo || null;
    }
    return null;
  }, [projects]);

  // Función para obtener la descripción del proyecto
  const getProjectDescription = useCallback((item, subItem) => {
    if (item.name === 'Proyectos' && projects?.projects) {
      const matchedProject = projects.projects.find(p => p.name === subItem.name);
      return matchedProject?.description || subItem.description || 'Descubre más sobre esta sección';
    }
    return subItem.description || 'Descubre más sobre esta sección';
  }, [projects]);

  // Función unificada para renderizar dropdowns
  const renderDropdown = useCallback((item) => {
    if (!item.subItems) return null;

    const isProjectDropdown = item.name === 'Proyectos';

    return (
      <ul 
        className={`nav__dropdown ${isProjectDropdown ? 'nav__dropdown--projects' : 'nav__dropdown--standard'}`}
        onMouseEnter={handleDropdownMouseEnter}
        onMouseLeave={handleDropdownMouseLeave}
      >
        {item.subItems.map((subItem, subIndex) => {
          // Para proyectos, verificar si existe en el contexto
          if (isProjectDropdown && projects?.projects) {
            const matchedProject = projects.projects.find(p => p.name === subItem.name);
            if (!matchedProject) return null; // Si no existe el proyecto, no mostrar
          }

          const isActive = isActiveDropdownItem(subItem.path);
          const backgroundImage = getItemImage(item, subItem);
          const projectLogo = getProjectLogo(item, subItem);
          const description = getProjectDescription(item, subItem);

          return (
            <li 
              key={subIndex} 
              className={`nav__dropdown-item ${isProjectDropdown ? '' : 'nav__dropdown-item--standard'} ${isActive ? 'nav__dropdown-item--active' : ''}`}
            >
              <Link 
                to={subItem.path} 
                className={`nav__dropdown-link ${isProjectDropdown ? '' : 'nav__dropdown-link--standard'} ${isActive ? 'nav__dropdown-link--active' : ''}`}
                onClick={handleDropdownLinkClick}
                aria-label={isProjectDropdown ? `Ver proyecto ${subItem.name}: ${description}` : subItem.name}
                aria-current={isActive ? "page" : undefined}
              >
                <div className={isProjectDropdown ? 'nav__project-images' : 'nav__standard-images'}>
                  <img
                    src={backgroundImage}
                    alt={subItem.name}
                    className={isProjectDropdown ? 'nav__project-background nav__project-background--active' : 'nav__standard-background'}
                    loading="lazy"
                    onError={(e) => {
                      e.target.src = '/img/shared/personas-trabajando.webp';
                    }}
                  />
                  {isProjectDropdown && projectLogo ? (
                    <img
                      src={projectLogo}
                      alt={`Logo de ${subItem.name}`}
                      className="nav__project-logo"
                      loading="lazy"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  ) : !isProjectDropdown ? (
                    <div className="nav__standard-overlay">
                      <h4 className="nav__standard-title">{subItem.name}</h4>
                    </div>
                  ) : null}
                </div>
                <span className="nav__dropdown-text">
                  {description}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    );
  }, [handleDropdownLinkClick, handleDropdownMouseEnter, handleDropdownMouseLeave, isActiveDropdownItem, getItemImage, getProjectLogo, getProjectDescription, projects]);

  const menuItems = (listRouters?.['Movimiento Naluum'] || []).filter(
    (item) => item.path !== '/carrito-de-compras'
  );

  return (
    <nav className="nav" ref={navRef}>
      <div className={`nav__content ${isScroll ? 'isScrollTrue alt-animation' : ''}`}>
        {/* Logo */}
        <div className="nav__logo">
          <Link 
            to="/movimiento-naluum/" 
            className="nav__logo-link"
            onClick={() => {
              if (isMobile && isMobileMenuOpen) {
                setIsMobileMenuOpen(false);
                setOpenDropdown(null);
              }
            }}
            aria-label="Ir al inicio - Movimiento Naluum"
          >
            <img 
              src="/img/branding/logo-naluum-transparente.svg"
              alt="Logo Movimiento Naluum"
              loading="lazy"
              onError={(e) => {
                e.target.src = '/img/branding/logo-naluum-transparente.svg';
              }}
            />
          </Link>
        </div>

        {/* Hamburger Button */}
        <button 
          className="nav__hamburger"
          onClick={toggleMobileMenu}
          aria-label={isMobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={isMobileMenuOpen}
          aria-controls="nav-menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Menu */}
        <div 
          className={`nav__menu ${isMobileMenuOpen ? 'nav__menu--open' : ''}`}
          id="nav-menu"
          role="navigation"
          aria-label="Navegación principal"
        >
          <ul className="nav__menu-list">
            {menuItems.map((item, index) => {
              const isActive = isActiveRoute(item);
              const hasDropdown = item.type === 'dropdown' || item.type === 'mega-dropdown';
              
              return (
                <li
                  key={index}
                  className={`nav__menu-item ${hasDropdown ? 'nav__menu-item--has-dropdown' : ''} ${isActive ? 'nav__menu-item--active' : ''}`}
                  onMouseEnter={() => handleMouseEnter(index, item)}
                  onMouseLeave={handleMouseLeave}
                >
                  <Link 
                    to={item.path || '#'}  
                    onClick={(e) => handleClick(e, item, index)} 
                    className={`nav__menu-link ${isActive ? 'nav__menu-link--active' : ''}`}
                    aria-haspopup={hasDropdown ? "true" : "false"}
                    aria-expanded={openDropdown === index ? "true" : "false"}
                    aria-current={location?.pathname === item.path ? "page" : undefined}
                  >
                    <span className="nav__menu-icon">
                      {renderIcon(item.icon)}
                    </span>
                    {item.name && <span className="nav__menu-text">{item.name}</span>}
                    {hasDropdown && (
                      <ChevronDown 
                        size={isMobile ? 16 : 14} 
                        className={`nav__menu-chevron ${openDropdown === index ? 'nav__menu-chevron--open' : ''}`}
                        aria-hidden="true"
                      />
                    )}
                  </Link>

                  {/* Dropdown */}
                  {hasDropdown && openDropdown === index && renderDropdown(item)}
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isMobile && isMobileMenuOpen && (
        <div 
          className="nav__overlay"
          onClick={() => {
            setIsMobileMenuOpen(false);
            setOpenDropdown(null);
          }}
          aria-hidden="true"
        />
      )}
    </nav>
  );
};

export default Nav;
