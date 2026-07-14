import { useEffect, useMemo, useRef } from 'react';
import './map_location.scss';

const MapLocations = () => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  // 5 ubicaciones diferentes
  const locations = useMemo(() => [
    {
        id: 1,
        name: "Colonia Paraíso",
        city: "Colonia Paraíso, Misiones, Argentina",
        lat: -27.22605,
        lng: -54.10347,
        description: "Pequeña aldea en el departamento de Guaraní, Misiones"
    },
    {
      id: 2,
      name: "Estatua de la Libertad",
      city: "Nueva York, USA",
      lat: 40.6892,
      lng: -74.0445,
      description: "Símbolo de libertad y democracia"
    },
    {
      id: 3,
      name: "Cristo Redentor",
      city: "Río de Janeiro, Brasil",
      lat: -22.9519,
      lng: -43.2105,
      description: "Una de las siete maravillas del mundo moderno"
    },
    {
      id: 4,
      name: "Torre de Tokio",
      city: "Tokio, Japón",
      lat: 35.6586,
      lng: 139.7454,
      description: "Inspirada en la Torre Eiffel pero más alta"
    },
    {
      id: 5,
      name: "Opera House",
      city: "Sídney, Australia",
      lat: -33.8568,
      lng: 151.2153,
      description: "Arquitectura única reconocida mundialmente"
    }
  ], []);

  useEffect(() => {
    let leafletCSS;
    let script;

    // Cargar Leaflet dinámicamente
    const loadLeaflet = async () => {
      // Cargar CSS de Leaflet
      leafletCSS = document.createElement('link');
      leafletCSS.rel = 'stylesheet';
      leafletCSS.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(leafletCSS);

      // Cargar JS de Leaflet
      script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.async = true;
      
      script.onload = () => {
        initializeMap();
      };
      
      document.body.appendChild(script);

    };

    const initializeMap = () => {
      if (!window.L || mapInstanceRef.current) return;

      // Inicializar el mapa
      const map = window.L.map(mapRef.current).setView([20, 0], 2);
      mapInstanceRef.current = map;

      // Añadir capa de tiles
      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
      }).addTo(map);

      // Crear icono personalizado
      const customIcon = window.L.divIcon({
        className: 'custom-marker',
        html: '<div class="marker-pin"></div>',
        iconSize: [30, 42],
        iconAnchor: [15, 42],
        popupAnchor: [0, -42]
      });

      // Añadir marcadores para cada ubicación
      locations.forEach(location => {
        const marker = window.L.marker([location.lat, location.lng], {
          icon: customIcon
        }).addTo(map);

        // Añadir popup con información
        marker.bindPopup(`
          <div class="custom-popup">
            <h3>${location.name}</h3>
            <p class="city">${location.city}</p>
            <p class="description">${location.description}</p>
          </div>
        `);

        // Evento hover para mostrar nombre
        marker.on('mouseover', function() {
          this.openPopup();
        });
      });

      // Ajustar vista para mostrar todos los marcadores
      const group = new window.L.featureGroup(
        locations.map(loc => window.L.marker([loc.lat, loc.lng]))
      );
      map.fitBounds(group.getBounds().pad(0.1));
    };

    loadLeaflet();

    // Cleanup
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      if (script) {
        script.onload = null;
        script.remove();
      }
      leafletCSS?.remove();
    };
  }, [locations]);

  return (
    <div className="map-locations">
      <div className="map-locations__inner">
        <div className="map-locations__header">
          <h2 className="map-locations__title">Ubicaciones Destacadas</h2>
          <p className="map-locations__subtitle">Explora 5 lugares icónicos alrededor del mundo</p>
        </div>
        
        <div className="map-locations__container">
          <div ref={mapRef} className="map-locations__map"></div>
          
          <div className="map-locations__sidebar">
            <h3 className="map-locations__sidebar-title">Lugares</h3>
            <ul className="map-locations__list">
              {locations.map(location => (
                <li key={location.id} className="map-locations__item">
                  <div className="map-locations__item-marker">{location.id}</div>
                  <div className="map-locations__item-content">
                    <h4 className="map-locations__item-name">{location.name}</h4>
                    <p className="map-locations__item-city">{location.city}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="map-locations__footer">
          <p className="map-locations__info">
            Haz clic en los marcadores para ver más información
          </p>
        </div>
      </div>
    </div>
  );
};

export default MapLocations;
