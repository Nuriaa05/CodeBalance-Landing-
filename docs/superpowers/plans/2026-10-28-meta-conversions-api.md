# Integración de Meta Conversions API

**Objetivo:** enviar los eventos actuales de CodeBalance desde Next.js en Vercel, con el mismo identificador que el píxel, después de aceptar las cookies.

**Arquitectura:** el navegador envía lotes pequeños a `POST /api/meta/conversions`. El servidor valida el origen, el consentimiento y los eventos; agrega la IP, el navegador y las cookies de atribución disponibles; y llama a Meta con un token privado. Se usa `fetch` nativo, sin nuevas dependencias.

**Restricciones:** UTF-8; conservar los eventos `PageView`, `Contact` y `Lead` y el comportamiento visual; no enviar eventos antes del consentimiento; no exponer el token; no cambiar las acciones de WhatsApp y correo. `Lead` sigue indicando un clic de contacto, no una conversación confirmada.

## Implementación y verificación

- [x] Ampliar `lib/meta-pixel.test.mjs` para comprobar el consentimiento, los identificadores compartidos, el envío cuando el píxel está bloqueado y los fallos de red.
- [x] Agregar `lib/meta-conversions.test.mjs` para comprobar los lotes enviados a Meta, los datos de atribución, el modo de prueba y el rechazo de peticiones inválidas.
- [x] Ejecutar las pruebas y confirmar que fallan por las funciones ausentes.
- [x] Implementar el envío del navegador en `lib/meta-pixel.ts` y trasladar `PageView` fuera del texto del script en `components/landing/cookie-consent-banner.tsx`.
- [x] Implementar `handleMetaConversionsRequest(request: Request): Promise<Response>` en `lib/meta-conversions.ts` y conectarlo desde `app/api/meta/conversions/route.ts`.
- [x] Permitir las importaciones relativas `.ts` en `tsconfig.json`, necesarias para las pruebas nativas de Node existentes.
- [x] Documentar las variables privadas de Vercel, la generación del token y la comprobación en Meta en `docs/meta-conversions-api.md`.
- [x] Ejecutar `npm test`, `npm run typecheck`, `npm run lint` y `npm run build`, y comprobar el flujo en el navegador sin enviar eventos reales a Meta.

La comprobación local detectó la normalización de `request.url` a `localhost` por Next.js. Se corrigió usando el dominio público de `Host` y el protocolo del proxy, con pruebas de regresión para ambos casos. Se comprobó además que un clic nuevo de un anuncio reemplaza una cookie de atribución anterior, conservando la fecha de la cookie cuando el clic coincide.

Resultado local: 23 pruebas aprobadas y compilación de producción correcta; consentimiento y contacto verificados en el navegador integrado a 1265 × 712. Se utilizó un ID de píxel ficticio y ningún token: la advertencia de Meta sobre ese ID es esperada y el endpoint responde `204`. La revisión independiente del código no encontró problemas importantes. Falta validar la entrega real en Vercel y Meta.

## Contrato del endpoint

```ts
type MetaConversionEvent = {
  event_name: "PageView" | "Contact" | "Lead";
  event_id: string;
  event_time: number;
  event_source_url: string;
  custom_data: Record<string, string | number | boolean>;
};

type MetaConversionsRequest = {
  consent: true;
  events: MetaConversionEvent[];
  fbc?: string;
};
```

Se aceptan hasta tres eventos y 8 KiB por petición, únicamente desde el mismo origen. La URL enviada a Meta excluye búsquedas y fragmentos. Las respuestas de error no incluyen credenciales ni datos personales. Si falta el token o el ID del píxel, el endpoint no envía eventos externos y devuelve `204`.

## Configuración pendiente de la cuenta

El usuario confirmó Vercel y que el píxel actual recibe eventos. Debe generar un token de integración directa para ese mismo píxel y guardarlo en `META_CONVERSIONS_API_ACCESS_TOKEN`. Para validar la recepción real se necesita además `META_CONVERSIONS_API_TEST_EVENT_CODE`, obtenido en «Probar eventos». La integración local y las pruebas sin credenciales no confirman la recepción en Meta.
