# Checklist de Implementación — AUDICO S.A.S.

- [x] Extraer contenido del .docx y revisar puntos clave
- [x] Estructura base Next.js (App Router, TS, Tailwind)
- [x] Landing page vendedora (copy inicial)
- [x] Formulario de registro de clientes (/register)
- [x] API: crear cliente (POST /api/clients)
- [x] API: listar/editar/eliminar clientes (GET/PATCH/DELETE)
- [x] Panel admin básico (/admin) con listado y envío de newsletter
- [x] API: newsletters (crear/listar y envío via SMTP si hay envs)
- [x] API: suscriptores (POST /api/subscribers)
- [x] API: procesos (crear/listar/editar/eliminar)
- [x] Autenticación básica para /admin y APIs protegidas (middleware)
- [x] Sanity: Schemas (client, process, newsletter, subscriber, service, company, testimonial)
- [x] Sanity Studio embebido (/studio)
- [x] Variables de entorno de ejemplo (.env.example)
- [x] Tailwind + estilos base
- [x] .gitignore

Pendientes / Próximos pasos:

- [ ] Conectar Sanity (projectId, dataset, token) y correr Studio
- [ ] Crear documento `company` con misión, visión, valores y contacto
- [ ] Añadir servicios y testimonios reales en Sanity
- [ ] Afinar copy de la landing con contenido definitivo del .docx
- [ ] Integrar SMTP real (o proveedor: SendGrid, Mailgun, SES)
- [ ] Seguimiento de procesos en el panel (UI CRUD completo)
- [ ] Exportar clientes (CSV) y filtros en admin
- [ ] Páginas públicas por servicio (SEO)
- [ ] Formularios adicionales (diagnóstico, cotización)
- [ ] Despliegue en Vercel y conexión de dominio

