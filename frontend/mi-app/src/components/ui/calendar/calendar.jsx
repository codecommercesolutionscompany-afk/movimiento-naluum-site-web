import { useState, useEffect, useRef } from 'react';
import { 
  Calendar,
  Clock,
  Users,
  MapPin,
  ChevronLeft,
  ChevronRight,
  X,
  Search,
  Filter,
  User,
  Eye
} from 'lucide-react';
import './calendar.scss';

const EventCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [viewMode, setViewMode] = useState('month');
  const [showEventDetail, setShowEventDetail] = useState(false);
  const modalRef = useRef(null);

  // Datos de eventos
  const events = {
    '2025-08-21': [
      { 
        id: 1, 
        title: 'Curso React Avanzado', 
        type: 'course', 
        time: '16:00',
        endTime: '19:00',
        instructor: 'Ana García',
        participants: 15,
        location: 'Aula 301',
        description: 'Aprende conceptos avanzados de React incluyendo hooks y optimización.'
      }
    ],
    '2025-08-22': [
      { 
        id: 2, 
        title: 'Workshop JavaScript', 
        type: 'course', 
        time: '09:00',
        endTime: '13:00',
        instructor: 'Carlos López',
        participants: 25,
        location: 'Lab 2',
        description: 'Domina las últimas características de JavaScript ES6+.'
      },
      { 
        id: 3, 
        title: 'Reunión Q4', 
        type: 'meeting', 
        time: '15:00',
        endTime: '17:00',
        participants: 12,
        location: 'Sala Ejecutiva',
        description: 'Planificación estratégica para el último trimestre.'
      }
    ],
    '2025-08-23': [
      { 
        id: 4, 
        title: 'Masterclass UI/UX', 
        type: 'course', 
        time: '10:00',
        endTime: '15:00',
        instructor: 'María Rodríguez',
        participants: 30,
        location: 'Auditorio',
        description: 'Diseño centrado en el usuario y mejores prácticas.'
      }
    ],
    '2025-08-25': [
      { 
        id: 5, 
        title: 'Tech Meetup', 
        type: 'event', 
        time: '18:00',
        endTime: '21:00',
        participants: 50,
        location: 'Centro de Eventos',
        description: 'Networking con profesionales de tecnología.'
      }
    ],
    '2025-08-26': [
      { 
        id: 6, 
        title: 'Python Data Science', 
        type: 'course', 
        time: '09:30',
        endTime: '15:30',
        instructor: 'Luis Martín',
        participants: 20,
        location: 'Lab 1',
        description: 'Análisis de datos y machine learning con Python.'
      }
    ],
    '2025-08-28': [
      { 
        id: 7, 
        title: 'Conferencia Tech 2025', 
        type: 'event', 
        time: '09:00',
        endTime: '17:00',
        participants: 200,
        location: 'Centro de Convenciones',
        description: 'El evento tecnológico más importante del año.'
      }
    ]
  };

  const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  const daysOfWeek = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

  // Cerrar modal al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShowEventDetail(false);
      }
    };

    if (showEventDetail) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showEventDetail]);

  // Obtener días del mes
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    let startingDayOfWeek = firstDay.getDay();
    startingDayOfWeek = startingDayOfWeek === 0 ? 6 : startingDayOfWeek - 1;

    const days = [];
    
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const prevDate = new Date(year, month, -i);
      days.push({
        date: prevDate,
        isCurrentMonth: false,
        day: prevDate.getDate()
      });
    }

    for (let day = 1; day <= daysInMonth; day++) {
      days.push({
        date: new Date(year, month, day),
        isCurrentMonth: true,
        day: day
      });
    }

    const remainingDays = 42 - days.length;
    for (let day = 1; day <= remainingDays; day++) {
      const nextDate = new Date(year, month + 1, day);
      days.push({
        date: nextDate,
        isCurrentMonth: false,
        day: nextDate.getDate()
      });
    }

    return days;
  };

  // Obtener eventos de una fecha
  const getEventsForDate = (date) => {
    const dateKey = date.toISOString().split('T')[0];
    let dayEvents = events[dateKey] || [];
    
    if (searchTerm) {
      dayEvents = dayEvents.filter(event => 
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (event.instructor && event.instructor.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (event.location && event.location.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    if (filterType !== 'all') {
      dayEvents = dayEvents.filter(event => event.type === filterType);
    }
    
    return dayEvents;
  };

  // Obtener eventos del mes
  const getMonthEvents = () => {
    const monthEvents = [];
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateEvents = getEventsForDate(date);
      dateEvents.forEach(event => {
        monthEvents.push({
          ...event,
          date: date,
          dateStr: date.toISOString().split('T')[0]
        });
      });
    }
    
    return monthEvents.sort((a, b) => a.date - b.date);
  };

  // Verificar si es hoy
  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  // Navegar entre meses
  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  // Ir a hoy
  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Manejar click en evento
  const handleEventClick = (event, date) => {
    setSelectedEvent({ ...event, date });
    setShowEventDetail(true);
  };

  // Obtener próximos eventos
  const getUpcomingEvents = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const upcoming = [];
    
    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() + i);
      const dateEvents = getEventsForDate(checkDate);
      
      dateEvents.forEach(event => {
        upcoming.push({
          ...event,
          date: checkDate,
          daysUntil: i
        });
      });
    }
    
    return upcoming.slice(0, 5);
  };

  // Obtener tipo de evento en español
  const getEventTypeLabel = (type) => {
    switch(type) {
      case 'course': return 'Curso';
      case 'meeting': return 'Reunión';
      case 'event': return 'Evento';
      default: return type;
    }
  };

  const days = getDaysInMonth(currentDate);
  const upcomingEvents = getUpcomingEvents();
  const monthEvents = getMonthEvents();

  return (
    <div className="calendar-view">
      <div className="calendar-view__container">
        {/* Header */}
        <div className="calendar-view__header">
          <div className="calendar-view__header-top">
            <div className="calendar-view__header-title">
              <Calendar size={28} />
              <div>
                <h1>Calendario de Eventos</h1>
                <p>{currentDate.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>
            </div>
            
            <div className="calendar-view__header-controls">
              <div className="calendar-view__search">
                <Search size={18} />
                <input
                  type="text"
                  placeholder="Buscar eventos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="calendar-view__filter">
                <Filter size={18} />
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                >
                  <option value="all">Todos</option>
                  <option value="course">Cursos</option>
                  <option value="meeting">Reuniones</option>
                  <option value="event">Eventos</option>
                </select>
              </div>

              <div className="calendar-view__view-toggle">
                <button
                  onClick={() => setViewMode('month')}
                  className={viewMode === 'month' ? 'active' : ''}
                >
                  Mes
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={viewMode === 'list' ? 'active' : ''}
                >
                  Lista
                </button>
              </div>
            </div>
          </div>

          <div className="calendar-view__header-nav">
            <button onClick={goToToday} className="calendar-view__today-btn">
              Hoy
            </button>
            
            <div className="calendar-view__month-nav">
              <button onClick={() => navigateMonth(-1)}>
                <ChevronLeft size={20} />
              </button>
              
              <h2>
                {months[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>
              
              <button onClick={() => navigateMonth(1)}>
                <ChevronRight size={20} />
              </button>
            </div>

            <div className="calendar-view__stats-mini">
              <span>{monthEvents.length} eventos este mes</span>
            </div>
          </div>
        </div>

        <div className="calendar-view__content">
          {/* Vista principal */}
          <div className="calendar-view__main">
            {viewMode === 'month' ? (
              <div className="calendar-view__calendar">
                <div className="calendar-view__weekdays">
                  {daysOfWeek.map(day => (
                    <div key={day} className="calendar-view__weekday">
                      <span className="desktop">{day}</span>
                      <span className="mobile">{day[0]}</span>
                    </div>
                  ))}
                </div>

                <div className="calendar-view__days">
                  {days.map((dayInfo, index) => {
                    const dayEvents = getEventsForDate(dayInfo.date);
                    const hasEvents = dayEvents.length > 0;
                    
                    return (
                      <div
                        key={index}
                        className={`
                          calendar-view__day
                          ${!dayInfo.isCurrentMonth ? 'inactive' : ''}
                          ${isToday(dayInfo.date) ? 'today' : ''}
                          ${hasEvents ? 'has-events' : ''}
                        `}
                      >
                        <div className="calendar-view__day-header">
                          <span className="calendar-view__day-number">
                            {dayInfo.day}
                          </span>
                          {isToday(dayInfo.date) && (
                            <span className="calendar-view__day-badge">HOY</span>
                          )}
                        </div>
                        
                        <div className="calendar-view__day-events">
                          {dayEvents.slice(0, 3).map(event => (
                            <div
                              key={event.id}
                              onClick={() => handleEventClick(event, dayInfo.date)}
                              className={`calendar-view__event calendar-view__event--${event.type}`}
                              title={`${event.title} - ${event.time}`}
                            >
                              <span className="calendar-view__event-time">{event.time}</span>
                              <span className="calendar-view__event-title">{event.title}</span>
                            </div>
                          ))}
                          {dayEvents.length > 3 && (
                            <div className="calendar-view__more">
                              +{dayEvents.length - 3} más
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="calendar-view__list">
                <h3>Eventos de {months[currentDate.getMonth()]} {currentDate.getFullYear()}</h3>
                
                {monthEvents.length > 0 ? (
                  <div className="calendar-view__list-items">
                    {monthEvents.map(event => (
                      <div
                        key={event.id}
                        onClick={() => handleEventClick(event, event.date)}
                        className="calendar-view__list-item"
                      >
                        <div className="calendar-view__list-item-date">
                          <span className="day">{event.date.getDate()}</span>
                          <span className="month">
                            {event.date.toLocaleDateString('es-ES', { month: 'short' })}
                          </span>
                        </div>
                        
                        <div className="calendar-view__list-item-content">
                          <h4>{event.title}</h4>
                          <div className="calendar-view__list-item-details">
                            <span><Clock size={14} /> {event.time} - {event.endTime}</span>
                            {event.location && <span><MapPin size={14} /> {event.location}</span>}
                            <span><Users size={14} /> {event.participants} participantes</span>
                          </div>
                        </div>
                        
                        <div className={`calendar-view__list-item-type calendar-view__list-item-type--${event.type}`}>
                          {getEventTypeLabel(event.type)}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="calendar-view__empty">
                    <Calendar size={48} />
                    <p>No hay eventos este mes</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Panel lateral */}
          <div className="calendar-view__sidebar">
            <div className="calendar-view__upcoming">
              <h3>Próximos eventos</h3>
              
              {upcomingEvents.length > 0 ? (
                <div className="calendar-view__upcoming-list">
                  {upcomingEvents.map(event => (
                    <div
                      key={event.id}
                      onClick={() => handleEventClick(event, event.date)}
                      className="calendar-view__upcoming-item"
                    >
                      <div className="calendar-view__upcoming-header">
                        <h4>{event.title}</h4>
                        {event.daysUntil === 0 && <span className="badge urgent">Hoy</span>}
                        {event.daysUntil === 1 && <span className="badge soon">Mañana</span>}
                      </div>
                      
                      <div className="calendar-view__upcoming-details">
                        <span><Calendar size={12} /> {event.date.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' })}</span>
                        <span><Clock size={12} /> {event.time}</span>
                        {event.location && <span><MapPin size={12} /> {event.location}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="calendar-view__upcoming-empty">No hay eventos próximos</p>
              )}
            </div>

            <div className="calendar-view__summary">
              <h3>Resumen del mes</h3>
              
              <div className="calendar-view__summary-stats">
                <div className="calendar-view__summary-item">
                  <span className="label">Total eventos</span>
                  <span className="value">{monthEvents.length}</span>
                </div>
                <div className="calendar-view__summary-item">
                  <span className="label">Cursos</span>
                  <span className="value primary">{monthEvents.filter(e => e.type === 'course').length}</span>
                </div>
                <div className="calendar-view__summary-item">
                  <span className="label">Reuniones</span>
                  <span className="value secondary">{monthEvents.filter(e => e.type === 'meeting').length}</span>
                </div>
                <div className="calendar-view__summary-item">
                  <span className="label">Eventos</span>
                  <span className="value accent">{monthEvents.filter(e => e.type === 'event').length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal de detalle */}
        {showEventDetail && selectedEvent && (
          <div className="calendar-view__modal">
            <div ref={modalRef} className="calendar-view__modal-content">
              <div className="calendar-view__modal-header">
                <div className={`calendar-view__modal-type calendar-view__modal-type--${selectedEvent.type}`}>
                  {getEventTypeLabel(selectedEvent.type)}
                </div>
                <button onClick={() => setShowEventDetail(false)} className="calendar-view__modal-close">
                  <X size={20} />
                </button>
              </div>

              <div className="calendar-view__modal-body">
                <h3>{selectedEvent.title}</h3>
                <p className="calendar-view__modal-date">
                  {selectedEvent.date.toLocaleDateString('es-ES', { 
                    weekday: 'long', 
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </p>

                {selectedEvent.description && (
                  <p className="calendar-view__modal-description">
                    {selectedEvent.description}
                  </p>
                )}

                <div className="calendar-view__modal-details">
                  <div className="calendar-view__modal-detail">
                    <Clock size={18} />
                    <span>{selectedEvent.time} - {selectedEvent.endTime}</span>
                  </div>
                  
                  {selectedEvent.location && (
                    <div className="calendar-view__modal-detail">
                      <MapPin size={18} />
                      <span>{selectedEvent.location}</span>
                    </div>
                  )}
                  
                  <div className="calendar-view__modal-detail">
                    <Users size={18} />
                    <span>{selectedEvent.participants} participantes confirmados</span>
                  </div>
                  
                  {selectedEvent.instructor && (
                    <div className="calendar-view__modal-detail">
                      <User size={18} />
                      <span>Instructor: {selectedEvent.instructor}</span>
                    </div>
                  )}
                </div>

                <div className="calendar-view__modal-actions">
                  <button className="calendar-view__modal-btn primary">
                    <Eye size={16} />
                    Ver más detalles
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventCalendar;
