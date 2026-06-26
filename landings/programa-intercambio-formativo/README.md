# Programa Intercambio Formativo

Proyecto independiente Vite + React para la landing publica:

```text
https://movimientonaluum.org/programa-intercambio-formativo
```

Esta landing vive separada de `frontend/mi-app` para poder desplegarse en Hostinger sin hacer deploy de toda la app principal.

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
/programa-intercambio-formativo/
```

Si Vite usa el puerto 5173, abrir:

```text
http://localhost:5173/programa-intercambio-formativo/
```

## Compilar

Generar la carpeta final:

```bash
npm run build
```

El resultado queda en:

```text
landings/programa-intercambio-formativo/dist/
```

## Probar el build

```bash
npm run preview
```

Abrir la URL que indique Vite manteniendo la ruta `/programa-intercambio-formativo/`.

## Deploy en Hostinger

Subir el CONTENIDO de:

```text
landings/programa-intercambio-formativo/dist/
```

dentro de:

```text
public_html/programa-intercambio-formativo/
```

No subir la carpeta `dist` completa.

La estructura esperada en Hostinger es:

```text
public_html/
|-- index.html
|-- assets/
`-- programa-intercambio-formativo/
    |-- index.html
    `-- assets/
```
