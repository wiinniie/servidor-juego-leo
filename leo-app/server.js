/**
 * =========================================================================
 * LEO – Lectura, Escritura y Oralidad
 * Servidor Backend con Node.js, Express, Socket.io y MongoDB Atlas
 * =========================================================================
 * 
 * Funcionalidades:
 * 1. Conexión a MongoDB Atlas mediante Mongoose (process.env.MONGODB_URI).
 * 2. Modelo de usuario (User) con encriptación bcryptjs y roles ('admin' y 'user').
 * 3. Creación automática del Administrador Principal por defecto (admin / admin123).
 * 4. Endpoints REST y eventos Socket.io para Registro, Login y Verificación.
 * 5. Panel de Administrador Principal en tiempo real (usuarios conectados, moderación,
 *    asignación de lecturas/actividades y estadísticas globales).
 * 6. Servidor de archivos estáticos para la SPA LEO.
 */

require('dotenv').config();
const http = require('http');
const path = require('path');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

const PORT = process.env.PORT || 8080;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/leo_db';
const JWT_SECRET = process.env.JWT_SECRET || 'leo_secret_jwt_key_super_segura_2026_peru_educacion';

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// =========================================================================
// 1. MODELO DE USUARIO (MONGOOSE)
// =========================================================================

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'El nombre de usuario es obligatorio'],
    unique: true,
    trim: true,
    lowercase: true,
    minlength: [3, 'El nombre de usuario debe tener al menos 3 caracteres']
  },
  password: {
    type: String,
    required: [true, 'La contraseña es obligatoria'],
    minlength: [6, 'La contraseña debe tener al menos 6 caracteres']
  },
  role: {
    type: String,
    enum: ['estudiante', 'maestro', 'admin', 'user'],
    default: 'estudiante'
  },
  displayName: {
    type: String,
    default: ''
  },
  profile: {
    grade: { type: String, default: 'Primaria' },
    level: { type: String, default: 'INICIO' },
    points: { type: Number, default: 0 },
    streak: { type: Number, default: 1 }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastLogin: {
    type: Date,
    default: Date.now
  }
});

const User = mongoose.model('User', userSchema);

// Función auxiliar para normalizar roles
function normalizeRole(role) {
  const r = String(role || '').toLowerCase().trim();
  if (r === 'admin' || r === 'administrador') return 'admin';
  if (r === 'maestro' || r === 'profesor' || r === 'docente' || r === 'teacher') return 'maestro';
  return 'estudiante';
}

// Almacén en memoria de usuarios conectados en tiempo real
// socketId -> { socketId, userId, username, role, connectedAt, activeScreen, currentActivity, ip }
const connectedUsers = new Map();

// Estado de conexión a base de datos
let isMongoConnected = false;

// Almacén auxiliar en memoria en caso de no haber conexión con MongoDB Atlas
const inMemoryFallbackUsers = new Map();

// =========================================================================
// 2. CONEXIÓN A MONGODB ATLAS Y CREACIÓN DE CUENTAS POR DEFECTO
// =========================================================================

async function ensureDefaultAccounts() {
  const defaultAccounts = [
    {
      username: 'admin',
      passwordPlain: 'admin123',
      role: 'admin',
      displayName: 'Administrador Principal LEO'
    },
    {
      username: 'maestro',
      passwordPlain: 'maestro123',
      role: 'maestro',
      displayName: 'Maestro de Aula LEO'
    },
    {
      username: 'estudiante',
      passwordPlain: 'estudiante123',
      role: 'estudiante',
      displayName: 'Estudiante Ejemplo'
    }
  ];

  for (const acc of defaultAccounts) {
    try {
      if (isMongoConnected) {
        let existing = await User.findOne({ username: acc.username });
        if (!existing) {
          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash(acc.passwordPlain, salt);

          const newUser = new User({
            username: acc.username,
            password: hashedPassword,
            role: acc.role,
            displayName: acc.displayName
          });

          await newUser.save();
          console.log(`👑 [CUENTA CREADA] ${acc.displayName}:`);
          console.log(`   - Usuario:    ${acc.username}`);
          console.log(`   - Contraseña: ${acc.passwordPlain}`);
          console.log(`   - Rol:        ${acc.role}`);
        } else {
          if (existing.role !== acc.role) {
            existing.role = acc.role;
            await existing.save();
          }
          console.log(`✅ [CUENTA ACTIVA] ${acc.username} (${acc.role}) verificado en MongoDB.`);
        }
      } else {
        // Modo local en memoria
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(acc.passwordPlain, salt);
        inMemoryFallbackUsers.set(acc.username, {
          _id: 'mem_' + acc.username,
          username: acc.username,
          password: hashedPassword,
          role: acc.role,
          displayName: acc.displayName,
          createdAt: new Date(),
          lastLogin: new Date()
        });
        console.log(`ℹ️ [CUENTA LOCAL] ${acc.username} (${acc.role}) cargado en memoria de respaldo.`);
      }
    } catch (err) {
      console.error(`❌ Error al crear cuenta por defecto (${acc.username}):`, err.message);
    }
  }
}

async function connectToMongoDB() {
  try {
    console.log('🔄 Conectando a MongoDB Atlas...');
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000
    });
    isMongoConnected = true;
    console.log('============================================================');
    console.log('🟢 [MONGODB ATLAS] Conexión establecida exitosamente.');
    console.log('============================================================');
    await ensureDefaultAccounts();
  } catch (error) {
    isMongoConnected = false;
    console.warn('⚠️ [AVISO MONGODB] No se pudo conectar a MongoDB Atlas:', error.message);
    console.warn('ℹ️ El servidor continuará operando en modo local con almacenamiento de respaldo.');
    console.warn('💡 Para conectar Atlas, verifica tu variable MONGODB_URI en el archivo .env');
    await ensureDefaultAccounts();
  }
}

mongoose.connection.on('disconnected', () => {
  isMongoConnected = false;
  console.log('⚠️ [MONGODB ATLAS] Conexión desconectada.');
});

// =========================================================================
// 3. CONTROLADORES AUXILIARES DE USUARIOS (MONGODB + FALLBACK)
// =========================================================================

async function findUserByUsername(username) {
  const cleanUsername = String(username).trim().toLowerCase();
  if (isMongoConnected) {
    return await User.findOne({ username: cleanUsername });
  } else {
    return inMemoryFallbackUsers.get(cleanUsername) || null;
  }
}

async function createUserRecord({ username, password, role, displayName }) {
  const cleanUsername = String(username).trim().toLowerCase();
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const userRole = normalizeRole(role);

  if (isMongoConnected) {
    const newUser = new User({
      username: cleanUsername,
      password: hashedPassword,
      role: userRole,
      displayName: displayName || cleanUsername
    });
    await newUser.save();
    return newUser;
  } else {
    const memUser = {
      _id: 'mem_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      username: cleanUsername,
      password: hashedPassword,
      role: userRole,
      displayName: displayName || cleanUsername,
      profile: { grade: 'Primaria', level: 'INICIO', points: 0, streak: 1 },
      createdAt: new Date(),
      lastLogin: new Date()
    };
    inMemoryFallbackUsers.set(cleanUsername, memUser);
    return memUser;
  }
}

function generateToken(user) {
  return jwt.sign(
    {
      id: user._id,
      username: user.username,
      role: user.role
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

// =========================================================================
// 4. RUTAS REST DE AUTENTICACIÓN Y ADMINISTRACIÓN
// =========================================================================

// REGISTRO DE USUARIOS (POST /api/auth/register o POST /api/register)
const handleRegister = async (req, res) => {
  try {
    const { username, password, role, displayName } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'El nombre de usuario y la contraseña son obligatorios.'
      });
    }

    if (username.trim().length < 3) {
      return res.status(400).json({
        success: false,
        message: 'El usuario debe tener al menos 3 caracteres.'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'La contraseña debe tener al menos 6 caracteres.'
      });
    }

    const cleanUsername = username.trim().toLowerCase();
    const existing = await findUserByUsername(cleanUsername);

    if (existing) {
      return res.status(409).json({
        success: false,
        message: `El usuario "${cleanUsername}" ya se encuentra registrado.`
      });
    }

    const user = await createUserRecord({
      username: cleanUsername,
      password,
      role: role || 'user',
      displayName
    });

    const token = generateToken(user);

    return res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente en LEO.',
      token,
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
        displayName: user.displayName || user.username
      }
    });
  } catch (error) {
    console.error('Error en registro:', error);
    return res.status(500).json({
      success: false,
      message: 'Error en el servidor al registrar usuario: ' + error.message
    });
  }
};

app.post('/api/auth/register', handleRegister);
app.post('/api/register', handleRegister);

// LOGIN DE USUARIOS (POST /api/auth/login o POST /api/login)
const handleLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Debes ingresar usuario y contraseña.'
      });
    }

    const cleanUsername = username.trim().toLowerCase();
    const user = await findUserByUsername(cleanUsername);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas: el usuario no existe.'
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas: contraseña incorrecta.'
      });
    }

    // Actualizar última fecha de login
    if (isMongoConnected && user.save) {
      user.lastLogin = new Date();
      await user.save().catch(() => {});
    }

    const token = generateToken(user);

    return res.json({
      success: true,
      message: 'Inicio de sesión exitoso.',
      token,
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
        displayName: user.displayName || user.username
      }
    });
  } catch (error) {
    console.error('Error en login:', error);
    return res.status(500).json({
      success: false,
      message: 'Error en el servidor al iniciar sesión: ' + error.message
    });
  }
};

app.post('/api/auth/login', handleLogin);
app.post('/api/login', handleLogin);

// VERIFICAR TOKEN / SESIÓN ACTUAL (GET /api/auth/me)
app.get('/api/auth/me', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Token no proporcionado.' });
  }

  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await findUserByUsername(decoded.username);

    if (!user) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado.' });
    }

    return res.json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
        displayName: user.displayName || user.username
      }
    });
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Token inválido o expirado.' });
  }
});

// ESTADÍSTICAS Y GESTIÓN PARA ADMINISTRADOR PRINCIPAL
app.get('/api/admin/stats', async (req, res) => {
  try {
    let totalRegistered = 0;
    let usersByRole = { admin: 0, maestro: 0, estudiante: 0 };

    if (isMongoConnected) {
      totalRegistered = await User.countDocuments();
      usersByRole.admin = await User.countDocuments({ role: 'admin' });
      usersByRole.maestro = await User.countDocuments({ role: { $in: ['maestro', 'docente', 'teacher'] } });
      usersByRole.estudiante = await User.countDocuments({ role: { $in: ['estudiante', 'user'] } });
    } else {
      totalRegistered = inMemoryFallbackUsers.size;
      for (const u of inMemoryFallbackUsers.values()) {
        const norm = normalizeRole(u.role);
        usersByRole[norm] = (usersByRole[norm] || 0) + 1;
      }
    }

    const connectedList = Array.from(connectedUsers.values());

    return res.json({
      success: true,
      dbStatus: isMongoConnected ? 'connected_atlas' : 'local_fallback',
      stats: {
        totalRegisteredUsers: totalRegistered,
        connectedUsersCount: connectedList.length,
        adminCount: usersByRole.admin,
        teacherCount: usersByRole.maestro,
        studentCount: usersByRole.estudiante,
        connectedUsers: connectedList
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// LISTA DE USUARIOS REGISTRADOS
app.get('/api/admin/users', async (req, res) => {
  try {
    let usersList = [];
    if (isMongoConnected) {
      usersList = await User.find({}, '-password').sort({ createdAt: -1 });
    } else {
      usersList = Array.from(inMemoryFallbackUsers.values()).map(u => ({
        _id: u._id,
        username: u.username,
        role: u.role,
        displayName: u.displayName,
        createdAt: u.createdAt,
        lastLogin: u.lastLogin
      }));
    }
    return res.json({ success: true, users: usersList });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// MODIFICAR/ASIGNAR ROL DE USUARIO (CONTROL TOTAL DE ADMINISTRADOR PRINCIPAL)
app.post('/api/admin/change-role', async (req, res) => {
  try {
    const { username, newRole } = req.body;
    if (!username || !newRole) {
      return res.status(400).json({ success: false, message: 'Usuario y nuevo rol requeridos.' });
    }

    const cleanUsername = String(username).toLowerCase().trim();
    const cleanRole = normalizeRole(newRole);

    let updatedUser = null;
    if (isMongoConnected) {
      updatedUser = await User.findOneAndUpdate(
        { username: cleanUsername },
        { role: cleanRole },
        { new: true }
      );
    } else {
      const u = inMemoryFallbackUsers.get(cleanUsername);
      if (u) {
        u.role = cleanRole;
        updatedUser = u;
      }
    }

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado.' });
    }

    // Actualizar rol en sockets conectados y emitir notificación en tiempo real
    for (const [sId, entry] of connectedUsers.entries()) {
      if (entry.username === cleanUsername) {
        entry.role = cleanRole;
        io.to(sId).emit('auth:role-updated', {
          newRole: cleanRole,
          message: `Tu rol ha sido actualizado a "${cleanRole.toUpperCase()}" por el Administrador Principal.`
        });
      }
    }
    broadcastAdminUpdate();

    return res.json({
      success: true,
      message: `Rol del usuario @${cleanUsername} modificado exitosamente a "${cleanRole}".`,
      user: {
        username: updatedUser.username,
        role: updatedUser.role
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// ESTADO GENERAL / HEALTH CHECK
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    app: 'LEO - Lectura, Escritura y Oralidad',
    mongoConnected: isMongoConnected,
    connectedSockets: io.engine.clientsCount,
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date()
  });
});

// Fallback SPA routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// =========================================================================
// 5. EVENTOS SOCKET.IO EN TIEMPO REAL
// =========================================================================

function broadcastAdminUpdate() {
  const usersArray = Array.from(connectedUsers.values());
  const statsPayload = {
    connectedCount: usersArray.length,
    users: usersArray,
    timestamp: new Date().toISOString()
  };
  io.to('admin_room').emit('admin:users-update', statsPayload);
}

io.on('connection', (socket) => {
  console.log(`🔌 [SOCKET CONECTADO] id=${socket.id} (Total: ${io.engine.clientsCount})`);

  // Registro de usuario vía Socket.io
  socket.on('auth:register', async (data, callback) => {
    try {
      const { username, password, role, displayName } = data || {};
      if (!username || !password) {
        return callback && callback({ success: false, message: 'Usuario y contraseña requeridos.' });
      }
      const cleanUsername = String(username).trim().toLowerCase();
      const existing = await findUserByUsername(cleanUsername);
      if (existing) {
        return callback && callback({ success: false, message: 'El usuario ya existe.' });
      }

      const user = await createUserRecord({
        username: cleanUsername,
        password,
        role: role || 'user',
        displayName
      });

      const token = generateToken(user);
      const userPayload = {
        id: user._id,
        username: user.username,
        role: user.role,
        displayName: user.displayName || user.username
      };

      // Registrar sesión activa
      connectedUsers.set(socket.id, {
        socketId: socket.id,
        userId: user._id,
        username: user.username,
        role: user.role,
        displayName: userPayload.displayName,
        connectedAt: new Date(),
        activeScreen: 'screen-dashboard',
        currentActivity: 'Explorando aventuras'
      });

      if (user.role === 'admin') {
        socket.join('admin_room');
      }

      broadcastAdminUpdate();

      if (callback) {
        callback({
          success: true,
          message: 'Registro exitoso.',
          token,
          user: userPayload
        });
      }
    } catch (err) {
      if (callback) callback({ success: false, message: err.message });
    }
  });

  // Login de usuario vía Socket.io
  socket.on('auth:login', async (data, callback) => {
    try {
      const { username, password } = data || {};
      if (!username || !password) {
        return callback && callback({ success: false, message: 'Credenciales incompletas.' });
      }

      const cleanUsername = String(username).trim().toLowerCase();
      const user = await findUserByUsername(cleanUsername);

      if (!user) {
        return callback && callback({ success: false, message: 'Usuario no encontrado.' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return callback && callback({ success: false, message: 'Contraseña incorrecta.' });
      }

      const token = generateToken(user);
      const userPayload = {
        id: user._id,
        username: user.username,
        role: user.role,
        displayName: user.displayName || user.username
      };

      const initialScreen = user.role === 'admin' 
        ? 'screen-admin-dashboard' 
        : (user.role === 'maestro' ? 'screen-teacher-dashboard' : 'screen-dashboard');
      const initialActivity = user.role === 'admin' 
        ? 'Panel de Control Principal 👑' 
        : (user.role === 'maestro' ? 'Seguimiento Docente 👩‍🏫' : 'En el portal de lectura 🧒');

      connectedUsers.set(socket.id, {
        socketId: socket.id,
        userId: user._id,
        username: user.username,
        role: user.role,
        displayName: userPayload.displayName,
        connectedAt: new Date(),
        activeScreen: initialScreen,
        currentActivity: initialActivity
      });

      if (user.role === 'admin') {
        socket.join('admin_room');
      } else if (user.role === 'maestro') {
        socket.join('teacher_room');
      }

      broadcastAdminUpdate();

      if (callback) {
        callback({
          success: true,
          message: 'Bienvenido a LEO.',
          token,
          user: userPayload
        });
      }
    } catch (err) {
      if (callback) callback({ success: false, message: err.message });
    }
  });

  // Identificar socket con sesión existente de localStorage
  socket.on('auth:identify', async (data, callback) => {
    try {
      const { token, user } = data || {};
      let verifiedUser = user;

      if (token) {
        try {
          const decoded = jwt.verify(token, JWT_SECRET);
          const dbUser = await findUserByUsername(decoded.username);
          if (dbUser) {
            verifiedUser = {
              id: dbUser._id,
              username: dbUser.username,
              role: dbUser.role,
              displayName: dbUser.displayName || dbUser.username
            };
          }
        } catch (jwtErr) {
          // Token inválido pero mantenemos datos si existen
        }
      }

      if (verifiedUser && verifiedUser.username) {
        connectedUsers.set(socket.id, {
          socketId: socket.id,
          userId: verifiedUser.id || verifiedUser._id,
          username: verifiedUser.username,
          role: verifiedUser.role,
          displayName: verifiedUser.displayName || verifiedUser.username,
          connectedAt: new Date(),
          activeScreen: verifiedUser.role === 'admin' ? 'screen-admin-dashboard' : 'screen-dashboard',
          currentActivity: verifiedUser.role === 'admin' ? 'Control de Administrador' : 'Aventura activa'
        });

        if (verifiedUser.role === 'admin') {
          socket.join('admin_room');
        }

        broadcastAdminUpdate();
        if (callback) callback({ success: true, user: verifiedUser });
      }
    } catch (err) {
      if (callback) callback({ success: false, message: err.message });
    }
  });

  // Notificar cambio de pantalla / actividad del estudiante en tiempo real
  socket.on('user:activity-update', (data) => {
    const entry = connectedUsers.get(socket.id);
    if (entry) {
      if (data.screen) entry.activeScreen = data.screen;
      if (data.activity) entry.currentActivity = data.activity;
      broadcastAdminUpdate();
    }
  });

  // =========================================================================
  // CONTROL TOTAL: ACCIONES DEL ADMINISTRADOR PRINCIPAL
  // =========================================================================

  // Solicitar lista completa de usuarios conectados y métricas
  socket.on('admin:request-live-data', () => {
    const usersArray = Array.from(connectedUsers.values());
    socket.emit('admin:users-update', {
      connectedCount: usersArray.length,
      users: usersArray,
      isMongoConnected,
      timestamp: new Date().toISOString()
    });
  });

  // Moderación en tiempo real: Desconectar o expulsar a un usuario
  socket.on('admin:kick-user', (data, callback) => {
    const { targetSocketId, reason } = data || {};
    const targetSocket = io.sockets.sockets.get(targetSocketId);

    if (targetSocket) {
      targetSocket.emit('auth:kicked', {
        message: reason || 'Tu sesión ha sido finalizada por el Administrador Principal.'
      });
      targetSocket.disconnect(true);
      connectedUsers.delete(targetSocketId);
      broadcastAdminUpdate();
      if (callback) callback({ success: true, message: 'Usuario desconectado exitosamente.' });
    } else {
      if (callback) callback({ success: false, message: 'El usuario ya no se encuentra en línea.' });
    }
  });

  // Moderación en tiempo real: Enviar mensaje directo a un usuario
  socket.on('admin:send-direct-message', (data, callback) => {
    const { targetSocketId, message, title } = data || {};
    const targetSocket = io.sockets.sockets.get(targetSocketId);

    if (targetSocket) {
      targetSocket.emit('system:direct-message', {
        title: title || 'Mensaje del Administrador',
        message: message || '',
        sentAt: new Date().toLocaleTimeString('es-PE')
      });
      if (callback) callback({ success: true });
    } else {
      if (callback) callback({ success: false, message: 'Usuario no disponible.' });
    }
  });

  // Difusión global: Transmitir anuncio o reto a todos los usuarios
  socket.on('admin:broadcast-message', (data, callback) => {
    const { title, message, type } = data || {};
    io.emit('system:announcement', {
      title: title || '📢 Mensaje Institucional LEO',
      message: message || '',
      type: type || 'info', // 'info', 'success', 'warning'
      timestamp: new Date().toLocaleTimeString('es-PE')
    });
    if (callback) callback({ success: true, count: io.engine.clientsCount });
  });

  // Asignar lectura en tiempo real a todos los estudiantes o uno específico
  socket.on('admin:broadcast-reading', (data, callback) => {
    const { readingId, readingTitle, level, targetSocketId, assignedBy } = data || {};
    const payload = {
      readingId,
      readingTitle,
      level,
      assignedBy: assignedBy || 'Docente / Administrador',
      timestamp: new Date().toISOString()
    };

    if (targetSocketId) {
      const target = io.sockets.sockets.get(targetSocketId);
      if (target) {
        target.emit('student:assigned-reading', payload);
      }
    } else {
      // A todos los sockets que no sean admin
      socket.broadcast.emit('student:assigned-reading', payload);
    }

    if (callback) callback({ success: true });
  });

  // Desconexión de socket
  socket.on('disconnect', () => {
    console.log(`🔌 [SOCKET DESCONECTADO] id=${socket.id}`);
    connectedUsers.delete(socket.id);
    broadcastAdminUpdate();
  });
});

// Iniciar servidor y base de datos
server.listen(PORT, async () => {
  console.log('============================================================');
  console.log(`🚀 [LEO SERVER] Servidor ejecutándose en el puerto ${PORT}`);
  console.log(`🌐 Accede en el navegador: http://localhost:${PORT}`);
  console.log('============================================================');
  await connectToMongoDB();
});
