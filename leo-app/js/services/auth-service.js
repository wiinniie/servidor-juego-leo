/**
 * =========================================================================
 * LEO – Lectura, Escritura y Oralidad
 * Servicio de Autenticación, Roles y Sincronización en Tiempo Real
 * =========================================================================
 * 
 * Gestiona:
 * - Inicio de sesión y Registro de usuarios con roles ('admin' y 'user').
 * - Persistencia de sesión en localStorage ('leo_auth_session').
 * - Comunicación vía REST API y eventos Socket.io.
 * - Soporte resiliente con fallback local si el servidor aún se está iniciando.
 */

class AuthService {
  constructor() {
    this.STORAGE_KEY_SESSION = "leo_auth_session";
    this.currentUser = null;
    this.token = null;
    this.socket = typeof socket !== "undefined" ? socket : null;
    this.isBackendOnline = false;

    this.initSession();
    this.setupSocketListeners();
  }

  // 1. Inicialización y persistencia en localStorage
  initSession() {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY_SESSION);
      if (raw) {
        const session = JSON.parse(raw);
        if (session && session.user && session.user.username) {
          this.currentUser = session.user;
          this.token = session.token || null;
          console.log(`🔑 Sesión recuperada de localStorage: ${this.currentUser.username} (${this.currentUser.role})`);
        }
      }
    } catch (e) {
      console.warn("Error al recuperar sesión de localStorage:", e);
      localStorage.removeItem(this.STORAGE_KEY_SESSION);
    }
  }

  saveSession(user, token) {
    this.currentUser = user;
    this.token = token || null;
    const sessionData = {
      user: {
        id: user.id || user._id,
        username: user.username,
        role: user.role || "user",
        displayName: user.displayName || user.username
      },
      token: this.token,
      loggedInAt: new Date().toISOString()
    };
    localStorage.setItem(this.STORAGE_KEY_SESSION, JSON.stringify(sessionData));

    // Identificar usuario en Socket.io
    if (this.socket && this.socket.connected) {
      this.socket.emit("auth:identify", { token: this.token, user: this.currentUser });
    }
  }

  clearSession() {
    this.currentUser = null;
    this.token = null;
    localStorage.removeItem(this.STORAGE_KEY_SESSION);
  }

  isAuthenticated() {
    return !!(this.currentUser && this.currentUser.username);
  }

  isAdmin() {
    return this.isAuthenticated() && this.currentUser.role === "admin";
  }

  isUser() {
    return this.isAuthenticated() && this.currentUser.role === "user";
  }

  getCurrentUser() {
    return this.currentUser;
  }

  // 2. Conexión de listeners Socket.io
  setupSocketListeners() {
    if (!this.socket) return;

    this.socket.on("connect", () => {
      this.isBackendOnline = true;
      console.log("⚡ [Socket.io] Conectado al servidor LEO con ID:", this.socket.id);
      if (this.isAuthenticated()) {
        this.socket.emit("auth:identify", { token: this.token, user: this.currentUser });
      }
    });

    this.socket.on("disconnect", () => {
      this.isBackendOnline = false;
      console.log("🔌 [Socket.io] Desconectado del servidor LEO");
    });

    // Evento de moderación: cuando el Administrador Principal expulsa al usuario
    this.socket.on("auth:kicked", (data) => {
      alert("⚠️ AVISO DEL ADMINISTRADOR:\n" + (data.message || "Tu sesión ha sido finalizada."));
      this.clearSession();
      if (window.leoApp) {
        window.leoApp.navigateTo("screen-auth");
        window.leoApp.updateNavbarUser();
      }
    });

    // Evento de anuncio global emitido por el Administrador
    this.socket.on("system:announcement", (data) => {
      if (window.leoApp && typeof window.leoApp.showSystemAnnouncement === "function") {
        window.leoApp.showSystemAnnouncement(data);
      }
    });

    // Evento de mensaje directo del Administrador
    this.socket.on("system:direct-message", (data) => {
      if (window.leoApp && typeof window.leoApp.showDirectMessageModal === "function") {
        window.leoApp.showDirectMessageModal(data);
      }
    });

    // Evento de lectura asignada en tiempo real por el Administrador
    this.socket.on("student:assigned-reading", (data) => {
      if (window.leoApp && typeof window.leoApp.handleAssignedReading === "function") {
        window.leoApp.handleAssignedReading(data);
      }
    });
  }

  // 3. Inicio de sesión (Login)
  async login(username, password) {
    const cleanUser = String(username).trim().toLowerCase();

    // Intentar vía REST API
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: cleanUser, password })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.user) {
          this.saveSession(data.user, data.token);
          return { success: true, user: data.user, message: data.message };
        }
      } else {
        const errData = await response.json().catch(() => ({}));
        // Si el servidor respondió con un error formal (ej. contraseña incorrecta)
        if (response.status === 401 || response.status === 400 || response.status === 404) {
          return {
            success: false,
            message: errData.message || "Credenciales incorrectas. Verifica tu usuario y contraseña."
          };
        }
      }
    } catch (fetchErr) {
      console.warn("REST API no respondió, intentando vía Socket o fallback local:", fetchErr.message);
    }

    // Intentar vía Socket.io si REST no estuvo disponible
    if (this.socket && this.socket.connected) {
      return new Promise((resolve) => {
        this.socket.emit("auth:login", { username: cleanUser, password }, (res) => {
          if (res && res.success) {
            this.saveSession(res.user, res.token);
            resolve({ success: true, user: res.user, message: res.message });
          } else {
            resolve({
              success: false,
              message: res ? res.message : "Error al autenticar mediante Socket."
            });
          }
        });
      });
    }

    // Fallback de contingencia local: si el servidor backend aún no se ha levantado
    // Permite validar de inmediato las credenciales por defecto especificadas
    if (cleanUser === "admin" && password === "admin123") {
      const mockAdmin = {
        id: "mem_admin_001",
        username: "admin",
        role: "admin",
        displayName: "Administrador Principal"
      };
      this.saveSession(mockAdmin, "mock_token_admin_2026");
      return {
        success: true,
        user: mockAdmin,
        message: "Inicio de sesión concedido como Administrador Principal (Modo Local)."
      };
    }

    // Si es un usuario existente en localStorage de estudiantes o pruebas
    const savedUsersRaw = localStorage.getItem("leo_local_registered_users");
    const localUsers = savedUsersRaw ? JSON.parse(savedUsersRaw) : [];
    const found = localUsers.find(u => u.username === cleanUser);
    if (found) {
      if (found.password === password) {
        this.saveSession(found, "mock_token_user_" + found.id);
        return { success: true, user: found, message: "Inicio de sesión exitoso." };
      } else {
        return { success: false, message: "Contraseña incorrecta." };
      }
    }

    return {
      success: false,
      message: "Usuario no encontrado. Por favor verifica tus datos o regístrate en la pestaña 'Crear Cuenta'."
    };
  }

  // 4. Registro de usuarios (Register)
  async register(username, password, role = "user", displayName = "") {
    const cleanUser = String(username).trim().toLowerCase();
    const cleanRole = role === "admin" ? "admin" : "user";

    // Intentar vía REST API
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: cleanUser,
          password,
          role: cleanRole,
          displayName: displayName || cleanUser
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.user) {
          this.saveSession(data.user, data.token);
          return { success: true, user: data.user, message: data.message };
        }
      } else {
        const errData = await response.json().catch(() => ({}));
        return {
          success: false,
          message: errData.message || "Error al registrar el usuario en el servidor."
        };
      }
    } catch (fetchErr) {
      console.warn("REST API no respondió en registro, usando Socket o respaldo:", fetchErr.message);
    }

    // Intentar vía Socket.io
    if (this.socket && this.socket.connected) {
      return new Promise((resolve) => {
        this.socket.emit("auth:register", {
          username: cleanUser,
          password,
          role: cleanRole,
          displayName: displayName || cleanUser
        }, (res) => {
          if (res && res.success) {
            this.saveSession(res.user, res.token);
            resolve({ success: true, user: res.user, message: res.message });
          } else {
            resolve({
              success: false,
              message: res ? res.message : "Error al registrar mediante Socket."
            });
          }
        });
      });
    }

    // Fallback de contingencia local
    const savedUsersRaw = localStorage.getItem("leo_local_registered_users");
    const localUsers = savedUsersRaw ? JSON.parse(savedUsersRaw) : [];
    if (localUsers.some(u => u.username === cleanUser)) {
      return { success: false, message: `El usuario "${cleanUser}" ya existe.` };
    }

    const newUser = {
      id: "usr_" + Date.now(),
      username: cleanUser,
      password: password, // En fallback local para desarrollo
      role: cleanRole,
      displayName: displayName || cleanUser,
      createdAt: new Date().toISOString()
    };
    localUsers.push(newUser);
    localStorage.setItem("leo_local_registered_users", JSON.stringify(localUsers));

    this.saveSession(newUser, "mock_token_" + newUser.id);
    return {
      success: true,
      user: newUser,
      message: "¡Usuario registrado exitosamente! Bienvenido a LEO."
    };
  }

  // Notificar al servidor cambio de actividad
  notifyActivity(screen, activity) {
    if (this.socket && this.socket.connected) {
      this.socket.emit("user:activity-update", { screen, activity });
    }
  }

  // Solicitar métricas y usuarios conectados (solo Admin)
  async fetchAdminStats() {
    try {
      const res = await fetch("/api/admin/stats");
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn("No se pudo obtener stats vía REST:", e);
    }
    return null;
  }
}

// Inicialización global
window.authService = new AuthService();
