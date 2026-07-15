import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import './catalog_filter.scss';

const CatalogFilter = ({ items = [], onFilteredItems }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [sortBy, setSortBy] = useState('featured');

  // Funcion para remover tildes
  const removeAccents = (str) => {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  };

  // Extraer categorias unicas
  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(items.map(item => item.badge))];
    return uniqueCategories;
  }, [items]);
 
  // Rangos de precio predefinidos
  const priceRanges = [
    { value: 'all', label: 'Todos los precios' },
    { value: '0-50', label: '$0 - $50' },
    { value: '50-100', label: '$50 - $100' },
    { value: '100-200', label: '$100 - $200' },
    { value: '200+', label: '$200+' }
  ];

  // Filtrar items
  const filteredItems = useMemo(() => {
    let filtered = items.filter(item => {
      // Filtro por busqueda (sin tildes)
      if (searchTerm) {
        const searchLower = removeAccents(searchTerm.toLowerCase());
        const titleMatch = removeAccents(item.title.toLowerCase()).includes(searchLower);
        const subtitleMatch = removeAccents(item.subtitle.toLowerCase()).includes(searchLower);
        const descriptionMatch = removeAccents(item.description.toLowerCase()).includes(searchLower);
        
        if (!titleMatch && !subtitleMatch && !descriptionMatch) {
          return false;
        }
      }

      // Filtro por categoria
      if (selectedCategory !== 'all' && item.badge !== selectedCategory) {
        return false;
      }

      // Filtro por rango de precio
      if (priceRange !== 'all') {
        const price = item.price;
        switch (priceRange) {
          case '0-50':
            if (price > 50) return false;
            break;
          case '50-100':
            if (price < 50 || price > 100) return false;
            break;
          case '100-200':
            if (price < 100 || price > 200) return false;
            break;
          case '200+':
            if (price < 200) return false;
            break;
        }
      }

      return true;
    });

    // Ordenar items
    switch (sortBy) {
      case 'priceLow':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'priceHigh':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'popular':
        filtered.sort((a, b) => (b.students || b.sold || 0) - (a.students || a.sold || 0));
        break;
      default:
        // featured - mantener orden original
        break;
    }

    return filtered;
  }, [items, searchTerm, selectedCategory, priceRange, sortBy]);

  // Notificar al componente padre cuando cambian los items filtrados
  React.useEffect(() => {
    if (onFilteredItems) {
      onFilteredItems(filteredItems);
    }
  }, [filteredItems, onFilteredItems]);

  const handleSearch = (e) => {
    e.preventDefault();
  };

  return (
    <div className="catalog-filter-simple">
      <div className="filter-container">
        <div className="filter-header">
          <h2>BUSCAR POR CATEGORIA</h2>
        </div>
        
        <form className="search-form" onSubmit={handleSearch}>
          <div className="search-wrapper">
            <button type="submit" className="search-button">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M17.5 17.5L13.5 13.5M15.5 9C15.5 12.5899 12.5899 15.5 9 15.5C5.41015 15.5 2.5 12.5899 2.5 9C2.5 5.41015 5.41015 2.5 9 2.5C12.5899 2.5 15.5 5.41015 15.5 9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
            <input
              type="text"
              placeholder="Buscar servicios..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </form>

        <div className="filter-options">
          <div className="filter-group">
            <label>Categoria</label>
            <select 
              value={selectedCategory} 
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="filter-select"
            >
              <option value="all">Todas las categorias</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Precio</label>
            <select 
              value={priceRange} 
              onChange={(e) => setPriceRange(e.target.value)}
              className="filter-select"
            >
              {priceRanges.map(range => (
                <option key={range.value} value={range.value}>{range.label}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Ordenar por</label>
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="filter-select"
            >
              <option value="featured">Destacados</option>
              <option value="priceLow">Precio: menor a mayor</option>
              <option value="priceHigh">Precio: mayor a menor</option>
              <option value="rating">Mejor calificados</option>
              <option value="popular">Mas populares</option>
            </select>
          </div>
        </div>

        <div className="filter-summary">
          <p>{filteredItems.length} servicios encontrados</p>
          {(searchTerm || selectedCategory !== 'all' || priceRange !== 'all') && (
            <button 
              className="clear-filters"
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
                setPriceRange('all');
                setSortBy('featured');
              }}
            >
              Limpiar filtros
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

CatalogFilter.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      badge: PropTypes.string,
      title: PropTypes.string,
      subtitle: PropTypes.string,
      description: PropTypes.string,
      price: PropTypes.number,
      rating: PropTypes.number,
      students: PropTypes.number,
      sold: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    })
  ),
  onFilteredItems: PropTypes.func,
};

export default CatalogFilter;
