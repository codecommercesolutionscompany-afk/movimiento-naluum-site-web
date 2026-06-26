# Selva Adentro

Proyecto independiente Vite + React para la landing pública:

```text
https://movimientonaluum.org/selva-adentro
```

Esta landing vive separada de `frontend/mi-app` y de las otras landings para poder desplegarse en Hostinger sin hacer deploy de toda la app principal.

## Fuente de contenido

El contenido editable está en:

```text
src/data/selvaAdentroContent.js
```

Los componentes consumen esa data para mantener textos, CTAs, FAQ, precios y bloques principales en un solo lugar.

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
/selva-adentro/
```

Si Vite usa el puerto 5173, abrir:

```text
http://localhost:5173/selva-adentro/
```

## Compilar

Generar la carpeta final:

```bash
npm run build
```

El resultado queda en:

```text
landings/selva-adentro/dist/
```

## Probar el build

```bash
npm run preview
```

Abrir la URL que indique Vite manteniendo la ruta `/selva-adentro/`.

## Deploy en Hostinger

Subir el contenido de:

```text
landings/selva-adentro/dist/
```

dentro de:

```text
public_html/selva-adentro/
```

No subir la carpeta `dist` completa.

La estructura esperada en Hostinger es:

```text
public_html/
|-- index.html
|-- assets/
`-- selva-adentro/
    |-- index.html
    |-- og-image.jpg
    |-- favicon.svg
    `-- assets/
```
