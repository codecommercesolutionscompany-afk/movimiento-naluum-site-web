# PDC

Proyecto independiente Vite + React para la landing publica:

```text
https://movimientonaluum.org/pdc
```

Esta landing vive separada de `frontend/mi-app` para poder desplegarse en Hostinger sin hacer deploy de toda la app principal.

## Fuente de contenido

El contenido se consume desde:

```text
src/data/pdc_landing_content_v2_reforzado.json
```

Los campos dinamicos se resuelven desde `settings`. El CTA principal usa `settings.whatsappUrl`.

## Desarrollo local

Instalar dependencias:

```bash
npm install
```

Levantar el servidor local:

```bash
npm run dev
```

Vite sirve la landing con base:

```text
/pdc/
```

Si Vite usa el puerto 5173, abrir:

```text
http://localhost:5173/pdc/
```

## Compilar

Generar la carpeta final:

```bash
npm run build
```

El resultado queda en:

```text
landings/pdc/dist/
```

## Probar el build

```bash
npm run preview
```

Abrir la URL que indique Vite manteniendo la ruta `/pdc/`.

## Deploy en Hostinger

Subir el CONTENIDO de:

```text
landings/pdc/dist/
```

dentro de:

```text
public_html/pdc/
```

No subir la carpeta `dist` completa.

La estructura esperada en Hostinger es:

```text
public_html/
|-- index.html
|-- assets/
`-- pdc/
    |-- index.html
    `-- assets/
```
