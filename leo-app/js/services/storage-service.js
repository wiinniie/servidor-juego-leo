/**
 * LEO – Lectura, Escritura y Oralidad
 * Servicio de Almacenamiento y Estado Persistente
 * 
 * Gestiona perfiles de estudiantes, datos del docente, repositorio de lecturas
 * (aprobadas y pendientes), métricas, logros, avatar y puntos con localStorage.
 */

class StorageService {
  constructor() {
    this.STORAGE_KEY_STUDENTS = "leo_students_v1";
    this.STORAGE_KEY_CURRENT_STUDENT = "leo_current_student_id_v1";
    this.STORAGE_KEY_READINGS = "leo_readings_repo_v1";
    this.STORAGE_KEY_TEACHER = "leo_teacher_profile_v1";

    this.initDefaultData();
  }

  initDefaultData() {
    // 1. Estudiantes por defecto para el prototipo funcional
    if (!localStorage.getItem(this.STORAGE_KEY_STUDENTS)) {
      const defaultStudents = [
        {
          id: "stu_lucia",
          name: "Lucía Quispe",
          age: 7,
          grade: "2° Grado Primaria",
          level: "INICIO",
          stage: 2, // En etapa 2 de Inicio: palabras sencillas
          progressPercentage: 45,
          points: 135,
          streak: 3,
          diagnosticDone: true,
          diagnosticResult: {
            overallPercentage: 42,
            assignedLevel: "INICIO",
            initialStage: 2,
            explanation: "Comenzaremos en 🟢 Inicio. Aquí podrás practicar paso a paso y avanzar a tu propio ritmo."
          },
          stats: {
            completedReadings: 2,
            readingsHistory: ["ini_stage_1"],
            correctLiteral: 8,
            totalLiteral: 9,
            correctInferential: 3,
            totalInferential: 6,
            correctCritical: 2,
            totalCritical: 4,
            writtenCritiqueCount: 1,
            cleanRunsWithoutComodin: 1,
            historyReadingsCount: 0,
            natureReadingsCount: 1,
            streak: 3,
            readToday: 1,
            literalToday: 3,
            savedComodinToday: 1,
            wroteOpenToday: 1
          },
          avatar: {
            headwear: "head_chullo_basic",
            outfit: "out_polo_blanco",
            accessory: "acc_ninguno",
            background: "bg_aula_alegre",
            unlockedItems: ["head_chullo_basic", "out_polo_blanco", "acc_ninguno", "bg_aula_alegre", "acc_lupa_misterio"]
          },
          achievements: ["ach_first_read", "ach_nature_friend", "ach_reading_streak"]
        },
        {
          id: "stu_mateo",
          name: "Mateo Flores",
          age: 8,
          grade: "3° Grado Primaria",
          level: "DESARROLLO",
          stage: 1,
          progressPercentage: 65,
          points: 260,
          streak: 5,
          diagnosticDone: true,
          diagnosticResult: {
            overallPercentage: 68,
            assignedLevel: "DESARROLLO",
            initialStage: 1,
            explanation: "Comenzaremos en 🟡 Desarrollo para fortalecer tu comprensión y fluidez."
          },
          stats: {
            completedReadings: 4,
            readingsHistory: ["des_grau", "des_delfin"],
            correctLiteral: 18,
            totalLiteral: 20,
            correctInferential: 12,
            totalInferential: 20,
            correctCritical: 14,
            totalCritical: 20,
            writtenCritiqueCount: 2,
            cleanRunsWithoutComodin: 2,
            historyReadingsCount: 1,
            natureReadingsCount: 1,
            streak: 5,
            readToday: 1,
            literalToday: 4,
            savedComodinToday: 1,
            wroteOpenToday: 1
          },
          avatar: {
            headwear: "head_chullo_basic",
            outfit: "out_poncho_cusco",
            accessory: "acc_lentes_detective",
            background: "bg_machu_picchu",
            unlockedItems: ["head_chullo_basic", "out_polo_blanco", "out_poncho_cusco", "acc_lentes_detective", "bg_aula_alegre", "bg_machu_picchu"]
          },
          achievements: ["ach_first_read", "ach_word_detective", "ach_peru_heroes", "ach_reading_streak", "ach_no_comodin"]
        },
        {
          id: "stu_valentina",
          name: "Valentina Benítez",
          age: 9,
          grade: "4° Grado Primaria",
          level: "AVANZADO",
          stage: 1,
          progressPercentage: 85,
          points: 420,
          streak: 7,
          diagnosticDone: true,
          diagnosticResult: {
            overallPercentage: 92,
            assignedLevel: "AVANZADO",
            initialStage: 1,
            explanation: "Comenzaremos en 🔴 Avanzado para desafiar tu pensamiento crítico con textos de hasta 3 párrafos."
          },
          stats: {
            completedReadings: 6,
            readingsHistory: ["ava_maria_reiche", "ava_olaya"],
            correctLiteral: 28,
            totalLiteral: 30,
            correctInferential: 26,
            totalInferential: 30,
            correctCritical: 25,
            totalCritical: 30,
            writtenCritiqueCount: 4,
            cleanRunsWithoutComodin: 4,
            historyReadingsCount: 3,
            natureReadingsCount: 2,
            streak: 7,
            readToday: 1,
            literalToday: 5,
            savedComodinToday: 1,
            wroteOpenToday: 1
          },
          avatar: {
            headwear: "head_corona_selva",
            outfit: "out_camiseta_peru",
            accessory: "acc_mochila_andina",
            background: "bg_mar_chorrillos",
            unlockedItems: ["head_chullo_basic", "out_polo_blanco", "head_corona_selva", "out_camiseta_peru", "acc_mochila_andina", "bg_mar_chorrillos"]
          },
          achievements: ["ach_first_read", "ach_five_reads", "ach_word_detective", "ach_inference_master", "ach_critical_thinker", "ach_reading_streak"]
        }
      ];
      localStorage.setItem(this.STORAGE_KEY_STUDENTS, JSON.stringify(defaultStudents));
      localStorage.setItem(this.STORAGE_KEY_CURRENT_STUDENT, "stu_lucia");
    }

    // 2. Repositorio de lecturas (fusionando iniciales y pendientes)
    if (!localStorage.getItem(this.STORAGE_KEY_READINGS)) {
      const allReadings = [...INITIAL_READINGS, ...PENDING_AI_READINGS];
      localStorage.setItem(this.STORAGE_KEY_READINGS, JSON.stringify(allReadings));
    }

    // 3. Perfil del docente
    if (!localStorage.getItem(this.STORAGE_KEY_TEACHER)) {
      const teacher = {
        name: "Prof. Carmen Morales",
        school: "I.E. República del Perú - N° 1082",
        classroom: "2° Grado - Sección A",
        region: "Lima / UGEL 03",
        email: "carmen.morales@educacion.gob.pe"
      };
      localStorage.setItem(this.STORAGE_KEY_TEACHER, JSON.stringify(teacher));
    }
  }

  // --- MÉTODOS DE ESTUDIANTES ---

  getStudents() {
    return JSON.parse(localStorage.getItem(this.STORAGE_KEY_STUDENTS) || "[]");
  }

  saveStudents(students) {
    localStorage.setItem(this.STORAGE_KEY_STUDENTS, JSON.stringify(students));
  }

  getCurrentStudent() {
    const students = this.getStudents();
    const currentId = localStorage.getItem(this.STORAGE_KEY_CURRENT_STUDENT) || (students[0] && students[0].id);
    return students.find(s => s.id === currentId) || students[0] || null;
  }

  setCurrentStudent(studentId) {
    localStorage.setItem(this.STORAGE_KEY_CURRENT_STUDENT, studentId);
  }

  createStudent(newStudentData) {
    const students = this.getStudents();
    const newStudent = {
      id: "stu_" + Date.now(),
      name: newStudentData.name || "Nuevo Estudiante",
      age: parseInt(newStudentData.age, 10) || 7,
      grade: newStudentData.grade || "2° Grado Primaria",
      level: "INICIO", // Asignado luego del diagnóstico
      stage: 1,
      progressPercentage: 0,
      points: 50, // Puntos de bienvenida
      streak: 1,
      diagnosticDone: false,
      diagnosticResult: null,
      stats: {
        completedReadings: 0,
        readingsHistory: [],
        correctLiteral: 0,
        totalLiteral: 0,
        correctInferential: 0,
        totalInferential: 0,
        correctCritical: 0,
        totalCritical: 0,
        writtenCritiqueCount: 0,
        cleanRunsWithoutComodin: 0,
        historyReadingsCount: 0,
        natureReadingsCount: 0,
        streak: 1,
        readToday: 0,
        literalToday: 0,
        savedComodinToday: 0,
        wroteOpenToday: 0
      },
      avatar: {
        headwear: "head_chullo_basic",
        outfit: "out_polo_blanco",
        accessory: "acc_ninguno",
        background: "bg_aula_alegre",
        unlockedItems: ["head_chullo_basic", "out_polo_blanco", "acc_ninguno", "bg_aula_alegre"]
      },
      achievements: []
    };

    students.push(newStudent);
    this.saveStudents(students);
    this.setCurrentStudent(newStudent.id);
    return newStudent;
  }

  updateStudent(updatedStudent) {
    const students = this.getStudents();
    const index = students.findIndex(s => s.id === updatedStudent.id);
    if (index !== -1) {
      students[index] = updatedStudent;
      this.saveStudents(students);
    }
  }

  // --- MÉTODOS DE LECTURAS Y REPOSITORIO ---

  getReadings() {
    return JSON.parse(localStorage.getItem(this.STORAGE_KEY_READINGS) || "[]");
  }

  saveReadings(readings) {
    localStorage.setItem(this.STORAGE_KEY_READINGS, JSON.stringify(readings));
  }

  getApprovedReadings(level = null) {
    const all = this.getReadings();
    let approved = all.filter(r => r.status === "APROBADA");
    if (level) {
      approved = approved.filter(r => r.level === level);
    }
    return approved;
  }

  getPendingReadings() {
    const all = this.getReadings();
    return all.filter(r => r.status === "PENDIENTE_REVISION");
  }

  addReading(reading) {
    const readings = this.getReadings();
    readings.unshift(reading); // Agregar al inicio
    this.saveReadings(readings);
  }

  updateReading(reading) {
    const readings = this.getReadings();
    const idx = readings.findIndex(r => r.id === reading.id);
    if (idx !== -1) {
      readings[idx] = reading;
      this.saveReadings(readings);
    }
  }

  updateReadingStatus(readingId, newStatus) {
    const readings = this.getReadings();
    const reading = readings.find(r => r.id === readingId);
    if (reading) {
      reading.status = newStatus;
      if (newStatus === "APROBADA") {
        reading.approvedAt = new Date().toISOString();
      }
      this.saveReadings(readings);
    }
  }

  // --- DOCENTE ---

  getTeacherProfile() {
    return JSON.parse(localStorage.getItem(this.STORAGE_KEY_TEACHER) || "{}");
  }
}

// Instancia global
window.storageService = new StorageService();
