export const EVENT_STATUSES = ['draft', 'open', 'closed', 'finished'];

export const events = [
  {
    slug: 'masterclass-evento-prueba',
    event_id: 'masterclass_evento_prueba_2026_07_01',
    event_name: 'Evento de prueba',
    event_type: 'masterclass',
    event_edition: '2026-07-01',
    event_date: '2026-07-01',
    event_time: '19:00',
    timezone: 'America/Argentina/Buenos_Aires',
    status: 'draft',
    eyebrow: 'Masterclass gratuita',
    headline: 'Evento de prueba',
    description: 'Configuracion temporal para validar la arquitectura.',
    image: '',
    facilitators: [],
    benefits: [],
    agenda: [],
    registration_url: '',
    related_service: 'none',
    cta_text: 'Reservar mi lugar',
    seo_title: 'Evento de prueba',
    seo_description: 'Evento temporal para validar la arquitectura.',
    faq: [],
  },
];

export const getPublicEvents = () => events.filter((event) => event.status !== 'draft');
