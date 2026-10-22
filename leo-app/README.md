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

## 🔐 7. Arquitectura de Autenticación, Roles y Persistencia en MongoDB Atlas

La versión 2.0 de LEO incluye una arquitectura cliente-servidor robusta con:

### 🍃 Persistencia con MongoDB Atlas & Mongoose
- **Mongoose ODM**: Conexión a MongoDB Atlas mediante `process.env.MONGODB_URI`.
- **Modelo de Usuario (`User`)**:
  - `username` (String, único, en minúsculas, validado).
  - `password` (String, encriptada con `bcryptjs` con 10 rondas de salt).
  - `role` (String, `'admin'` o `'user'`).
  - `displayName`, `profile`, `createdAt`, `lastLogin`.
- **Administrador Principal por Defecto**:
  Al arrancar el servidor `server.js`, verifica automáticamente si existe el administrador; si no existe, lo crea con:
  - **Usuario:** `admin`
  - **Contraseña:** `admin123`
  - **Rol:** `admin`

### 👥 Manejo de Roles
1. **Rol Usuario / Estudiante (`user`)**:
   - Acceso inmediato al mundo de aprendizaje interactivo.
   - Evaluación diagnóstica, ruleta de lectura, 15 preguntas con comodín y retroalimentación pedagógica.
   - Guardado automático de sesión en `localStorage` (`leo_auth_session`).
2. **Rol Administrador Principal (`admin`)**:
   - **Panel de Control Total (`screen-admin-dashboard`)**:
     - **Gestión de usuarios en vivo**: Monitor en tiempo real de estudiantes conectados vía Socket.io.
     - **Moderación instantánea**: Capacidad de enviar avisos directos o forzar desconexión (Kick) a usuarios activos.
     - **Asignación en vivo**: Lanzar lecturas o actividades sincrónicas a todos los estudiantes con 1 clic.
     - **Difusión global**: Transmisión de anuncios y retos a todas las pantallas conectadas.
     - **Estadísticas generales**: Métricas en tiempo real de registros en MongoDB Atlas, usuarios en línea y catálogo.

### 🚀 Cómo Ejecutar con Node.js y MongoDB Atlas
1. Copia `.env.example` a `.env` y define tu cadena de conexión:
   ```env
   PORT=8080
   MONGODB_URI=mongodb+srv://<usuario>:<password>@cluster0.mongodb.net/leo_db?retryWrites=true&w=majority
   JWT_SECRET=tu_clave_secreta_jwt
   ```
2. Instala dependencias y arranca el servidor:
   ```bash
   npm install
   npm start
   ```
3. Accede en tu navegador a:
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

