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

Los clics a WhatsApp se preparan en `dataLayer` como `cta_click` y `click_whatsapp`, sin datos personales.
