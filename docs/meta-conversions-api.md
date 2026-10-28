# API de conversiones de Meta en CodeBalance

La página envía `PageView`, `Contact` y `Lead` mediante el píxel del navegador y `POST /api/meta/conversions`. Ambas versiones de cada evento comparten `event_name` y `event_id`, para que Meta pueda deduplicarlas.

El envío requiere aceptar el aviso de cookies. La API también funciona si el script externo del píxel está bloqueado, siempre que el visitante haya aceptado las cookies y la petición al propio sitio pueda completarse.

## 1. Generar el token en Meta

1. Abrir el Administrador de eventos y seleccionar el mismo píxel que ya recibe eventos de CodeBalance.
2. En Configuración, buscar API de conversiones y la integración directa.
3. Seleccionar «Configurar sin Dataset Quality API» para esta integración y pulsar «Generar token de acceso». Dataset Quality API agrega consultas de métricas que este proyecto no utiliza.
4. Guardar el token como un secreto. No pegarlo en el código ni subirlo al repositorio.
5. En «Probar eventos», copiar el código de eventos de prueba.

## 2. Configurar Vercel

En el proyecto de CodeBalance, abrir Settings → Environment Variables.

| Variable | Valor | Entorno |
| --- | --- | --- |
| `NEXT_PUBLIC_META_PIXEL_ID` | ID numérico del píxel actual; conservar el existente | Production |
| `META_CONVERSIONS_API_ACCESS_TOKEN` | Token generado para ese mismo píxel | Production; Sensitive |
| `META_CONVERSIONS_API_TEST_EVENT_CODE` | Código de «Probar eventos»; solo durante la validación | Production |
| `META_GRAPH_API_VERSION` | Opcional; el código usa `v26.0` si se omite | Production |

El token no debe llevar el prefijo `NEXT_PUBLIC_`: se usa únicamente en el servidor. No hace falta crear un segundo píxel ni contratar otro servidor para esta integración.

Publicar los cambios de código y crear un nuevo deployment después de guardar las variables. Cambiar variables en Vercel no modifica los deployments anteriores.

Para probar en Preview, configurar ese entorno con un píxel de prueba o con `META_CONVERSIONS_API_TEST_EVENT_CODE`. No agregar el token de producción a todos los previews sin un código de prueba.

## 3. Verificar la recepción real

1. Mantener abierta la pestaña «Probar eventos» del píxel correcto.
2. Abrir el deployment con las variables configuradas y aceptar las cookies. Debe llegar `PageView` desde el servidor.
3. Pulsar un botón de WhatsApp o correo. Deben llegar `Contact` y `Lead` desde el servidor.
4. En las herramientas del navegador, la petición `POST /api/meta/conversions` debe responder `200` con `events_received: 1` para la visita y `events_received: 2` para el clic de contacto.
5. Comparar el identificador de cada evento del navegador y del servidor en Meta. Deben coincidir para que se dedupliquen; la llegada de dos versiones no debe contarse como dos conversiones.
6. Comprobar que no se envía ninguna petición a la API antes de aceptar las cookies. Al probar con el script del píxel bloqueado, la API debe seguir enviando los eventos después del consentimiento.
7. Cuando termine la validación, eliminar `META_CONVERSIONS_API_TEST_EVENT_CODE` de Production y crear otro deployment para comenzar el envío normal.

## Qué se mide y qué se envía

`Contact` y `Lead` conservan el comportamiento existente: ambos indican un clic hacia WhatsApp o correo. No confirman que la persona haya enviado un mensaje o se haya convertido en cliente. Para medir contactos confirmados se necesitaría una señal de WhatsApp Business, un formulario confirmado o un CRM.

Se envían el nombre y el identificador del evento, la hora, la URL sin parámetros ni fragmentos, los metadatos de contacto ya existentes, la IP y el navegador de la petición y, cuando están disponibles, `_fbp` y `_fbc`. Si falta `_fbc` o pertenece a un clic anterior, se utiliza únicamente un `fbclid` real de la URL de entrada; si corresponde al mismo clic se conserva la fecha de la cookie. No se inventan correos, teléfonos ni identificadores de atribución; la página no recoge datos de contacto del visitante.

El servidor admite únicamente los tres eventos conocidos, valida el origen y el consentimiento y limita el tamaño de la petición. No expone el token ni las respuestas completas de error de Meta. La IP y el navegador se obtienen de la petición recibida en Vercel; el origen y el consentimiento son controles para el flujo del sitio, no autenticación contra clientes automatizados.

## Diagnóstico

| Respuesta | Significado |
| --- | --- |
| `200` | Meta confirmó la recepción de todos los eventos del lote. No confirma por sí sola atribución ni deduplicación. |
| `204` | Falta el token o el ID del píxel en ese deployment; no se llamó a Meta. |
| `400`, `403`, `413`, `415` | La petición no cumple el contrato del sitio. |
| `502` | Meta rechazó el envío o falló la conexión; revisar credenciales, permisos, ID del píxel y los logs de Vercel. |
| `503` | El formato del ID del píxel o de la versión de API configurada es inválido. |

El envío es inmediato y no bloquea la apertura de WhatsApp o correo. No incorpora una cola persistente de reintentos; una caída de red puede perder eventos. Las verificaciones locales sin credenciales no sustituyen la comprobación en «Probar eventos».

## Referencias

- [Meta: empezar con Conversions API](https://developers.facebook.com/docs/marketing-api/conversions-api/get-started)
- [Meta: deduplicar eventos del píxel y del servidor](https://developers.facebook.com/docs/marketing-api/conversions-api/deduplicate-pixel-and-server-events)
- [SDK oficial de Meta y parámetros de Conversions API](https://github.com/facebook/facebook-nodejs-business-sdk#conversions-api)
- [Vercel: configurar variables de entorno y crear un nuevo deployment](https://vercel.com/kb/guide/how-to-add-vercel-environment-variables)
