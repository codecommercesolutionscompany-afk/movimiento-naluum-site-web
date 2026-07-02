# Ecos de la Tierra

Landing independiente Vite + React para la base reutilizable del Festival Regenerativo de Madre Selva.

## Ruta publica prevista

```text
https://movimientonaluum.org/festival/
```

Vite esta configurado con base:

```text
/festival/
```

## Estado actual

La landing queda preparada en estado `draft`. No publica programa completo, formulario real ni condiciones internas no confirmadas.

## Desarrollo local

```bash
npm ci
npm run dev
```

Si Vite usa el puerto 5173, abrir:

```text
http://localhost:5173/festival/
```

## Build

```bash
npm run build
```

El resultado queda en:

```text
landings/festival/dist/
```

## Medicion

- Google Tag Manager: `GTM-5CM2KPSL`
- Microsoft Clarity: `wb5tt06imo`
- Sin GA4 directo
- Sin Meta Pixel directo

Los clics a WhatsApp se preparan en `dataLayer` como `cta_click` y `click_whatsapp`, sin PII.

### Contrato de eventos

`event_page_context` se envia una vez por carga con contexto de pagina, evento, estado `draft`, UTMs persistidas por sesion y `first_touch_timestamp`.

`cta_click` se envia en todos los clics a WhatsApp. Incluye URL y path de pagina, texto del CTA, URL base de WhatsApp sin el mensaje completo, ubicacion del CTA, tipo `whatsapp`, categoria tecnica de entrada cuando existe, servicio relacionado y UTMs disponibles.

`click_whatsapp` se deduplica por sesion, ubicacion del CTA y categoria de entrada. La clave conceptual es:

```text
festival_whatsapp_click_tracked:<cta_location>:<ticket_category|none>
```

Esto permite contar un primer clic por categoria o ubicacion sin inflar repeticiones consecutivas sobre la misma opcion.

El primer clic sobre un CTA genera una referencia tecnica corta y no personal por sesion y categoria:

```text
FEST-<CATEGORIA>-<CODIGO>
```

Ejemplos:

```text
FEST-PREV-8K2M
FEST-BOSQ-4N7Q
```

La referencia se guarda en `sessionStorage` con una clave conceptual como:

```text
festival_funnel_reference:<ticket_category>
festival_funnel_reference:general
```

Tambien viaja como `funnel_reference` en `cta_click` y `click_whatsapp`.

No se crean referencias para CTAs no utilizados.

### Atribucion y WhatsApp

Las UTMs quedan disponibles para GTM/GA4 mediante `dataLayer`, pero WhatsApp no garantiza transportar esa atribucion hacia el CRM.

El mensaje de WhatsApp no incluye UTMs ni parametros tecnicos. Cuando la persona consulta desde una categoria de entrada, el mensaje agrega solamente una linea legible:

```text
Entrada de interés: Preventa
```

La categoria llega de forma legible al chat, pero el registro final en CRM sera manual o mediante una integracion futura.

Abrir WhatsApp no equivale a lead confirmado. El evento de conversion de lead no debe dispararse desde la landing.

### Contrato operativo minimo para CRM manual

Cuando una conversacion real sea confirmada, registrar como minimo:

- `landing = festival`
- `servicio = Ecos de la Tierra`
- `referencia_de_embudo = funnel_reference enviado en el mensaje`
- `categoria_de_entrada`
- `canal_de_entrada = WhatsApp`
- `utm_source`, si esta disponible
- `utm_medium`, si esta disponible
- `utm_campaign`, si esta disponible
- `utm_content`, si esta disponible
- `utm_term`, si esta disponible
- `estado_comercial = Nuevo`
- `fecha_de_entrada`

La landing no crea el lead automaticamente. El lead se confirma cuando comienza una conversacion real.

El equipo debe copiar la referencia de embudo a Notion. La referencia no confirma por si sola un lead; solo ayuda a unir la atribucion web con el registro comercial. Una futura automatizacion podra usar esa referencia para vincular GTM/GA4 con CRM.
