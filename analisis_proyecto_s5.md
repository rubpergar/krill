# Análisis completo del proyecto S5 — Formulario de captación con panel de seguimiento

## 1. Resumen ejecutivo
El proyecto S5 consiste en desarrollar una aplicación web que permita captar solicitudes desde un formulario público y gestionarlas desde un panel interno privado. Aunque aparentemente puede parecer un formulario sencillo, el valor real del proyecto está en convertir cada envío en una solicitud gestionable, con estado, responsable, notas internas, trazabilidad y notificaciones.

La solución cubre el ciclo completo:
**captar → validar → guardar → notificar → revisar → anotar → cambiar estado → cerrar**

Este proyecto es una referencia especialmente útil para el catálogo porque representa un patrón común en muchos sistemas empresariales: entrada pública de datos y tratamiento interno mediante backoffice.

## 2. Objetivos del proyecto

### 2.1 Objetivo principal
Centralizar la recepción y gestión de solicitudes procedentes de un formulario público, evitando que los contactos queden dispersos en correos, mensajes o registros manuales.

### 2.2 Objetivos funcionales
- Publicar un formulario público accesible sin autenticación.
- Validar los datos introducidos por el visitante.
- Registrar cada envío como una solicitud interna.
- Notificar al equipo cuando entra una nueva solicitud.
- Permitir a usuarios internos consultar y filtrar solicitudes.
- Permitir cambiar el estado de cada solicitud.
- Permitir añadir notas internas de seguimiento.
- Permitir asignar responsables.
- Mantener trazabilidad básica de cambios relevantes.

### 2.3 Objetivo como proyecto de catálogo
Este proyecto sirve como referencia para múltiples casos posteriores:
- solicitudes de presupuesto;
- captación de leads;
- formularios de contacto;
- altas de proveedores;
- inscripciones;
- peticiones internas;
- revisión de candidaturas;
- solicitudes de soporte simples;
- bandejas de entrada estructuradas.

## 3. Clasificación del proyecto

| Criterio | Valor |
| :--- | :--- |
| **ID** | S5 |
| **Nombre** | Formulario de captación con panel de seguimiento |
| **Tipo** | Aplicación web |
| **Complejidad funcional** | Baja-media |
| **Complejidad técnica** | Baja-media |
| **Riesgo técnico** | Bajo |
| **Riesgo funcional** | Medio-bajo |
| **Riesgo legal** | Medio, por datos personales |
| **Usuarios externos** | Sí |
| **Usuarios internos** | Sí |
| **Autenticación** | Sí, para panel privado |
| **Integraciones** | Email en MVP; APIs futuras opcionales |
| **Reutilización** | Alta |

## 4. Alcance general

### 4.1 Incluido en MVP

| Funcionalidad | Incluido |
| :--- | :--- |
| Formulario público | Sí |
| Validaciones frontend y backend | Sí |
| Consentimiento legal | Sí |
| Protección anti-spam básica | Sí |
| Guardado en base de datos | Sí |
| Estado inicial automático | Sí |
| Email de aviso interno | Sí |
| Login privado | Sí |
| Listado de solicitudes | Sí |
| Filtros básicos | Sí |
| Búsqueda simple | Sí |
| Detalle de solicitud | Sí |
| Cambio de estado | Sí |
| Notas internas | Sí |
| Asignación simple | Recomendable |
| Historial básico | Recomendable |

### 4.2 Fuera del MVP

| Funcionalidad | Motivo |
| :--- | :--- |
| CRM completo | Aumenta mucho el alcance |
| Pipeline comercial visual | Pertenece a un CRM ligero |
| Gestión de campañas | Pertenece a un gestor de campañas y leads |
| Formularios dinámicos configurables | Requiere constructor de formularios |
| Múltiples formularios por cliente | Añade configuración y permisos |
| Reporting avanzado | Pertenece a plataforma de reporting |
| Automatizaciones complejas | Mejor fase posterior |
| Integración con CRM externo | Dependencia externa adicional |
| Portal público de seguimiento | Cambia el modelo del producto |
| Adjuntos en formulario | Añade gestión documental y seguridad |
| SLA o tiempos objetivo | Se acerca a sistema de tickets |

## 5. Actores del sistema

### 5.1 Visitante público
Persona externa que accede al formulario sin iniciar sesión.

**Puede:**
- ver el formulario;
- rellenar los campos;
- aceptar la política de privacidad;
- enviar la solicitud;
- ver confirmación de envío.

**No puede:**
- acceder al panel privado;
- consultar solicitudes anteriores;
- modificar solicitudes enviadas;
- ver información interna;
- consultar notas, estados o responsables.

### 5.2 Usuario interno
Persona del equipo que gestiona las solicitudes recibidas.

**Puede:**
- iniciar sesión;
- ver solicitudes;
- buscar y filtrar;
- consultar detalles;
- cambiar estados;
- añadir notas internas;
- asignar responsables, si aplica;
- cerrar solicitudes como convertidas o descartadas.

### 5.3 Administrador
Usuario interno con permisos ampliados.

**Puede, si se incluye en alcance:**
- gestionar usuarios internos;
- configurar tipos de necesidad;
- exportar solicitudes;
- archivar o eliminar solicitudes;
- consultar métricas generales;
- administrar parámetros básicos.

### 5.4 Sistema
Actor automático responsable de:
- validar datos;
- crear registros;
- asignar estado inicial;
- enviar notificaciones;
- registrar auditoría;
- proteger contra spam;
- controlar errores.

## 6. Flujo funcional principal
1. Un visitante accede al formulario público.
2. Rellena los datos solicitados.
3. Acepta la política de privacidad.
4. Envía el formulario.
5. El sistema valida los datos en frontend y backend.
6. El sistema aplica medidas anti-spam.
7. El sistema crea una nueva solicitud.
8. La solicitud se crea con estado Nuevo.
9. El sistema guarda fecha y hora de entrada.
10. El sistema envía notificación interna por email.
11. El visitante ve una pantalla de confirmación.
12. Un usuario interno accede al panel privado.
13. Consulta el listado de solicitudes.
14. Abre el detalle de una solicitud.
15. Cambia estado, añade notas o asigna responsable.
16. La solicitud queda finalmente convertida, descartada o archivada.

## 7. Entidades principales

### 7.1 Lead o solicitud
Entidad central del sistema.

| Campo | Tipo orientativo | Obligatorio | Comentario |
| :--- | :--- | :--- | :--- |
| id | UUID / entero | Sí | Identificador único |
| nombre | texto | Sí | Nombre del solicitante |
| email | texto | Sí | Email de contacto |
| telefono | texto | No | Opcional según alcance |
| empresa | texto | No | Empresa u organización |
| tipo_necesidad | enum / texto | Sí | Clasificación inicial |
| mensaje | texto largo | Sí | Descripción de la solicitud |
| estado | enum | Sí | Nuevo por defecto |
| responsable_id | relación | No | Usuario interno asignado |
| origen | texto | No | Web, campaña, landing, etc. |
| ip_origen | texto | No | Solo si se decide legalmente |
| user_agent | texto | No | Opcional |
| consentimiento_aceptado | booleano | Sí | Debe ser true |
| consentimiento_fecha | fecha/hora | Sí | Momento de aceptación |
| archivado | booleano | Sí | false por defecto |
| created_at | fecha/hora | Sí | Creación |
| updated_at | fecha/hora | Sí | Última actualización |

### 7.2 Usuario interno

| Campo | Tipo orientativo | Obligatorio | Comentario |
| :--- | :--- | :--- | :--- |
| id | UUID / entero | Sí | Identificador |
| nombre | texto | Sí | Nombre visible |
| email | texto | Sí | Login; debe ser único |
| password_hash | texto | Sí | Nunca contraseña plana |
| rol | enum | Sí | admin / usuario |
| activo | booleano | Sí | Permite desactivar acceso |
| created_at | fecha/hora | Sí | Creación |
| updated_at | fecha/hora | Sí | Actualización |

### 7.3 Nota interna

| Campo | Tipo orientativo | Obligatorio | Comentario |
| :--- | :--- | :--- | :--- |
| id | UUID / entero | Sí | Identificador |
| lead_id | relación | Sí | Solicitud asociada |
| usuario_id | relación | Sí | Autor de la nota |
| contenido | texto largo | Sí | Nota interna |
| created_at | fecha/hora | Sí | Fecha de creación |

### 7.4 Evento de auditoría

| Campo | Tipo orientativo | Obligatorio | Comentario |
| :--- | :--- | :--- | :--- |
| id | UUID / entero | Sí | Identificador |
| lead_id | relación | Sí | Solicitud afectada |
| usuario_id | relación | No | Usuario que hizo la acción |
| accion | texto / enum | Sí | Cambio de estado, asignación, nota, etc. |
| campo | texto | No | Campo modificado |
| valor_anterior | texto | No | Valor previo |
| valor_nuevo | texto | No | Valor posterior |
| created_at | fecha/hora | Sí | Fecha del evento |

## 8. Relaciones entre entidades
- Usuario interno 1 --- N Lead
- Lead 1 --- N Nota interna
- Lead 1 --- N Evento de auditoría
- Usuario interno 1 --- N Nota interna
- Usuario interno 1 --- N Evento de auditoría

*Una solicitud puede estar sin responsable o asignada a un único usuario interno. Una solicitud puede tener muchas notas y muchos eventos de auditoría.*

## 9. Estados de la solicitud

| Estado | Significado |
| :--- | :--- |
| Nuevo | La solicitud acaba de entrar |
| Revisado | Alguien del equipo ya la ha leído |
| Contactado | Se ha contactado con el solicitante |
| En seguimiento | Existe conversación o gestión abierta |
| Convertido | La solicitud se ha convertido en oportunidad o proyecto |
| Descartado | No interesa, no procede o es inválida |

### 9.1 Flujo recomendado
**Nuevo → Revisado → Contactado → En seguimiento → Convertido**

También son válidos cierres alternativos:
- Nuevo → Descartado
- Revisado → Descartado
- Contactado → Descartado
- En seguimiento → Descartado

### 9.2 Recomendación
En el MVP no conviene aplicar restricciones rígidas de transición. Es preferible permitir cambios libres entre estados, pero registrar cada cambio con usuario, fecha, valor anterior y valor nuevo.

## 10. Casos de uso

### 10.1 Mapa general

| ID | Caso de uso | Actor principal | Prioridad |
| :--- | :--- | :--- | :--- |
| UC-01 | Consultar formulario público | Visitante público | Alta |
| UC-02 | Enviar solicitud de captación | Visitante público | Alta |
| UC-03 | Validar datos del formulario | Sistema | Alta |
| UC-04 | Confirmar envío al visitante | Sistema | Alta |
| UC-05 | Notificar nueva solicitud al equipo | Sistema | Alta |
| UC-06 | Iniciar sesión en panel privado | Usuario interno | Alta |
| UC-07 | Consultar listado de solicitudes | Usuario interno | Alta |
| UC-08 | Filtrar y buscar solicitudes | Usuario interno | Alta |
| UC-09 | Consultar detalle de solicitud | Usuario interno | Alta |
| UC-10 | Cambiar estado de solicitud | Usuario interno | Alta |
| UC-11 | Añadir nota interna | Usuario interno | Alta |
| UC-12 | Asignar responsable | Usuario interno | Media |
| UC-13 | Consultar historial de cambios | Usuario interno | Media |
| UC-14 | Cerrar solicitud como convertida | Usuario interno | Alta |
| UC-15 | Cerrar solicitud como descartada | Usuario interno | Alta |
| UC-16 | Exportar solicitudes | Usuario interno / Admin | Baja-media |
| UC-17 | Gestionar usuarios internos | Administrador | Media |
| UC-18 | Configurar tipos de necesidad | Administrador | Baja |
| UC-19 | Gestionar estados disponibles | Administrador | Baja |
| UC-20 | Archivar o eliminar solicitud | Administrador | Media |
| UC-21 | Consultar métricas básicas | Usuario interno | Media |
| UC-22 | Proteger formulario contra spam | Sistema | Alta |
| UC-23 | Registrar auditoría básica | Sistema | Media-alta |
| UC-24 | Enviar acuse de recibo al solicitante | Sistema | Opcional |
| UC-25 | Recuperar contraseña | Usuario interno | Media |

### 10.2 UC-01 — Consultar formulario público
- **Actor principal:** Visitante público
- **Objetivo:** Ver el formulario de captación.
- **Precondiciones:** El formulario está publicado y activo.
- **Flujo principal:** El visitante accede a la URL, el sistema muestra los campos, el texto legal y el botón de envío.
- **Criterios de aceptación:** El formulario no requiere login, los campos obligatorios son visibles y no se muestra información interna.

### 10.3 UC-02 — Enviar solicitud de captación
- **Actor principal:** Visitante público
- **Objetivo:** Enviar una solicitud al equipo interno.
- **Flujo principal:** El visitante rellena campos, acepta privacidad, envía, el sistema valida, crea la solicitud, asigna estado Nuevo, guarda fecha y muestra confirmación.
- **Flujos alternativos:** Campos obligatorios vacíos, email inválido, consentimiento no aceptado, spam detectado, doble clic, fallo de email.
- **Criterios de aceptación:** La solicitud válida se guarda, la inválida no se guarda, y el usuario ve confirmación si todo va bien.

### 10.4 UC-03 — Validar datos del formulario
- **Actor principal:** Sistema
- **Objetivo:** Asegurar que los datos recibidos son correctos y seguros.
- **Validaciones:** nombre obligatorio, email válido, mensaje obligatorio, tipo permitido, consentimiento aceptado, honeypot vacío, rate limit, longitud máxima, sanitización.
- **Criterios de aceptación:** La validación se realiza en backend y no se exponen errores técnicos.

### 10.5 UC-04 — Confirmar envío al visitante
- **Actor principal:** Sistema
- **Objetivo:** Informar al visitante de que la solicitud se ha recibido.
- **Criterios de aceptación:** La confirmación aparece solo si la solicitud se ha guardado correctamente y no expone datos internos.

### 10.6 UC-05 — Notificar nueva solicitud al equipo
- **Actor principal:** Sistema
- **Actor secundario:** Servicio de email
- **Objetivo:** Avisar al equipo de una nueva solicitud.
- **Criterios de aceptación:** El lead se guarda aunque el email falle; el error de email se registra; el email contiene datos mínimos y enlace al panel privado.

### 10.7 UC-06 — Iniciar sesión en panel privado
- **Actor principal:** Usuario interno
- **Objetivo:** Acceder de forma segura al backoffice.
- **Criterios de aceptación:** Solo usuarios activos pueden acceder; las contraseñas se guardan hasheadas; los errores son genéricos; la sesión puede cerrarse.

### 10.8 UC-07 — Consultar listado de solicitudes
- **Actor principal:** Usuario interno
- **Objetivo:** Ver las solicitudes recibidas.
- **Criterios de aceptación:** El listado requiere autenticación, está paginado y muestra las solicitudes más recientes primero.

### 10.9 UC-08 — Filtrar y buscar solicitudes
- **Actor principal:** Usuario interno
- **Objetivo:** Localizar solicitudes concretas.
- **Filtros MVP:** estado, tipo de necesidad, texto libre, fecha y responsable.
- **Criterios de aceptación:** Los filtros pueden combinarse, limpiarse y no rompen paginación.

### 10.10 UC-09 — Consultar detalle de solicitud
- **Actor principal:** Usuario interno
- **Objetivo:** Ver toda la información de una solicitud.
- **Criterios de aceptación:** El detalle muestra datos de contacto, mensaje, estado, responsable, notas e historial si aplica.

### 10.11 UC-10 — Cambiar estado de solicitud
- **Actor principal:** Usuario interno
- **Objetivo:** Actualizar la situación de una solicitud.
- **Criterios de aceptación:** El cambio se guarda, se refleja en listado y detalle, y queda auditado.

### 10.12 UC-11 — Añadir nota interna
- **Actor principal:** Usuario interno
- **Objetivo:** Registrar seguimiento interno.
- **Criterios de aceptación:** No se permiten notas vacías; cada nota tiene autor y fecha; las notas no son visibles públicamente.

### 10.13 UC-12 — Asignar responsable
- **Actor principal:** Usuario interno
- **Objetivo:** Indicar quién gestiona una solicitud.
- **Criterios de aceptación:** La solicitud puede estar sin responsable o asignada a uno; el cambio queda registrado.

### 10.14 UC-13 — Consultar historial de cambios
- **Actor principal:** Usuario interno
- **Objetivo:** Ver trazabilidad.
- **Criterios de aceptación:** El historial está ordenado por fecha, no es editable y muestra acciones relevantes.

### 10.15 UC-14 — Cerrar solicitud como convertida
- **Actor principal:** Usuario interno
- **Objetivo:** Marcar una solicitud como aprovechada.
- **Criterios de aceptación:** La solicitud queda en estado Convertido y aparece en métricas.

### 10.16 UC-15 — Cerrar solicitud como descartada
- **Actor principal:** Usuario interno
- **Objetivo:** Marcar una solicitud como no válida o no interesante.
- **Criterios de aceptación:** La solicitud queda en estado Descartado y puede incluir motivo en nota interna.

### 10.17 UC-16 — Exportar solicitudes
- **Actor principal:** Usuario interno / Administrador
- **Objetivo:** Descargar datos para análisis o tratamiento externo.
- **Recomendación:** Fuera del MVP salvo necesidad clara.
- **Criterios de aceptación:** La exportación respeta filtros y permisos.

### 10.18 UC-17 — Gestionar usuarios internos
- **Actor principal:** Administrador
- **Objetivo:** Crear, editar, activar o desactivar usuarios.
- **Recomendación:** Puede omitirse si los usuarios se gestionan manualmente al principio.

### 10.19 UC-18 — Configurar tipos de necesidad
- **Actor principal:** Administrador
- **Objetivo:** Mantener opciones del formulario.
- **Recomendación:** Para MVP pueden estar definidos en configuración o código.

### 10.20 UC-19 — Gestionar estados disponibles
- **Actor principal:** Administrador
- **Objetivo:** Configurar estados del flujo.
- **Recomendación:** No incluir en MVP; estados fijos.

### 10.21 UC-20 — Archivar o eliminar solicitud
- **Actor principal:** Administrador
- **Objetivo:** Retirar solicitudes del listado activo o atender necesidades legales.
- **Criterios de aceptación:** Archivar es preferible a eliminar; eliminar requiere permisos elevados y confirmación.

### 10.22 UC-21 — Consultar métricas básicas
- **Actor principal:** Usuario interno
- **Objetivo:** Ver resumen operativo.
- **Métricas:** nuevos, en seguimiento, convertidos y descartados.

### 10.23 UC-22 — Proteger formulario contra spam
- **Actor principal:** Sistema
- **Objetivo:** Reducir envíos automáticos.
- **Medidas MVP:** honeypot y rate limiting; captcha opcional.

### 10.24 UC-23 — Registrar auditoría básica
- **Actor principal:** Sistema
- **Objetivo:** Mantener trazabilidad de acciones relevantes.
- **Acciones auditables:** creación, cambio de estado, cambio de responsable, nota añadida, archivo/eliminación.

### 10.25 UC-24 — Enviar acuse de recibo al solicitante
- **Actor principal:** Sistema
- **Objetivo:** Enviar email de confirmación al visitante.
- **Recomendación:** Opcional en MVP.

### 10.26 UC-25 — Recuperar contraseña
- **Actor principal:** Usuario interno
- **Objetivo:** Recuperar acceso al panel.
- **Criterios de aceptación:** Token temporal, caducidad, un solo uso y mensaje que no revela si el email existe.

## 11. Requisitos funcionales

| ID | Requisito funcional |
| :--- | :--- |
| RF-01 | El sistema debe mostrar un formulario público accesible sin login. |
| RF-02 | El sistema debe permitir introducir nombre, email, teléfono, empresa, tipo de necesidad y mensaje. |
| RF-03 | El sistema debe obligar a aceptar la política de privacidad. |
| RF-04 | El sistema debe validar los campos obligatorios. |
| RF-05 | El sistema debe validar el formato del email. |
| RF-06 | El sistema debe aplicar protección anti-spam básica. |
| RF-07 | El sistema debe crear una solicitud al recibir un formulario válido. |
| RF-08 | Toda nueva solicitud debe crearse con estado Nuevo. |
| RF-09 | El sistema debe guardar fecha y hora de creación. |
| RF-10 | El sistema debe registrar la aceptación del consentimiento. |
| RF-11 | El sistema debe mostrar una confirmación tras un envío correcto. |
| RF-12 | El sistema debe enviar notificación interna por email. |
| RF-13 | El sistema debe permitir login de usuarios internos. |
| RF-14 | El sistema debe proteger todas las rutas privadas. |
| RF-15 | El sistema debe mostrar un listado paginado de solicitudes. |
| RF-16 | El sistema debe permitir filtrar solicitudes por estado. |
| RF-17 | El sistema debe permitir buscar por texto libre. |
| RF-18 | El sistema debe permitir ver el detalle de una solicitud. |
| RF-19 | El sistema debe permitir cambiar el estado de una solicitud. |
| RF-20 | El sistema debe permitir añadir notas internas. |
| RF-21 | El sistema debe permitir asignar un responsable. |
| RF-22 | El sistema debe registrar cambios relevantes en auditoría. |
| RF-23 | El sistema debe permitir cerrar una solicitud como convertida. |
| RF-24 | El sistema debe permitir cerrar una solicitud como descartada. |
| RF-25 | El sistema debe permitir cerrar sesión. |
| RF-26 | El sistema debe permitir recuperar contraseña si se incluye autenticación propia. |
| RF-27 | El sistema debe permitir archivar solicitudes si se incluye administración. |
| RF-28 | El sistema debe permitir exportar solicitudes si se incluye en alcance. |

## 12. Requisitos no funcionales

### 12.1 Seguridad
| ID | Requisito |
| :--- | :--- |
| RNF-01 | Las rutas privadas deben requerir autenticación. |
| RNF-02 | Las contraseñas deben almacenarse mediante hash seguro. |
| RNF-03 | Debe existir protección contra XSS. |
| RNF-04 | Debe existir protección contra CSRF si aplica. |
| RNF-05 | Debe existir validación de datos en backend. |
| RNF-06 | Debe aplicarse rate limiting al formulario público. |
| RNF-07 | Los errores técnicos no deben exponerse al usuario final. |
| RNF-08 | Las sesiones deben gestionarse de forma segura. |

### 12.2 Privacidad
| ID | Requisito |
| :--- | :--- |
| RNF-09 | Solo deben recogerse datos necesarios. |
| RNF-10 | Debe mostrarse enlace a política de privacidad. |
| RNF-11 | Debe registrarse la aceptación del consentimiento. |
| RNF-12 | El acceso a datos personales debe limitarse a usuarios internos autorizados. |
| RNF-13 | Debe existir mecanismo de eliminación o anonimización si se requiere. |
| RNF-14 | Debe definirse una política de retención de datos. |

### 12.3 Rendimiento
| ID | Requisito |
| :--- | :--- |
| RNF-15 | El formulario debe cargar rápidamente. |
| RNF-16 | El listado debe estar paginado. |
| RNF-17 | Los filtros básicos deben responder de forma ágil. |
| RNF-18 | El envío de email no debe bloquear la creación del lead. |

### 12.4 Usabilidad
| ID | Requisito |
| :--- | :--- |
| RNF-19 | Los mensajes de error deben ser claros. |
| RNF-20 | Los campos obligatorios deben estar identificados. |
| RNF-21 | El panel debe permitir priorizar solicitudes nuevas fácilmente. |
| RNF-22 | El usuario debe poder volver del detalle al listado sin perder contexto. |

### 12.5 Mantenibilidad
| ID | Requisito |
| :--- | :--- |
| RNF-23 | La lógica de estados debe estar centralizada. |
| RNF-24 | Las plantillas de email deben ser mantenibles. |
| RNF-25 | Las validaciones deben estar definidas de forma clara. |
| RNF-26 | El código debe separar zona pública, backoffice y lógica de dominio. |

### 12.6 Accesibilidad
| ID | Requisito |
| :--- | :--- |
| RNF-27 | Los campos del formulario deben tener etiquetas accesibles. |
| RNF-28 | La navegación debe ser posible mediante teclado. |
| RNF-29 | Debe existir contraste suficiente en textos y botones. |
| RNF-30 | Los errores deben asociarse visualmente al campo correspondiente. |

## 13. Historias de usuario

### 13.1 Visitante público
| ID | Historia de usuario |
| :--- | :--- |
| HU-01 | Como visitante público, quiero ver un formulario claro para poder enviar mi solicitud. |
| HU-02 | Como visitante público, quiero saber qué campos son obligatorios para completar el formulario correctamente. |
| HU-03 | Como visitante público, quiero recibir una confirmación tras enviar el formulario para saber que mi solicitud ha llegado. |
| HU-04 | Como visitante público, quiero entender cómo se tratarán mis datos personales antes de enviarlos. |

### 13.2 Usuario interno
| ID | Historia de usuario |
| :--- | :--- |
| HU-05 | Como usuario interno, quiero iniciar sesión para acceder de forma segura al panel. |
| HU-06 | Como usuario interno, quiero ver las solicitudes recientes para priorizar el trabajo. |
| HU-07 | Como usuario interno, quiero filtrar por estado para localizar solicitudes pendientes. |
| HU-08 | Como usuario interno, quiero buscar por nombre, email o empresa para encontrar una solicitud concreta. |
| HU-09 | Como usuario interno, quiero ver el detalle completo de una solicitud para entender qué necesita el contacto. |
| HU-10 | Como usuario interno, quiero cambiar el estado de una solicitud para reflejar su avance. |
| HU-11 | Como usuario interno, quiero añadir notas internas para registrar el seguimiento realizado. |
| HU-12 | Como usuario interno, quiero asignar un responsable para saber quién se encarga de cada solicitud. |
| HU-13 | Como usuario interno, quiero ver el historial de cambios para entender qué ha ocurrido con una solicitud. |

### 13.3 Administrador
| ID | Historia de usuario |
| :--- | :--- |
| HU-14 | Como administrador, quiero gestionar usuarios internos para controlar quién accede al panel. |
| HU-15 | Como administrador, quiero archivar solicitudes antiguas para mantener limpio el listado activo. |
| HU-16 | Como administrador, quiero exportar solicitudes para análisis externo si es necesario. |
| HU-17 | Como administrador, quiero configurar tipos de necesidad para adaptar el formulario al negocio. |

## 14. Matriz de permisos

| Acción | Visitante público | Usuario interno | Administrador |
| :--- | :--- | :--- | :--- |
| Ver formulario público | Sí | Sí | Sí |
| Enviar formulario | Sí | Sí | Sí |
| Ver confirmación | Sí | Sí | Sí |
| Acceder al panel privado | No | Sí | Sí |
| Ver listado de solicitudes | No | Sí | Sí |
| Ver detalle de solicitud | No | Sí | Sí |
| Cambiar estado | No | Sí | Sí |
| Añadir nota interna | No | Sí | Sí |
| Asignar responsable | No | Sí | Sí |
| Ver historial | No | Sí | Sí |
| Exportar solicitudes | No | Opcional | Sí |
| Gestionar usuarios | No | No | Sí |
| Configurar tipos | No | No | Sí |
| Archivar solicitud | No | Opcional | Sí |
| Eliminar solicitud | No | No | Sí |
| Ver métricas | No | Sí | Sí |

## 15. Definición de pantallas

### 15.1 Formulario público
**Elementos:**
- título;
- descripción breve;
- campo nombre;
- campo email;
- campo teléfono;
- campo empresa;
- selector de tipo de necesidad;
- campo mensaje;
- checkbox de privacidad;
- enlace a política de privacidad;
- botón de envío;
- mensajes de error;
- protección anti-spam no visible.

### 15.2 Pantalla de confirmación
**Elementos:**
- mensaje de éxito;
- indicación de próximos pasos;
- botón para volver a la web principal;
- sin datos internos.

### 15.3 Login privado
**Elementos:**
- email;
- contraseña;
- botón de acceso;
- enlace de recuperación de contraseña, si aplica;
- mensajes de error genéricos.

### 15.4 Dashboard
**Elementos:**
- tarjetas de métricas básicas;
- últimos leads recibidos;
- accesos rápidos a filtros;
- acceso al listado completo.

### 15.5 Listado de solicitudes
**Elementos:**
- tabla de solicitudes;
- filtro por estado;
- filtro por tipo;
- buscador;
- filtro por responsable, si aplica;
- rango de fechas, si aplica;
- paginación;
- acción para ver detalle.

**Columnas recomendadas:**
- fecha;
- nombre;
- email;
- empresa;
- tipo de necesidad;
- estado;
- responsable;
- última actualización;
- acciones.

### 15.6 Detalle de solicitud
**Elementos:**
- datos de contacto;
- mensaje enviado;
- estado actual;
- responsable;
- selector de cambio de estado;
- formulario para añadir nota;
- listado de notas internas;
- historial de cambios;
- acciones de cierre;
- opción de archivar, si aplica.

### 15.7 Gestión de usuarios
Pantalla opcional para administradores.
**Elementos:**
- listado de usuarios;
- crear usuario;
- editar usuario;
- activar/desactivar usuario;
- asignar rol.

## 16. Criterios de aceptación consolidados

### 16.1 Formulario público
- Dado un visitante, cuando accede a la URL pública, entonces ve el formulario sin iniciar sesión.
- Dado un visitante con campos obligatorios vacíos, cuando intenta enviar, entonces el sistema muestra errores y no crea solicitud.
- Dado un visitante sin aceptar privacidad, cuando intenta enviar, entonces el sistema bloquea el envío.
- Dado un visitante con email inválido, cuando intenta enviar, entonces el sistema muestra error.
- Dado un formulario válido, cuando se envía, entonces se crea una solicitud con estado Nuevo.
- Dado un envío correcto, cuando termina el proceso, entonces se muestra confirmación.

### 16.2 Panel privado
- Dado un usuario no autenticado, cuando intenta acceder al panel, entonces es redirigido al login.
- Dado un usuario activo con credenciales válidas, cuando inicia sesión, entonces accede al dashboard.
- Dado un usuario interno, cuando abre el listado, entonces ve solicitudes paginadas ordenadas por fecha descendente.
- Dado un usuario interno, cuando aplica filtros, entonces el listado muestra solo resultados coincidentes.
- Dado un usuario interno, cuando abre una solicitud, entonces ve el detalle completo.

### 16.3 Gestión de solicitudes
- Dado un usuario interno, cuando cambia el estado de una solicitud, entonces el nuevo estado se guarda.
- Dado un cambio de estado, cuando se guarda, entonces se registra usuario, fecha, valor anterior y valor nuevo.
- Dado un usuario interno, cuando añade una nota no vacía, entonces la nota queda asociada a la solicitud.
- Dado una nota interna, cuando se muestra, entonces incluye autor y fecha.
- Dado un lead convertido, cuando se consulta el dashboard, entonces se contabiliza como convertido.
- Dado un lead descartado, cuando se consulta el dashboard, entonces se contabiliza como descartado.

### 16.4 Seguridad y privacidad
- Dado un acceso no autorizado, cuando intenta ver datos internos, entonces el sistema lo bloquea.
- Dado un error técnico, cuando ocurre, entonces el usuario ve un mensaje seguro y genérico.
- Dado un envío de formulario, cuando se procesa, entonces los datos se validan en backend.
- Dado un usuario interno, cuando cierra sesión, entonces no puede acceder al panel sin autenticarse de nuevo.

## 17. Escenarios de error

| Error | Comportamiento esperado |
| :--- | :--- |
| Fallo de validación | Mostrar errores claros y no guardar solicitud |
| Fallo de base de datos | Mostrar error genérico y registrar log técnico |
| Fallo de email interno | Guardar solicitud igualmente y registrar error |
| Servicio de email no configurado | Guardar solicitud y registrar aviso |
| Sesión caducada | Redirigir al login |
| Usuario sin permisos | Mostrar error 403 controlado |
| Lead inexistente | Mostrar error 404 controlado |
| Spam detectado | Bloquear o ignorar con mensaje genérico |
| Doble envío | Evitar duplicado o marcar posible duplicado |
| Usuario desactivado | Impedir login |
| Responsable eliminado/desactivado | Mantener histórico, impedir nuevas asignaciones |
| Error inesperado | Registrar log y mostrar mensaje seguro |

## 18. Política de datos personales

### 18.1 Datos recogidos
- Nombre.
- Email.
- Teléfono, si se incluye.
- Empresa, si se incluye.
- Tipo de necesidad.
- Mensaje libre.
- Fecha y hora de envío.
- Consentimiento aceptado.
- IP y user agent solo si se decide expresamente.

### 18.2 Principios recomendados
- Minimizar datos recogidos.
- Pedir solo información necesaria para atender la solicitud.
- Mostrar enlace a política de privacidad.
- Registrar fecha de aceptación del consentimiento.
- Limitar acceso a usuarios internos autorizados.
- Evitar indexación pública de cualquier dato.
- Definir plazo de conservación.
- Permitir supresión o anonimización.

### 18.3 Decisiones pendientes

| Decisión | Opciones |
| :--- | :--- |
| Base legal | Consentimiento / interés legítimo |
| Política de privacidad | Existente / nueva |
| Retención | 6 meses, 12 meses, 24 meses, indefinida justificada |
| IP y user agent | Guardar / no guardar |
| Email interno | Datos completos / solo resumen con enlace |
| Supresión | Borrado físico / anonimización |

## 19. Riesgos del proyecto

| Riesgo | Impacto | Mitigación |
| :--- | :--- | :--- |
| Alcance crece hacia CRM | Alto | Definir claramente fuera de alcance |
| Spam en formulario público | Medio | Honeypot, rate limiting, captcha opcional |
| Mala gestión de datos personales | Alto | Consentimiento, privacidad, permisos |
| Fallos en email | Medio | Guardar lead antes de enviar y registrar errores |
| Estados poco claros | Medio | Mantener estados simples y documentados |
| Demasiados campos | Medio | Minimizar formulario |
| Usuarios internos sin proceso | Medio | Definir estados y responsabilidades |
| Falta de auditoría | Medio | Registrar cambios clave |
| Filtros insuficientes | Bajo-medio | Incluir estado, tipo y búsqueda libre |

## 20. Decisiones técnicas abiertas

| Decisión | Opciones posibles | Recomendación inicial |
| :--- | :--- | :--- |
| Stack | Laravel, Django, Rails, Next.js | Elegir stack habitual del equipo |
| Base de datos | PostgreSQL, MySQL, SQLite | PostgreSQL o MySQL |
| Autenticación | Propia, framework, Google/Microsoft | Framework estándar |
| Email | SMTP, Resend, SendGrid, Mailgun, SES | SMTP o proveedor simple |
| Anti-spam | Honeypot, rate limit, Captcha | Honeypot + rate limit |
| Hosting | VPS, PaaS, cliente | Según cliente |
| Exportación | Sí / no | Fase posterior salvo necesidad |
| Adjuntos | Sí / no | No en MVP |
| Gestión de usuarios | Panel / manual | Manual o panel simple |
| Auditoría | Completa / básica | Básica en MVP |

## 21. Plan de fases

**Fase 0 — Definición final**
- Confirmar campos del formulario.
- Confirmar estados.
- Confirmar roles.
- Confirmar dirección de notificación.
- Confirmar política de privacidad.
- Confirmar stack técnico.

**Fase 1 — Captación pública**
- Maquetar formulario.
- Implementar validaciones.
- Implementar protección anti-spam.
- Crear endpoint de envío.
- Guardar solicitud.
- Mostrar confirmación.

**Fase 2 — Panel interno básico**
- Login.
- Dashboard inicial.
- Listado de solicitudes.
- Filtros básicos.
- Vista detalle.

**Fase 3 — Seguimiento operativo**
- Cambio de estado.
- Notas internas.
- Asignación de responsable.
- Historial básico.
- Cierre como convertido o descartado.

**Fase 4 — Notificaciones y ajustes**
- Email interno.
- Registro de errores de email.
- Posible acuse al solicitante.
- Métricas básicas.

**Fase 5 — Calidad y entrega**
- Pruebas funcionales.
- Pruebas de seguridad básicas.
- Revisión de permisos.
- Revisión de privacidad.
- Despliegue.
- Documentación básica.

## 22. Backlog inicial

| Épica | Historias / tareas principales |
| :--- | :--- |
| Captación pública | Ver formulario, validar campos, enviar solicitud, confirmar envío |
| Gestión interna | Login, listado, filtros, detalle |
| Seguimiento | Cambiar estado, añadir nota, asignar responsable |
| Auditoría | Registrar creación, cambios de estado, notas y asignaciones |
| Notificaciones | Email interno, registro de fallo, acuse opcional |
| Administración | Usuarios, archivo, exportación, configuración opcional |
| Seguridad | Protección rutas, hash de contraseñas, rate limiting, CSRF/XSS |
| Privacidad | Consentimiento, retención, supresión, acceso restringido |
| Calidad | Pruebas, logs, despliegue, documentación |

## 23. Estimación cualitativa por módulos

| Módulo | Tamaño orientativo | Complejidad |
| :--- | :--- | :--- |
| Formulario público | S | Baja |
| Validaciones | S | Baja |
| Anti-spam | S/M | Media-baja |
| API de creación | S | Baja |
| Base de datos | S | Baja |
| Email interno | S | Baja-media |
| Login | M | Media |
| Listado y filtros | M | Media |
| Detalle | M | Media |
| Estados | S/M | Media-baja |
| Notas internas | M | Media |
| Asignación | S/M | Media-baja |
| Auditoría | S/M | Media |
| Dashboard | S/M | Media-baja |
| Gestión de usuarios | M | Media |
| Exportación | S/M | Media-baja |
| Pruebas y despliegue | M | Media |

## 24. Definición de terminado
El proyecto puede considerarse terminado cuando:
- El formulario público está operativo.
- Las validaciones funcionan en frontend y backend.
- El consentimiento legal es obligatorio.
- Las solicitudes válidas se guardan correctamente.
- Cada solicitud se crea con estado Nuevo.
- El panel privado requiere autenticación.
- El listado de solicitudes está disponible y paginado.
- Los filtros básicos funcionan.
- La vista detalle muestra la información completa.
- Los usuarios internos pueden cambiar estados.
- Los usuarios internos pueden añadir notas.
- La asignación de responsable funciona si se incluye.
- La auditoría básica registra acciones relevantes.
- La notificación interna por email está probada.
- Los fallos de email no impiden guardar solicitudes.
- Las rutas privadas están protegidas.
- Los errores se gestionan de forma controlada.
- La política de datos personales está contemplada.
- El sistema está desplegado en el entorno acordado.
- Existe documentación básica de uso y mantenimiento.

## 25. Valor reutilizable para el catálogo
Este proyecto genera piezas reutilizables para otros desarrollos:

| Pieza reutilizable | Aplicable en |
| :--- | :--- |
| Formulario público validado | Captación, solicitudes, soporte, inscripciones |
| Panel privado | Backoffices simples |
| Listado con filtros | CRM, tickets, pedidos, RRHH |
| Estados | Incidencias, pedidos, aprobaciones |
| Notas internas | CRM, soporte, gestión operativa |
| Notificaciones por email | Alertas, formularios, tareas |
| Login interno | Portales privados |
| Auditoría básica | Sistemas con trazabilidad |
| Asignación de responsable | CRM, incidencias, flujos internos |

## 26. Frontera con otros proyectos

### 26.1 Diferencia con CRM ligero
Este proyecto no debe convertirse en CRM.

| S5 | CRM ligero |
| :--- | :--- |
| Solicitudes entrantes | Clientes y oportunidades |
| Estados simples | Pipeline comercial |
| Notas internas | Actividades comerciales |
| Responsable simple | Gestión comercial completa |
| Sin importes | Importes, probabilidad y previsión |

### 26.2 Diferencia con sistema de tickets

| S5 | Sistema de tickets |
| :--- | :--- |
| Captación comercial/general | Soporte operativo |
| Seguimiento simple | SLA y prioridades |
| Estados básicos | Colas, asignaciones, tiempos objetivo |
| Notas internas | Comentarios y trazabilidad más extensa |

### 26.3 Diferencia con gestor de campañas

| S5 | Gestor de campañas |
| :--- | :--- |
| Un formulario o entrada principal | Varias campañas |
| Clasificación simple | Segmentación y reporting |
| Captura de leads | Gestión de origen, canal y conversión |
| Seguimiento básico | Exportación, análisis y atribución |

## 27. Conclusión
S5 es un excelente primer proyecto de catálogo porque tiene más valor que un CRUD puro sin entrar todavía en la complejidad de un CRM, un sistema de tickets o una plataforma de reporting.

La clave es mantener el alcance controlado:
No estamos construyendo un CRM; estamos construyendo una bandeja de entrada estructurada para solicitudes recibidas desde un formulario público.

La primera versión debe demostrar bien el ciclo completo:
**captar → registrar → avisar → revisar → anotar → cambiar estado → cerrar**

Con ese alcance, el proyecto queda suficientemente completo para ser útil en producción y, al mismo tiempo, suficientemente acotado para funcionar como referencia reutilizable dentro del catálogo de futuros proyectos.
