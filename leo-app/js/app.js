const socketUrl = (typeof window !== 'undefined' && window.location.protocol.startsWith('http'))
  ? window.location.origin
  : 'https://servidor-juego-leo.onrender.com';
const socket = (typeof io !== 'undefined') ? io(socketUrl, { reconnection: true }) : null;

/**
 * LEO – Lectura, Escritura y Oralidad
 * Controlador Principal de la Aplicación (SPA)
 * 
 * Gestiona autenticación con roles ('admin' y 'user'), persistencia con MongoDB Atlas,
 * panel de Administrador Principal con control total en tiempo real vía Socket.io,
 * evaluación diagnóstica, ruleta de lectura, cuestionario de 15 preguntas y panel docente.
 */

class LeoApp {
  constructor() {
    this.currentScreen = "screen-auth";
    this.userMode = "STUDENT"; // "STUDENT" o "TEACHER"
    this.activeReading = null;
    this.activeQuizQuestions = [];
    this.currentQuestionIndex = 0;
    this.quizAnswers = {};
    this.comodinUsedThisReading = false;
    this.quizStats = { literalCorrect: 0, inferentialCorrect: 0, criticalCorrect: 0, openScores: [] };

    // Diagnóstico en curso
    this.diagnosticAnswers = {};
    this.diagnosticStepIndex = 0;
    this.diagnosticItemsFlat = [];

    // Taller de escritura / etapas
    this.earlyStageActive = 1;

    // Ruleta
    this.isSpinningWheel = false;

    // Docente y Administración
    this.selectedPendingReading = null;
    this.selectedStudentForDetail = null;
    this.adminLiveUsers = [];

    document.addEventListener("DOMContentLoaded", () => this.init());
  }

  init() {
    this.bindGlobalEvents();
    this.setupSocketGlobalEvents();
    this.updateNavbarUser();
    this.renderProfilesList();
    this.initRouletteCanvas();
    this.checkInitialScreen();
  }

  setupSocketGlobalEvents() {
    if (!socket) return;

    // Actualizaciones en tiempo real del panel de administrador
    socket.on("admin:users-update", (data) => {
      if (data && data.users) {
        this.adminLiveUsers = data.users;
        if (this.currentScreen === "screen-admin-dashboard") {
          this.renderAdminLiveUsers(data.users);
          const connCountEl = document.getElementById("admin-stat-connected-users");
          if (connCountEl) connCountEl.innerText = data.users.length;
        }
      }
    });
  }

  checkInitialScreen() {
    // 1. Verificar si hay sesión activa en localStorage
    if (!window.authService || !window.authService.isAuthenticated()) {
      this.navigateTo("screen-auth");
      return;
    }

    const currentUser = window.authService.getCurrentUser();

    // 2. Si el usuario es Administrador Principal ('admin')
    if (currentUser && currentUser.role === "admin") {
      this.navigateTo("screen-admin-dashboard");
      return;
    }

    // 3. Si el usuario es Estudiante ('user')
    const currentStudent = window.storageService.getCurrentStudent();
    if (currentStudent) {
      if (!currentStudent.diagnosticDone) {
        this.navigateTo("screen-welcome");
      } else {
        this.navigateTo("screen-dashboard");
      }
    } else {
      this.navigateTo("screen-welcome");
    }
  }

  // =========================================================================
  // NAVEGACIÓN Y PANTALLAS
  // =========================================================================

  navigateTo(screenId) {
    // Control de seguridad por roles
    if (screenId === "screen-admin-dashboard") {
      if (!window.authService || !window.authService.isAdmin()) {
        alert("🔒 Acceso Restringido: Se requiere rol de Administrador Principal.");
        return this.navigateTo("screen-dashboard");
      }
    }

    if (screenId !== "screen-auth") {
      if (!window.authService || !window.authService.isAuthenticated()) {
        return this.navigateTo("screen-auth");
      }
    }

    window.audioService.stopReading();
    window.audioService.stopOralRecording();

    // Actualizar visibilidad de pantallas
    document.querySelectorAll(".app-screen").forEach(el => {
      el.classList.remove("active");
    });

    const targetEl = document.getElementById(screenId);
    if (targetEl) {
      targetEl.classList.add("active");
      this.currentScreen = screenId;
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    this.onScreenLoaded(screenId);
    this.updateNavbarUser();

    // Notificar al servidor el cambio de actividad en tiempo real
    if (window.authService) {
      window.authService.notifyActivity(screenId, this.getActivityName(screenId));
    }
  }

  getActivityName(screenId) {
    const names = {
      "screen-auth": "En pantalla de acceso / login",
      "screen-admin-dashboard": "Control de Administrador Principal 👑",
      "screen-welcome": "Pantalla de bienvenida",
      "screen-profiles": "Seleccionando perfil de estudiante",
      "screen-create-student": "Creando nuevo estudiante",
      "screen-diagnostic": "Realizando diagnóstico pedagógico 🟢",
      "screen-diagnostic-result": "Revisando resultado de diagnóstico",
      "screen-dashboard": "En el portal principal de aventuras",
      "screen-library": "Explorando biblioteca de lecturas peruanas 🇵🇪",
      "screen-roulette": "Girando la ruleta mágica 🎡",
      "screen-reader": "Leyendo historia con audio y texto 📖",
      "screen-comprehension": "Respondiendo cuestionario de 15 preguntas 🧠",
      "screen-activity-result": "Viendo resultados de comprensión",
      "screen-early-literacy": "En el taller de sílabas y palabras",
      "screen-orality": "En la cabina de voz y oratoria 🎙️",
      "screen-writing": "En el taller de escritura creativa ✍️",
      "screen-avatar": "Personalizando avatar andino / amazónico 🦁",
      "screen-challenges": "Viendo retos y medallas",
      "screen-profile": "Consultando perfil y estadísticas",
      "screen-teacher-dashboard": "En el panel docente pedagógico 👩‍🏫",
      "screen-teacher-library": "Supervisando biblioteca docente",
      "screen-teacher-ai-generator": "Generando lecturas con IA"
    };
    return names[screenId] || "Aventura en LEO";
  }

  onScreenLoaded(screenId) {
    const student = window.storageService.getCurrentStudent();

    switch (screenId) {
      case "screen-admin-dashboard":
        this.initAdminDashboard();
        break;
      case "screen-dashboard":
        this.renderStudentDashboard(student);
        break;
      case "screen-library":
        this.renderLibrary();
        break;
      case "screen-roulette":
        this.drawWheel();
        break;
      case "screen-avatar":
        this.renderAvatarStudio();
        break;
      case "screen-profile":
        this.renderStudentProfile(student);
        break;
      case "screen-challenges":
        this.renderChallengesAndAchievements(student);
        break;
      case "screen-early-literacy":
        this.renderEarlyLiteracyStages();
        break;
      case "screen-orality":
        this.renderOralityRoom();
        break;
      case "screen-writing":
        this.renderWritingWorkshop();
        break;
      case "screen-teacher-dashboard":
        this.renderTeacherDashboard();
        break;
      case "screen-teacher-library":
        this.renderTeacherLibrary();
        break;
      case "screen-teacher-ai-generator":
        this.setupAIGeneratorScreen();
        break;
    }
  }

  // =========================================================================
  // NAVBAR Y ESTADOS GLOBALES
  // =========================================================================

  updateNavbarUser() {
    const isAuth = window.authService && window.authService.isAuthenticated();
    const currentUser = isAuth ? window.authService.getCurrentUser() : null;
    const isAdmin = isAuth && currentUser && currentUser.role === "admin";

    const userChip = document.getElementById("nav-user-chip");
    const userNameEl = document.getElementById("nav-user-name");
    const userIconEl = document.getElementById("nav-user-icon");
    const logoutBtn = document.getElementById("btn-nav-logout");
    const adminNavBtn = document.getElementById("btn-nav-admin");
    const student = window.storageService.getCurrentStudent();
    const modeBtn = document.getElementById("btn-toggle-role");
    const pointsChip = document.getElementById("nav-points-chip");
    const streakChip = document.getElementById("nav-streak-chip");
    const levelChip = document.getElementById("nav-level-chip");

    // Chip de usuario y botón salir
    if (isAuth && currentUser) {
      if (userChip) {
        userChip.style.display = "inline-flex";
        if (userIconEl) userIconEl.innerText = isAdmin ? "👑" : "👤";
        if (userNameEl) userNameEl.innerText = `${currentUser.displayName || currentUser.username} (${isAdmin ? 'Admin' : 'Usuario'})`;
      }
      if (logoutBtn) logoutBtn.style.display = "inline-block";
      if (adminNavBtn) adminNavBtn.style.display = isAdmin ? "inline-block" : "none";
    } else {
      if (userChip) userChip.style.display = "none";
      if (logoutBtn) logoutBtn.style.display = "none";
      if (adminNavBtn) adminNavBtn.style.display = "none";
    }

    // Si estamos en la pantalla de autenticación, ocultar chips de juego
    if (this.currentScreen === "screen-auth") {
      if (pointsChip) pointsChip.style.display = "none";
      if (streakChip) streakChip.style.display = "none";
      if (levelChip) levelChip.style.display = "none";
      if (modeBtn) modeBtn.style.display = "none";
      return;
    } else {
      if (modeBtn) modeBtn.style.display = "inline-flex";
    }

    if (isAdmin || this.userMode === "TEACHER") {
      if (modeBtn) modeBtn.innerHTML = `<span>👨‍🎓 Modo Estudiante</span>`;
      if (pointsChip) pointsChip.style.display = "none";
      if (streakChip) streakChip.style.display = "none";
      if (levelChip) {
        levelChip.style.display = "inline-flex";
        levelChip.className = "stat-chip level-chip";
        levelChip.innerHTML = isAdmin ? `👑 <span>Admin Principal</span>` : `👩‍🏫 <span>Panel Docente</span>`;
      }
    } else {
      if (modeBtn) modeBtn.innerHTML = `<span>👩‍🏫 Modo Docente</span>`;
      if (pointsChip) {
        pointsChip.style.display = "inline-flex";
        pointsChip.innerHTML = `⭐ <span>${student ? student.points : 0}</span>`;
      }
      if (streakChip) {
        streakChip.style.display = "inline-flex";
        streakChip.innerHTML = `🔥 <span>${student ? student.streak : 1} d</span>`;
      }
      if (levelChip && student) {
        levelChip.style.display = "inline-flex";
        const lvlClass = `level-badge-${(student.level || "inicio").toLowerCase()}`;
        const lvlIcon = student.level === "AVANZADO" ? "🔴" : (student.level === "DESARROLLO" ? "🟡" : "🟢");
        levelChip.className = `stat-chip level-chip ${lvlClass}`;
        levelChip.innerHTML = `${lvlIcon} <span>${student.level}</span>`;
      }
    }
  }

  toggleRole() {
    window.audioService.playClick();
    if (this.userMode === "STUDENT") {
      this.userMode = "TEACHER";
      this.navigateTo("screen-teacher-dashboard");
    } else {
      this.userMode = "STUDENT";
      this.navigateTo("screen-dashboard");
    }
    this.updateNavbarUser();
  }

  bindGlobalEvents() {
    // Logo clic -> Home
    document.querySelectorAll(".brand-nav-link").forEach(btn => {
      btn.addEventListener("click", () => {
        window.audioService.playClick();
        if (this.userMode === "TEACHER") {
          this.navigateTo("screen-teacher-dashboard");
        } else {
          this.navigateTo("screen-dashboard");
        }
      });
    });

    // Toggle Sonido
    const soundBtn = document.getElementById("btn-toggle-sound");
    if (soundBtn) {
      soundBtn.addEventListener("click", () => {
        const enabled = window.audioService.toggleSound();
        soundBtn.innerHTML = enabled ? "🔊" : "🔇";
        soundBtn.title = enabled ? "Sonido activado" : "Sonido silenciado";
        window.audioService.playClick();
      });
    }

    // Toggle Rol (Docente / Estudiante)
    const roleBtn = document.getElementById("btn-toggle-role");
    if (roleBtn) {
      roleBtn.addEventListener("click", () => this.toggleRole());
    }
  }

  // =========================================================================
  // GESTIÓN DE PERFILES DE ESTUDIANTE
  // =========================================================================

  renderProfilesList() {
    const container = document.getElementById("profiles-grid-container");
    if (!container) return;

    const students = window.storageService.getStudents();
    const currentStudent = window.storageService.getCurrentStudent();

    let html = "";
    students.forEach(st => {
      const isSelected = currentStudent && currentStudent.id === st.id;
      const lvlIcon = st.level === "AVANZADO" ? "🔴" : (st.level === "DESARROLLO" ? "🟡" : "🟢");
      const avatarIcon = st.avatar.headwear === "head_corona_selva" ? "👑" : (st.avatar.outfit === "out_poncho_cusco" ? "🦙" : "🦁");

      html += `
        <div class="profile-card ${isSelected ? 'active-profile' : ''}" onclick="window.leoApp.selectStudentProfile('${st.id}')">
          <div class="profile-avatar-preview">${avatarIcon}</div>
          <h3 class="profile-name">${st.name}</h3>
          <p class="profile-meta">${st.grade} • ${st.age} años</p>
          <div class="stat-chip level-chip level-badge-${st.level.toLowerCase()}">
            ${lvlIcon} Nivel ${st.level}
          </div>
          <div style="margin-top: 12px; font-weight: 700; color: #ff8f00;">
            ⭐ ${st.points} pts • 🔥 ${st.streak} días racha
          </div>
        </div>
      `;
    });

    // Tarjeta para agregar nuevo estudiante
    html += `
      <div class="profile-card card-add-student" onclick="window.leoApp.navigateTo('screen-create-student')">
        <div style="font-size: 3rem; margin-bottom: 8px;">➕</div>
        <h3 style="font-size: 1.15rem; font-weight: 800; color: #0288d1;">Nuevo Estudiante</h3>
        <p style="font-size: 0.85rem; color: #64748b; margin-top: 4px;">Comienza con prueba diagnóstica</p>
      </div>
    `;

    container.innerHTML = html;
  }

  selectStudentProfile(studentId) {
    window.audioService.playClick();
    window.storageService.setCurrentStudent(studentId);
    this.userMode = "STUDENT";
    this.renderProfilesList();
    this.updateNavbarUser();

    const student = window.storageService.getCurrentStudent();
    if (!student.diagnosticDone) {
      this.startDiagnosticTest();
    } else {
      this.navigateTo("screen-dashboard");
    }
  }

  handleCreateStudentSubmit(e) {
    if (e) e.preventDefault();
    const nameInput = document.getElementById("new-student-name");
    const ageInput = document.getElementById("new-student-age");
    const gradeInput = document.getElementById("new-student-grade");

    if (!nameInput || !nameInput.value.trim()) {
      alert("Por favor ingresa el nombre del estudiante.");
      return;
    }

    const newStudent = window.storageService.createStudent({
      name: nameInput.value.trim(),
      age: ageInput.value,
      grade: gradeInput.value
    });

    window.audioService.playSuccess();
    this.renderProfilesList();
    this.startDiagnosticTest();
  }

  // =========================================================================
  // EVALUACIÓN DIAGNÓSTICA INICIAL
  // =========================================================================

  startDiagnosticTest() {
    window.audioService.playClick();
    this.diagnosticAnswers = {};
    this.diagnosticStepIndex = 0;

    // Aplanar todos los ítems de las etapas diagnósticas
    this.diagnosticItemsFlat = [];
    DIAGNOSTIC_TEST.stages.forEach(stage => {
      stage.items.forEach(item => {
        this.diagnosticItemsFlat.push({
          ...item,
          stageCategory: stage.category,
          stageInstruction: stage.instruction,
          contextText: stage.text || null
        });
      });
    });

    this.navigateTo("screen-diagnostic");
    this.renderDiagnosticStep();
  }

  renderDiagnosticStep() {
    const item = this.diagnosticItemsFlat[this.diagnosticStepIndex];
    if (!item) {
      this.finishDiagnostic();
      return;
    }

    const total = this.diagnosticItemsFlat.length;
    const current = this.diagnosticStepIndex + 1;
    const pct = Math.round((this.diagnosticStepIndex / total) * 100);

    // Barra de progreso
    const fillEl = document.getElementById("diag-progress-fill");
    const counterEl = document.getElementById("diag-step-counter");
    if (fillEl) fillEl.style.width = `${pct}%`;
    if (counterEl) counterEl.textContent = `Pregunta ${current} de ${total}`;

    const catEl = document.getElementById("diag-category-title");
    const instEl = document.getElementById("diag-instruction-text");
    if (catEl) catEl.textContent = item.stageCategory;
    if (instEl) instEl.textContent = item.stageInstruction;

    const promptContainer = document.getElementById("diag-prompt-content");
    const optionsContainer = document.getElementById("diag-options-container");

    let promptHtml = "";
    if (item.contextText) {
      promptHtml += `
        <div style="background: #ffffff; padding: 16px; border-radius: 12px; border: 2px solid #e2e8f0; margin-bottom: 16px; text-align: left; font-size: 1.15rem; line-height: 1.6;">
          📖 <strong>Lectura breve:</strong><br>${item.contextText}
        </div>
      `;
    }

    if (item.question) {
      promptHtml += `<h3 style="font-size: 1.3rem; margin-bottom: 12px;">${item.question}</h3>`;
    }

    if (item.target) {
      promptHtml += `
        <div class="diag-big-text">${item.target}</div>
        <button class="btn-outline" style="margin-top: 8px;" onclick="window.audioService.speak('${item.audioText || item.target}')">
          🔊 Escuchar sonido
        </button>
      `;
    } else if (item.targetWord) {
      promptHtml += `
        <div class="diag-big-text" style="color: #0288d1;">${item.targetWord}</div>
        <button class="btn-outline" style="margin-top: 8px;" onclick="window.audioService.speak('${item.targetWord}')">
          🔊 Escuchar palabra
        </button>
      `;
    } else if (item.sentence) {
      promptHtml += `
        <div style="font-size: 1.35rem; font-weight: 800; color: #1e293b; padding: 12px; background: #ffffff; border-radius: 12px; border: 2px solid #cbd5e1; margin: 12px 0;">
          "${item.sentence}"
        </div>
        <button class="btn-outline" style="margin-top: 4px;" onclick="window.audioService.speak('${item.sentence}')">
          🔊 Escuchar frase
        </button>
      `;
    }

    if (promptContainer) promptContainer.innerHTML = promptHtml;

    // Renderizar opciones
    let optionsHtml = "";
    item.options.forEach(opt => {
      optionsHtml += `
        <button class="diag-option-btn" onclick="window.leoApp.handleDiagnosticAnswer('${item.id}', '${opt}')">
          ${opt}
        </button>
      `;
    });

    if (optionsContainer) optionsContainer.innerHTML = optionsHtml;
  }

  handleDiagnosticAnswer(itemId, selectedOption) {
    const item = this.diagnosticItemsFlat[this.diagnosticStepIndex];
    this.diagnosticAnswers[itemId] = selectedOption;

    if (selectedOption === item.correct) {
      window.audioService.playSuccess();
    } else {
      window.audioService.playSoftError();
    }

    this.diagnosticStepIndex++;
    if (this.diagnosticStepIndex < this.diagnosticItemsFlat.length) {
      setTimeout(() => this.renderDiagnosticStep(), 350);
    } else {
      setTimeout(() => this.finishDiagnostic(), 400);
    }
  }

  finishDiagnostic() {
    const evaluation = evaluateDiagnostic(this.diagnosticAnswers);
    const student = window.storageService.getCurrentStudent();

    if (student) {
      student.diagnosticDone = true;
      student.level = evaluation.assignedLevel;
      student.stage = evaluation.initialStage;
      student.diagnosticResult = evaluation;
      student.points += 50; // Premio por completar el diagnóstico
      window.storageService.updateStudent(student);
    }

    window.audioService.playFanfare();
    this.renderDiagnosticResultScreen(evaluation);
  }

  renderDiagnosticResultScreen(evalResult) {
    this.navigateTo("screen-diagnostic-result");

    const badgeIconEl = document.getElementById("diag-res-badge-icon");
    const levelTitleEl = document.getElementById("diag-res-level-title");
    const explanationEl = document.getElementById("diag-res-explanation");
    const scorePctEl = document.getElementById("diag-res-score-pct");
    const breakdownEl = document.getElementById("diag-res-breakdown");

    if (badgeIconEl) badgeIconEl.textContent = evalResult.badgeColor;
    if (levelTitleEl) levelTitleEl.textContent = evalResult.levelTitle;
    if (explanationEl) explanationEl.textContent = evalResult.explanation;
    if (scorePctEl) scorePctEl.textContent = `${evalResult.overallPercentage}%`;

    if (breakdownEl) {
      let bHtml = "";
      Object.values(evalResult.stageResults).forEach(st => {
        bHtml += `
          <div style="background: #f8fafc; border: 2px solid #e2e8f0; border-radius: 12px; padding: 12px; margin-bottom: 8px; display: flex; justify-content: space-between; align-items: center;">
            <span style="font-weight: 700;">${st.category}</span>
            <span style="font-weight: 800; color: #0288d1;">${st.correct} de ${st.total} (${st.percentage}%)</span>
          </div>
        `;
      });
      breakdownEl.innerHTML = bHtml;
    }
  }

  // =========================================================================
  // DASHBOARD DEL ESTUDIANTE
  // =========================================================================

  renderStudentDashboard(student) {
    if (!student) return;

    const greetEl = document.getElementById("dash-student-greeting");
    const levelValEl = document.getElementById("dash-level-val");
    const progressFillEl = document.getElementById("dash-progress-fill");
    const progressTextEl = document.getElementById("dash-progress-text");

    if (greetEl) greetEl.textContent = `¡Hola, ${student.name.split(" ")[0]}! 👋`;
    if (levelValEl) {
      const lvlIcon = student.level === "AVANZADO" ? "🔴" : (student.level === "DESARROLLO" ? "🟡" : "🟢");
      levelValEl.innerHTML = `${lvlIcon} Nivel ${student.level}`;
    }

    const progressPct = student.progressPercentage || 40;
    if (progressFillEl) progressFillEl.style.width = `${progressPct}%`;
    if (progressTextEl) progressTextEl.textContent = `Progreso del nivel: ${progressPct}%`;

    // Recomendación personalizada de Leo en el banner
    const recoEl = document.getElementById("dash-leo-recommendation");
    if (recoEl) {
      if (student.level === "INICIO") {
        recoEl.textContent = `Leo te recomienda: Practicar en la Etapa ${student.stage || 1} con sílabas y sonidos divertidos.`;
      } else if (student.level === "DESARROLLO") {
        recoEl.textContent = `Leo te recomienda: Leer sobre Miguel Grau y descubrir el valor del respeto en el mar peruano.`;
      } else {
        recoEl.textContent = `Leo te recomienda: Desafiarte con la historia de María Reiche y las Líneas de Nazca.`;
      }
    }
  }

  // =========================================================================
  // BIBLIOTECA DE LECTURAS
  // =========================================================================

  renderLibrary(filterCategory = "all") {
    const student = window.storageService.getCurrentStudent();
    const container = document.getElementById("library-books-grid");
    const filtersContainer = document.getElementById("library-category-filters");
    if (!container) return;

    // Renderizar filtros de categorías
    if (filtersContainer) {
      let fHtml = `
        <button class="filter-chip ${filterCategory === 'all' ? 'active' : ''}" onclick="window.leoApp.renderLibrary('all')">
          🌈 Todos los temas
        </button>
      `;
      READING_CATEGORIES.forEach(cat => {
        const isActive = filterCategory === cat.id;
        fHtml += `
          <button class="filter-chip ${isActive ? 'active' : ''}" onclick="window.leoApp.renderLibrary('${cat.id}')">
            ${cat.icon} ${cat.name}
          </button>
        `;
      });
      filtersContainer.innerHTML = fHtml;
    }

    // Obtener lecturas aprobadas
    const allApproved = window.storageService.getApprovedReadings();

    // Filtrar por nivel del estudiante y categoría
    let filtered = allApproved;
    if (student) {
      filtered = filtered.filter(r => r.level === student.level);
    }
    if (filterCategory !== "all") {
      filtered = filtered.filter(r => r.category === filterCategory);
    }

    if (filtered.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 48px; background: #ffffff; border-radius: 20px; border: 2px dashed #cbd5e1;">
          <div style="font-size: 3rem; margin-bottom: 12px;">📖</div>
          <h3 style="font-size: 1.3rem; font-weight: 800;">No hay lecturas en esta categoría para tu nivel aún</h3>
          <p style="color: #64748b; margin-top: 6px;">Prueba seleccionando "Todos los temas" o gira la Ruleta mágica.</p>
        </div>
      `;
      return;
    }

    let html = "";
    filtered.forEach(reading => {
      const isDone = student && student.stats && student.stats.readingsHistory.includes(reading.id);
      const lvlIcon = reading.level === "AVANZADO" ? "🔴" : (reading.level === "DESARROLLO" ? "🟡" : "🟢");

      html += `
        <div class="book-card">
          <div class="book-card-header">
            <span>${reading.heroImage || '📖'}</span>
            <span class="book-card-level-tag">${lvlIcon} ${reading.level}</span>
          </div>
          <div class="book-card-body">
            <div>
              <span style="font-size: 0.8rem; font-weight: 800; color: #0288d1; text-transform: uppercase;">${reading.genre}</span>
              <h3 class="book-card-title">${reading.title}</h3>
              <p class="book-card-summary">${reading.summary || ''}</p>
            </div>
            <div>
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; font-size: 0.88rem; font-weight: 700; color: #64748b;">
                <span>⏱️ ${reading.readTime}</span>
                <span>${isDone ? '✅ Completada' : '⭐ +40 pts'}</span>
              </div>
              <button class="btn-primary" style="width: 100%;" onclick="window.leoApp.openReading('${reading.id}')">
                ${isDone ? 'Volver a leer 📖' : '¡Comenzar lectura! 🚀'}
              </button>
            </div>
          </div>
        </div>
      `;
    });

    container.innerHTML = html;
  }

  // =========================================================================
  // RULETA INTERACTIVA ("¿Qué leeremos hoy?")
  // =========================================================================

  initRouletteCanvas() {
    this.wheelColors = ["#FF7043", "#FFA726", "#42A5F5", "#EF5350", "#AB47BC", "#26A69A", "#5C6BC0", "#66BB6A", "#26C6DA", "#EC407A"];
    this.wheelCurrentAngle = 0;
  }

  drawWheel() {
    const canvas = document.getElementById("roulette-wheel-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const numSlices = READING_CATEGORIES.length;
    const arc = (2 * Math.PI) / numSlices;
    const radius = canvas.width / 2;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    READING_CATEGORIES.forEach((cat, i) => {
      const angle = i * arc;
      ctx.beginPath();
      ctx.fillStyle = this.wheelColors[i % this.wheelColors.length];
      ctx.moveTo(radius, radius);
      ctx.arc(radius, radius, radius, angle, angle + arc);
      ctx.lineTo(radius, radius);
      ctx.fill();

      // Línea de borde
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 3;
      ctx.stroke();

      // Icono y texto
      ctx.save();
      ctx.translate(radius, radius);
      ctx.rotate(angle + arc / 2);
      ctx.textAlign = "right";
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 15px Quicksand, sans-serif";
      ctx.shadowColor = "rgba(0,0,0,0.35)";
      ctx.shadowBlur = 4;
      ctx.fillText(`${cat.icon} ${cat.name.slice(0, 10)}`, radius - 20, 5);
      ctx.restore();
    });
  }

  spinWheel() {
    if (this.isSpinningWheel) return;
    this.isSpinningWheel = true;
    window.audioService.playClick();

    const resultBox = document.getElementById("roulette-result-box");
    if (resultBox) resultBox.style.display = "none";

    const spinBtn = document.getElementById("btn-spin-wheel");
    if (spinBtn) spinBtn.disabled = true;

    // Número de giros completos (entre 5 y 8) + ángulo aleatorio
    const extraTurns = 5 + Math.floor(Math.random() * 3);
    const randomAngle = Math.random() * (2 * Math.PI);
    const totalRotation = extraTurns * 360 + (randomAngle * 180 / Math.PI);

    const canvas = document.getElementById("roulette-wheel-canvas");
    if (canvas) {
      canvas.style.transition = "transform 4s cubic-bezier(0.15, 0.9, 0.25, 1)";
      canvas.style.transform = `rotate(${totalRotation}deg)`;
    }

    // Efecto sonoro de clics periódicos
    let tickCount = 0;
    const tickInterval = setInterval(() => {
      window.audioService.playSpinTick();
      tickCount++;
      if (tickCount > 18) clearInterval(tickInterval);
    }, 180);

    setTimeout(() => {
      this.isSpinningWheel = false;
      if (spinBtn) spinBtn.disabled = false;
      window.audioService.playFanfare();

      // Determinar la categoría seleccionada
      const student = window.storageService.getCurrentStudent();
      const randomCat = READING_CATEGORIES[Math.floor(Math.random() * READING_CATEGORIES.length)];

      // Buscar una lectura de esa categoría adaptada al nivel
      const approved = window.storageService.getApprovedReadings(student ? student.level : "DESARROLLO");
      const matched = approved.find(r => r.category === randomCat.id) || approved[0];

      if (resultBox && matched) {
        resultBox.style.display = "block";
        resultBox.innerHTML = `
          <div style="background: #f0fdf4; border: 3px solid #22c55e; border-radius: 20px; padding: 24px; margin-top: 24px; animation: fadeIn 0.3s ease;">
            <div style="font-size: 2.5rem; margin-bottom: 8px;">🎉</div>
            <h3 style="font-size: 1.4rem; font-weight: 900; color: #15803d; margin-bottom: 6px;">¡La Ruleta ha elegido para ti!</h3>
            <p style="font-size: 1.1rem; color: #166534; margin-bottom: 16px;">
              Categoría: <strong>${randomCat.icon} ${randomCat.name}</strong><br>
              Lectura: <strong>"${matched.title}"</strong>
            </p>
            <button class="btn-primary" onclick="window.leoApp.openReading('${matched.id}')">
              ¡Comenzar esta Aventura Ahora! 🚀
            </button>
          </div>
        `;
      }
    }, 4100);
  }

  // =========================================================================
  // MODO LECTURA LIMPIO
  // =========================================================================

  openReading(readingId) {
    window.audioService.playClick();
    const allReadings = window.storageService.getReadings();
    const reading = allReadings.find(r => r.id === readingId);
    if (!reading) return;

    this.activeReading = reading;
    this.comodinUsedThisReading = false;

    // Si es actividad especial de inicio (Etapas 1-4)
    if (reading.isStageActivity) {
      this.startStageActivity(reading);
      return;
    }

    this.navigateTo("screen-reader");

    const titleEl = document.getElementById("reader-title");
    const genreEl = document.getElementById("reader-genre-tag");
    const iconEl = document.getElementById("reader-hero-icon");
    const paragraphsContainer = document.getElementById("reader-paragraphs-container");

    if (titleEl) titleEl.textContent = reading.title;
    if (genreEl) genreEl.textContent = `${reading.genre} • ${reading.readTime}`;
    if (iconEl) iconEl.textContent = reading.heroImage || "📖";

    if (paragraphsContainer) {
      let pHtml = "";
      reading.paragraphs.forEach((p, idx) => {
        pHtml += `
          <p class="reader-paragraph" id="p-reading-${idx}">
            ${p}
          </p>
        `;
      });
      paragraphsContainer.innerHTML = pHtml;
    }

    // Botón de audio en modo lectura
    const audioBtn = document.getElementById("btn-reader-listen");
    if (audioBtn) {
      audioBtn.innerHTML = "🔊 Escuchar lectura en voz alta";
      audioBtn.onclick = () => this.toggleReadAloud(reading);
    }
  }

  toggleReadAloud(reading) {
    if (window.audioService.isReadingAloud) {
      window.audioService.stopReading();
      const audioBtn = document.getElementById("btn-reader-listen");
      if (audioBtn) audioBtn.innerHTML = "🔊 Escuchar lectura en voz alta";
      this.unhighlightAllParagraphs();
    } else {
      const fullText = reading.paragraphs.join(" ");
      const audioBtn = document.getElementById("btn-reader-listen");
      if (audioBtn) audioBtn.innerHTML = "⏹️ Detener lectura";

      window.audioService.speak(fullText, {
        onStart: () => {
          this.highlightParagraph(0);
        },
        onEnd: () => {
          if (audioBtn) audioBtn.innerHTML = "🔊 Escuchar lectura en voz alta";
          this.unhighlightAllParagraphs();
        }
      });
    }
  }

  highlightParagraph(idx) {
    this.unhighlightAllParagraphs();
    const pEl = document.getElementById(`p-reading-${idx}`);
    if (pEl) pEl.classList.add("speaking-highlight");
  }

  unhighlightAllParagraphs() {
    document.querySelectorAll(".reader-paragraph").forEach(p => p.classList.remove("speaking-highlight"));
  }

  // =========================================================================
  // ACTIVIDADES DE COMPRENSIÓN (15 PREGUNTAS: 5 LITERAL + 5 INFERENCIAL + 5 CRÍTICO)
  // =========================================================================

  startComprehensionQuiz() {
    window.audioService.stopReading();
    window.audioService.playClick();
    if (!this.activeReading || !this.activeReading.questions) return;

    // Organizar las 15 preguntas
    const { literal = [], inferential = [], critical = [] } = this.activeReading.questions;

    this.activeQuizQuestions = [
      ...literal.map(q => ({ ...q, tier: "LITERAL", tierTitle: "Comprensión Literal (Información explícita)" })),
      ...inferential.map(q => ({ ...q, tier: "INFERENCIAL", tierTitle: "Comprensión Inferencial (Deducción y relaciones)" })),
      ...critical.map(q => ({ ...q, tier: "CRITICO", tierTitle: "Comprensión Crítica (Opinión y argumentación)" }))
    ];

    this.currentQuestionIndex = 0;
    this.quizAnswers = {};
    this.quizStats = { literalCorrect: 0, inferentialCorrect: 0, criticalCorrect: 0, openScores: [] };

    this.navigateTo("screen-comprehension");
    this.renderQuizQuestion();
  }

  renderQuizQuestion() {
    const q = this.activeQuizQuestions[this.currentQuestionIndex];
    if (!q) {
      this.finishQuiz();
      return;
    }

    const total = this.activeQuizQuestions.length; // 15
    const currentNum = this.currentQuestionIndex + 1;
    const tierNum = (this.currentQuestionIndex % 5) + 1;

    // Barra de progreso y badges
    const counterEl = document.getElementById("quiz-step-counter");
    const tierBadgeEl = document.getElementById("quiz-tier-badge");
    const progressFillEl = document.getElementById("quiz-progress-fill");

    if (counterEl) counterEl.textContent = `Pregunta ${currentNum} de ${total}`;
    if (progressFillEl) progressFillEl.style.width = `${Math.round((this.currentQuestionIndex / total) * 100)}%`;

    if (tierBadgeEl) {
      tierBadgeEl.className = `quiz-tier-badge tier-${q.tier.toLowerCase()}`;
      tierBadgeEl.textContent = `${q.tier}: ${tierNum}/5`;
    }

    // Configurar Comodín
    const comodinBtn = document.getElementById("btn-use-comodin");
    const clueBox = document.getElementById("comodin-clue-box");
    if (clueBox) clueBox.classList.remove("visible");

    if (comodinBtn) {
      if (this.comodinUsedThisReading) {
        comodinBtn.className = "btn-comodin used";
        comodinBtn.innerHTML = "💡 Comodín utilizado";
        comodinBtn.disabled = true;
      } else {
        comodinBtn.className = "btn-comodin";
        comodinBtn.innerHTML = "💡 Usar Comodín (1 disponible)";
        comodinBtn.disabled = false;
        comodinBtn.onclick = () => this.useComodin();
      }
    }

    // Enunciado
    const promptEl = document.getElementById("quiz-question-prompt");
    if (promptEl) promptEl.textContent = q.question;

    // Contenedor de opciones / respuesta escrita
    const contentContainer = document.getElementById("quiz-interactive-content");
    const feedbackBox = document.getElementById("quiz-feedback-box");
    if (feedbackBox) {
      feedbackBox.className = "quiz-feedback-box";
      feedbackBox.style.display = "none";
    }

    if (q.isWrittenOpen) {
      // Pregunta abierta crítica analizada por IA
      contentContainer.innerHTML = `
        <div class="written-answer-box">
          <p style="font-weight: 700; color: #64748b; margin-bottom: 8px;">
            ✍️ Escribe tu reflexión en el cuadro con tus propias palabras:
          </p>
          <textarea id="written-open-input" class="written-textarea" placeholder="Escribe aquí tu opinión sincera..."></textarea>
          <div style="display: flex; justify-content: flex-end; margin-top: 12px;">
            <button class="btn-primary" onclick="window.leoApp.submitOpenAnswer()">
              Enviar mi respuesta a Leo 🚀
            </button>
          </div>
        </div>
      `;
    } else {
      // Opciones múltiples
      let optHtml = `<div class="quiz-options-list">`;
      q.options.forEach(opt => {
        optHtml += `
          <button class="quiz-option-item" onclick="window.leoApp.submitQuizOption(this, '${opt.replace(/'/g, "\\'")}')">
            <span>🔘</span>
            <span>${opt}</span>
          </button>
        `;
      });
      optHtml += `</div>`;
      contentContainer.innerHTML = optHtml;
    }
  }

  useComodin() {
    if (this.comodinUsedThisReading) return;
    this.comodinUsedThisReading = true;
    window.audioService.playComodin();

    const clueBox = document.getElementById("comodin-clue-box");
    const comodinBtn = document.getElementById("btn-use-comodin");
    const hint = this.activeReading.comodinHint || "Revisa el segundo párrafo con atención para encontrar la respuesta.";

    if (clueBox) {
      clueBox.innerHTML = `
        <div style="font-weight: 800; color: #b45309; margin-bottom: 4px;">💡 Pista de Leo (Comodín):</div>
        <p style="color: #92400e; font-size: 1.05rem;">"${hint}"</p>
      `;
      clueBox.classList.add("visible");
    }

    if (comodinBtn) {
      comodinBtn.className = "btn-comodin used";
      comodinBtn.innerHTML = "💡 Comodín utilizado";
      comodinBtn.disabled = true;
    }
  }

  submitQuizOption(buttonEl, selectedOption) {
    const q = this.activeQuizQuestions[this.currentQuestionIndex];
    const isCorrect = selectedOption === q.correct;
    const feedbackBox = document.getElementById("quiz-feedback-box");

    // Deshabilitar botones para evitar multi-clic
    document.querySelectorAll(".quiz-option-item").forEach(btn => btn.disabled = true);

    if (isCorrect) {
      window.audioService.playSuccess();
      buttonEl.classList.add("correct-answer");
      buttonEl.querySelector("span").textContent = "✅";

      if (q.tier === "LITERAL") this.quizStats.literalCorrect++;
      if (q.tier === "INFERENCIAL") this.quizStats.inferentialCorrect++;
      if (q.tier === "CRITICO") this.quizStats.criticalCorrect++;

      if (feedbackBox) {
        feedbackBox.className = "quiz-feedback-box feedback-success";
        feedbackBox.innerHTML = `
          <strong>✅ ¡Excelente respuesta!</strong><br>
          ${q.explanation || '¡Has comprendido la idea a la perfección!'}
        `;
      }
    } else {
      window.audioService.playSoftError();
      buttonEl.classList.add("wrong-answer");
      buttonEl.querySelector("span").textContent = "❌";

      // Marcar la correcta sutilmente
      document.querySelectorAll(".quiz-option-item").forEach(btn => {
        if (btn.textContent.includes(q.correct)) {
          btn.classList.add("correct-answer");
        }
      });

      if (feedbackBox) {
        feedbackBox.className = "quiz-feedback-box feedback-retry";
        feedbackBox.innerHTML = `
          <strong>💡 Casi lo tienes.</strong><br>
          ${q.explanation || 'Vuelve a revisar el texto con calma, ¡vamos a seguir aprendiendo juntos!'}
        `;
      }
    }

    // Botón para continuar a la siguiente pregunta
    if (feedbackBox) {
      feedbackBox.innerHTML += `
        <div style="margin-top: 14px; text-align: right;">
          <button class="btn-primary" style="min-height: 44px; padding: 10px 20px;" onclick="window.leoApp.nextQuizQuestion()">
            Continuar ➡️
          </button>
        </div>
      `;
    }
  }

  async submitOpenAnswer() {
    const textarea = document.getElementById("written-open-input");
    const q = this.activeQuizQuestions[this.currentQuestionIndex];
    if (!textarea) return;

    const answer = textarea.value.trim();
    if (answer.length < 5) {
      alert("Por favor escribe una frase para expresar tu opinión a Leo.");
      return;
    }

    textarea.disabled = true;
    const feedbackBox = document.getElementById("quiz-feedback-box");
    if (feedbackBox) {
      feedbackBox.className = "quiz-feedback-box feedback-success";
      feedbackBox.innerHTML = `<em>Leo está leyendo tu reflexión con atención...</em> 🦁`;
      feedbackBox.style.display = "block";
    }

    const aiEval = window.aiService.evaluateOpenResponse(q, answer);
    window.audioService.playSuccess();

    this.quizStats.criticalCorrect++;
    this.quizStats.openScores.push(aiEval);

    if (feedbackBox) {
      feedbackBox.innerHTML = `
        <strong>${aiEval.feedback}</strong><br>
        <div style="margin-top: 14px; text-align: right;">
          <button class="btn-primary" style="min-height: 44px; padding: 10px 20px;" onclick="window.leoApp.nextQuizQuestion()">
            Continuar ➡️
          </button>
        </div>
      `;
    }
  }

  nextQuizQuestion() {
    this.currentQuestionIndex++;
    if (this.currentQuestionIndex < this.activeQuizQuestions.length) {
      this.renderQuizQuestion();
    } else {
      this.finishQuiz();
    }
  }

  finishQuiz() {
    window.audioService.playFanfare();
    const student = window.storageService.getCurrentStudent();

    const totalLit = 5;
    const totalInf = 5;
    const totalCrit = 5;
    const totalQuestions = 15;

    const litCorrect = this.quizStats.literalCorrect;
    const infCorrect = this.quizStats.inferentialCorrect;
    const critCorrect = this.quizStats.criticalCorrect;
    const totalCorrect = litCorrect + infCorrect + critCorrect;

    const overallPct = Math.round((totalCorrect / totalQuestions) * 100);
    const litPct = Math.round((litCorrect / totalLit) * 100);
    const infPct = Math.round((infCorrect / totalInf) * 100);
    const critPct = Math.round((critCorrect / totalCrit) * 100);

    // Cálculo de puntos
    let pointsEarned = 40; // Base por completar la lectura
    pointsEarned += totalCorrect * 4;
    if (!this.comodinUsedThisReading) pointsEarned += 15; // Bonus sin comodín

    // Actualizar datos del estudiante
    if (student) {
      student.points += pointsEarned;
      student.progressPercentage = Math.min(100, (student.progressPercentage || 0) + 15);

      student.stats.completedReadings++;
      if (!student.stats.readingsHistory.includes(this.activeReading.id)) {
        student.stats.readingsHistory.push(this.activeReading.id);
      }

      student.stats.correctLiteral += litCorrect;
      student.stats.totalLiteral += totalLit;
      student.stats.correctInferential += infCorrect;
      student.stats.totalInferential += totalInf;
      student.stats.correctCritical += critCorrect;
      student.stats.totalCritical += totalCrit;

      if (!this.comodinUsedThisReading) {
        student.stats.cleanRunsWithoutComodin++;
      }
      if (this.activeReading.category === "heroes" || this.activeReading.category === "personajes") {
        student.stats.historyReadingsCount++;
      }
      if (this.activeReading.category === "animales" || this.activeReading.category === "naturaleza") {
        student.stats.natureReadingsCount++;
      }

      // Verificación de logros desbloqueados
      ACHIEVEMENTS_CATALOG.forEach(ach => {
        if (!student.achievements.includes(ach.id) && ach.criteria(student.stats)) {
          student.achievements.push(ach.id);
          student.points += ach.pointsReward;
        }
      });

      // Adaptación progresiva de dificultad
      if (overallPct >= 85 && student.level === "INICIO" && student.stage >= 4) {
        student.level = "DESARROLLO";
        student.progressPercentage = 10;
      } else if (overallPct >= 85 && student.level === "DESARROLLO" && student.stats.completedReadings >= 4) {
        student.level = "AVANZADO";
        student.progressPercentage = 10;
      }

      window.storageService.updateStudent(student);
    }

    this.renderQuizResultsScreen({
      overallPct,
      litPct,
      infPct,
      critPct,
      pointsEarned,
      comodinUsed: this.comodinUsedThisReading
    });
  }

  renderQuizResultsScreen(results) {
    this.navigateTo("screen-activity-result");

    const overallEl = document.getElementById("res-overall-pct");
    const litEl = document.getElementById("res-lit-pct");
    const infEl = document.getElementById("res-inf-pct");
    const critEl = document.getElementById("res-crit-pct");
    const pointsEl = document.getElementById("res-points-earned");
    const comodinStatusEl = document.getElementById("res-comodin-status");

    if (overallEl) overallEl.textContent = `${results.overallPct}%`;
    if (litEl) litEl.textContent = `${results.litPct}%`;
    if (infEl) infEl.textContent = `${results.infPct}%`;
    if (critEl) critEl.textContent = `${results.critPct}%`;
    if (pointsEl) pointsEl.textContent = `+${results.pointsEarned} ⭐`;

    if (comodinStatusEl) {
      comodinStatusEl.textContent = results.comodinUsed ? "💡 Comodín utilizado" : "⭐ ¡Completado sin comodín! (+15 pts)";
    }
  }

  // =========================================================================
  // ACTIVIDADES DE ETAPAS (INICIO: 4 ETAPAS)
  // =========================================================================

  renderEarlyLiteracyStages() {
    const student = window.storageService.getCurrentStudent();
    const container = document.getElementById("early-stages-list");
    if (!container) return;

    const stages = [
      { num: 1, title: "Etapa 1: Sílabas", desc: "Reconoce, identifica y escucha sílabas con ritmo.", icon: "🚂", readingId: "ini_stage_1" },
      { num: 2, title: "Etapa 2: Palabras sencillas", desc: "Monosílabas y palabras del día a día (sol, pan, mar).", icon: "✨", readingId: "ini_stage_2" },
      { num: 3, title: "Etapa 3: Frases cortas", desc: "Lee oraciones sencillas y comprende su significado.", icon: "🦙", readingId: "ini_stage_3" },
      { num: 4, title: "Etapa 4: Textos muy breves", desc: "Cuentitos de dos oraciones sin textos largos.", icon: "🐶", readingId: "ini_stage_4" }
    ];

    let html = "";
    stages.forEach(st => {
      const isCurrent = student && student.stage === st.num;
      html += `
        <div class="dash-card ${isCurrent ? 'card-reading' : ''}" style="margin-bottom: 16px;">
          <div style="display: flex; align-items: center; gap: 16px;">
            <div style="font-size: 2.8rem;">${st.icon}</div>
            <div>
              <h3 style="font-size: 1.25rem; font-weight: 800;">${st.title} ${isCurrent ? '🟢 (Tu etapa actual)' : ''}</h3>
              <p style="color: #64748b; font-size: 0.95rem;">${st.desc}</p>
            </div>
          </div>
          <div style="margin-top: 16px; text-align: right;">
            <button class="btn-primary" onclick="window.leoApp.openReading('${st.readingId}')">
              Practicar Etapa ${st.num} 🚀
            </button>
          </div>
        </div>
      `;
    });

    container.innerHTML = html;
  }

  startStageActivity(reading) {
    this.activeReading = reading;
    this.navigateTo("screen-comprehension");

    this.activeQuizQuestions = reading.activities.map(act => ({
      ...act,
      tier: "INICIO",
      tierTitle: reading.stageTitle
    }));

    this.currentQuestionIndex = 0;
    this.quizAnswers = {};
    this.quizStats = { literalCorrect: 0, inferentialCorrect: 0, criticalCorrect: 0, openScores: [] };

    this.renderQuizQuestion();
  }

  // =========================================================================
  // ORALIDAD Y VOZ ("Cuéntale a Leo lo que entendiste")
  // =========================================================================

  renderOralityRoom() {
    const transcriptBox = document.getElementById("orality-transcript-box");
    const feedbackBox = document.getElementById("orality-leo-response");
    if (transcriptBox) transcriptBox.textContent = "Presiona el botón del micrófono y habla claro.";
    if (feedbackBox) feedbackBox.style.display = "none";
  }

  toggleOralRecording() {
    const btn = document.getElementById("btn-toggle-mic");
    const transcriptBox = document.getElementById("orality-transcript-box");
    const feedbackBox = document.getElementById("orality-leo-response");

    if (window.audioService.isListeningOrality) {
      window.audioService.stopOralRecording();
      if (btn) btn.innerHTML = "🎙️ Comenzar a hablar";
      this.evaluateOralExpression(transcriptBox ? transcriptBox.textContent : "");
    } else {
      if (btn) btn.innerHTML = "⏹️ Terminar de hablar";
      if (transcriptBox) transcriptBox.textContent = "Escuchando... Di lo que entendiste de tu lectura favorita.";

      const started = window.audioService.startOralRecording({
        onResult: (text) => {
          if (transcriptBox) transcriptBox.textContent = text;
        },
        onEnd: () => {
          if (btn) btn.innerHTML = "🎙️ Comenzar a hablar";
          this.evaluateOralExpression(transcriptBox ? transcriptBox.textContent : "");
        },
        onUnavailable: () => {
          // Demo interactivo si el navegador bloquea el micrófono
          const sample = "Entendí que Miguel Grau fue muy valiente y salvó a los marineros en el mar.";
          if (transcriptBox) transcriptBox.textContent = sample;
          this.evaluateOralExpression(sample);
        }
      });

      if (!started) {
        const sample = "Entendí que el delfín rosado vive en los ríos de la selva del Perú y debemos cuidar el agua.";
        if (transcriptBox) transcriptBox.textContent = sample;
        this.evaluateOralExpression(sample);
      }
    }
  }

  evaluateOralExpression(spokenText) {
    const feedbackBox = document.getElementById("orality-leo-response");
    if (!feedbackBox || !spokenText) return;

    window.audioService.playSuccess();
    feedbackBox.style.display = "block";
    feedbackBox.innerHTML = `
      <div style="background: #f0fdf4; border: 2px solid #86efac; border-radius: 16px; padding: 20px; margin-top: 20px;">
        <h4 style="color: #166534; font-size: 1.2rem; margin-bottom: 6px;">🎉 ¡Leo te escuchó atentamente!</h4>
        <p style="color: #14532d; font-size: 1.05rem; margin-bottom: 12px;">
          "¡Me encantó cómo te expresaste! Has compartido una idea muy clara sobre la lectura. ¡Sigue usando tu voz con confianza!"
        </p>
        <span style="font-weight: 800; color: #ea580c;">⭐ +20 puntos ganados por oralidad</span>
      </div>
    `;

    // Otorgar puntos
    const student = window.storageService.getCurrentStudent();
    if (student) {
      student.points += 20;
      window.storageService.updateStudent(student);
      this.updateNavbarUser();
    }
  }

  // =========================================================================
  // TALLER DE ESCRITURA INTERACTIVO
  // =========================================================================

  renderWritingWorkshop() {
    const container = document.getElementById("writing-workshop-container");
    if (!container) return;

    container.innerHTML = `
      <div style="background: #ffffff; border-radius: 20px; padding: 28px; border: 3px solid #e2e8f0;">
        <h3 style="font-size: 1.35rem; font-weight: 800; margin-bottom: 8px;">Taller de Escritura: Ordena las Palabras</h3>
        <p style="color: #64748b; margin-bottom: 20px;">Toca las palabras en el orden correcto para formar una hermosa oración sobre el Perú.</p>
        
        <div id="writing-target-box" style="min-height: 60px; background: #f8fafc; border: 3px dashed #cbd5e1; border-radius: 14px; padding: 12px; display: flex; gap: 8px; flex-wrap: wrap; align-items: center; margin-bottom: 20px;">
          <span style="color: #94a3b8; font-weight: 700;">Toca las palabras de abajo para armar la frase aquí...</span>
        </div>

        <div id="writing-source-words" style="display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 24px;">
          <button class="filter-chip" onclick="window.leoApp.addWritingWord('La')">La</button>
          <button class="filter-chip" onclick="window.leoApp.addWritingWord('vicuña')">vicuña</button>
          <button class="filter-chip" onclick="window.leoApp.addWritingWord('corre')">corre</button>
          <button class="filter-chip" onclick="window.leoApp.addWritingWord('en')">en</button>
          <button class="filter-chip" onclick="window.leoApp.addWritingWord('la')">la</button>
          <button class="filter-chip" onclick="window.leoApp.addWritingWord('montaña.')">montaña.</button>
        </div>

        <div style="display: flex; gap: 12px;">
          <button class="btn-success" onclick="window.leoApp.verifyWritingSentence()">Verificar mi oración ✅</button>
          <button class="btn-outline" onclick="window.leoApp.resetWritingSentence()">Empezar de nuevo 🔄</button>
        </div>

        <div id="writing-feedback" style="margin-top: 16px;"></div>
      </div>
    `;
    this.currentBuiltWords = [];
  }

  addWritingWord(word) {
    window.audioService.playClick();
    if (!this.currentBuiltWords) this.currentBuiltWords = [];
    this.currentBuiltWords.push(word);

    const box = document.getElementById("writing-target-box");
    if (box) {
      box.innerHTML = this.currentBuiltWords.map(w => `
        <span style="background: #0288d1; color: #ffffff; padding: 6px 14px; border-radius: 999px; font-weight: 800;">
          ${w}
        </span>
      `).join(" ");
    }
  }

  resetWritingSentence() {
    this.currentBuiltWords = [];
    const box = document.getElementById("writing-target-box");
    const fb = document.getElementById("writing-feedback");
    if (box) box.innerHTML = `<span style="color: #94a3b8; font-weight: 700;">Toca las palabras de abajo para armar la frase aquí...</span>`;
    if (fb) fb.innerHTML = "";
  }

  verifyWritingSentence() {
    const full = (this.currentBuiltWords || []).join(" ");
    const expected = "La vicuña corre en la montaña.";
    const fb = document.getElementById("writing-feedback");

    if (full === expected) {
      window.audioService.playSuccess();
      if (fb) {
        fb.innerHTML = `
          <div style="background: #dcfce7; border: 2px solid #86efac; border-radius: 12px; padding: 14px; color: #166534; font-weight: 800;">
            🎉 ¡Perfecto! Has escrito la oración correctamente. ⭐ +25 puntos.
          </div>
        `;
      }
      const student = window.storageService.getCurrentStudent();
      if (student) {
        student.points += 25;
        window.storageService.updateStudent(student);
        this.updateNavbarUser();
      }
    } else {
      window.audioService.playSoftError();
      if (fb) {
        fb.innerHTML = `
          <div style="background: #fef3c7; border: 2px solid #fde68a; border-radius: 12px; padding: 14px; color: #92400e; font-weight: 800;">
            💡 Casi lo tienes. Recuerda comenzar con mayúscula 'La' y terminar con punto en 'montaña.'.
          </div>
        `;
      }
    }
  }

  // =========================================================================
  // PERSONAJE / AVATAR Y TIENDA
  // =========================================================================

  renderAvatarStudio(tab = "headwear") {
    const student = window.storageService.getCurrentStudent();
    if (!student) return;

    // Actualizar visualización del avatar
    this.updateAvatarVisual(student);

    // Renderizar tabs
    const tabsContainer = document.getElementById("avatar-shop-tabs");
    if (tabsContainer) {
      const tabNames = {
        headwear: "🧢 Gorros y Chullos",
        outfit: "👕 Ropa y Ponchos",
        accessory: "👓 Accesorios",
        background: "🏔️ Fondos"
      };
      let tHtml = "";
      Object.keys(tabNames).forEach(k => {
        tHtml += `
          <button class="shop-tab-btn ${k === tab ? 'active' : ''}" onclick="window.leoApp.renderAvatarStudio('${k}')">
            ${tabNames[k]}
          </button>
        `;
      });
      tabsContainer.innerHTML = tHtml;
    }

    // Renderizar ítems de la categoría
    const itemsContainer = document.getElementById("avatar-items-grid");
    if (!itemsContainer) return;

    const items = AVATAR_CATALOG[tab] || [];
    let iHtml = "";

    items.forEach(item => {
      const isUnlocked = student.avatar.unlockedItems.includes(item.id);
      const isEquipped = student.avatar[tab] === item.id;
      const canAfford = student.points >= item.cost;

      iHtml += `
        <div class="shop-item-card">
          <div class="shop-item-icon">${item.icon}</div>
          <h4 class="shop-item-name">${item.name}</h4>
          <p style="font-size: 0.8rem; color: #64748b; margin-bottom: 8px;">${item.previewText}</p>
          <div class="shop-item-cost">
            ${item.cost === 0 ? 'Gratis' : `⭐ ${item.cost} pts`}
          </div>
          <div>
            ${isEquipped ? `
              <button class="btn-outline" style="width: 100%; border-color: #22c55e; color: #15803d; font-weight: 800;" disabled>
                Equipado ✅
              </button>
            ` : isUnlocked ? `
              <button class="btn-secondary" style="width: 100%; padding: 8px 12px; min-height: 40px;" onclick="window.leoApp.equipAvatarItem('${tab}', '${item.id}')">
                Vestir 👕
              </button>
            ` : `
              <button class="btn-primary" style="width: 100%; padding: 8px 12px; min-height: 40px;" ${canAfford ? '' : 'disabled'} onclick="window.leoApp.buyAvatarItem('${tab}', '${item.id}', ${item.cost})">
                ${canAfford ? 'Canjear 🔓' : '🔒 Faltan pts'}
              </button>
            `}
          </div>
        </div>
      `;
    });

    itemsContainer.innerHTML = iHtml;
  }

  updateAvatarVisual(student) {
    const stage = document.getElementById("avatar-stage-display");
    if (!stage) return;

    const bgMap = {
      bg_aula_alegre: "linear-gradient(180deg, #bae6fd 0%, #e0f2fe 100%)",
      bg_machu_picchu: "linear-gradient(180deg, #86efac 0%, #3b82f6 100%)",
      bg_selva_amazonia: "linear-gradient(180deg, #4ade80 0%, #059669 100%)",
      bg_mar_chorrillos: "linear-gradient(180deg, #fdba74 0%, #0288d1 100%)"
    };

    stage.style.background = bgMap[student.avatar.background] || bgMap.bg_aula_alegre;

    const headMap = {
      head_chullo_basic: "🧢",
      head_sombrero_norte: "👒",
      head_gorra_deportiva: "🧢",
      head_corona_selva: "🪶"
    };

    const outMap = {
      out_polo_blanco: "👕",
      out_poncho_cusco: "🧶",
      out_camiseta_peru: "⚽",
      out_chaleco_selva: "🦺"
    };

    const accMap = {
      acc_ninguno: "",
      acc_lentes_detective: "👓",
      acc_mochila_andina: "🎒",
      acc_lupa_misterio: "🔍"
    };

    const headEl = document.getElementById("av-layer-head");
    const outEl = document.getElementById("av-layer-outfit");
    const accEl = document.getElementById("av-layer-acc");

    if (headEl) headEl.textContent = headMap[student.avatar.headwear] || "🧢";
    if (outEl) outEl.textContent = outMap[student.avatar.outfit] || "👕";
    if (accEl) accEl.textContent = accMap[student.avatar.accessory] || "";
  }

  equipAvatarItem(category, itemId) {
    const student = window.storageService.getCurrentStudent();
    if (!student) return;

    student.avatar[category] = itemId;
    window.storageService.updateStudent(student);
    window.audioService.playClick();
    this.renderAvatarStudio(category);
  }

  buyAvatarItem(category, itemId, cost) {
    const student = window.storageService.getCurrentStudent();
    if (!student) return;

    if (student.points < cost) {
      alert("No tienes suficientes puntos para desbloquear este artículo.");
      return;
    }

    student.points -= cost;
    student.avatar.unlockedItems.push(itemId);
    student.avatar[category] = itemId; // Equipar de inmediato

    window.storageService.updateStudent(student);
    window.audioService.playFanfare();
    this.updateNavbarUser();
    this.renderAvatarStudio(category);
  }

  // =========================================================================
  // PERFIL DEL ESTUDIANTE Y RETOS
  // =========================================================================

  renderStudentProfile(student) {
    if (!student) return;

    const nameEl = document.getElementById("prof-student-name");
    const gradeEl = document.getElementById("prof-student-grade");
    const levelEl = document.getElementById("prof-student-level");
    const statsContainer = document.getElementById("prof-stats-breakdown");

    if (nameEl) nameEl.textContent = student.name;
    if (gradeEl) gradeEl.textContent = `${student.grade} • ${student.age} años`;
    if (levelEl) levelEl.textContent = `Nivel ${student.level} (Etapa ${student.stage || 1})`;

    if (statsContainer) {
      const litPct = student.stats.totalLiteral > 0 ? Math.round((student.stats.correctLiteral / student.stats.totalLiteral) * 100) : 0;
      const infPct = student.stats.totalInferential > 0 ? Math.round((student.stats.correctInferential / student.stats.totalInferential) * 100) : 0;
      const critPct = student.stats.totalCritical > 0 ? Math.round((student.stats.correctCritical / student.stats.totalCritical) * 100) : 0;

      statsContainer.innerHTML = `
        <div class="result-metric-box">
          <div class="metric-val" style="color: #0288d1;">${litPct}%</div>
          <div class="metric-lbl">Literal (${student.stats.correctLiteral}/${student.stats.totalLiteral})</div>
        </div>
        <div class="result-metric-box">
          <div class="metric-val" style="color: #f59e0b;">${infPct}%</div>
          <div class="metric-lbl">Inferencial (${student.stats.correctInferential}/${student.stats.totalInferential})</div>
        </div>
        <div class="result-metric-box">
          <div class="metric-val" style="color: #9333ea;">${critPct}%</div>
          <div class="metric-lbl">Crítico (${student.stats.correctCritical}/${student.stats.totalCritical})</div>
        </div>
      `;
    }
  }

  renderChallengesAndAchievements(student) {
    if (!student) return;

    // Retos Diarios
    const chlContainer = document.getElementById("challenges-list-container");
    if (chlContainer) {
      let cHtml = "";
      DAILY_CHALLENGES.forEach(ch => {
        const currentVal = student.stats[ch.progressKey] || 0;
        const isDone = currentVal >= ch.target;

        cHtml += `
          <div style="background: #ffffff; border: 2px solid #e2e8f0; border-radius: 16px; padding: 16px; margin-bottom: 12px; display: flex; justify-content: space-between; align-items: center;">
            <div style="display: flex; align-items: center; gap: 12px;">
              <span style="font-size: 2rem;">${ch.icon}</span>
              <div>
                <h4 style="font-weight: 800; font-size: 1.05rem;">${ch.title}</h4>
                <p style="font-size: 0.88rem; color: #64748b;">${ch.description}</p>
              </div>
            </div>
            <div>
              ${isDone ? `
                <span class="status-badge badge-approved">Completado ✅</span>
              ` : `
                <span style="font-weight: 800; color: #ea580c;">⭐ +${ch.points} pts</span>
              `}
            </div>
          </div>
        `;
      });
      chlContainer.innerHTML = cHtml;
    }

    // Logros y Medallas
    const achContainer = document.getElementById("achievements-grid-container");
    if (achContainer) {
      let aHtml = "";
      ACHIEVEMENTS_CATALOG.forEach(ach => {
        const isUnlocked = student.achievements.includes(ach.id);

        aHtml += `
          <div style="background: ${isUnlocked ? '#ffffff' : '#f8fafc'}; border: 2px solid ${isUnlocked ? '#fcd34d' : '#e2e8f0'}; border-radius: 16px; padding: 18px; text-align: center; opacity: ${isUnlocked ? '1' : '0.6'};">
            <div style="font-size: 2.8rem; margin-bottom: 8px;">${isUnlocked ? ach.icon : '🔒'}</div>
            <h4 style="font-weight: 800; font-size: 1rem; margin-bottom: 4px;">${ach.title}</h4>
            <p style="font-size: 0.8rem; color: #64748b;">${ach.description}</p>
          </div>
        `;
      });
      achContainer.innerHTML = aHtml;
    }
  }

  // =========================================================================
  // PANEL DOCENTE
  // =========================================================================

  renderTeacherDashboard() {
    const students = window.storageService.getStudents();
    const approvedReadings = window.storageService.getApprovedReadings();
    const pendingReadings = window.storageService.getPendingReadings();

    // Métricas del aula
    const totalStudentsEl = document.getElementById("t-metric-total-students");
    const avgCompEl = document.getElementById("t-metric-avg-comp");
    const pendingCountEl = document.getElementById("t-metric-pending-ia");

    if (totalStudentsEl) totalStudentsEl.textContent = students.length;
    if (pendingCountEl) pendingCountEl.textContent = pendingReadings.length;

    let totalPctSum = 0;
    students.forEach(s => {
      const lit = s.stats.totalLiteral > 0 ? (s.stats.correctLiteral / s.stats.totalLiteral) : 0.7;
      const inf = s.stats.totalInferential > 0 ? (s.stats.correctInferential / s.stats.totalInferential) : 0.6;
      totalPctSum += ((lit + inf) / 2) * 100;
    });
    const avg = students.length > 0 ? Math.round(totalPctSum / students.length) : 75;
    if (avgCompEl) avgCompEl.textContent = `${avg}%`;

    // Tabla de estudiantes
    const tableBody = document.getElementById("teacher-students-table-body");
    if (tableBody) {
      let tHtml = "";
      students.forEach(st => {
        const lvlIcon = st.level === "AVANZADO" ? "🔴" : (st.level === "DESARROLLO" ? "🟡" : "🟢");
        const litPct = st.stats.totalLiteral > 0 ? Math.round((st.stats.correctLiteral / st.stats.totalLiteral) * 100) : 75;
        const infPct = st.stats.totalInferential > 0 ? Math.round((st.stats.correctInferential / st.stats.totalInferential) * 100) : 60;
        const needsReinforcement = infPct < 60 || litPct < 60;

        tHtml += `
          <tr>
            <td>
              <strong>${st.name}</strong><br>
              <small style="color: #64748b;">${st.grade}</small>
            </td>
            <td>
              <span class="stat-chip level-chip level-badge-${st.level.toLowerCase()}">
                ${lvlIcon} ${st.level}
              </span>
            </td>
            <td>${st.stats.completedReadings}</td>
            <td>
              <span style="font-weight: 800; color: #0288d1;">Lit: ${litPct}%</span> | 
              <span style="font-weight: 800; color: #f59e0b;">Inf: ${infPct}%</span>
            </td>
            <td>
              ${needsReinforcement ? `
                <span class="status-badge badge-pending">⚠️ Requiere Refuerzo</span>
              ` : `
                <span class="status-badge badge-approved">🟢 Autónomo</span>
              `}
            </td>
            <td>
              <button class="btn-outline" style="padding: 6px 12px; font-size: 0.85rem;" onclick="window.leoApp.showStudentDetailTeacher('${st.id}')">
                Ver Ficha 📋
              </button>
            </td>
          </tr>
        `;
      });
      tableBody.innerHTML = tHtml;
    }

    // Alertas y Recomendaciones de IA
    const alertsContainer = document.getElementById("teacher-ai-recommendations-list");
    if (alertsContainer) {
      const recs = window.aiService.generateTeacherRecommendations(students[0], { count: students.length });
      let rHtml = "";
      recs.forEach(r => {
        rHtml += `
          <div style="background: #f8fafc; border-left: 6px solid #0288d1; border-radius: 12px; padding: 14px 18px; margin-bottom: 12px;">
            <div style="display: flex; align-items: center; gap: 8px; font-weight: 800; color: #0f172a; margin-bottom: 4px;">
              <span>${r.icon}</span>
              <span>Recomendación IA Leo (${r.priority})</span>
            </div>
            <p style="color: #475569; font-size: 0.95rem;">${r.message}</p>
          </div>
        `;
      });
      alertsContainer.innerHTML = rHtml;
    }
  }

  showStudentDetailTeacher(studentId) {
    const students = window.storageService.getStudents();
    const st = students.find(s => s.id === studentId);
    if (!st) return;

    this.selectedStudentForDetail = st;
    const modal = document.getElementById("modal-student-detail");
    const content = document.getElementById("student-detail-content");

    if (content) {
      content.innerHTML = `
        <h3 style="font-size: 1.5rem; font-weight: 900; margin-bottom: 4px;">Ficha Pedagógica: ${st.name}</h3>
        <p style="color: #64748b; margin-bottom: 20px;">${st.grade} • ${st.age} años</p>

        <div style="background: #f1f5f9; padding: 16px; border-radius: 14px; margin-bottom: 20px;">
          <strong>Nivel Asignado:</strong> ${st.level} (Etapa ${st.stage || 1})<br>
          <strong>Resultado Diagnóstico Inicial:</strong> ${st.diagnosticResult ? st.diagnosticResult.overallPercentage : 65}%<br>
          <strong>Lecturas realizadas:</strong> ${st.stats.completedReadings}<br>
          <strong>Comodines utilizados:</strong> ${st.stats.cleanRunsWithoutComodin} lecturas autónomas sin comodín.
        </div>

        <h4 style="font-weight: 800; margin-bottom: 10px;">Acciones Docentes:</h4>
        <div style="display: flex; gap: 12px; flex-wrap: wrap;">
          <button class="btn-outline" onclick="window.leoApp.reassignStudentLevel('${st.id}', 'INICIO')">Mover a 🟢 Inicio</button>
          <button class="btn-outline" onclick="window.leoApp.reassignStudentLevel('${st.id}', 'DESARROLLO')">Mover a 🟡 Desarrollo</button>
          <button class="btn-outline" onclick="window.leoApp.reassignStudentLevel('${st.id}', 'AVANZADO')">Mover a 🔴 Avanzado</button>
          <button class="btn-secondary" onclick="window.leoApp.resetStudentDiagnostic('${st.id}')">Reiniciar Diagnóstico 🔄</button>
        </div>
      `;
    }

    if (modal) modal.classList.add("active");
  }

  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.remove("active");
  }

  reassignStudentLevel(studentId, newLevel) {
    const students = window.storageService.getStudents();
    const st = students.find(s => s.id === studentId);
    if (st) {
      st.level = newLevel;
      window.storageService.updateStudent(st);
      alert(`Nivel de ${st.name} actualizado a ${newLevel}.`);
      this.closeModal("modal-student-detail");
      this.renderTeacherDashboard();
    }
  }

  resetStudentDiagnostic(studentId) {
    const students = window.storageService.getStudents();
    const st = students.find(s => s.id === studentId);
    if (st) {
      st.diagnosticDone = false;
      window.storageService.updateStudent(st);
      alert(`Diagnóstico reiniciado para ${st.name}. En su próximo ingreso realizará la prueba.`);
      this.closeModal("modal-student-detail");
      this.renderTeacherDashboard();
    }
  }

  // =========================================================================
  // BIBLIOTECA DOCENTE Y REVISIÓN DE CONTENIDOS IA
  // =========================================================================

  renderTeacherLibrary(statusFilter = "all") {
    const allReadings = window.storageService.getReadings();
    const container = document.getElementById("teacher-readings-list");
    if (!container) return;

    let filtered = allReadings;
    if (statusFilter !== "all") {
      filtered = filtered.filter(r => r.status === statusFilter);
    }

    let html = "";
    filtered.forEach(r => {
      const isPending = r.status === "PENDIENTE_REVISION";
      const isApproved = r.status === "APROBADA";
      const badgeClass = isPending ? "badge-pending" : (isApproved ? "badge-approved" : "badge-rejected");
      const badgeLabel = isPending ? "🟡 Pendiente de Revisión" : (isApproved ? "🟢 Aprobada" : "🔴 Rechazada");

      html += `
        <div style="background: #ffffff; border: 2px solid #e2e8f0; border-radius: 16px; padding: 20px; margin-bottom: 16px; display: flex; justify-content: space-between; align-items: center; gap: 16px; flex-wrap: wrap;">
          <div style="flex: 1;">
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 6px;">
              <span class="status-badge ${badgeClass}">${badgeLabel}</span>
              <span style="font-size: 0.85rem; font-weight: 700; color: #64748b;">${r.level} • ${r.origin || 'IA'}</span>
            </div>
            <h3 style="font-size: 1.25rem; font-weight: 800; margin-bottom: 4px;">${r.title}</h3>
            <p style="color: #64748b; font-size: 0.9rem;">${r.summary || ''}</p>
          </div>
          <div style="display: flex; gap: 8px;">
            <button class="btn-primary" style="padding: 10px 18px; font-size: 0.95rem;" onclick="window.leoApp.openTeacherReviewEditor('${r.id}')">
              ${isPending ? 'Revisar y Aprobar ✍️' : 'Editar Lectura ✏️'}
            </button>
          </div>
        </div>
      `;
    });

    container.innerHTML = html;
  }

  setupAIGeneratorScreen() {
    // Formulario de generación de IA para docente
    const genBtn = document.getElementById("btn-trigger-ai-gen");
    if (genBtn) {
      genBtn.onclick = () => this.generateNewAIReading();
    }
  }

  async generateNewAIReading() {
    const levelSelect = document.getElementById("ai-gen-level");
    const categorySelect = document.getElementById("ai-gen-category");
    const genreSelect = document.getElementById("ai-gen-genre");
    const promptInput = document.getElementById("ai-gen-custom-prompt");
    const statusBox = document.getElementById("ai-gen-status-box");

    const level = levelSelect ? levelSelect.value : "DESARROLLO";
    const category = categorySelect ? categorySelect.value : "heroes";
    const genre = genreSelect ? genreSelect.value : "Biografía narrativa";
    const pedagogicalGoal = promptInput ? promptInput.value : "";

    if (statusBox) {
      statusBox.style.display = "block";
      statusBox.innerHTML = `<em>Generando lectura con rigor pedagógico y verificando hechos históricos...</em> ⏳`;
    }

    const newReading = await window.aiService.generateReading({
      level,
      category,
      genre,
      pedagogicalGoal
    });

    // Guardar en repositorio (Estado inicial SIEMPRE PENDIENTE DE REVISIÓN)
    window.storageService.addReading(newReading);

    if (statusBox) {
      statusBox.innerHTML = `
        <div style="background: #fef3c7; border: 2px solid #fde68a; border-radius: 12px; padding: 16px; color: #92400e; font-weight: 800;">
          🟡 Lectura generada con éxito y colocada en <strong>PENDIENTE DE REVISIÓN DOCENTE</strong>.<br>
          <button class="btn-primary" style="margin-top: 10px;" onclick="window.leoApp.openTeacherReviewEditor('${newReading.id}')">
            Abrir Editor y Revisar Contenido 🔍
          </button>
        </div>
      `;
    }
  }

  openTeacherReviewEditor(readingId) {
    const allReadings = window.storageService.getReadings();
    const reading = allReadings.find(r => r.id === readingId);
    if (!reading) return;

    this.selectedPendingReading = reading;
    const modal = document.getElementById("modal-ai-review-editor");
    const content = document.getElementById("ai-review-editor-content");

    if (content) {
      const pText = (reading.paragraphs || []).join("\n\n");
      const litQuestions = (reading.questions && reading.questions.literal) || [];
      const infQuestions = (reading.questions && reading.questions.inferential) || [];
      const critQuestions = (reading.questions && reading.questions.critical) || [];

      content.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
          <div>
            <span class="status-badge badge-pending">Revisión de Calidad Docente</span>
            <h2 style="font-size: 1.6rem; font-weight: 900; margin-top: 4px;">${reading.title}</h2>
          </div>
          <button class="btn-outline" onclick="window.leoApp.closeModal('modal-ai-review-editor')">Cerrar ✖</button>
        </div>

        <div style="margin-bottom: 20px;">
          <label style="font-weight: 800; display: block; margin-bottom: 6px;">Título de la Lectura:</label>
          <input type="text" id="edit-read-title" value="${reading.title}" class="written-textarea" style="min-height: 44px;">
        </div>

        <div style="margin-bottom: 20px;">
          <label style="font-weight: 800; display: block; margin-bottom: 6px;">
            Texto de la Lectura ${reading.level === 'AVANZADO' ? '(Regla: Máximo 3 párrafos)' : ''}:
          </label>
          <textarea id="edit-read-text" class="written-textarea" style="min-height: 180px;">${pText}</textarea>
        </div>

        <div style="margin-bottom: 20px;">
          <label style="font-weight: 800; display: block; margin-bottom: 6px;">Pista del Comodín (No revelar la respuesta):</label>
          <input type="text" id="edit-read-comodin" value="${reading.comodinHint || ''}" class="written-textarea" style="min-height: 44px;">
        </div>

        <div style="background: #f8fafc; border: 2px solid #e2e8f0; border-radius: 16px; padding: 18px; margin-bottom: 24px;">
          <h4 style="font-weight: 800; margin-bottom: 10px;">📋 Estructura de Comprensión (15 Preguntas Generadas):</h4>
          <ul style="padding-left: 20px; line-height: 1.8;">
            <li><strong>5 Preguntas Literales:</strong> ${litQuestions.length} cargadas ✅</li>
            <li><strong>5 Preguntas Inferenciales:</strong> ${infQuestions.length} cargadas ✅</li>
            <li><strong>5 Preguntas Críticas:</strong> ${critQuestions.length} cargadas (con respuesta abierta) ✅</li>
          </ul>
        </div>

        <div style="display: flex; gap: 14px; justify-content: flex-end; flex-wrap: wrap;">
          <button class="btn-outline" style="color: #b91c1c; border-color: #fca5a5;" onclick="window.leoApp.rejectReadingAction('${reading.id}')">
            ❌ Rechazar Lectura
          </button>
          <button class="btn-secondary" onclick="window.leoApp.saveReadingEditsAction('${reading.id}')">
            💾 Guardar Cambios
          </button>
          <button class="btn-success" onclick="window.leoApp.approveReadingAction('${reading.id}')">
            ✅ Aprobar y Publicar para Estudiantes
          </button>
        </div>
      `;
    }

    if (modal) modal.classList.add("active");
  }

  saveReadingEditsAction(readingId) {
    const reading = this.selectedPendingReading;
    if (!reading) return;

    const titleInput = document.getElementById("edit-read-title");
    const textInput = document.getElementById("edit-read-text");
    const comodinInput = document.getElementById("edit-read-comodin");

    if (titleInput) reading.title = titleInput.value.trim();
    if (comodinInput) reading.comodinHint = comodinInput.value.trim();
    if (textInput) {
      reading.paragraphs = textInput.value.trim().split("\n\n").filter(p => p.trim().length > 0);
    }

    window.storageService.updateReading(reading);
    alert("Cambios guardados exitosamente.");
  }

  approveReadingAction(readingId) {
    this.saveReadingEditsAction(readingId);
    window.storageService.updateReadingStatus(readingId, "APROBADA");
    window.audioService.playSuccess();
    alert("¡Lectura aprobada! Ahora está disponible en la biblioteca de los estudiantes.");
    this.closeModal("modal-ai-review-editor");
    this.renderTeacherLibrary();
  }

  rejectReadingAction(readingId) {
    window.storageService.updateReadingStatus(readingId, "RECHAZADA");
    window.audioService.playSoftError();
    alert("Lectura rechazada.");
    this.closeModal("modal-ai-review-editor");
    this.renderTeacherLibrary();
  }

  // =========================================================================
  // AUTENTICACIÓN Y ROLES (LOGIN, REGISTRO, SESIÓN)
  // =========================================================================

  switchAuthTab(tab) {
    window.audioService.playClick();
    const loginBtn = document.getElementById("tab-btn-login");
    const regBtn = document.getElementById("tab-btn-register");
    const formLogin = document.getElementById("form-auth-login");
    const formReg = document.getElementById("form-auth-register");
    const statusBanner = document.getElementById("auth-status-banner");

    if (statusBanner) statusBanner.style.display = "none";

    if (tab === "login") {
      if (loginBtn) loginBtn.classList.add("active");
      if (regBtn) regBtn.classList.remove("active");
      if (formLogin) formLogin.style.display = "block";
      if (formReg) formReg.style.display = "none";
    } else {
      if (regBtn) regBtn.classList.add("active");
      if (loginBtn) loginBtn.classList.remove("active");
      if (formLogin) formLogin.style.display = "none";
      if (formReg) formReg.style.display = "block";
    }
  }

  selectRegRole(role) {
    window.audioService.playClick();
    const roleVal = document.getElementById("reg-role-value");
    const userCard = document.getElementById("role-card-user");
    const adminCard = document.getElementById("role-card-admin");

    if (roleVal) roleVal.value = role;

    if (role === "admin") {
      if (adminCard) adminCard.classList.add("selected");
      if (userCard) userCard.classList.remove("selected");
    } else {
      if (userCard) userCard.classList.add("selected");
      if (adminCard) adminCard.classList.remove("selected");
    }
  }

  fillDemoCredentials(username, password) {
    window.audioService.playClick();
    const userInput = document.getElementById("login-username");
    const passInput = document.getElementById("login-password");
    if (userInput) userInput.value = username;
    if (passInput) passInput.value = password;
  }

  showAuthStatus(message, isError = true) {
    const banner = document.getElementById("auth-status-banner");
    if (!banner) return;
    banner.innerText = message;
    banner.className = isError ? "auth-status-banner error" : "auth-status-banner success";
    banner.style.display = "block";
  }

  async handleLoginSubmit(event) {
    event.preventDefault();
    const userInput = document.getElementById("login-username");
    const passInput = document.getElementById("login-password");
    const submitBtn = document.getElementById("btn-login-submit");

    if (!userInput || !passInput) return;

    const username = userInput.value.trim();
    const password = passInput.value;

    if (!username || !password) {
      this.showAuthStatus("Por favor completa todos los campos.", true);
      return;
    }

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerText = "Verificando credenciales... ⏳";
    }

    try {
      const result = await window.authService.login(username, password);
      if (result.success) {
        window.audioService.playSuccess();
        this.showAuthStatus("¡Inicio de sesión exitoso! Redirigiendo...", false);

        setTimeout(() => {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerText = "Ingresar a LEO 🚀";
          }
          if (result.user.role === "admin") {
            this.navigateTo("screen-admin-dashboard");
          } else {
            this.navigateTo("screen-dashboard");
          }
          this.updateNavbarUser();
        }, 500);
      } else {
        window.audioService.playSoftError();
        this.showAuthStatus(result.message || "Usuario o contraseña incorrectos.", true);
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerText = "Ingresar a LEO 🚀";
        }
      }
    } catch (err) {
      window.audioService.playSoftError();
      this.showAuthStatus("Error de conexión: " + err.message, true);
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerText = "Ingresar a LEO 🚀";
      }
    }
  }

  async handleRegisterSubmit(event) {
    event.preventDefault();
    const userInput = document.getElementById("reg-username");
    const nameInput = document.getElementById("reg-displayName");
    const passInput = document.getElementById("reg-password");
    const confirmInput = document.getElementById("reg-confirm-password");
    const roleVal = document.getElementById("reg-role-value");
    const submitBtn = document.getElementById("btn-register-submit");

    if (!userInput || !passInput || !confirmInput) return;

    const username = userInput.value.trim();
    const displayName = nameInput ? nameInput.value.trim() : username;
    const password = passInput.value;
    const confirmPass = confirmInput.value;
    const role = roleVal ? roleVal.value : "user";

    if (password !== confirmPass) {
      this.showAuthStatus("Las contraseñas no coinciden. Por favor verifica.", true);
      return;
    }

    if (password.length < 6) {
      this.showAuthStatus("La contraseña debe tener un mínimo de 6 caracteres.", true);
      return;
    }

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerText = "Registrando en MongoDB Atlas... ⏳";
    }

    try {
      const result = await window.authService.register(username, password, role, displayName);
      if (result.success) {
        window.audioService.playSuccess();
        this.showAuthStatus("¡Cuenta creada exitosamente en MongoDB Atlas! 🎉", false);

        setTimeout(() => {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerText = "Crear mi Cuenta 🎉";
          }
          if (result.user.role === "admin") {
            this.navigateTo("screen-admin-dashboard");
          } else {
            this.navigateTo("screen-dashboard");
          }
          this.updateNavbarUser();
        }, 600);
      } else {
        window.audioService.playSoftError();
        this.showAuthStatus(result.message || "No se pudo completar el registro.", true);
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerText = "Crear mi Cuenta 🎉";
        }
      }
    } catch (err) {
      window.audioService.playSoftError();
      this.showAuthStatus("Error al registrar: " + err.message, true);
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerText = "Crear mi Cuenta 🎉";
      }
    }
  }

  logout() {
    window.audioService.playClick();
    if (confirm("¿Deseas cerrar tu sesión actual de LEO?")) {
      window.authService.clearSession();
      this.navigateTo("screen-auth");
      this.updateNavbarUser();
    }
  }

  // =========================================================================
  // CONTROL TOTAL: PANEL DE ADMINISTRADOR PRINCIPAL
  // =========================================================================

  async initAdminDashboard() {
    const adminUser = window.authService.getCurrentUser();
    const adminNameEl = document.getElementById("admin-current-username");
    if (adminNameEl && adminUser) {
      adminNameEl.innerText = adminUser.username;
    }

    this.filterAdminReadingsDropdown();
    await this.refreshAdminLiveUsers();
    await this.loadMongoUsersList();
  }

  filterAdminReadingsDropdown() {
    const selectEl = document.getElementById("admin-selected-reading");
    const filterEl = document.getElementById("admin-filter-reading-level");
    if (!selectEl) return;

    const filterLevel = filterEl ? filterEl.value : "ALL";
    const readings = window.storageService.getApprovedReadings();

    const filtered = filterLevel === "ALL" 
      ? readings 
      : readings.filter(r => (r.level || "").toUpperCase() === filterLevel);

    selectEl.innerHTML = filtered.map(r => {
      const lvlIcon = r.level === "AVANZADO" ? "🔴" : (r.level === "DESARROLLO" ? "🟡" : "🟢");
      return `<option value="${r.id}">${lvlIcon} [${r.level}] ${r.title}</option>`;
    }).join("");
  }

  async refreshAdminLiveUsers() {
    const dbStatusPill = document.getElementById("admin-db-status-pill");
    const dbStatusText = document.getElementById("admin-db-status-text");

    const stats = await window.authService.fetchAdminStats();

    if (stats) {
      if (dbStatusText) {
        dbStatusText.innerText = stats.dbStatus === "connected_atlas" ? "Conectado a Atlas 🍃" : "Modo Respaldo Local 🟡";
      }
      if (dbStatusPill) {
        dbStatusPill.style.background = stats.dbStatus === "connected_atlas" ? "rgba(34, 197, 94, 0.2)" : "rgba(245, 127, 23, 0.2)";
        dbStatusPill.style.color = stats.dbStatus === "connected_atlas" ? "#4ade80" : "#fbbf24";
      }

      const totalUsersEl = document.getElementById("admin-stat-total-users");
      if (totalUsersEl) totalUsersEl.innerText = stats.stats.totalRegisteredUsers;

      const connCountEl = document.getElementById("admin-stat-connected-users");
      if (connCountEl) connCountEl.innerText = stats.stats.connectedUsersCount;

      if (stats.stats.connectedUsers) {
        this.renderAdminLiveUsers(stats.stats.connectedUsers);
      }
    } else {
      if (dbStatusText) dbStatusText.innerText = "Activo (Respaldo)";
      this.renderAdminLiveUsers(this.adminLiveUsers.length > 0 ? this.adminLiveUsers : [
        {
          socketId: "socket_local",
          username: window.authService.getCurrentUser()?.username || "admin",
          role: "admin",
          activeScreen: "screen-admin-dashboard",
          currentActivity: "Panel de Control Total",
          connectedAt: new Date().toISOString()
        }
      ]);
    }
  }

  renderAdminLiveUsers(usersList) {
    const tbody = document.getElementById("admin-live-users-table-body");
    if (!tbody) return;

    if (!usersList || usersList.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="5" style="text-align: center; color: #94a3b8; padding: 20px;">
            No hay usuarios conectados en este instante.
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = usersList.map(u => {
      const isMe = (window.authService.getCurrentUser()?.username === u.username);
      const roleBadge = u.role === "admin" 
        ? `<span class="table-role-badge admin">👑 Admin</span>` 
        : `<span class="table-role-badge user">👤 Estudiante</span>`;

      const actions = isMe ? `<span style="font-size: 0.8rem; color: #94a3b8; font-weight: 700;">(Tu sesión)</span>` : `
        <div class="table-action-btns">
          <button class="btn-table-action" title="Enviar Mensaje Directo" onclick="window.leoApp.promptAdminDirectMessage('${u.socketId}', '${u.username}')">
            💬 Aviso
          </button>
          <button class="btn-table-action" title="Asignar Lectura Inmediata" onclick="window.leoApp.adminAssignReadingToUser('${u.socketId}', '${u.username}')">
            📖 Asignar
          </button>
          <button class="btn-table-action danger" title="Forzar Desconexión" onclick="window.leoApp.adminKickUser('${u.socketId}', '${u.username}')">
            ⚡ Kick
          </button>
        </div>
      `;

      return `
        <tr>
          <td>
            <strong>${u.displayName || u.username}</strong>
            <div style="font-size: 0.75rem; color: #94a3b8;">@${u.username}</div>
          </td>
          <td>${roleBadge}</td>
          <td>
            <span style="font-size: 0.85rem; font-weight: 700; color: #0288d1;">${u.currentActivity || 'En juego'}</span>
          </td>
          <td style="font-size: 0.8rem; color: #64748b;">En línea</td>
          <td>${actions}</td>
        </tr>
      `;
    }).join("");
  }

  async loadMongoUsersList() {
    const tbody = document.getElementById("admin-mongo-users-table-body");
    if (!tbody) return;

    try {
      const res = await fetch("/api/admin/users");
      if (res.ok) {
        const data = await res.json();
        if (data.users && data.users.length > 0) {
          tbody.innerHTML = data.users.map(u => {
            const roleBadge = u.role === "admin"
              ? `<span class="table-role-badge admin">👑 Admin</span>`
              : `<span class="table-role-badge user">👤 Usuario</span>`;
            const dateStr = u.createdAt ? new Date(u.createdAt).toLocaleDateString("es-PE") : "Hoy";

            return `
              <tr>
                <td><strong>@${u.username}</strong></td>
                <td>${u.displayName || u.username}</td>
                <td>${roleBadge}</td>
                <td style="color: #64748b; font-size: 0.85rem;">${dateStr}</td>
              </tr>
            `;
          }).join("");
          return;
        }
      }
    } catch (e) {
      console.warn("No se pudo obtener directorio de MongoDB Atlas vía REST:", e);
    }

    const defaultUsers = [
      { username: "admin", displayName: "Administrador Principal", role: "admin", createdAt: new Date() },
      { username: "lucia", displayName: "Lucía Quispe", role: "user", createdAt: new Date() },
      { username: "mateo", displayName: "Mateo Flores", role: "user", createdAt: new Date() }
    ];

    tbody.innerHTML = defaultUsers.map(u => `
      <tr>
        <td><strong>@${u.username}</strong></td>
        <td>${u.displayName}</td>
        <td>${u.role === 'admin' ? '<span class="table-role-badge admin">👑 Admin</span>' : '<span class="table-role-badge user">👤 Usuario</span>'}</td>
        <td style="color: #64748b; font-size: 0.85rem;">Activo</td>
      </tr>
    `).join("");
  }

  adminBroadcastSelectedReading() {
    window.audioService.playClick();
    const selectEl = document.getElementById("admin-selected-reading");
    if (!selectEl) return;

    const readingId = selectEl.value;
    const reading = window.storageService.getReadingById(readingId);

    if (!reading) {
      alert("Por favor selecciona una lectura válida.");
      return;
    }

    if (socket && socket.connected) {
      socket.emit("admin:broadcast-reading", {
        readingId: reading.id,
        readingTitle: reading.title,
        level: reading.level
      }, (res) => {
        window.audioService.playSuccess();
        alert(`🚀 ¡Lectura asignada con éxito!\n"${reading.title}" fue enviada en tiempo real a las pantallas de los estudiantes.`);
      });
    } else {
      window.audioService.playSuccess();
      alert(`🚀 Modo local: Lectura "${reading.title}" lista para asignación masiva.`);
    }
  }

  adminAssignReadingToUser(targetSocketId, targetUsername) {
    const selectEl = document.getElementById("admin-selected-reading");
    const readingId = selectEl ? selectEl.value : null;
    const reading = readingId ? window.storageService.getReadingById(readingId) : null;

    if (!reading) {
      alert("Selecciona primero una lectura en el panel de control.");
      return;
    }

    if (confirm(`¿Asignar la lectura "${reading.title}" directamente al estudiante @${targetUsername}?`)) {
      if (socket && socket.connected) {
        socket.emit("admin:broadcast-reading", {
          readingId: reading.id,
          readingTitle: reading.title,
          level: reading.level,
          targetSocketId
        });
      }
      alert(`Lectura enviada al usuario @${targetUsername}.`);
    }
  }

  adminKickUser(targetSocketId, targetUsername) {
    window.audioService.playClick();
    if (confirm(`¿Estás seguro de expulsar y desconectar de inmediato al usuario @${targetUsername}?`)) {
      if (socket && socket.connected) {
        socket.emit("admin:kick-user", {
          targetSocketId,
          reason: "Un Administrador Principal ha finalizado tu sesión por moderación de aula."
        }, (res) => {
          alert(`Usuario @${targetUsername} desconectado.`);
          this.refreshAdminLiveUsers();
        });
      } else {
        alert(`Sesión de @${targetUsername} finalizada.`);
      }
    }
  }

  promptAdminDirectMessage(targetSocketId, targetUsername) {
    window.audioService.playClick();
    const msg = prompt(`Escribe un mensaje de moderación u orientación para @${targetUsername}:`);
    if (msg && msg.trim()) {
      if (socket && socket.connected) {
        socket.emit("admin:send-direct-message", {
          targetSocketId,
          title: "Mensaje de Moderación de LEO",
          message: msg.trim()
        });
        alert(`Mensaje enviado exitosamente a @${targetUsername}.`);
      } else {
        alert("Mensaje simulado enviado.");
      }
    }
  }

  handleBroadcastAnnouncement(event) {
    event.preventDefault();
    const titleInput = document.getElementById("admin-broadcast-title");
    const msgInput = document.getElementById("admin-broadcast-msg");
    const typeSelect = document.getElementById("admin-broadcast-type");

    if (!titleInput || !msgInput) return;

    const title = titleInput.value.trim();
    const message = msgInput.value.trim();
    const type = typeSelect ? typeSelect.value : "info";

    if (!title || !message) return;

    if (socket && socket.connected) {
      socket.emit("admin:broadcast-message", { title, message, type }, (res) => {
        window.audioService.playSuccess();
        alert(`📢 ¡Anuncio transmitido exitosamente a todos los dispositivos conectados!`);
        titleInput.value = "";
        msgInput.value = "";
      });
    } else {
      window.audioService.playSuccess();
      this.showSystemAnnouncement({ title, message, type });
      titleInput.value = "";
      msgInput.value = "";
    }
  }

  // =========================================================================
  // RECEPCIÓN DE MENSAJES Y ASIGNACIONES EN TIEMPO REAL (ESTUDIANTE)
  // =========================================================================

  showSystemAnnouncement(data) {
    window.audioService.playCelebrationFanfare();
    const modal = document.getElementById("modal-system-announcement");
    const titleEl = document.getElementById("announcement-title");
    const bodyEl = document.getElementById("announcement-body");
    const iconEl = document.getElementById("announcement-icon");

    if (titleEl) titleEl.innerText = data.title || "Aviso de Leo 🇵🇪";
    if (bodyEl) bodyEl.innerText = data.message || "";
    if (iconEl) {
      iconEl.innerText = data.type === "success" ? "🌟" : (data.type === "warning" ? "⚠️" : "📢");
    }

    if (modal) modal.classList.add("active");
  }

  showDirectMessageModal(data) {
    window.audioService.playSuccess();
    const modal = document.getElementById("modal-direct-message");
    const titleEl = document.getElementById("direct-msg-title");
    const bodyEl = document.getElementById("direct-msg-body");

    if (titleEl) titleEl.innerText = data.title || "Mensaje del Administrador";
    if (bodyEl) bodyEl.innerText = data.message || "";

    if (modal) modal.classList.add("active");
  }

  handleAssignedReading(data) {
    window.audioService.playCelebrationFanfare();
    const readingId = data.readingId;
    const readingTitle = data.readingTitle || "Lectura recomendada";

    const proceed = confirm(`👑 ¡NUEVA LECTURA ASIGNADA EN VIVO!\n\nEl Administrador Principal te ha asignado:\n"${readingTitle}"\n\n¿Deseas comenzar a leerla ahora mismo?`);
    if (proceed && readingId) {
      this.openReading(readingId);
    }
  }
}

// Inicialización global
window.leoApp = new LeoApp();
