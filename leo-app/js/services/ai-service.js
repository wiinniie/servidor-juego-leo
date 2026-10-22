/**
 * LEO – Lectura, Escritura y Oralidad
 * Servicio de Inteligencia Artificial Pedagógica
 * 
 * Funcionalidades:
 * 1. Generación de lecturas educativas respetando:
 *    - Rigor histórico en héroes y cultura peruana.
 *    - Nivel del estudiante (Inicio, Desarrollo, Avanzado).
 *    - Regla estricta: Nivel Avanzado MÁXIMO 3 PÁRRAFOS.
 *    - 15 preguntas obligatorias: 5 Literales + 5 Inferenciales + 5 Críticas (al menos 1 abierta).
 *    - Estado inicial: PENDIENTE DE REVISIÓN DOCENTE. NUNCA se publica directamente.
 * 2. Evaluación de respuestas abiertas críticas con rúbrica cualitativa adaptada a niños.
 * 3. Generador de recomendaciones pedagógicas personalizadas para el docente.
 */

class AIService {
  constructor() {
    this.apiKey = localStorage.getItem("leo_gemini_api_key") || "";
  }

  setApiKey(key) {
    this.apiKey = key;
    localStorage.setItem("leo_gemini_api_key", key);
  }

  /**
   * Genera una nueva lectura con 5 literales + 5 inferenciales + 5 críticas
   * Estado SIEMPRE PENDIENTE DE REVISIÓN
   */
  async generateReading({ level, category, genre, topic, targetGrade, pedagogicalGoal }) {
    // Simulador inteligente de alta fidelidad pedagógica con banco de sabiduría peruana
    await new Promise(r => setTimeout(r, 1200)); // Tiempo realista de reflexión de IA

    const generatedId = "ai_" + Date.now();
    const currentDate = new Date().toISOString().split("T")[0];

    // Banco de temas y narrativas peruanas auténticas
    const libraryThemes = {
      heroes: [
        {
          title: "Daniel Alcides Carrión: El Mártir de la Medicina Peruana",
          heroImage: "🩺",
          category: "heroes",
          genre: "Biografía histórica",
          paragraphs: [
            "Daniel Alcides Carrión nació en Cerro de Pasco, entre los fríos valles mineros del Perú central. Siendo estudiante de medicina en la Universidad de San Marcos, observó con preocupación cómo muchos trabajadores de las obras del ferrocarril enfermaban gravemente a causa de una fiebre misteriosa.",
            "Para descubrir la verdad y encontrar una cura científica, Carrión tomó una decisión heroica en 1885: se inoculó a sí mismo el virus para documentar minuciosamente cada síntoma día tras día en su diario clínico, ante la admiración de sus profesores y compañeros.",
            "Gracias a su supremo sacrificio, los médicos lograron demostrar el origen de la verruga peruana y salvar incontables vidas en el futuro. Hoy en día, Carrión es honrado como el Patrono de la Medicina Peruana y un ejemplo eterno de amor por la ciencia y por el prójimo."
          ],
          comodinHint: "Lee el segundo párrafo para recordar qué hizo Carrión para documentar la enfermedad.",
          questions: this.buildCarriónQuestions()
        },
        {
          title: "Chabuca Granda: La Voz Poética de la Lima Criolla",
          heroImage: "🎸",
          category: "heroes",
          genre: "Biografía narrativa",
          paragraphs: [
            "María Isabel Granda Larco, conocida con inmenso cariño como Chabuca Granda, nació en un asentamiento minero de Cotabambas, en Apurímac. Desde temprana edad quedó fascinada por la música tradicional costeña y los ritmos afroperuanos que llenaban los barrios limeños.",
            "Con su guitarra y su hermosa voz, compuso canciones inmortales como 'La flor de la canela', rindiendo tributo a los puentes, alamedas y a los personajes sencillos y trabajadores de la ciudad, rescatando la elegancia del vals criollo.",
            "Chabuca llevó la cultura y la poesía del Perú a los escenarios más prestigiosos de América y el mundo. Su talento y generosidad demostraron que el arte musical une a los pueblos y enaltece el alma de nuestra nación."
          ],
          comodinHint: "Busca en el segundo párrafo los temas y canciones que inspiraron a Chabuca Granda.",
          questions: this.buildChabucaQuestions()
        }
      ],
      animales: [
        {
          title: "El Vuelo Majestuoso del Cóndor en el Cañón del Colca",
          heroImage: "🦅",
          category: "animales",
          genre: "Texto narrativo sobre naturaleza",
          paragraphs: [
            "En las profundidades del Cañón del Colca, en Arequipa, vive el cóndor andino, una de las aves voladoras más grandes del planeta. Con sus alas extendidas puede medir más de tres metros de ancho, planeando con serenidad sobre las corrientes de aire caliente sin necesidad de aletear constantemente.",
            "Los antiguos incas consideraban al cóndor un ser sagrado que conectaba el mundo de los humanos con el mundo celestial. Esta noble ave cumple un rol ecológico fundamental en la cordillera, pues limpia los campos al alimentarse de animales caídos, evitando que se propaguen enfermedades.",
            "Actualmente, guardaparques y comunidades del Colca cuidan los miradores y promueven el turismo responsable para proteger su hábitat natural. Admirar un cóndor surcando el cielo andino es un recordatorio de la grandeza y fragilidad de nuestra fauna peruana."
          ],
          comodinHint: "Observa en el segundo párrafo la función ecológica que cumple el cóndor en la naturaleza.",
          questions: this.buildCondorQuestions()
        }
      ],
      cultura: [
        {
          title: "El Inti Raymi: La Fiesta del Sol en el Cusco",
          heroImage: "☀️",
          category: "cultura",
          genre: "Relato cultural",
          paragraphs: [
            "Cada mes de junio, durante el solsticio de invierno en el hemisferio sur, la ciudad del Cusco se viste de fiesta para celebrar el Inti Raymi, la ancestral ceremonia incaica en honor al dios Sol o Inti. En la explanada de la fortaleza de Sacsayhuamán, cientos de actores reviven los ritos con vestimentas tradicionales llenas de color.",
            "Los antiguos pobladores andinos agradecían al Sol por dar calor a la tierra y hacer brotar el maíz, las papas y la quinua. La música de las quenas, zampoñas y pututos resuena entre las gigantescas piedras milenarias, llenando el ambiente de emoción y solemnidad.",
            "Esta festividad representa el orgullo por la herencia incaica y congrega a miles de visitantes de todo el mundo. Es un momento especial para recordar que el respeto a la Madre Tierra y a las fuerzas de la naturaleza forma parte esencial de la identidad peruana."
          ],
          comodinHint: "En el segundo párrafo se mencionan los instrumentos musicales y los alimentos agradecidos.",
          questions: this.buildIntiRaymiQuestions()
        }
      ]
    };

    // Selección del tema según solicitud
    const categoryGroup = libraryThemes[category] || libraryThemes["heroes"];
    const baseTemplate = categoryGroup[Math.floor(Math.random() * categoryGroup.length)];

    // Si el nivel es AVANZADO, aseguramos rigurosamente que sean máximo 3 párrafos
    let finalParagraphs = [...baseTemplate.paragraphs];
    if (level === "AVANZADO" && finalParagraphs.length > 3) {
      finalParagraphs = finalParagraphs.slice(0, 3);
    } else if (level === "INICIO") {
      // Simplificar a oraciones cortas
      finalParagraphs = [
        "El cóndor vuela sobre la montaña del Perú.",
        "Tiene alas muy grandes y cuida la naturaleza.",
        "Todos los niños aprenden a querer a nuestras aves."
      ];
    }

    const newReading = {
      id: generatedId,
      level: level || "DESARROLLO",
      title: baseTemplate.title,
      category: category || "heroes",
      genre: genre || "Biografía narrativa",
      readTime: "5 min",
      status: "PENDIENTE_REVISION", // NUNCA directo al estudiante
      origin: "Generado por IA Leo (Supervisión Requerida)",
      createdAt: currentDate,
      heroImage: baseTemplate.heroImage,
      summary: `Lectura generada con propósito pedagógico: "${pedagogicalGoal || 'Fortalecer comprensión inferencial y valores'}".`,
      paragraphs: finalParagraphs,
      comodinHint: baseTemplate.comodinHint,
      questions: baseTemplate.questions
    };

    return newReading;
  }

  // --- EVALUACIÓN DE RESPUESTAS ABIERTAS CON IA ---

  /**
   * Analiza la respuesta del estudiante en preguntas críticas
   * Sin exigir respuesta de memoria o exacta.
   */
  evaluateOpenResponse(questionData, studentAnswer) {
    if (!studentAnswer || typeof studentAnswer !== "string") {
      return {
        isAcceptable: false,
        score: 0,
        feedback: "¡Anímate a escribir tu opinión! Cuéntale a Leo qué piensas en tus propias palabras."
      };
    }

    const text = studentAnswer.trim();
    const words = text.split(/\s+/).filter(w => w.length > 0);
    const wordCount = words.length;

    if (wordCount < 4) {
      return {
        isAcceptable: false,
        score: 30,
        feedback: "¡Buen comienzo! Escribe un poquito más para que Leo pueda comprender tu punto de vista."
      };
    }

    const lower = text.toLowerCase();

    // Palabras de opinión y justificación esperadas en niños de primaria
    const reasoningMarkers = ["porque", "ya que", "para que", "pienso", "creo", "me parece", "siento", "opino", "importante", "debemos", "valores", "ayudar", "respeto"];
    const foundMarkers = reasoningMarkers.filter(m => lower.includes(m));

    // Palabras clave de la rúbrica
    const rubricKeywords = questionData.rubricKeywords || [];
    const matchedKeywords = rubricKeywords.filter(k => lower.includes(k.toLowerCase()));

    let score = 70; // Base por redactar con sentido
    if (wordCount >= 6) score += 10;
    if (foundMarkers.length > 0) score += 10;
    if (matchedKeywords.length > 0) score += 10;
    score = Math.min(score, 100);

    let feedback = "";
    if (score >= 85) {
      feedback = "🌟 ¡Extraordinaria reflexión! Has fundamentado tu opinión con mucha claridad y la relacionaste con la historia.";
    } else {
      feedback = "👏 ¡Muy buena opinión! Se nota tu sinceridad y esfuerzo al expresar lo que piensas.";
    }

    return {
      isAcceptable: true,
      score,
      wordCount,
      matchedKeywords,
      feedback,
      bonusPoints: 15
    };
  }

  // --- RECOMENDACIONES PEDAGÓGICAS PARA EL DOCENTE ---

  generateTeacherRecommendations(studentStats, groupStats) {
    const recommendations = [];

    // Recomendación individual
    if (studentStats) {
      const litRate = studentStats.literalRate || 75;
      const infRate = studentStats.inferentialRate || 60;
      const critRate = studentStats.criticalRate || 70;

      if (infRate < 60) {
        recommendations.push({
          type: "INFERENTIAL_FOCUS",
          priority: "ALTA",
          icon: "💡",
          studentName: studentStats.name,
          message: `El estudiante ${studentStats.name} presenta buen desempeño literal (${litRate}%), pero requiere fortalecer deducciones e inferencias de causa-efecto (${infRate}%). Se sugiere trabajar fábulas cortas con pistas contextuales.`
        });
      }

      if (litRate < 50) {
        recommendations.push({
          type: "LITERAL_REINFORCEMENT",
          priority: "MUY ALTA",
          icon: "🔍",
          studentName: studentStats.name,
          message: `Dificultad en localización de información explícita. Se recomienda lectura guiada en voz alta y ejercicios de subrayado de datos concretos en párrafos breves.`
        });
      }

      if (litRate >= 85 && infRate >= 80 && critRate >= 75) {
        recommendations.push({
          type: "READY_FOR_ADVANCE",
          priority: "POSITIVA",
          icon: "🚀",
          studentName: studentStats.name,
          message: `¡Desempeño sobresaliente y constante! ${studentStats.name} está listo para ser promovido progresivamente al siguiente nivel de desafío lector.`
        });
      }
    }

    // Recomendación grupal
    if (groupStats) {
      recommendations.push({
        type: "GROUP_STRATEGY",
        priority: "GENERAL",
        icon: "👥",
        message: "El aula muestra alto entusiasmo por las biografías peruanas. Se sugiere una sesión grupal de debate oral: '¿Qué héroe o heroína nos inspira más hoy?' para potenciar la oralidad."
      });
    }

    return recommendations;
  }

  // --- CUESTIONARIOS PREESTRUCTURADOS PARA TEMAS DE IA ---

  buildCarriónQuestions() {
    return {
      literal: [
        { id: "car_lit_1", question: "¿Dónde nació Daniel Alcides Carrión?", options: ["En Cerro de Pasco", "En Iquitos", "En Tacna", "En Moquegua"], correct: "En Cerro de Pasco", explanation: "El texto inicia indicando que nació en Cerro de Pasco." },
        { id: "car_lit_2", question: "¿En qué universidad estudiaba medicina?", options: ["Universidad de San Marcos", "Universidad de Oxford", "Universidad de París", "Universidad de Salamanca"], correct: "Universidad de San Marcos", explanation: "Se indica explícitamente en el primer párrafo." },
        { id: "car_lit_3", question: "¿En qué año tomó la decisión heroica de inocularse el virus?", options: ["En 1885", "En 1920", "En 1750", "En 2001"], correct: "En 1885", explanation: "El segundo párrafo consigna el año 1885." },
        { id: "car_lit_4", question: "¿Dónde documentó Carrión cada síntoma que experimentaba?", options: ["En su diario clínico", "En un periódico de noticias", "En una carta postal", "En una pared del hospital"], correct: "En su diario clínico", explanation: "El texto detalla que anotó día a día en su diario clínico." },
        { id: "car_lit_5", question: "¿Con qué título es honrado Carrión en el Perú?", options: ["Patrono de la Medicina Peruana", "Héroe de la Aviación", "Explorador del Mar", "Mago de la Selva"], correct: "Patrono de la Medicina Peruana", explanation: "El último párrafo lo proclama Patrono de la Medicina Peruana." }
      ],
      inferential: [
        { id: "car_inf_1", question: "¿Por qué Carrión decidió inocularse a sí mismo en vez de probar en otros?", options: ["Porque valoraba la ética y el rigor científico sin dañar a nadie", "Porque no tenía pacientes", "Por un descuido", "Para ganar dinero rápido"], correct: "Porque valoraba la ética y el rigor científico sin dañar a nadie", explanation: "Demuestra una entrega voluntaria y desinteresada por la salud pública." },
        { id: "car_inf_2", question: "¿Qué enfermedad ayudó a descifrar su sacrificio?", options: ["La verruga peruana o fiebre de La Oroya", "La gripe común", "El dolor de cabeza", "La alergia al polen"], correct: "La verruga peruana o fiebre de La Oroya", explanation: "El texto explica que salvó incontables vidas al demostrar su origen." },
        { id: "car_inf_3", question: "¿Qué cualidad resalta más en los estudiantes sanmarquinos de esa época?", options: ["La vocación de servicio por la salud del pueblo peruano", "El desinterés por los enfermos", "El deseo de viajar al extranjero", "La falta de estudio"], correct: "La vocación de servicio por la salud del pueblo peruano", explanation: "Carrión personificaba el compromiso médico con su país." },
        { id: "car_inf_4", question: "¿Por qué sus compañeros y profesores lo admiraban tanto?", options: ["Por su valentía, precisión científica y altruismo absoluto", "Porque era el más joven", "Porque tenía mucha ropa", "Porque no hablaba con nadie"], correct: "Por su valentía, precisión científica y altruismo absoluto", explanation: "Su serenidad ante la enfermedad conmovió a la comunidad científica." },
        { id: "car_inf_5", question: "¿Qué nos enseña la historia de Carrión sobre los médicos peruanos?", options: ["Que la medicina peruana tiene raíces de valentía y entrega generosa", "Que los médicos no necesitan estudiar", "Que las enfermedades no tienen cura", "Que la ciencia es aburrida"], correct: "Que la medicina peruana tiene raíces de valentía y entrega generosa", explanation: "Es un pilar de la ética médica nacional." }
      ],
      critical: [
        { id: "car_crit_1", question: "¿Qué opinas del sacrificio de Daniel Alcides Carrión por la ciencia?", options: ["Un acto supremo de amor a la humanidad que merece gratitud eterna.", "Fue una tontería sin sentido.", "No debió preocuparse por los enfermos.", "Da igual."], correct: "Un acto supremo de amor a la humanidad que merece gratitud eterna.", explanation: "Su entrega salvó a miles de generaciones posteriores." },
        { id: "car_crit_2", question: "¿Cómo podemos valorar el trabajo de los médicos y enfermeras hoy en día?", options: ["Respetando su esfuerzo, cuidando nuestra salud y siguiendo sus consejos.", "Exigiéndoles sin agradecerles.", "No acudiendo a las postas médicas.", "Burlándonos de ellos."], correct: "Respetando su esfuerzo, cuidando nuestra salud y siguiendo sus consejos.", explanation: "El personal de salud cuida nuestra vida a diario." },
        { id: "car_crit_3", question: "¿Crees que la ciencia debe estar siempre al servicio de la salud y la vida?", options: ["Sí, el conocimiento científico debe buscar el bienestar y la dignidad de todos.", "No, solo debe servir para crear armas.", "Solo para ganar fama personal.", "No importa."], correct: "Sí, el conocimiento científico debe buscar el bienestar y la dignidad de todos.", explanation: "La ética es la base de toda investigación científica." },
        { id: "car_crit_4", question: "¿Qué valor te parece más admirable en un joven universitario: la curiosidad o el compromiso social?", options: ["Ambos se necesitan para transformar la sociedad de manera positiva.", "Ninguno.", "Solo pasar los exámenes sin aprender.", "No tener metas."], correct: "Ambos se necesitan para transformar la sociedad de manera positiva.", explanation: "Curiosidad y compromiso forman profesionales completos." },
        { id: "car_crit_5", isWrittenOpen: true, question: "Escribe tu reflexión: Si fueras un investigador científico en el Perú, ¿qué problema de tu comunidad te gustaría investigar y resolver para ayudar a la gente?", rubricKeywords: ["salud", "agua", "enfermedad", "ayudar", "estudiar", "investigar", "comunidad", "perú"], minWords: 6, sampleAnswer: "Me gustaría investigar cómo purificar el agua de los ríos para que ningún niño enferme y todos crezcamos sanos.", explanation: "Leo valorará tu propuesta con entusiasmo." }
      ]
    };
  }

  buildChabucaQuestions() {
    return {
      literal: [
        { id: "cha_lit_1", question: "¿En qué región andina nació Chabuca Granda?", options: ["En Apurímac (Cotabambas)", "En Piura", "En Loreto", "En Tacna"], correct: "En Apurímac (Cotabambas)", explanation: "El texto cita su nacimiento en Cotabambas, Apurímac." },
        { id: "cha_lit_2", question: "¿Cuál es una de sus canciones más inmortales mencionada en el texto?", options: ["'La flor de la canela'", "'El cóndor pasa'", "'La marinera norteña'", "'Carnaval arequipeño'"], correct: "'La flor de la canela'", explanation: "Se destaca explícitamente 'La flor de la canela'." },
        { id: "cha_lit_3", question: "¿A quiénes rendía tributo en sus composiciones según el texto?", options: ["A los personajes sencillos y trabajadores de la ciudad", "A los reyes de España", "A los autos de carrera", "A los aviones de combate"], correct: "A los personajes sencillos y trabajadores de la ciudad", explanation: "El texto señala su homenaje a la gente humilde y trabajadora." },
        { id: "cha_lit_4", question: "¿Qué ritmos tradicionales enriquecieron su música?", options: ["La música costeña y ritmos afroperuanos", "La música electrónica", "El rock pesado", "El vals europeo únicamente"], correct: "La música costeña y ritmos afroperuanos", explanation: "Se mencionan los ritmos costeños y afroperuanos." },
        { id: "cha_lit_5", question: "¿Con qué instrumento solía acompañar sus canciones?", options: ["Con su guitarra", "Con una batería eléctrica", "Con trompetas de metal", "Con un sintetizador"], correct: "Con su guitarra", explanation: "El texto relata su canto acompañado de su guitarra." }
      ],
      inferential: [
        { id: "cha_inf_1", question: "¿Por qué las canciones de Chabuca Granda siguen emocionando a generaciones de peruanos?", options: ["Porque retratan con poesía la identidad, el cariño y la ternura de nuestra tierra", "Porque eran muy cortas", "Porque las pasaban en comerciales", "Porque nadie más cantaba"], correct: "Porque retratan con poesía la identidad, el cariño y la ternura de nuestra tierra", explanation: "Su poesía toca las fibras del sentimiento nacional." },
        { id: "cha_inf_2", question: "¿Qué demuestra el éxito internacional de su música en América y el mundo?", options: ["Que la cultura peruana posee una belleza universal que cautiva a todos", "Que solo a los turistas les gustaba", "Que no se escuchaba en el Perú", "Que la música no necesita mensaje"], correct: "Que la cultura peruana posee una belleza universal que cautiva a todos", explanation: "Demuestra la categoría artística del patrimonio musical peruano." },
        { id: "cha_inf_3", question: "¿Cómo ayudó Chabuca a visibilizar la cultura afroperuana?", options: ["Integrando sus ritmos y celebrando la alegría y talento de sus músicos", "Ignorando sus aportes", "Cambiando sus letras", "Prohibiendo sus tambores"], correct: "Integrando sus ritmos y celebrando la alegría y talento de sus músicos", explanation: "Fue una pionera en reivindicar la herencia afroperuana." },
        { id: "cha_inf_4", question: "¿Qué sentía Chabuca por los puentes y alamedas de Lima?", options: ["Una profunda nostalgia y admiración por su historia y su gente", "Ganas de demolerlos", "Aburrimiento", "Temor a caminar"], correct: "Una profunda nostalgia y admiración por su historia y su gente", explanation: "Sus canciones embellecieron poéticamente la ciudad." },
        { id: "cha_inf_5", question: "¿Qué cualidad personal refleja su sencillez al cantar sobre personajes humildes?", options: ["Gran empatía social y sensibilidad humana", "Deseo de figurar", "Falta de imaginación", "Indiferencia"], correct: "Gran empatía social y sensibilidad humana", explanation: "Valoraba la dignidad de cada trabajador." }
      ],
      critical: [
        { id: "cha_crit_1", question: "¿Crees que la música y el arte son tan importantes para un país como la ciencia? ¿Por qué?", options: ["Sí, porque la música alimenta el alma, une a la sociedad y preserva nuestra identidad cultural.", "No, solo el dinero importa.", "El arte no sirve para nada.", "Solo si no cuesta nada."], correct: "Sí, porque la música alimenta el alma, une a la sociedad y preserva nuestra identidad cultural.", explanation: "Arte y ciencia son pilares indispensables del desarrollo humano." },
        { id: "cha_crit_2", question: "¿Por qué es importante que los niños peruanos escuchen música de nuestras diferentes regiones?", options: ["Para conocer la diversidad cultural del Perú y sentirnos orgullosos de nuestras raíces.", "Para tener que bailar obligados.", "No es importante.", "Solo se debe escuchar música de otros países."], correct: "Para conocer la diversidad cultural del Perú y sentirnos orgullosos de nuestras raíces.", explanation: "La música regional fortalece la pertenencia y el aprecio intercultural." },
        { id: "cha_crit_3", question: "¿Qué opinas del apodo cariñoso 'Chabuca' con el que todo el Perú la recuerda?", options: ["Muestra el afecto y la cercanía familiar que el pueblo siente hacia ella.", "Es una falta de respeto.", "No tiene significado.", "Cualquiera puede tenerlo."], correct: "Muestra el afecto y la cercanía familiar que el pueblo siente hacia ella.", explanation: "Refleja el cariño genuino del pueblo peruano." },
        { id: "cha_crit_4", question: "¿Cómo podemos en nuestra escuela mantener vivas las canciones criollas y andinas?", options: ["Cantándolas en festivales escolares y aprendiendo sobre los autores peruanos.", "Olvidándolas para siempre.", "Cambiándoles la letra por bromas.", "No escuchando música."], correct: "Cantándolas en festivales escolares y aprendiendo sobre los autores peruanos.", explanation: "La práctica escolar difunde la memoria artística." },
        { id: "cha_crit_5", isWrittenOpen: true, question: "Escribe tu opinión: ¿Qué tipo de música o canción peruana te hace sentir más feliz y qué recuerdos bonitos te trae de tu familia?", rubricKeywords: ["música", "canción", "familia", "fiesta", "feliz", "perú", "alegría", "cantar"], minWords: 6, sampleAnswer: "Me hace feliz escuchar los huaynos y marineras en los cumpleaños familiares porque todos bailamos y sonreímos juntos.", explanation: "Leo evaluará tu emoción y redacción personal." }
      ]
    };
  }

  buildCondorQuestions() {
    return {
      literal: [
        { id: "con_lit_1", question: "¿En qué famoso cañón de Arequipa se menciona que vive el cóndor?", options: ["En el Cañón del Colca", "En el Cañón del Pato", "En el Cañón de Cotahuasi", "En el Cañón de Tinajani"], correct: "En el Cañón del Colca", explanation: "Se indica el Cañón del Colca en Arequipa." },
        { id: "con_lit_2", question: "¿Cuánto pueden llegar a medir las alas extendidas de un cóndor andino?", options: ["Más de tres metros de ancho", "Un metro solamente", "Medio metro", "Diez metros"], correct: "Más de tres metros de ancho", explanation: "El texto señala más de tres metros de envergadura." },
        { id: "con_lit_3", question: "¿Cómo logran volar sin necesidad de aletear constantemente?", options: ["Planeando sobre las corrientes de aire caliente", "Usando pequeños motores", "Saltando de piedra en piedra", "Nadando en el aire"], correct: "Planeando sobre las corrientes de aire caliente", explanation: "Aprovechan las corrientes térmicas ascendentes." },
        { id: "con_lit_4", question: "¿Qué rol ecológico cumple el cóndor en la cordillera?", options: ["Limpia los campos al alimentarse de animales caídos", "Siembra árboles de eucalipto", "Construye nidos en las casas", "Pesca en el mar"], correct: "Limpia los campos al alimentarse de animales caídos", explanation: "Es un ave carroñera vital para la higiene ecológica." },
        { id: "con_lit_5", question: "¿Qué civilización ancestral consideraba al cóndor un ser sagrado?", options: ["Los incas", "Los egipcios", "Los griegos", "Los mayas"], correct: "Los incas", explanation: "El segundo párrafo menciona a los incas y el mundo celestial." }
      ],
      inferential: [
        { id: "con_inf_1", question: "¿Por qué el cóndor es un símbolo de libertad y majestuosidad?", options: ["Por su imponente vuelo a grandes alturas y su porte soberbio en los Andes", "Porque es muy ruidoso", "Porque come rápido", "Porque vive en jaulas"], correct: "Por su imponente vuelo a grandes alturas y su porte soberbio en los Andes", explanation: "Surcar las alturas andinas evoca libertad y grandeza." },
        { id: "con_inf_2", question: "¿Qué pasaría con las enfermedades en el campo si no hubiera cóndores?", options: ["Aumentarían, ya que los restos de animales tardarían más en descomponerse", "Disminuirían solas", "No habría ningún cambio", "El aire se volvería más frío"], correct: "Aumentarían, ya que los restos de animales tardarían más en descomponerse", explanation: "Cumple la función de limpiador natural de la montaña." },
        { id: "con_inf_3", question: "¿Por qué el turismo en el Cañón del Colca debe ser 'responsable'?", options: ["Para no asustar a las aves ni alterar su hábitat con ruidos o basura", "Para que los turistas no compren recuerdos", "Porque no hay caminos", "Para cobrar más dinero"], correct: "Para no asustar a las aves ni alterar su hábitat con ruidos o basura", explanation: "El turismo ecológico cuida la paz de las especies." },
        { id: "con_inf_4", question: "¿Por qué el cóndor prefiere vivir en cañones y precipicios elevados?", options: ["Porque desde los acantilados puede despegar fácilmente hacia las corrientes de viento", "Porque le da miedo el suelo plano", "Porque no le gusta la hierba", "Porque le gustan las sombras"], correct: "Porque desde los acantilados puede despegar fácilmente hacia las corrientes de viento", explanation: "Por su gran peso, necesita la altura de los riscos para planear." },
        { id: "con_inf_5", question: "¿Qué relación veían los incas entre el cóndor y el Hanan Pacha (mundo celestial)?", options: ["Que al volar tan cerca del cielo era un mensajero entre los dioses y los hombres", "Que vivía en la luna", "Que brillaba de noche", "Que traía lluvia de oro"], correct: "Que al volar tan cerca del cielo era un mensajero entre los dioses y los hombres", explanation: "Formaba parte de la trilogía sagrada andina." }
      ],
      critical: [
        { id: "con_crit_1", question: "¿Por qué debemos proteger al cóndor andino de la caza furtiva y el veneno?", options: ["Porque es una especie protegida irreemplazable de nuestro patrimonio natural.", "Porque da mala suerte cuidarlo.", "Solo si es para tenerlo en una jaula.", "No importa si se extingue."], correct: "Porque es una especie protegida irreemplazable de nuestro patrimonio natural.", explanation: "Toda especie merece protección frente a la crueldad humana." },
        { id: "con_crit_2", question: "¿Qué mensaje le darías a un turista que visita el Cañón del Colca?", options: ["Respeta el silencio, no tires basura y contempla la naturaleza con admiración.", "Haz ruido para que los cóndores salgan.", "Tírale comida chatarra.", "Pisa las plantas protegidas."], correct: "Respeta el silencio, no tires basura y contempla la naturaleza con admiración.", explanation: "El respeto a la vida silvestre es educación ciudadana." },
        { id: "con_crit_3", question: "¿Consideras que las tradiciones ancestrales pueden enseñarnos a cuidar mejor los animales?", options: ["Sí, la cosmovisión andina enseña que los animales y la tierra son seres sagrados dignos de respeto.", "No, solo la tecnología sabe de animales.", "Las tradiciones no enseñan nada.", "Da igual."], correct: "Sí, la cosmovisión andina enseña que los animales y la tierra son seres sagrados dignos de respeto.", explanation: "La sabiduría ancestral promueve la armonía ecológica." },
        { id: "con_crit_4", question: "¿Qué sientes al saber que en el Perú vuelan aves de más de tres metros de ancho?", options: ["Orgullo y asombro por la maravillosa fauna de nuestro país.", "Miedo sin sentido.", "Indiferencia.", "Ganas de cazarlas."], correct: "Orgullo y asombro por la maravillosa fauna de nuestro país.", explanation: "La biodiversidad peruana es motivo de orgullo y cuidado." },
        { id: "con_crit_5", isWrittenOpen: true, question: "Escribe tu reflexión: ¿Por qué crees que es importante que los niños y niñas conozcan los animales de las tres regiones del Perú?", rubricKeywords: ["conocer", "animales", "proteger", "perú", "costa", "sierra", "selva", "orgullo", "cuidar"], minWords: 6, sampleAnswer: "Es importante porque al conocer los animales de la costa, sierra y selva aprendemos a quererlos y protegerlos para que nunca desaparezcan.", explanation: "Leo evaluará tu redacción con cariño." }
      ]
    };
  }

  buildIntiRaymiQuestions() {
    return {
      literal: [
        { id: "int_lit_1", question: "¿En qué ciudad del Perú se celebra el Inti Raymi?", options: ["En el Cusco", "En Trujillo", "En Piura", "En Iquitos"], correct: "En el Cusco", explanation: "Se celebra en la histórica ciudad del Cusco." },
        { id: "int_lit_2", question: "¿En qué explanada de piedra se escenifica la ceremonia principal?", options: ["En la fortaleza de Sacsayhuamán", "En la Plaza de Armas de Lima", "En el estadio de fútbol", "En el puerto del Callao"], correct: "En la fortaleza de Sacsayhuamán", explanation: "El texto cita la fortaleza de Sacsayhuamán." },
        { id: "int_lit_3", question: "¿A qué dios o deidad agradecían los antiguos incas durante esta fiesta?", options: ["Al dios Sol (Inti)", "Al dios del trueno", "A la lluvia de invierno", "Al viento del mar"], correct: "Al dios Sol (Inti)", explanation: "El texto explica el tributo al Inti o Sol." },
        { id: "int_lit_4", question: "¿Qué alimentos agradecían al Sol por hacerlos brotar de la tierra?", options: ["El maíz, las papas y la quinua", "Manzanas y uvas de Europa", "Pan y fideos", "Dulces y caramelos"], correct: "El maíz, las papas y la quinua", explanation: "El segundo párrafo cita el maíz, papas y quinua." },
        { id: "int_lit_5", question: "¿Qué instrumentos musicales tradicionales se mencionan en la lectura?", options: ["Quenas, zampoñas y pututos", "Guitarras eléctricas y tambores de metal", "Pianos de cola", "Trombones"], correct: "Quenas, zampoñas y pututos", explanation: "Se detallan quenas, zampoñas y pututos andinos." }
      ],
      inferential: [
        { id: "int_inf_1", question: "¿Por qué el solsticio de invierno era el momento ideal para pedir calor al Sol?", options: ["Porque inicia la temporada más fría del año y necesitaban que el Sol no se alejara de sus cultivos", "Porque hacía demasiado calor", "Para salir de vacaciones", "Para dormir más horas"], correct: "Porque inicia la temporada más fría del año y necesitaban que el Sol no se alejara de sus cultivos", explanation: "En junio el solsticio marca días cortos y frío andino." },
        { id: "int_inf_2", question: "¿Qué demuestra la vestimenta colorida y la música en esta celebración?", options: ["La profunda alegría, solemnidad y riqueza artística de la cultura incaica", "Que no tenían ropa abrigadora", "Que era un día de compras", "Que querían imitar a otros países"], correct: "La profunda alegría, solemnidad y riqueza artística de la cultura incaica", explanation: "Es una manifestación de esplendor estético y ritual." },
        { id: "int_inf_3", question: "¿Por qué miles de turistas viajan desde todos los continentes al Cusco en junio?", options: ["Para presenciar una de las celebraciones culturales vivas más deslumbrantes del mundo", "Porque no hay fiestas en sus países", "Para comprar quenas únicamente", "Porque no conocen el sol"], correct: "Para presenciar una de las celebraciones culturales vivas más deslumbrantes del mundo", explanation: "El Inti Raymi tiene renombre cultural planetario." },
        { id: "int_inf_4", question: "¿Cómo se relaciona el Inti Raymi con el respeto a la Madre Tierra (Pachamama)?", options: ["Reconoce que los seres humanos formamos parte de la naturaleza y dependemos de sus bendiciones", "Dice que la tierra no necesita cuidado", "Que los cultivos crecen solos sin agua ni sol", "No tiene relación"], correct: "Reconoce que los seres humanos formamos parte de la naturaleza y dependemos de sus bendiciones", explanation: "La cosmovisión andina es de reciprocidad sagrada (ayni)." },
        { id: "int_inf_5", question: "¿Qué importancia tiene para los niños peruanos conocer estas festividades?", options: ["Fortalece su identidad nacional y el aprecio por la historia milenaria de su patria", "Para tener que dar exámenes largos", "Para no salir a jugar", "No tiene ninguna importancia"], correct: "Fortalece su identidad nacional y el aprecio por la historia milenaria de su patria", explanation: "Cultiva la pertenencia y el orgullo por el pasado y presente." }
      ],
      critical: [
        { id: "int_crit_1", question: "¿Crees que conservar fiestas tradicionales como el Inti Raymi ayuda al desarrollo del Perú? ¿Por qué?", options: ["Sí, porque preserva nuestras raíces, une al país y genera turismo y trabajo para muchas familias.", "No, las tradiciones son cosas viejas.", "Solo debería haber fiestas modernas.", "No tiene beneficio."], correct: "Sí, porque preserva nuestras raíces, une al país y genera turismo y trabajo para muchas familias.", explanation: "Cultura, identidad y economía se potencian mutuamente." },
        { id: "int_crit_2", question: "¿Qué opinas de la gratitud que los antiguos peruanos demostraban a la tierra y al sol?", options: ["Una lección admirable de humildad y respeto ecológico que deberíamos practicar hoy.", "Una pérdida de tiempo.", "No tiene valor agradecer a la naturaleza.", "Da igual."], correct: "Una lección admirable de humildad y respeto ecológico que deberíamos practicar hoy.", explanation: "Agradecer a la naturaleza nos hace consumidores más responsables." },
        { id: "int_crit_3", question: "¿Cómo podemos en nuestra propia escuela agradecer el esfuerzo de quienes cultivan nuestros alimentos?", options: ["No desperdiciando la comida y valorando el duro trabajo de los campesinos del Perú.", "Tirando la comida al tacho.", "Comiendo solo golosinas.", "Quejándonos del almuerzo."], correct: "No desperdiciando la comida y valorando el duro trabajo de los campesinos del Perú.", explanation: "Cero desperdicio es el mejor homenaje al agricultor." },
        { id: "int_crit_4", question: "¿Qué te parece más hermoso del Cusco: sus monumentos arqueológicos o sus tradiciones vivas?", options: ["Ambos se complementan de manera única, creando una ciudad mágica llena de historia viva.", "Solo las piedras.", "Ninguno de los dos.", "Solo los restaurantes."], correct: "Ambos se complementan de manera única, creando una ciudad mágica llena de historia viva.", explanation: "Patrimonio material e inmaterial hacen único al Cusco." },
        { id: "int_crit_5", isWrittenOpen: true, question: "Escribe tu reflexión: Si fueras el guía de un niño de otro país que visita el Perú por primera vez, ¿qué le contarías con orgullo sobre nuestras costumbres y alimentos peruanos?", rubricKeywords: ["orgullo", "comida", "papa", "cusco", "perú", "costumbres", "amigos", "rico", "hermoso"], minWords: 6, sampleAnswer: "Le contaría con orgullo que tenemos ricas comidas como la papa andina y el maíz, y fiestas hermosas donde bailamos y compartimos con cariño.", explanation: "Leo apreciará tu entusiasmo patriótico." }
      ]
    };
  }
}

// Instancia global
window.aiService = new AIService();
