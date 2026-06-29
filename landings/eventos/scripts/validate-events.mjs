import { events, EVENT_STATUSES } from '../src/data/events.config.js';

const REQUIRED_STRING_FIELDS = [
  'slug',
  'event_id',
  'event_name',
  'event_type',
  'event_edition',
  'event_date',
  'event_time',
  'timezone',
  'status',
  'headline',
  'description',
  'related_service',
  'cta_text',
  'seo_title',
  'seo_description',
];

const ARRAY_FIELDS = ['facilitators', 'benefits', 'agenda', 'faq'];
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const eventIdPattern = /^[a-z0-9]+(?:_[a-z0-9]+)*$/;
const datePattern = /^\d{4}-\d{2}-\d{2}$/;
const timePattern = /^([01]\d|2[0-3]):[0-5]\d$/;

const errors = [];

const addError = (message) => errors.push(message);

const isValidDate = (value) => {
  if (!datePattern.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
};

const validateUnique = (field) => {
  const seen = new Set();

  events.forEach((event) => {
    const value = event[field];
    if (!value) return;

    if (seen.has(value)) {
      addError(`Duplicate ${field}: ${value}`);
    }

    seen.add(value);
  });
};

if (!Array.isArray(events)) {
  addError('events must be an array');
}

events.forEach((event, index) => {
  REQUIRED_STRING_FIELDS.forEach((field) => {
    if (typeof event[field] !== 'string' || event[field].trim() === '') {
      addError(`Event ${index}: ${field} is required and must be a non-empty string`);
    }
  });

  ARRAY_FIELDS.forEach((field) => {
    if (!Array.isArray(event[field])) {
      addError(`Event ${event.slug || index}: ${field} must be an array`);
    }
  });

  if (event.slug && !slugPattern.test(event.slug)) {
    addError(`Event ${event.slug}: slug must use kebab-case`);
  }

  if (event.event_id && !eventIdPattern.test(event.event_id)) {
    addError(`Event ${event.slug}: event_id must use snake_case`);
  }

  if (event.event_date && !isValidDate(event.event_date)) {
    addError(`Event ${event.slug}: event_date must be a valid ISO date`);
  }

  if (event.event_edition && !isValidDate(event.event_edition)) {
    addError(`Event ${event.slug}: event_edition must be a valid ISO date for this phase`);
  }

  if (event.event_time && !timePattern.test(event.event_time)) {
    addError(`Event ${event.slug}: event_time must use HH:mm`);
  }

  if (event.status && !EVENT_STATUSES.includes(event.status)) {
    addError(`Event ${event.slug}: invalid status ${event.status}`);
  }

  if (event.status === 'open') {
    try {
      new URL(event.registration_url);
    } catch {
      addError(`Event ${event.slug}: registration_url is required and must be valid when status is open`);
    }
  }

  if (event.registration_url) {
    try {
      new URL(event.registration_url);
    } catch {
      addError(`Event ${event.slug}: registration_url must be a valid URL when present`);
    }
  }

  event.facilitators?.forEach((facilitator, facilitatorIndex) => {
    if (!facilitator || typeof facilitator.name !== 'string' || facilitator.name.trim() === '') {
      addError(`Event ${event.slug}: facilitator ${facilitatorIndex} must include a name`);
    }
  });

  event.agenda?.forEach((item, agendaIndex) => {
    if (!item || typeof item.title !== 'string' || item.title.trim() === '') {
      addError(`Event ${event.slug}: agenda item ${agendaIndex} must include a title`);
    }
  });

  event.faq?.forEach((item, faqIndex) => {
    if (!item || typeof item.q !== 'string' || typeof item.a !== 'string' || !item.q.trim() || !item.a.trim()) {
      addError(`Event ${event.slug}: faq item ${faqIndex} must include q and a`);
    }
  });
});

validateUnique('slug');
validateUnique('event_id');
validateUnique('event_edition');

if (errors.length > 0) {
  console.error('Event configuration validation failed:');
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(`Event configuration valid: ${events.length} event(s) checked.`);
