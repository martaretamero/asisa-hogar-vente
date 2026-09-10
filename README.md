# ASISA Hogar VENTE - Reto Octubre 2026

Esta carpeta contiene la web completa lista para GitHub y Vercel.

## Subirla a GitHub

1. Descomprime el archivo ZIP.
2. Crea un repositorio nuevo y vacío en GitHub.
3. Pulsa **Add file > Upload files**.
4. Arrastra todos los elementos de esta carpeta: `index.html`, `styles.css`, `script.js`, `README.md` y la carpeta `assets`.
5. Pulsa **Commit changes**.

El archivo `index.html` debe verse en la raíz del repositorio, no dentro de otra carpeta.

## Publicarla en Vercel

1. Entra en Vercel y pulsa **Add New > Project**.
2. Importa el repositorio de GitHub.
3. En **Framework Preset**, selecciona **Other**.
4. Deja vacíos **Build Command** y **Output Directory**.
5. Pulsa **Deploy**.

## Activar el calendario real

La versión entregada está abierta permanentemente para la presentación al cliente.

Antes de lanzar la campaña, abre `script.js` y cambia:

```js
DEMO_MODE: true,
```

por:

```js
DEMO_MODE: false,
```

El juego quedará disponible desde el **1 de octubre de 2026 a las 08:00** hasta el **7 de octubre de 2026 a las 23:59**, hora peninsular española. Antes del inicio aparecerá el aviso de próxima apertura y, después del cierre, la pantalla de juego finalizado.

## Cambiar el enlace de Typeform

En la parte superior de `script.js`, sustituye:

```js
TYPEFORM_URL: "https://www.typeform.com/"
```

por el enlace definitivo. Se actualizarán todos los botones de **Canjear metas**.

## Respuestas configuradas

- Escena 1: primera opción.
- Escenas 2, 3, 4, 5 y 6: segunda opción.

Las respuestas se han configurado siguiendo las opciones resaltadas en verde en el documento facilitado.

## Editar textos y tamaños

Puedes editar los archivos directamente desde GitHub: abre el archivo y pulsa el icono del lápiz.

- Los textos de portada, instrucciones, botones y pantalla de cierre están en `index.html`.
- Las preguntas, opciones y mensajes de respuesta están en `script.js`, dentro del bloque `const scenes`.
- Los tamaños, colores y espacios están en `styles.css`.

En `styles.css`, los tamaños principales se encuentran en:

- `h1`: título “¿Cuánto sabes de hogar?”.
- `.section-heading h2`: título situado sobre la casa.
- `.scene-index`: números 01-06 de las tarjetas.
- `.instructions h2`: título del bloque inferior.
- `.scene-number`: texto “Escena 01” dentro de la ventana de preguntas.
- `.quiz-content h2`: título de la situación.
- `.question`: enunciado de la pregunta.

Los tamaños escritos con `clamp()` tienen tres valores: mínimo, adaptable y máximo. Puedes reducir el primer y el último valor para hacer el texto más pequeño manteniendo la adaptación a móvil.
