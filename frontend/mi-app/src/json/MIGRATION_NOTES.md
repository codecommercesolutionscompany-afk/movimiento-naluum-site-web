# Migración de contenido local

Fuente canónica desde esta migración: `frontend/mi-app/src/json`.

La copia remota de `movimientonaluum.org/json` se consultó únicamente para recuperar contenido antes de retirar el cargador remoto. La comparación se realizó el 14 de julio de 2026 sobre archivos remotos modificados el 4 de junio de 2026.

## Incorporaciones remotas

- `products.json`: se conservaron los tres productos locales y se fusionó en `yerba-mate-organica` su ficha `detail`, textos, datos vigentes e imágenes.
- `projects.json`: se conservaron los tres proyectos y se incorporaron las descripciones, galerías y logos remotos correspondientes al mismo nombre de proyecto.
- `servicios.json`: se conservaron los doce servicios locales. El PDC mantuvo su ID y recibió los campos remotos actuales, incluidos `detail` y `description_strong`. Se agregaron seis IDs remotos: `selva-adentro`, `voluntariado-residencial-madre-selva`, `festival-eco-de-la-tierra`, `camping-madre-selva`, `restaurante-madre-selva` y `visitas-guiadas-madre-selva`.
- `testimonios.json`: los testimonios remotos se fusionaron dentro de sus grupos por ID o identidad estable; los registros locales no presentes en remoto se conservaron.
- `messge.json`: se incorporó la versión remota vigente de los cinco mensajes.
- `blogs.json`: se conservó `como-sembrar-en-misiones-argentina` y se agregó `que-es-la-permacultura`.
- `FAQ.json`: se conservaron las 21 preguntas locales aprobadas y se agregaron las preguntas remotas `1`, `3`, `4`, `5` y `6`. Se excluyeron las preguntas remotas sobre certificación y envíos por duplicación semántica con `faq-12` y `faq-7`.
- `timerProps.json` y `eventos.json`: se incorporó la fecha vigente `2026-09-21` y su imagen local.
- `info_contacto.json`: se reemplazó el objeto genérico incompatible por el arreglo remoto de Global, Madre Selva y Na Lu'um.
- `listRouters.json`: se incorporaron las cinco diferencias remotas verificadas de imágenes y descripción.

No se restauraron productos de prueba, FAQ retiradas ni servicios históricos sin vigencia confirmada.

## Contenido transaccional excluido

Antes de guardar `servicios.json` se retiraron FAQ, secciones, textos y enlaces que indicaban pasarelas, formas de pago, comprobantes o pagos de reserva. El JSON canónico no contiene referencias a Stripe, Mercado Pago, PayPal, checkout, cuotas ni pasarelas.

## Imágenes

Las imágenes recuperadas se guardaron en `public/img` con carpetas y nombres descriptivos. Esto incluye galerías de Yerba, proyectos, servicios, testimonios, blog, navegación, mensajes y el evento 2026.

La imagen `gestion-agua-vida.jpg` se recuperó del blob histórico del commit `426e4d4`, porque el recurso remoto devolvía HTML.

Cuando el archivo original no respondió como imagen se utilizaron placeholders locales contextuales. Cada uno identifica el tipo y el contenido pendiente en los dos productos, siete servicios locales y ocho testimonios afectados.

Todas las rutas de imagen declaradas en los JSON son locales y fueron verificadas contra `public/img`.
