# 🦁 LEO – Lectura, Escritura y Oralidad

**Aplicación educativa interactiva para estudiantes de educación primaria del Perú.**

Desarrollada para fortalecer progresivamente la lectura, la comprensión lectora, la escritura y la oralidad, con estética de videojuego educativo y respeto irrestricto al principio pedagógico:
> **“Cada estudiante avanza desde su propio nivel.”**

---

## 🇵🇪 1. Identidad y Características Centrales

* **Logo Oficial Integrado**: Se respeta y utiliza el diseño original del logo oficial de Leo (leoncito con chullo andino y tablet) en la pantalla de bienvenida, navegación, inicio de sesión, perfil y paneles.
* **El grado escolar NO determina el nivel de lectura**: Un estudiante de 2° grado con dificultades inicia en 🟢 **Inicio**, mientras que un estudiante con mayor fluidez puede ubicarse en 🟡 **Desarrollo** o 🔴 **Avanzado**, según su evaluación diagnóstica.
* **Contenidos Peruanos Auténticos y Verificados**: Biografías y lecturas de héroes y heroínas del Perú (Miguel Grau, Micaela Bastidas, José Olaya, Daniel Alcides Carrión, María Reiche, Chabuca Granda), fauna nativa (gallito de las rocas, delfín rosado, vicuña, cóndor) y patrimonio cultural (Inti Raymi, Sacsayhuamán, algodón nativo). **Sin datos históricos inventados.**

---

## 📚 2. Estructura de Niveles

### 🟢 Nivel Inicio (4 etapas internas)
1. **Etapa 1: Sílabas**: Reconocimiento visual y auditivo de sílabas directas (MA, ME, MI, MO, MU / PA, PE, PI, PO, PU).
2. **Etapa 2: Palabras sencillas**: Monosílabas y vocabulario inicial de uso diario (SOL, PAN, MAR, LUNA, PAPA).
3. **Etapa 3: Frases cortas**: Oraciones sencillas con estructura sujeto-verbo-predicado.
4. **Etapa 4: Textos muy breves**: Micro-relatos de 2 oraciones para transición suave hacia historias completas.

### 🟡 Nivel Desarrollo
* Cuentos cortos, fábulas y biografías narrativas de personajes peruanos.
* Vocabulario intermedio, comprensión de causas y consecuencias.

### 🔴 Nivel Avanzado
* Estructuras narrativas más ricas, inferencias complejas y análisis de puntos de vista.
* **Regla estricta:** Textos de máximo **3 párrafos**.

---

## 🧠 3. Comprensión Lectora Obligatoria en 3 Niveles (15 Preguntas)

Cada lectura cuenta con una batería completa de 15 actividades:
1. **Nivel Literal (5 preguntas)**: Localización de datos explícitos del texto.
2. **Nivel Inferencial (5 preguntas)**: Deducción de intenciones, emociones, causas y significados contextuales.
3. **Nivel Crítico (5 preguntas)**: Juicios de valor, argumentación cívica y **al menos una respuesta abierta escrita** analizada cualitativamente por IA sin exigir respuestas de memoria.

### 💡 Comodín Pedagógico (1 por lectura)
* Entrega una **pista orientadora** que invita a releer una parte específica del texto.
* **NUNCA** revela directamente la respuesta correcta.
* Se consume una vez utilizado durante la lectura.

### 🔊 Retroalimentación Constructiva
* Tanto en aciertos (✅) como en errores (💡), Leo brinda retroalimentaciones formativas y afectuosas, sin mensajes punitivos o desalentadores.

---

## 👩‍🏫 4. Panel Docente y Control de Calidad de IA

* **Regla de Oro:** **Ninguna lectura generada por IA se publica directamente para los estudiantes.**
* Todo contenido nuevo ingresa en **🟡 PENDIENTE DE REVISIÓN DOCENTE**.
* El docente cuenta con un editor interactivo para:
  1. Revisar y ajustar el texto y los párrafos.
  2. Ajustar las 15 preguntas (literales, inferenciales y críticas).
  3. Verificar o editar la pista del comodín.
  4. **Aprobar y publicar (🟢)** o **Rechazar (🔴)**.
* **Analítica del Aula**:
  * Distribución de alumnos por nivel.
  * Promedios de comprensión literal, inferencial y crítica.
  * Identificación de estudiantes que requieren reforzamiento.
  * Recomendaciones pedagógicas automáticas generadas por IA.

---

## 🎮 5. Gamificación y Personaje

* **Puntos (⭐)**, **Rachas (🔥)** y **Medallas (🏅)**: Logros por lectura constante, autonomía, inferencia y pensamiento crítico.
* **Avatar Personalizable**:
  * Chullos andinos, sombreros norteños, gorras deportivas, coronas amazónicas.
  * Ponchos cusqueños, camisetas del Perú, chalecos de explorador.
  * Lentes de detective, mochilas andinas, lupas misteriosas.
  * Fondos de Machu Picchu, Selva Amazónica y Bahía de Chorrillos.
  * Sistema de desbloqueo claro con requisitos de puntos y lecturas.

---

## 💻 6. Cómo Ejecutar la Aplicación

La aplicación es una Single-Page Application (SPA) pura con cero dependencias externas:

### Opción 1: Abrir directamente en el navegador
Hacer doble clic en `index.html` o abrirlo en Microsoft Edge o Google Chrome:
```powershell
Start-Process "C:\Users\winni\.gemini\antigravity\scratch\leo-app\index.html"
```

### Opción 2: Iniciar con servidor local PowerShell
Ejecutar el script incluido:
```powershell
powershell -ExecutionPolicy Bypass -File "C:\Users\winni\.gemini\antigravity\scratch\leo-app\serve.ps1"
```
Abre automáticamente `http://localhost:8080/`.

---

## 🔐 7. Arquitectura de Autenticación Multi-Rol y Persistencia en MongoDB Atlas

La plataforma LEO implementa un sistema de autenticación multi-rol con tres tipos de accesos diferenciados y persistencia en MongoDB Atlas:

### 👥 1. Roles y Permisos

| Rol | Identificador | Acceso y Permisos |
|---|---|---|
| **Estudiante** | `'estudiante'` (o `'user'`) | **Acceso exclusivo a la interfaz de juego**: evaluación diagnóstica, ruleta mágica, 15 preguntas por lectura con comodín pedagógico, talleres de sílabas/escritura, cabina de voz y personalización de avatar. Bloqueado estrictamente de paneles docentes o administrativos. |
| **Maestro** | `'maestro'` | **Acceso al Panel Docente (`screen-teacher-dashboard`)**: seguimiento individual y grupal de alumnos, métricas del aula (comprensión literal e inferencial), alertas y recomendaciones pedagógicas generadas por IA, revisión de lecturas pendientes y **asignación en tiempo real de actividades y lecturas al aula**. Bloqueado de funciones administrativas globales. |
| **Administrador Principal** | `'admin'` | **Control Total de la Aplicación (`screen-admin-dashboard`)**: gestión global del directorio de usuarios en MongoDB con cambio dinámico de rol (`estudiante` ↔ `maestro` ↔ `admin`), monitor en tiempo real de usuarios conectados con desconexión forzada (Kick), difusión global de anuncios institucionales, asignación de lecturas y métricas de servidor. |

---

### 🔑 2. Cuentas Predeterminadas (Auto-creadas al Iniciar el Servidor)

Al arrancar `server.js` (o en modo local de contingencia), el sistema verifica y crea automáticamente las cuentas por defecto si no existen:

| Tipo de Acceso | Usuario | Contraseña | Rol Asignado |
|---|---|---|---|
| 👑 **Administrador Principal** | `admin` | `admin123` | `admin` |
| 👩‍🏫 **Maestro de Ejemplo** | `maestro` | `maestro123` | `maestro` |
| 🧒 **Estudiante de Ejemplo** | `estudiante` | `estudiante123` | `estudiante` |

> En la pantalla de autenticación (`index.html`) existen botones de **"Acceso Rápido Demo"** para ingresar directamente con cualquiera de los 3 roles con 1 solo clic.

---

### 🍃 3. Base de Datos y Backend (`server.js`)
- **Conexión Mongoose**: Utiliza la variable de entorno `process.env.MONGODB_URI` para conectar con MongoDB Atlas.
- **Modelo de Usuario (`User`)**:
  - `username`: String único, en minúsculas, requerido.
  - `password`: Encriptada de forma segura con `bcryptjs` (salt de 10 rondas).
  - `role`: Enum `['estudiante', 'maestro', 'admin', 'user']`.
  - `displayName`, `profile`, `createdAt`, `lastLogin`.
- **API REST y Seguridad**:
  - `POST /api/auth/register`: Registro de nuevas cuentas con selección de rol.
  - `POST /api/auth/login`: Autenticación con verificación por `bcryptjs` y emisión de tokens JWT.
  - `GET /api/auth/me`: Verificación de sesión activa.
  - `POST /api/admin/change-role`: Reasignación de roles por parte del administrador, con notificación en vivo vía Socket.io (`auth:role-updated`).
  - `GET /api/admin/stats`: Estadísticas consolidadas con distribución por rol.
- **Canal en Tiempo Real (Socket.io)**:
  - Evento `admin:broadcast-reading`: Envía lecturas asignadas desde el panel de Maestro o Admin a las pantallas activas de los estudiantes.
  - Evento `admin:broadcast-message`: Emite anuncios institucionales emergentes a toda el aula.
  - Sincronización en vivo de usuarios conectados con control de desconexión.

---

### 🖥️ 4. Cliente y Experiencia de Usuario (`index.html` y `js/app.js`)
- **Formulario Unificado de Login / Registro**: Selector de roles interactivo en el registro y atajos de demostración rápida.
- **Redirección Automática**:
  - `estudiante` ➡️ Pantalla de Bienvenida (`screen-welcome`) o Portal de Aventuras (`screen-dashboard`).
  - `maestro` ➡️ Panel Docente de Seguimiento (`screen-teacher-dashboard`).
  - `admin` ➡️ Panel de Administrador Principal (`screen-admin-dashboard`).
- **Persistencia de Sesión**: Guardado seguro en `localStorage` bajo la clave `leo_auth_session`.
- **Protección de Rutas**: Guardianes de navegación en `navigateTo()` que impiden a estudiantes entrar a paneles de docentes/administradores y a docentes entrar a la administración del servidor.

---

### 🚀 5. Cómo Ejecutar con Node.js y MongoDB Atlas
1. Copia `.env.example` a `.env` y configura tu cadena de conexión de MongoDB Atlas:
   ```env
   PORT=8080
   MONGODB_URI=mongodb+srv://<usuario>:<password>@cluster0.mongodb.net/leo_db?retryWrites=true&w=majority
   JWT_SECRET=tu_clave_secreta_jwt
   ```
2. Instala las dependencias necesarias:
   ```bash
   npm install
   ```
   *(Asegura: `mongoose`, `bcryptjs`, `jsonwebtoken`, `dotenv`, `cors`, `express`, `socket.io`)*
3. Inicia el servidor:
   ```bash
   npm start
   ```
4. Ingresa en tu navegador a:
   `http://localhost:8080/`

---

## 📁 8. Estructura del Proyecto

```text
leo-app/
├── .env                          # Variables de entorno locales
├── .env.example                  # Plantilla de configuración de MongoDB Atlas
├── package.json                  # Dependencias: mongoose, bcryptjs, jsonwebtoken, dotenv, cors, express, socket.io
├── server.js                     # Servidor Node.js con MongoDB Atlas, Socket.io y REST API
├── index.html                    # SPA con pantalla de Login/Registro y Panel de Administrador Principal
├── serve.ps1                     # Servidor local de respaldo en PowerShell
├── assets/
│   └── leo-logo.png              # Logo oficial original de Leo
├── css/
│   └── styles.css                # Sistema de diseño, pantalla de Auth y Panel de Administrador
└── js/
    ├── data/
    │   ├── diagnostic.js         # Prueba diagnóstica inicial en 5 etapas
    │   ├── readings.js           # Banco de 15 lecturas peruanas y preguntas
    │   └── gamification.js       # Logros, retos y avatar
    ├── services/
    │   ├── auth-service.js       # Autenticación, roles, localStorage y sync Socket.io
    │   ├── audio-service.js      # SFX + TTS + Reconocimiento de voz
    │   ├── ai-service.js         # Motor IA de preguntas y retroalimentación
    │   └── storage-service.js    # Repositorio y datos persistentes
    └── app.js                    # Controlador general de las 22 pantallas de la app
```

