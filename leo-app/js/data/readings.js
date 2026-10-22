/**
 * LEO – Lectura, Escritura y Oralidad
 * Biblioteca de Lecturas y Actividades
 * 
 * Contenidos auténticos, adaptados a la realidad educativa del Perú.
 * Cumple rigurosamente:
 * - Inicio: 4 etapas progresivas (Sílabas, Palabras sencillas, Frases cortas, Textos breves).
 * - Desarrollo: Cuentos, biografías, fábulas y biodiversidad peruana.
 * - Avanzado: Máximo 3 párrafos, vocabulario enriquecido, pensamiento crítico profundo.
 * - Cada lectura regular cuenta con 15 preguntas (5 literales + 5 inferenciales + 5 críticas).
 * - Cada pregunta incluye retroalimentación explicativa y pista para comodín.
 */

const READING_CATEGORIES = [
  { id: "cuentos", name: "Cuentos", icon: "📚", color: "#FF7043" },
  { id: "fabulas", name: "Fábulas", icon: "🦊", color: "#FFA726" },
  { id: "biografias", name: "Biografías", icon: "👤", color: "#42A5F5" },
  { id: "heroes", name: "Héroes del Perú", icon: "🇵🇪", color: "#EF5350" },
  { id: "personajes", name: "Personajes ilustres", icon: "🏛️", color: "#AB47BC" },
  { id: "cultura", name: "Cultura peruana", icon: "🌎", color: "#26A69A" },
  { id: "ciencia", name: "Ciencia", icon: "🔬", color: "#5C6BC0" },
  { id: "animales", name: "Animales del Perú", icon: "🐾", color: "#66BB6A" },
  { id: "naturaleza", name: "Naturaleza", icon: "🌱", color: "#8D6E63" },
  { id: "escuela", name: "Escuela", icon: "🏫", color: "#29B6F6" },
  { id: "familia", name: "Familia", icon: "👨‍👩‍👧", color: "#EC407A" },
  { id: "deportes", name: "Deportes", icon: "⚽", color: "#26C6DA" },
  { id: "historias_divertidas", name: "Historias divertidas", icon: "😂", color: "#FFA000" }
];

const INITIAL_READINGS = [
  // =========================================================================
  // 🟢 NIVEL INICIO: ETAPAS 1 A 4
  // =========================================================================
  {
    id: "ini_stage_1",
    level: "INICIO",
    stage: 1,
    stageTitle: "Etapa 1: Jugando con Sílabas",
    title: "El tren de las sílabas alegres",
    category: "historias_divertidas",
    genre: "Actividad fonológica",
    readTime: "3 min",
    status: "APROBADA",
    origin: "Leo Educativo",
    heroImage: "🚂",
    summary: "Reconoce y combina las primeras sílabas con sonidos y ritmo.",
    content: [
      "¡Chu, chu! El tren de las sílabas llega a la estación.",
      "Lleva cajas con sonidos alegres: MA, ME, MI, MO, MU.",
      "Luego se suman las sílabas de la fiesta: PA, PE, PI, PO, PU.",
      "Cuando juntamos MA y NO, formamos una mano que saluda."
    ],
    comodinHint: "Escucha el sonido con el botón de audio y mira con qué letra empieza.",
    isStageActivity: true,
    activities: [
      {
        id: "ini1_act1",
        type: "syllable_sound",
        question: "Escucha y toca la sílaba correcta: 'MA'",
        audioValue: "MA",
        options: ["MA", "SA", "LA", "TA"],
        correct: "MA",
        explanation: "¡Excelente! 'MA' empieza con la letra M y suena como mamá."
      },
      {
        id: "ini1_act2",
        type: "syllable_sound",
        question: "Toca la sílaba con la que empieza la palabra 'PAPA'",
        audioValue: "PA",
        options: ["PA", "PE", "PI", "PO"],
        correct: "PA",
        explanation: "¡Muy bien! 'PA' es la primera sílaba de papa, el rico tubérculo peruano."
      },
      {
        id: "ini1_act3",
        type: "syllable_match",
        question: "¿Qué sílaba falta para formar 'SO___' (SOPA)?",
        audioValue: "PA",
        options: ["PA", "MA", "LA", "NA"],
        correct: "PA",
        explanation: "¡Correcto! SO + PA forma la rica sopa caliente."
      },
      {
        id: "ini1_act4",
        type: "syllable_repeat",
        question: "Repite con Leo el sonido: 'LU'. ¿Dónde está escrita?",
        audioValue: "LU",
        options: ["LU", "LI", "LE", "LO"],
        correct: "LU",
        explanation: "¡Genial! 'LU' como en 'luna' o 'lupa'."
      }
    ]
  },
  {
    id: "ini_stage_2",
    level: "INICIO",
    stage: 2,
    stageTitle: "Etapa 2: Mis Primeras Palabras",
    title: "Palabras mágicas del Perú",
    category: "cultura",
    genre: "Vocabulario inicial",
    readTime: "4 min",
    status: "APROBADA",
    origin: "Leo Educativo",
    heroImage: "✨",
    summary: "Aprende palabras sencillas, monosílabas y de la vida diaria.",
    content: [
      "En el Perú tenemos palabras brillantes como el SOL.",
      "En la mesa compartimos un rico PAN calientito.",
      "Por la noche nos alumbra la LUNA redonda.",
      "Y en la costa nadan peces en nuestro gran MAR."
    ],
    comodinHint: "Fíjate en las letras grandes y de color en el texto.",
    isStageActivity: true,
    activities: [
      {
        id: "ini2_act1",
        type: "word_recognition",
        question: "¿Cuál de estas palabras nombra a lo que brilla de día en el cielo?",
        options: ["SOL", "SAL", "SUR", "SED"],
        correct: "SOL",
        explanation: "¡Exacto! El SOL nos da luz y calor cada mañana."
      },
      {
        id: "ini2_act2",
        type: "word_build",
        question: "Junta las sílabas para formar el nombre del animal andino: LU + MA o PU + MA",
        options: ["PUMA", "PALA", "PATO", "POZO"],
        correct: "PUMA",
        explanation: "¡Bravo! El PUMA es un gran felino que vive en los Andes peruanos."
      },
      {
        id: "ini2_act3",
        type: "word_fill",
        question: "En la mesa comemos un rico _____ con mantequilla.",
        options: ["PAN", "PEZ", "PIE", "PIN"],
        correct: "PAN",
        explanation: "¡Muy bien! El PAN es un alimento que muchos niños desayunan."
      }
    ]
  },
  {
    id: "ini_stage_3",
    level: "INICIO",
    stage: 3,
    stageTitle: "Etapa 3: Frases Cortas",
    title: "La vicuña en la montaña",
    category: "animales",
    genre: "Lectura de frases",
    readTime: "4 min",
    status: "APROBADA",
    origin: "Leo Educativo",
    heroImage: "🦙",
    summary: "Lee oraciones breves y descubre cómo se relacionan las palabras.",
    content: [
      "La vicuña camina por la montaña alta.",
      "Su lana es suave y dorada como el trigo.",
      "Bebe agua fresca de la laguna cristalina.",
      "El cóndor la saluda desde el cielo azul."
    ],
    comodinHint: "Lee despacio palabra por palabra. Cada punto (.) marca una idea completa.",
    isStageActivity: true,
    activities: [
      {
        id: "ini3_act1",
        type: "sentence_order",
        question: "¿Dónde camina la vicuña según la primera frase?",
        options: [
          "Por la montaña alta",
          "Por la playa de arena",
          "Por el patio de la casa",
          "Por un túnel oscuro"
        ],
        correct: "Por la montaña alta",
        explanation: "¡Excelente! La primera frase dice claramente: 'La vicuña camina por la montaña alta'."
      },
      {
        id: "ini3_act2",
        type: "sentence_detail",
        question: "¿Cómo es la lana de la vicuña?",
        options: [
          "Suave y dorada",
          "Dura y fría",
          "Verde y corta",
          "Azul y mojada"
        ],
        correct: "Suave y dorada",
        explanation: "¡Gran lectura! La segunda frase describe que su lana es suave y dorada."
      }
    ]
  },
  {
    id: "ini_stage_4",
    level: "INICIO",
    stage: 4,
    stageTitle: "Etapa 4: Textos Muy Breves",
    title: "El perrito de Chorrillos",
    category: "historias_divertidas",
    genre: "Micro-relato",
    readTime: "5 min",
    status: "APROBADA",
    origin: "Leo Educativo",
    heroImage: "🐶",
    summary: "Un texto breve y claro de dos oraciones para dar el salto a historias completas.",
    content: [
      "Peluchín es un perrito peruano sin pelo que vive cerca del mar de Chorrillos.",
      "Todas las mañanas corre tras las olas y saluda a los pescadores moviendo su colita.",
      "Al regresar a casa, duerme plácidamente sobre una manta calientita."
    ],
    comodinHint: "Busca en la primera oración el nombre del perrito y el lugar donde vive.",
    isStageActivity: true,
    activities: [
      {
        id: "ini4_act1",
        type: "literal",
        question: "¿Cómo se llama el perrito de la historia?",
        options: ["Peluchín", "Manchitas", "Boby", "Cholo"],
        correct: "Peluchín",
        explanation: "¡Así es! En la primera línea aprendemos que su nombre es Peluchín."
      },
      {
        id: "ini4_act2",
        type: "literal",
        question: "¿A quiénes saluda Peluchín moviendo su colita?",
        options: ["A los pescadores", "A los autos", "A las gaviotas", "A los gatos"],
        correct: "A los pescadores",
        explanation: "¡Perfecto! En la segunda oración dice que saluda a los pescadores."
      },
      {
        id: "ini4_act3",
        type: "critical_opinion",
        question: "¿Crees que los perritos se sienten felices cuando los cuidamos con cariño? ¿Por qué?",
        options: [
          "Sí, porque cuando reciben amor, comida y abrigo están alegres y seguros.",
          "No, a los perritos no les importa cómo los traten.",
          "Solamente si les compramos juguetes caros.",
          "No sé qué responder."
        ],
        correct: "Sí, porque cuando reciben amor, comida y abrigo están alegres y seguros.",
        explanation: "¡Hermosa reflexión! El cariño y el respeto a los animales los hace muy felices."
      }
    ]
  },

  // =========================================================================
  // 🟡 NIVEL DESARROLLO (Biografías, Fábulas, Cultura e Historia del Perú)
  // =========================================================================
  {
    id: "des_grau",
    level: "DESARROLLO",
    title: "Miguel Grau: El Caballero de los Mares",
    category: "heroes",
    genre: "Biografía narrativa",
    readTime: "6 min",
    status: "APROBADA",
    origin: "Historia Peruana Verificada",
    heroImage: "⚓",
    summary: "Conoce al almirante peruano que enseñó al mundo el valor del respeto, el honor y la solidaridad.",
    paragraphs: [
      "Miguel Grau Seminario nació en la calurosa ciudad de Piura. Desde niño sintió un inmenso amor por el mar peruano y soñaba con navegarlo. Con dedicación y estudio se convirtió en marino de la Armada del Perú y comandó con gran valentía el célebre buque Huáscar.",
      "Durante la guerra en el mar, el almirante Grau demostró una enorme nobleza que asombró a todos. Cuando el barco chileno Esmeralda se hundió en el combate de Iquique, Grau no continuó atacando; en lugar de eso, ordenó a sus hombres arrojar cuerdas para salvar la vida de los marineros que naufragaban en las aguas frías.",
      "Además, Grau escribió una carta llena de respeto y consuelo a la viuda del comandante chileno, devolviéndole los objetos personales de su esposo. Por estos actos de humanidad y honradez, tanto el Perú como el mundo lo recuerdan con admiración como 'El Caballero de los Mares'."
    ],
    comodinHint: "Revisa el segundo párrafo para recordar por qué llamaban a Miguel Grau 'El Caballero de los Mares'.",
    questions: {
      literal: [
        {
          id: "grau_lit_1",
          question: "¿En qué ciudad del norte del Perú nació Miguel Grau?",
          options: ["En Piura", "En Trujillo", "En Arequipa", "En Lima"],
          correct: "En Piura",
          explanation: "¡Correcto! El texto menciona al inicio que Miguel Grau nació en la calurosa ciudad de Piura."
        },
        {
          id: "grau_lit_2",
          question: "¿Cómo se llamaba el célebre buque que comandó Miguel Grau?",
          options: ["El Huáscar", "La Unión", "El Rímac", "La Covadonga"],
          correct: "El Huáscar",
          explanation: "¡Muy bien! En el primer párrafo se indica que comandó con valentía el buque Huáscar."
        },
        {
          id: "grau_lit_3",
          question: "¿Qué ordenó Grau a sus hombres cuando se hundió el barco Esmeralda?",
          options: [
            "Arrojar cuerdas para salvar la vida de los náufragos",
            "Navegar rápidamente hacia el norte sin mirar atrás",
            "Disparar más cañones",
            "Guardar silencio y esconderse"
          ],
          correct: "Arrojar cuerdas para salvar la vida de los náufragos",
          explanation: "¡Exacto! El segundo párrafo relata que ordenó arrojar cuerdas para salvar a los náufragos."
        },
        {
          id: "grau_lit_4",
          question: "¿Qué hizo Grau con los objetos personales del comandante rival?",
          options: [
            "Se los devolvió a su viuda junto con una carta de respeto",
            "Los guardó en un museo militar",
            "Los regaló a sus tripulantes",
            "Los arrojó al fondo del mar"
          ],
          correct: "Se los devolvió a su viuda junto con una carta de respeto",
          explanation: "¡Acertaste! En el tercer párrafo se explica que le escribió una carta y le devolvió sus pertenencias."
        },
        {
          id: "grau_lit_5",
          question: "¿Con qué título honorífico es recordado Miguel Grau en el Perú y el mundo?",
          options: [
            "El Caballero de los Mares",
            "El Héroe de la Selva",
            "El Pescador Valiente",
            "El Navegante Solitario"
          ],
          correct: "El Caballero de los Mares",
          explanation: "¡Perfecto! Al final del texto se señala que se le recuerda como 'El Caballero de los Mares'."
        }
      ],
      inferential: [
        {
          id: "grau_inf_1",
          question: "¿Por qué Miguel Grau salvó a los marineros enemigos en lugar de dejarlos en el mar?",
          options: [
            "Porque valoraba la vida humana y sentía compasión por quienes estaban en peligro",
            "Porque necesitaba marineros para limpiar su propio barco",
            "Porque alguien se lo exigió por teléfono",
            "Porque pensó que eran turistas"
          ],
          correct: "Porque valoraba la vida humana y sentía compasión por quienes estaban en peligro",
          explanation: "¡Gran deducción! Su nobleza demostraba que para él la vida humana estaba por encima del rencor."
        },
        {
          id: "grau_inf_2",
          question: "¿Qué cualidad personal destaca más en la carta que Grau envió a la viuda?",
          options: [
            "La empatía y la delicadeza para comprender el dolor ajeno",
            "La prisa por terminar pronto sus cartas",
            "El deseo de presumir de su victoria",
            "El enojo con los demás"
          ],
          correct: "La empatía y la delicadeza para comprender el dolor ajeno",
          explanation: "¡Bien pensado! Devolver recuerdos a una persona en duelo demuestra una profunda empatía."
        },
        {
          id: "grau_inf_3",
          question: "¿Qué sentimiento tenía Grau hacia su país, el Perú?",
          options: [
            "Un profundo amor patriótico y deseo de servir con honestidad",
            "Indiferencia, solo le importaba ganar dinero",
            "Miedo a navegar",
            "Deseo de abandonar sus deberes"
          ],
          correct: "Un profundo amor patriótico y deseo de servir con honestidad",
          explanation: "¡Excelente inferencia! Su dedicación y valor muestran un amor inquebrantable a su patria."
        },
        {
          id: "grau_inf_4",
          question: "¿Por qué las personas de otros países también respetaron y admiraron a Miguel Grau?",
          options: [
            "Porque sus acciones demostraron principios morales que cualquier persona honorable valora",
            "Porque construyó muchos barcos comerciales",
            "Porque viajaba a menudo de vacaciones",
            "Porque les envió cartas a todos los gobernantes"
          ],
          correct: "Porque sus acciones demostraron principios morales que cualquier persona honorable valora",
          explanation: "¡Muy acertado! Los valores de honor y compasión son respetados universalmente."
        },
        {
          id: "grau_inf_5",
          question: "¿Qué podemos deducir sobre la infancia de Grau y su vocación marina?",
          options: [
            "Que su cercanía al mar desde pequeño influyó en su sueño de convertirse en un gran marino",
            "Que a Grau no le gustaba salir de casa",
            "Que sus padres lo obligaron a nadar",
            "Que no sabía qué profesión elegir"
          ],
          correct: "Que su cercanía al mar desde pequeño influyó en su sueño de convertirse en un gran marino",
          explanation: "¡Exacto! El texto nos dice que desde niño soñaba con navegar el mar peruano."
        }
      ],
      critical: [
        {
          id: "grau_crit_1",
          question: "¿Crees que Miguel Grau tomó una buena decisión al rescatar a los náufragos? ¿Por qué?",
          options: [
            "Sí, porque respetar la vida y socorrer al necesitado es el verdadero signo de un héroe con valores.",
            "No, en una batalla nunca se debe ayudar a nadie.",
            "Solo debió ayudar a sus propios amigos.",
            "No tiene importancia lo que hiciera."
          ],
          correct: "Sí, porque respetar la vida y socorrer al necesitado es el verdadero signo de un héroe con valores.",
          explanation: "¡Muy valiosa tu opinión! Un verdadero héroe demuestra humanidad en todo momento."
        },
        {
          id: "grau_crit_2",
          question: "¿Cómo podemos aplicar el ejemplo de nobleza de Miguel Grau en nuestra escuela hoy en día?",
          options: [
            "Ayudando a un compañero si tropieza o tiene dificultades, sin burlarnos ni dejarlo solo.",
            "Haciendo competencias para ver quién es más fuerte.",
            "Ignorando a quienes no piensen como nosotros.",
            "Quedándonos callados cuando alguien necesita apoyo."
          ],
          correct: "Ayudando a un compañero si tropieza o tiene dificultades, sin burlarnos ni dejarlo solo.",
          explanation: "¡Excelente aplicación! La solidaridad diaria en el aula honra los grandes valores."
        },
        {
          id: "grau_crit_3",
          question: "¿Qué valor te parece más importante en un líder: la fuerza o la honradez y compasión?",
          options: [
            "La honradez y la compasión, porque orientan las acciones hacia el bien de todas las personas.",
            "La fuerza, porque asusta a los demás.",
            "Ninguna de las anteriores.",
            "Solamente mandar sin escuchar."
          ],
          correct: "La honradez y la compasión, porque orientan las acciones hacia el bien de todas las personas.",
          explanation: "¡Gran juicio crítico! La fuerza sin valores no construye una sociedad justa."
        },
        {
          id: "grau_crit_4",
          question: "¿Por qué crees que es importante recordar a personajes históricos con hechos reales y verdaderos?",
          options: [
            "Porque la verdad nos enseña lecciones reales sobre el esfuerzo humano y la justicia.",
            "Porque es divertido inventar nombres.",
            "No es importante recordar la historia.",
            "Para tener que memorizar fechas largas."
          ],
          correct: "Porque la verdad nos enseña lecciones reales sobre el esfuerzo humano y la justicia.",
          explanation: "¡Exacto! La historia real nos brinda modelos auténticos a seguir."
        },
        {
          id: "grau_crit_5",
          isWrittenOpen: true,
          question: "Escribe tu opinión personal: ¿Qué es lo que más admiras de Miguel Grau y cómo puedes ser un héroe o heroína en tu propia casa y colegio?",
          rubricKeywords: ["respeto", "ayudar", "nobleza", "amabilidad", "estudiar", "familia", "compañeros", "valores"],
          minWords: 6,
          sampleAnswer: "Admiro su generosidad para ayudar a quienes sufrían. En mi colegio puedo ser un héroe ayudando a mis amigos cuando no entienden una tarea y cuidando a mi familia.",
          explanation: "Leo evaluará tu respuesta escrita según tu reflexión, sinceridad y relación con la historia."
        }
      ]
    }
  },
  {
    id: "des_micaela",
    level: "DESARROLLO",
    title: "Micaela Bastidas: El Coraje de una Heroína",
    category: "heroes",
    genre: "Biografía narrativa",
    readTime: "6 min",
    status: "APROBADA",
    origin: "Historia Peruana Verificada",
    heroImage: "🌟",
    summary: "La historia real de la valiente estratega andina que luchó por la justicia y los derechos de su pueblo.",
    paragraphs: [
      "Micaela Bastidas Puyucahua nació en Tamburco, en la hermosa región andina de Apurímac. Desde joven destacó por su inteligencia, firmeza de carácter y gran sensibilidad ante las injusticias y abusos que sufrían las comunidades indígenas.",
      "Junto a su esposo José Gabriel Condorcanqui, conocido como Túpac Amaru II, organizó una de las rebeliones más importantes por la libertad de América. Micaela no se quedó esperando: fue una brillante estratega militar, administró provisiones, escribió cartas decisivas y coordinó tropas con determinación.",
      "Su célebre frase: 'Por la libertad de mi pueblo no he de ver florecer la flor de mi juventud' resume su inquebrantable entrega. Su recuerdo vive en el corazón de todos los peruanos como ejemplo de dignidad, valentía y liderazgo femenino."
    ],
    comodinHint: "Observa en el segundo párrafo las acciones que realizaba Micaela para organizar y liderar a su pueblo.",
    questions: {
      literal: [
        {
          id: "mic_lit_1",
          question: "¿En qué lugar de la región de Apurímac nació Micaela Bastidas?",
          options: ["En Tamburco", "En Abancay", "En Andahuaylas", "En Cusco"],
          correct: "En Tamburco",
          explanation: "¡Correcto! En el primer párrafo se señala que nació en Tamburco, Apurímac."
        },
        {
          id: "mic_lit_2",
          question: "¿Quién era su esposo y compañero en la rebelión por la libertad?",
          options: [
            "José Gabriel Condorcanqui (Túpac Amaru II)",
            "José Olaya Balandra",
            "Francisco Bolognesi",
            "Ramón Castilla"
          ],
          correct: "José Gabriel Condorcanqui (Túpac Amaru II)",
          explanation: "¡Muy bien! El segundo párrafo menciona a su esposo José Gabriel Condorcanqui."
        },
        {
          id: "mic_lit_3",
          question: "¿Qué tareas clave desempeñó Micaela durante la rebelión?",
          options: [
            "Fue estratega militar, administró provisiones y coordinó tropas",
            "Solo se dedicó a observar desde lejos",
            "Hizo viajes de vacaciones",
            "Se quedó descansando en el campo"
          ],
          correct: "Fue estratega militar, administró provisiones y coordinó tropas",
          explanation: "¡Acertaste! Se detalla en el segundo párrafo su rol de estratega y administradora."
        },
        {
          id: "mic_lit_4",
          question: "¿Qué situación motivó a Micaela a rebelarse según el texto?",
          options: [
            "Las injusticias y abusos contra las comunidades indígenas",
            "El clima frío de los Andes",
            "El aburrimiento en su pueblo",
            "Una fiesta en el pueblo vecino"
          ],
          correct: "Las injusticias y abusos contra las comunidades indígenas",
          explanation: "¡Exacto! El texto destaca su sensibilidad ante las injusticias hacia los indígenas."
        },
        {
          id: "mic_lit_5",
          question: "¿Por qué cualidades es recordada Micaela Bastidas en el Perú?",
          options: [
            "Como ejemplo de dignidad, valentía y liderazgo femenino",
            "Como una gran cocinera solamente",
            "Como una cantante de ópera",
            "Como una reina de Europa"
          ],
          correct: "Como ejemplo de dignidad, valentía y liderazgo femenino",
          explanation: "¡Perfecto! El último párrafo destaca su dignidad, valentía y liderazgo."
        }
      ],
      inferential: [
        {
          id: "mic_inf_1",
          question: "¿Qué demuestra el hecho de que Micaela organizara provisiones y escribiera cartas de coordinación?",
          options: [
            "Que poseía una gran capacidad de planificación, orden e inteligencia",
            "Que no tenía soldados que le hicieran caso",
            "Que prefería no hablar con la gente",
            "Que quería dedicarse a la pintura"
          ],
          correct: "Que poseía una gran capacidad de planificación, orden e inteligencia",
          explanation: "¡Gran deducción! Organizar recursos en momentos difíciles requiere enorme capacidad."
        },
        {
          id: "mic_inf_2",
          question: "¿Qué significa la frase 'Por la libertad de mi pueblo no he de ver florecer la flor de mi juventud'?",
          options: [
            "Que estaba dispuesta a sacrificar su tranquilidad y años de juventud por el bien de su gente",
            "Que no le gustaban las flores silvestres",
            "Que prefería vivir en la ciudad",
            "Que no deseaba crecer"
          ],
          correct: "Que estaba dispuesta a sacrificar su tranquilidad y años de juventud por el bien de su gente",
          explanation: "¡Excelente interpretación! Expresa el desprendimiento y sacrificio por su pueblo."
        },
        {
          id: "mic_inf_3",
          question: "¿Cómo era el trabajo conjunto entre Micaela Bastidas y Túpac Amaru II?",
          options: [
            "Un trabajo en equipo basado en la confianza, el respeto mutuo y la causa común",
            "Competían para ver quién mandaba más",
            "No se comunicaban nunca",
            "Tenían ideas opuestas y peleaban siempre"
          ],
          correct: "Un trabajo en equipo basado en la confianza, el respeto mutuo y la causa común",
          explanation: "¡Muy bien! Ambos se complementaban como líderes y estrategas."
        },
        {
          id: "mic_inf_4",
          question: "¿Qué podemos inferir sobre el papel de las mujeres peruanas en la historia a través de Micaela?",
          options: [
            "Que las mujeres han sido protagonistas valientes y decisivas en la construcción del Perú",
            "Que las mujeres nunca participaban en la historia",
            "Que solo los hombres tomaban decisiones",
            "Que la historia peruana es fácil y sin retos"
          ],
          correct: "Que las mujeres han sido protagonistas valientes y decisivas en la construcción del Perú",
          explanation: "¡Exacto! Su figura demuestra el rol crucial de las mujeres en la historia."
        },
        {
          id: "mic_inf_5",
          question: "¿Por qué crees que su memoria se mantiene viva después de tantos años?",
          options: [
            "Porque su valentía frente a la opresión sigue inspirando a buscar una sociedad más justa",
            "Porque escribió un libro de chistes",
            "Porque viajó por muchos países en avión",
            "Porque nadie más vivía en Tamburco"
          ],
          correct: "Porque su valentía frente a la opresión sigue inspirando a buscar una sociedad más justa",
          explanation: "¡Gran reflexión! Los ideales de justicia inspiran a todas las generaciones."
        }
      ],
      critical: [
        {
          id: "mic_crit_1",
          question: "¿Por qué es justo y necesario defender a quienes sufren abusos o injusticias?",
          options: [
            "Porque todas las personas tenemos igual dignidad y merecemos respeto y oportunidades.",
            "Porque solo así podemos ganar premios en la escuela.",
            "Porque es una obligación sin importancia.",
            "No debemos meternos si no nos afecta directamente."
          ],
          correct: "Porque todas las personas tenemos igual dignidad y merecemos respeto y oportunidades.",
          explanation: "¡Excelente postura ética! Defender los derechos de los demás enaltece a la comunidad."
        },
        {
          id: "mic_crit_2",
          question: "¿Qué opinas del liderazgo de Micaela Bastidas en una época donde casi solo gobernaban hombres?",
          options: [
            "Fue un ejemplo admirable de valentía que demostró la inteligencia y capacidad de la mujer andina.",
            "Fue un error porque las mujeres no debían opinar.",
            "No tuvo ninguna trascendencia.",
            "Cualquiera hubiera hecho lo mismo sin esforzarse."
          ],
          correct: "Fue un ejemplo admirable de valentía que demostró la inteligencia y capacidad de la mujer andina.",
          explanation: "¡Muy acertado! Rompió barreras y abrió camino para futuras generaciones."
        },
        {
          id: "mic_crit_3",
          question: "¿Cómo demuestran hoy en día las niñas y niños su valentía en la vida cotidiana?",
          options: [
            "Diciendo la verdad, defendiendo a amigos del acoso y esforzándose al aprender cosas nuevas.",
            "Peleando físicamente en el recreo.",
            "Haciendo cosas peligrosas sin permiso de sus padres.",
            "Burlándose de los más pequeños."
          ],
          correct: "Diciendo la verdad, defendiendo a amigos del acoso y esforzándose al aprender cosas nuevas.",
          explanation: "¡Gran sentido común! La verdadera valentía diaria es constructiva y solidaria."
        },
        {
          id: "mic_crit_4",
          question: "¿Qué valor te parece más admirable en una heroína: no rendirse jamás o buscar la justicia para todos?",
          options: [
            "Ambos valores se unen, porque la constancia permite alcanzar la justicia y el bienestar común.",
            "Ninguno, es mejor rendirse pronto.",
            "Buscar beneficios solo para uno mismo.",
            "No pensar en el futuro."
          ],
          correct: "Ambos valores se unen, porque la constancia permite alcanzar la justicia y el bienestar común.",
          explanation: "¡Brillante reflexión! La perseverancia y la justicia van de la mano."
        },
        {
          id: "mic_crit_5",
          isWrittenOpen: true,
          question: "Escribe tu reflexión: ¿Qué mensaje le darías a Micaela Bastidas si pudieras hablar con ella hoy y qué harás tú para hacer del Perú un país más justo?",
          rubricKeywords: ["gracias", "justicia", "valiente", "perú", "estudiar", "respeto", "ayudar", "ejemplo"],
          minWords: 6,
          sampleAnswer: "Le daría las gracias por su enorme valentía. Para hacer un Perú más justo voy a respetar a todas las personas y estudiar mucho para ayudar a mi comunidad.",
          explanation: "Leo evaluará tu respuesta considerando tus argumentos y tu compromiso cívico."
        }
      ]
    }
  },
  {
    id: "des_delfin",
    level: "DESARROLLO",
    title: "El Delfín Rosado de la Amazonía",
    category: "animales",
    genre: "Texto informativo narrativo",
    readTime: "5 min",
    status: "APROBADA",
    origin: "Biodiversidad Peruana Verificada",
    heroImage: "🐬",
    summary: "Descubre al inteligente cetáceo de agua dulce que nada en los ríos caudalosos del oriente peruano.",
    paragraphs: [
      "En los caudalosos ríos de la selva peruana, como el Ucayali y el gran Amazonas, vive una criatura asombrosa: el delfín rosado o 'boto'. A diferencia de sus parientes que habitan en los mares salados, este mamífero se ha adaptado perfectamente a nadar entre las raíces y troncos de la selva inundada.",
      "Cuando nacen, estos delfines tienen la piel de color gris oscuro. Conforme van creciendo y jugando en las aguas cálidas de la Amazonía, su piel va cambiando hasta adquirir un hermoso tono rosado brillante. Su cuello es flexible, lo que les permite mover la cabeza de lado a lado para buscar peces entre las plantas acuáticas.",
      "Las comunidades amazónicas protegen al delfín rosado porque saben que mantiene el equilibrio y la salud de los ríos. Cuidar de ellos significa no contaminar las aguas y conservar los bosques tropicales que son el hogar de miles de seres vivos del Perú."
    ],
    comodinHint: "Busca en el segundo párrafo la parte donde se explica el cambio de color de su piel conforme crece.",
    questions: {
      literal: [
        {
          id: "del_lit_1",
          question: "¿En qué ríos de la selva peruana habita el delfín rosado según la lectura?",
          options: [
            "En el Ucayali y el gran Amazonas",
            "En el río Rímac",
            "En el río Santa de Áncash",
            "En el río Chili de Arequipa"
          ],
          correct: "En el Ucayali y el gran Amazonas",
          explanation: "¡Correcto! El primer párrafo menciona específicamente los ríos Ucayali y Amazonas."
        },
        {
          id: "del_lit_2",
          question: "¿De qué color es la piel del delfín rosado cuando recién nace?",
          options: ["Gris oscuro", "Rosado brillante", "Blanco puro", "Amarillo limón"],
          correct: "Gris oscuro",
          explanation: "¡Muy bien! En el segundo párrafo se indica que al nacer tienen la piel gris oscura."
        },
        {
          id: "del_lit_3",
          question: "¿Qué ventaja le da al delfín rosado tener el cuello flexible?",
          options: [
            "Mover la cabeza de lado a lado para buscar peces entre las plantas",
            "Nadar a la velocidad de un avión",
            "Saltar por encima de los árboles más altos",
            "Dormir de pie en la orilla"
          ],
          correct: "Mover la cabeza de lado a lado para buscar peces entre las plantas",
          explanation: "¡Acertaste! En el segundo párrafo se explica esta característica anatómica."
        },
        {
          id: "del_lit_4",
          question: "¿Qué tipo de agua habitan estos delfines en comparación con los del mar?",
          options: ["Agua dulce de ríos", "Agua muy salada", "Agua congelada", "Agua con gas"],
          correct: "Agua dulce de ríos",
          explanation: "¡Exacto! El texto aclara que es un mamífero de agua dulce adaptado a la selva."
        },
        {
          id: "del_lit_5",
          question: "¿Por qué protegen las comunidades amazónicas al delfín rosado?",
          options: [
            "Porque mantiene el equilibrio y la salud de los ríos",
            "Porque hace trucos en circos",
            "Porque les regala piedras preciosas",
            "Porque espanta a todos los peces"
          ],
          correct: "Porque mantiene el equilibrio y la salud de los ríos",
          explanation: "¡Perfecto! El tercer párrafo explica su importancia para el equilibrio del ecosistema."
        }
      ],
      inferential: [
        {
          id: "del_inf_1",
          question: "¿Qué sucedería con los peces y la vida del río si el delfín rosado desapareciera?",
          options: [
            "Se rompería el equilibrio natural del río y se afectaría la salud del ecosistema",
            "Los ríos se volverían más limpios de inmediato",
            "El agua se convertiría en salada",
            "No pasaría absolutamente nada"
          ],
          correct: "Se rompería el equilibrio natural del río y se afectaría la salud del ecosistema",
          explanation: "¡Gran deducción! Cada especie cumple un rol vital en la cadena ecológica."
        },
        {
          id: "del_inf_2",
          question: "¿Por qué el delfín rosado necesita nadar entre raíces y árboles inundados?",
          options: [
            "Porque en la selva inundada se refugian muchos peces que le sirven de alimento",
            "Porque quiere esconderse del sol",
            "Porque no sabe nadar en aguas abiertas",
            "Porque le gusta trepar a los árboles"
          ],
          correct: "Porque en la selva inundada se refugian muchos peces que le sirven de alimento",
          explanation: "¡Exacto! Las raíces son zonas ricas en vegetación y peces de río."
        },
        {
          id: "del_inf_3",
          question: "¿Qué relación existe entre la contaminación de las ciudades y la vida del delfín amazónico?",
          options: [
            "La basura arrojada a los ríos puede intoxicar las aguas y poner en riesgo la vida de los delfines",
            "La contaminación ayuda a los delfines a alimentarse mejor",
            "Los plásticos protegen a los ríos",
            "No hay ninguna relación"
          ],
          correct: "La basura arrojada a los ríos puede intoxicar las aguas y poner en riesgo la vida de los delfines",
          explanation: "¡Muy acertado! Los desechos dañan gravemente a las especies acuáticas."
        },
        {
          id: "del_inf_4",
          question: "¿Qué nos enseña la actitud de las comunidades nativas hacia la naturaleza?",
          options: [
            "Que debemos convivir con respeto y proteger a los seres vivos que comparten nuestro entorno",
            "Que la naturaleza solo sirve para explotarla sin pensar en el futuro",
            "Que los animales salvajes no tienen importancia",
            "Que no es necesario cuidar el agua"
          ],
          correct: "Que debemos convivir con respeto y proteger a los seres vivos que comparten nuestro entorno",
          explanation: "¡Excelente inferencia! Los saberes ancestrales nos enseñan armonía con el medio ambiente."
        },
        {
          id: "del_inf_5",
          question: "¿Por qué crees que a los niños peruanos les fascina conocer sobre el delfín rosado?",
          options: [
            "Porque es un animal único, llamativo y representativo de la gran biodiversidad de nuestro país",
            "Porque es el animal más común en todas las casas",
            "Porque es idéntico a un perro",
            "Porque vive en las montañas nevadas"
          ],
          correct: "Porque es un animal único, llamativo y representativo de la gran biodiversidad de nuestro país",
          explanation: "¡Gran deducción! Su singularidad despierta curiosidad y orgullo por nuestra fauna."
        }
      ],
      critical: [
        {
          id: "del_crit_1",
          question: "¿Qué opinas de las personas que arrojan plásticos o desperdicios a los ríos?",
          options: [
            "Es una mala acción, porque daña el agua que bebemos y destruye el hogar de animales inocentes.",
            "Está bien, los ríos se limpian solos con la corriente.",
            "No tiene consecuencias negativas.",
            "Es una costumbre que todos deberían seguir."
          ],
          correct: "Es una mala acción, porque daña el agua que bebemos y destruye el hogar de animales inocentes.",
          explanation: "¡Muy buena postura ambiental! Cuidar el agua es cuidar la vida misma."
        },
        {
          id: "del_crit_2",
          question: "¿Cómo puedes tú, desde tu colegio o casa, contribuir al cuidado de la naturaleza del Perú?",
          options: [
            "Ahorrando agua, reduciendo el plástico de un solo uso y depositando la basura en tachos adecuados.",
            "Dejando los caños abiertos para que corra el agua.",
            "Tirando envolturas en el patio escolar.",
            "Comprando animales silvestres como mascotas."
          ],
          correct: "Ahorrando agua, reduciendo el plástico de un solo uso y depositando la basura en tachos adecuados.",
          explanation: "¡Magnífica decisión! Pequeñas acciones diarias generan un gran impacto colectivo."
        },
        {
          id: "del_crit_3",
          question: "¿Consideras que el Perú debe estar orgulloso de su biodiversidad? ¿Por qué?",
          options: [
            "Sí, porque poseemos una de las mayores variedades de especies y paisajes naturales del mundo entero.",
            "No, la biodiversidad no tiene valor.",
            "Solo si los animales son de otros continentes.",
            "No sé."
          ],
          correct: "Sí, porque poseemos una de las mayores variedades de especies y paisajes naturales del mundo entero.",
          explanation: "¡Totalmente de acuerdo! El Perú es un país megadiverso reconocido globalmente."
        },
        {
          id: "del_crit_4",
          question: "¿Crees que las leyes peruanas deben sancionar con severidad a quienes contaminan los ríos amazónicos?",
          options: [
            "Sí, porque proteger los recursos naturales es un deber para el presente y para las futuras generaciones.",
            "No, cada uno debe hacer lo que quiera.",
            "Solamente si las personas contaminan los domingos.",
            "No tiene relevancia."
          ],
          correct: "Sí, porque proteger los recursos naturales es un deber para el presente y para las futuras generaciones.",
          explanation: "¡Excelente juicio crítico! Las leyes deben garantizar el bien común y la sostenibilidad."
        },
        {
          id: "del_crit_5",
          isWrittenOpen: true,
          question: "Escribe tu compromiso ecológico: Si pudieras ser el protector de la Amazonía por un día, ¿qué harías para que las personas cuiden a los delfines y a los ríos?",
          rubricKeywords: ["cuidar", "ríos", "limpiar", "agua", "animales", "proteger", "selva", "basura", "concientizar"],
          minWords: 6,
          sampleAnswer: "Organizaría campañas para limpiar los ríos y enseñaría a los niños a no usar plásticos para que los delfines naden felices y seguros.",
          explanation: "Leo evaluará tu propuesta valorando tu creatividad y sentido de responsabilidad ambiental."
        }
      ]
    }
  },

  // =========================================================================
  // 🔴 NIVEL AVANZADO (Máximo 3 párrafos, vocabulario rico, rigor histórico)
  // =========================================================================
  {
    id: "ava_maria_reiche",
    level: "AVANZADO",
    title: "María Reiche: La Dama que Descifró las Líneas de Nazca",
    category: "personajes",
    genre: "Biografía histórica",
    readTime: "7 min",
    status: "APROBADA",
    origin: "Historia y Arqueología Peruana Verificada",
    heroImage: "🔭",
    summary: "La matemática que consagró su existencia a estudiar y preservar los colosales geoglifos del desierto iqueño. (Máximo 3 párrafos).",
    paragraphs: [
      "En el árido e imponente desierto de la costa sur del Perú, sobre las pampas de Nazca, reposan gigantescos geoglifos que representan colibríes, monos, arañas y complejas figuras geométricas trazadas hace más de un milenio por los antiguos pobladores prehispánicos. Durante siglos, estas magníficas líneas permanecieron ocultas al entendimiento común, expuestas al desgaste del viento y a la indiferencia del ser humano.",
      "A mediados del siglo XX, la matemática y traductora alemana-peruana María Reiche decidió consagrar su vida entera a su estudio. Provista de una sencilla escoba para barrer el polvo acumulado, una cinta métrica y una libreta de notas, recorrió infatigablemente el caluroso desierto durante décadas, midiendo con asombrosa precisión cada surco y formulando la hipótesis de que las líneas constituían un colosal calendario astronómico y agrícola para la civilización nazca.",
      "María no solo investigó: se convirtió en la guardiana más tenaz de aquel patrimonio cultural, enfrentando a quienes pretendían construir carreteras o destruir los trazos con vehículos. Su dedicación inquebrantable logró que la UNESCO declarara las Líneas de Nazca como Patrimonio de la Humanidad en 1994, demostrando cómo la perseverancia científica y el amor por la cultura pueden salvar la memoria de un pueblo."
    ],
    comodinHint: "Lee con atención el segundo párrafo: allí se detallan las herramientas que empleaba María Reiche y su hipótesis astronómica.",
    questions: {
      literal: [
        {
          id: "rei_lit_1",
          question: "¿Qué figuras trazaron los antiguos pobladores sobre las pampas de Nazca según el primer párrafo?",
          options: [
            "Colibríes, monos, arañas y complejas figuras geométricas",
            "Barcos de vapor y aviones modernos",
            "Grandes rascacielos y castillos",
            "Retratos de reyes europeos"
          ],
          correct: "Colibríes, monos, arañas y complejas figuras geométricas",
          explanation: "¡Correcto! En el primer párrafo se enumeran explícitamente estas figuras zoomorfas y geométricas."
        },
        {
          id: "rei_lit_2",
          question: "¿Con qué sencillas herramientas iniciales recorría María Reiche el desierto para estudiar las líneas?",
          options: [
            "Una escoba para barrer el polvo, una cinta métrica y una libreta de notas",
            "Drones con cámaras de video satelitales",
            "Excavadoras y tractores pesados",
            "Una brújula digital y una tableta electrónica"
          ],
          correct: "Una escoba para barrer el polvo, una cinta métrica y una libreta de notas",
          explanation: "¡Muy bien! El segundo párrafo describe con detalle estos modestos instrumentos de trabajo."
        },
        {
          id: "rei_lit_3",
          question: "¿Qué hipótesis formuló María Reiche acerca de la función de las líneas trazadas en las pampas?",
          options: [
            "Que constituían un colosal calendario astronómico y agrícola",
            "Que eran pistas para competencias de carretas",
            "Que eran planos para construir una ciudad subterránea",
            "Que no tenían ningún propósito intencional"
          ],
          correct: "Que constituían un colosal calendario astronómico y agrícola",
          explanation: "¡Acertaste! Se señala claramente en el segundo párrafo su hipótesis astronómica y agrícola."
        },
        {
          id: "rei_lit_4",
          question: "¿En qué año la UNESCO declaró las Líneas de Nazca como Patrimonio de la Humanidad gracias a su esfuerzo?",
          options: ["En 1994", "En 1821", "En 1950", "En 2010"],
          correct: "En 1994",
          explanation: "¡Exacto! El tercer párrafo consigna con exactitud el año 1994."
        },
        {
          id: "rei_lit_5",
          question: "¿Frente a qué amenazas defendió María Reiche tenazmente las pampas de Nazca?",
          options: [
            "A quienes pretendían construir carreteras o ingresar con vehículos destruyendo los trazos",
            "A la lluvia constante y huracanes",
            "A animales salvajes carnívoros",
            "A barcos piratas en el litoral"
          ],
          correct: "A quienes pretendían construir carreteras o ingresar con vehículos destruyendo los trazos",
          explanation: "¡Excelente! El tercer párrafo relata su tenaz lucha contra vehículos y obras destructivas."
        }
      ],
      inferential: [
        {
          id: "rei_inf_1",
          question: "¿Por qué María Reiche utilizaba una escoba en lugar de herramientas mecánicas invasivas?",
          options: [
            "Porque debía limpiar el polvo sin alterar ni dañar la delicada superficie de los antiguos trazos",
            "Porque no existían otras herramientas en el mundo",
            "Porque le gustaba limpiar casas",
            "Porque las máquinas eran muy baratas"
          ],
          correct: "Porque debía limpiar el polvo sin alterar ni dañar la delicada superficie de los antiguos trazos",
          explanation: "¡Brillante deducción! El rigor arqueológico exige extrema delicadeza para no borrar vestigios milenarios."
        },
        {
          id: "rei_inf_2",
          question: "¿Qué revela la vida solitaria de María Reiche en el desierto sobre su personalidad y convicciones?",
          options: [
            "Una admirable perseverancia, amor a la ciencia y una profunda pasión por descifrar la verdad histórica",
            "Que no le agradaba convivir con ninguna persona",
            "Que fue obligada a vivir en el desierto",
            "Que buscaba hacerse famosa de la noche a la mañana"
          ],
          correct: "Una admirable perseverancia, amor a la ciencia y una profunda pasión por descifrar la verdad histórica",
          explanation: "¡Muy buena inferencia! Consagrar décadas a una labor solitaria demuestra un compromiso inquebrantable."
        },
        {
          id: "rei_inf_3",
          question: "¿Por qué era fundamental relacionar los geoglifos con el conocimiento astronómico de los antiguos peruanos?",
          options: [
            "Porque demuestra que los pobladores prehispánicos poseían avanzados saberes matemáticos y de ciclos climáticos",
            "Porque pensaban que las estrellas eran de oro",
            "Porque querían viajar a la luna en cohetes",
            "Para demostrar que no sabían sembrar"
          ],
          correct: "Porque demuestra que los pobladores prehispánicos poseían avanzados saberes matemáticos y de ciclos climáticos",
          explanation: "¡Exacto! Reconoce la sofisticación científica de las sociedades andinas originarias."
        },
        {
          id: "rei_inf_4",
          question: "¿Qué habría ocurrido con las Líneas de Nazca si María Reiche no hubiera intervenido a tiempo?",
          options: [
            "Muchos de los geoglifos se habrían perdido irremediablemente por el paso de vehículos y la urbanización",
            "Habrían brillado solas en la oscuridad",
            "Se habrían conservado mejor sin nadie que las mirara",
            "Habrían cambiado de lugar solas"
          ],
          correct: "Muchos de los geoglifos se habrían perdido irremediablemente por el paso de vehículos y la urbanización",
          explanation: "¡Muy acertado! Sin su vigilancia activa, las rodadas de camiones hubieran borrado las figuras."
        },
        {
          id: "rei_inf_5",
          question: "¿Qué significado tiene que una investigadora nacida en Alemania sea declarada ilustre defensora del patrimonio peruano?",
          options: [
            "Que el amor y respeto por el patrimonio cultural trasciende fronteras y une a la humanidad en una causa noble",
            "Que en el Perú nadie sabía matemáticas",
            "Que los peruanos no querían a las líneas",
            "Que las líneas pertenecían a Alemania"
          ],
          correct: "Que el amor y respeto por el patrimonio cultural trasciende fronteras y une a la humanidad en una causa noble",
          explanation: "¡Gran inferencia humanista! La ciencia y el aprecio cultural son universales."
        }
      ],
      critical: [
        {
          id: "rei_crit_1",
          question: "¿Crees que el desarrollo económico (como carreteras y comercio) debe justificar destruir el patrimonio arqueológico? ¿Por qué?",
          options: [
            "No, porque el patrimonio arqueológico es irreemplazable y guarda la memoria e identidad de nuestros antepasados.",
            "Sí, todo lo antiguo debe destruirse para construir fábricas.",
            "Solo si nos pagan mucho dinero por destruirlo.",
            "No tiene relevancia la historia frente al dinero."
          ],
          correct: "No, porque el patrimonio arqueológico es irreemplazable y guarda la memoria e identidad de nuestros antepasados.",
          explanation: "¡Sólida postura ética! El progreso verdadero debe convivir en armonía con la preservación cultural."
        },
        {
          id: "rei_crit_2",
          question: "¿Qué valoras más del legado de María Reiche: su trabajo como investigadora científica o su papel como defensora ciudadana?",
          options: [
            "Ambos son inseparables, pues la investigación genera conocimiento y la defensa asegura que dicho conocimiento no desaparezca.",
            "Solo ser científica, la defensa no importa.",
            "Solo discutir con la gente.",
            "Ninguno de los dos."
          ],
          correct: "Ambos son inseparables, pues la investigación genera conocimiento y la defensa asegura que dicho conocimiento no desaparezca.",
          explanation: "¡Excelente análisis crítico! Ciencia y compromiso social forman una alianza ejemplar."
        },
        {
          id: "rei_crit_3",
          question: "¿Por qué crees que muchos monumentos históricos sufren a veces la indiferencia de las personas?",
          options: [
            "A menudo por falta de educación y sensibilización sobre el valor incalculable de nuestra historia colectiva.",
            "Porque la historia es aburrida.",
            "Porque las piedras viejas no sirven para nada.",
            "Porque la gente prefiere vivir sin pasado."
          ],
          correct: "A menudo por falta de educación y sensibilización sobre el valor incalculable de nuestra historia colectiva.",
          explanation: "¡Muy agudo! La educación es la clave fundamental para valorar y cuidar el patrimonio."
        },
        {
          id: "rei_crit_4",
          question: "¿Qué lecciones de perseverancia podemos extraer para nuestros estudios escolares a partir de su ejemplo?",
          options: [
            "Que los grandes logros requieren paciencia, disciplina constante y pasión, aun cuando el camino sea difícil.",
            "Que solo debemos esforzarnos si nos dan un premio inmediato.",
            "Que es mejor abandonar una tarea si hace mucho calor.",
            "Que no vale la pena dedicar tiempo a metas lejanas."
          ],
          correct: "Que los grandes logros requieren paciencia, disciplina constante y pasión, aun cuando el camino sea difícil.",
          explanation: "¡Inspiradora conclusión! La constancia diaria es el verdadero secreto del aprendizaje."
        },
        {
          id: "rei_crit_5",
          isWrittenOpen: true,
          question: "Escribe tu ensayo breve de pensamiento crítico (máx. 3-4 oraciones): Si descubrieras un vestigio arqueológico en tu localidad, ¿cómo actuarías con responsabilidad cívica y por qué?",
          rubricKeywords: ["avisar", "proteger", "autoridades", "ministerio", "patrimonio", "cuidar", "respetar", "cultura", "historia"],
          minWords: 8,
          sampleAnswer: "Si encontrara un vestigio antiguo, no lo tocaría ni dañaría. Avisaría de inmediato a mis profesores y a las autoridades culturales para que lo estudien y protejan, porque es parte de nuestra historia nacional.",
          explanation: "Leo evaluará la coherencia, argumentación y sentido de responsabilidad cívica en tu respuesta escrita."
        }
      ]
    }
  },
  {
    id: "ava_olaya",
    level: "AVANZADO",
    title: "José Olaya: El Patriota de las Aguas de Chorrillos",
    category: "heroes",
    genre: "Biografía histórica",
    readTime: "7 min",
    status: "APROBADA",
    origin: "Historia Peruana Verificada",
    heroImage: "🏊‍♂️",
    summary: "El humilde pescador chorrillano que nadó contra la corriente para defender la independencia del Perú. (Máximo 3 párrafos).",
    paragraphs: [
      "A principios de 1823, en plena lucha por la consolidación de la independencia del Perú, las fuerzas patriotas se encontraban sitiadas en los castillos del Callao mientras las tropas virreinales controlaban la ciudad de Lima. En aquel escenario de extremo peligro, la comunicación secreta entre los libertadores resultaba decisiva pero parecía prácticamente imposible por tierra debido al estricto bloqueo enemigo.",
      "Fue entonces cuando emergió la heroica figura de José Silverio Olaya Balandra, un modesto pescador de origen indígena nacido en la villa de Chorrillos. Conociendo a la perfección las corrientes marinas y poseedor de una resistencia física extraordinaria, Olaya se ofreció voluntariamente a cruzar a nado las bravas aguas del océano Pacífico entre Chorrillos, Lima y el Callao, llevando correspondencia clandestina cosida en sus ropas para no ser descubierto.",
      "Interceptado finalmente por las autoridades coloniales, fue sometido a crueles tormentos para que delatara los planes y nombres de los patriotas. Sin embargo, su lealtad fue inquebrantable y pronunció la inmortal sentencia: 'Si mil vidas tuviera, gustoso las daría por mi patria'. Su sacrificio demostró al mundo que la libertad del Perú no fue solo obra de ejércitos formales, sino del coraje heroico de sus propios ciudadanos comunes."
    ],
    comodinHint: "Revisa el segundo párrafo para entender cómo aprovechaba Olaya las corrientes marinas y dónde ocultaba las cartas.",
    questions: {
      literal: [
        {
          id: "ola_lit_1",
          question: "¿En qué villa del litoral limeño nació José Olaya Balandra?",
          options: ["En Chorrillos", "En Ancón", "En Pucusana", "En Barranco"],
          correct: "En Chorrillos",
          explanation: "¡Correcto! El segundo párrafo indica que nació en la villa de Chorrillos."
        },
        {
          id: "ola_lit_2",
          question: "¿Cuál era la ocupación u oficio de José Olaya antes de convertirse en emisario?",
          options: ["Modesto pescador", "Médico militar", "Comerciante de telas", "Abogado del cabildo"],
          correct: "Modesto pescador",
          explanation: "¡Muy bien! Se menciona explícitamente que era un modesto pescador de origen indígena."
        },
        {
          id: "ola_lit_3",
          question: "¿Cómo transportaba la correspondencia secreta para evitar que los enemigos la descubrieran?",
          options: [
            "Cosida en sus ropas mientras cruzaba a nado las aguas del mar",
            "En una gran botella de vidrio que flotaba",
            "En una carreta tirada por caballos",
            "A través de una paloma mensajera"
          ],
          correct: "Cosida en sus ropas mientras cruzaba a nado las aguas del mar",
          explanation: "¡Acertaste! El segundo párrafo describe que llevaba correspondencia clandestina cosida en sus ropas."
        },
        {
          id: "ola_lit_4",
          question: "¿Qué célebre frase pronunció José Olaya ante sus captores antes de su inmolación?",
          options: [
            "'Si mil vidas tuviera, gustoso las daría por mi patria'",
            "'El mar es bravo pero la tierra es tranquila'",
            "'Prefiero navegar que quedarme en la orilla'",
            "'La victoria llegará el próximo año'"
          ],
          correct: "'Si mil vidas tuviera, gustoso las daría por mi patria'",
          explanation: "¡Exacto! El tercer párrafo cita su inmortal e histórica frase patriótica."
        },
        {
          id: "ola_lit_5",
          question: "¿Entre qué puntos del litoral nadaba Olaya para conectar a las fuerzas sitiadas?",
          options: [
            "Entre Chorrillos, Lima y el Callao",
            "Entre Ica y Arequipa",
            "Entre Piura y Tumbes",
            "Entre Trujillo y Chimbote"
          ],
          correct: "Entre Chorrillos, Lima y el Callao",
          explanation: "¡Perfecto! El segundo párrafo señala la ruta marina entre Chorrillos, Lima y el Callao."
        }
      ],
      inferential: [
        {
          id: "ola_inf_1",
          question: "¿Por qué el oficio de pescador fue fundamental para que Olaya pudiera cumplir su peligrosa misión?",
          options: [
            "Porque le brindó gran fortaleza física y un conocimiento profundo del mar y de sus corrientes",
            "Porque tenía muchos botes con motor",
            "Porque nadie sospechaba de los peces",
            "Porque le gustaba el agua fría"
          ],
          correct: "Porque le brindó gran fortaleza física y un conocimiento profundo del mar y de sus corrientes",
          explanation: "¡Gran deducción! Su experiencia de vida en el mar fue su herramienta más valiosa."
        },
        {
          id: "ola_inf_2",
          question: "¿Qué motivó a José Olaya a arriesgar su vida sin esperar riquezas ni ascensos militares?",
          options: [
            "Un amor sincero y desinteresado por la causa de la independencia y la libertad de su patria",
            "El deseo de recibir un premio en dinero",
            "La obligación de sus superiores",
            "El aburrimiento en su caleta"
          ],
          correct: "Un amor sincero y desinteresado por la causa de la independencia y la libertad de su patria",
          explanation: "¡Muy buena inferencia! Su sacrificio fue un acto de convicción patriótica pura."
        },
        {
          id: "ola_inf_3",
          question: "¿Qué demuestra la actitud de Olaya frente a los interrogatorios y tormentos?",
          options: [
            "Una lealtad absoluta hacia sus compatriotas y un coraje moral inquebrantable",
            "Que no entendía el idioma de sus captores",
            "Que había olvidado la información que llevaba",
            "Que tenía miedo a hablar"
          ],
          correct: "Una lealtad absoluta hacia sus compatriotas y un coraje moral inquebrantable",
          explanation: "¡Excelente! Prefirió entregar su vida antes que traicionar a quienes confiaron en él."
        },
        {
          id: "ola_inf_4",
          question: "¿Qué nos enseña la historia de Olaya sobre quiénes construyeron la independencia del Perú?",
          options: [
            "Que la independencia fue forjada por el pueblo peruano entero, incluyendo campesinos y pescadores",
            "Que solo los generales con uniformes dorados importaban",
            "Que la independencia ocurrió sin el apoyo de los peruanos",
            "Que el mar no tuvo ningún papel en la historia"
          ],
          correct: "Que la independencia fue forjada por el pueblo peruano entero, incluyendo campesinos y pescadores",
          explanation: "¡Muy agudo! La historia la construyen hombres y mujeres de todas las clases sociales."
        },
        {
          id: "ola_inf_5",
          question: "¿Por qué el mar de Chorrillos y el Callao representaba una ruta tan peligrosa en esa época?",
          options: [
            "Por las bajas temperaturas, olas fuertes y la constante vigilancia de patrullas navales enemigas",
            "Porque no había peces para comer",
            "Porque el agua estaba contaminada con petróleo",
            "Porque los tiburones atacaban los botes"
          ],
          correct: "Por las bajas temperaturas, olas fuertes y la constante vigilancia de patrullas navales enemigas",
          explanation: "¡Exacto! El océano Pacífico en invierno es gélido, con fuertes corrientes y acecho constante."
        }
      ],
      critical: [
        {
          id: "ola_crit_1",
          question: "¿Qué valor moral consideras más admirable en José Olaya: la valentía física o la lealtad?",
          options: [
            "La lealtad, porque su valentía física estaba guiada por la firmeza de sus convicciones y su amor por los demás.",
            "Ninguno, fue una imprudencia haber participado.",
            "Solo saber nadar rápido.",
            "No tiene valor moral arriesgarse por un país."
          ],
          correct: "La lealtad, porque su valentía física estaba guiada por la firmeza de sus convicciones y su amor por los demás.",
          explanation: "¡Profunda reflexión crítica! La lealtad da sentido y grandeza a la valentía."
        },
        {
          id: "ola_crit_2",
          question: "¿Cómo pueden los ciudadanos de hoy demostrar lealtad y amor a su país sin necesidad de guerras?",
          options: [
            "Trabajando con honradez, cuidando los espacios públicos y respetando las leyes y a la comunidad.",
            "Quejándose todo el tiempo sin aportar soluciones.",
            "Ignorando las necesidades de los vecinos.",
            "Buscando ventajas personales sin importar los demás."
          ],
          correct: "Trabajando con honradez, cuidando los espacios públicos y respetando las leyes y a la comunidad.",
          explanation: "¡Magnífica respuesta cívica! El patriotismo cotidiano se demuestra con integridad y servicio."
        },
        {
          id: "ola_crit_3",
          question: "¿Por qué es importante que en las escuelas del Perú se conozcan héroes civiles y populares como José Olaya?",
          options: [
            "Porque inspira a todos los estudiantes a saber que cada persona común puede transformar su sociedad.",
            "Porque es obligatorio para dar exámenes.",
            "Para memorizar fechas sin sentido.",
            "No es relevante estudiar a civiles."
          ],
          correct: "Porque inspira a todos los estudiantes a saber que cada persona común puede transformar su sociedad.",
          explanation: "¡Excelente! La identidad y el orgullo ciudadano se fortalecen con modelos cercanos."
        },
        {
          id: "ola_crit_4",
          question: "¿Qué opinas del hecho de que nunca delató a sus compañeros a pesar de las amenazas?",
          options: [
            "Demostró una fortaleza de carácter y una dignidad humana excepcionales dignas de respeto eterno.",
            "Debió delatarlos para salvarse él mismo.",
            "Fue un acto sin importancia.",
            "No se puede juzgar esa decisión."
          ],
          correct: "Demostró una fortaleza de carácter y una dignidad humana excepcionales dignas de respeto eterno.",
          explanation: "¡Muy acertado! Cumplir la palabra dada en circunstancias extremas es heroísmo puro."
        },
        {
          id: "ola_crit_5",
          isWrittenOpen: true,
          question: "Escribe tu reflexión crítica: ¿Qué significa para ti la frase 'Si mil vidas tuviera, gustoso las daría por mi patria' y cómo defenderías tú la verdad y la justicia en tu vida diaria?",
          rubricKeywords: ["patria", "compromiso", "verdad", "justicia", "amor", "honestidad", "ayuda", "respeto"],
          minWords: 8,
          sampleAnswer: "Para mí significa que el amor por nuestra patria y por nuestra gente es muy grande. Yo defendería la verdad siendo honesto en mis estudios, no mintiendo y ayudando a que todos seamos tratados con respeto.",
          explanation: "Leo evaluará la sinceridad de tu reflexión, coherencia y sentido ético."
        }
      ]
    }
  }
];

// Lecturas generadas por IA que están inicialmente en "PENDIENTE DE REVISIÓN DOCENTE"
const PENDING_AI_READINGS = [
  {
    id: "ai_gen_1",
    level: "DESARROLLO",
    title: "El Secreto del Algodón Nativo de Lambayeque",
    category: "cultura",
    genre: "Cuento educativo",
    readTime: "5 min",
    status: "PENDIENTE_REVISION",
    origin: "Generado por IA Leo",
    createdAt: "2026-10-06",
    heroImage: "🌾",
    summary: "Lectura sobre la tradición milenaria del algodón de colores naturales en la costa norte del Perú.",
    paragraphs: [
      "En los valles cálidos de Lambayeque, una niña llamada Ximena descubrió en la huerta de su abuela unas plantas de algodón muy especiales. A diferencia del algodón blanco común, estas plantas daban copos de color pardo, marrón rojizo y verde claro natural.",
      "Su abuela le explicó con una sonrisa que aquel era el algodón nativo, cultivado desde hace miles de años por los antiguos mochicas. Este algodón no necesita tintes químicos artificiales y resiste muy bien el calor y las plagas del campo.",
      "Juntas aprendieron a hilar las hebras con husos tradicionales para tejer bolsos y mantas suaves. Ximena comprendió que la sabiduría de nuestros antepasados peruanos sigue viva y nos enseña a vivir en armonía con la tierra."
    ],
    comodinHint: "Revisa el segundo párrafo: allí la abuela explica las propiedades ecológicas y colores del algodón nativo.",
    questions: {
      literal: [
        {
          id: "alg_lit_1",
          question: "¿En qué región del Perú se ambienta la historia de Ximena?",
          options: ["En Lambayeque", "En Puno", "En Huancavelica", "En Loreto"],
          correct: "En Lambayeque",
          explanation: "El texto inicia indicando los valles cálidos de Lambayeque."
        },
        {
          id: "alg_lit_2",
          question: "¿De qué colores naturales eran los copos de algodón que descubrió Ximena?",
          options: ["Pardo, marrón rojizo y verde claro", "Azul marino y morado", "Rojo carmesí y negro", "Amarillo brillante y plateado"],
          correct: "Pardo, marrón rojizo y verde claro",
          explanation: "El primer párrafo describe los colores pardo, marrón rojizo y verde."
        },
        {
          id: "alg_lit_3",
          question: "¿Qué cultura ancestral ya cultivaba este algodón hace miles de años?",
          options: ["Los mochicas", "Los vikingos", "Los romanos", "Los fenicios"],
          correct: "Los mochicas",
          explanation: "La abuela explica que fue cultivado por los antiguos mochicas."
        },
        {
          id: "alg_lit_4",
          question: "¿Por qué es ecológico este tipo de algodón según la abuela?",
          options: ["Porque no necesita tintes químicos y resiste plagas", "Porque flota en el aire", "Porque se come como dulce", "Porque cambia de color con la música"],
          correct: "Porque no necesita tintes químicos y resiste plagas",
          explanation: "El segundo párrafo detalla que no requiere tintes artificiales."
        },
        {
          id: "alg_lit_5",
          question: "¿Qué aprendieron a tejer Ximena y su abuela con los husos tradicionales?",
          options: ["Bolsos y mantas suaves", "Zapatos de cuero", "Casas de madera", "Sombreros de paja toquilla"],
          correct: "Bolsos y mantas suaves",
          explanation: "En el tercer párrafo se menciona que tejieron bolsos y mantas suaves."
        }
      ],
      inferential: [
        {
          id: "alg_inf_1",
          question: "¿Por qué es importante rescatar el cultivo de plantas nativas tradicionales?",
          options: ["Porque protege la biodiversidad local y preserva saberes agrícolas ancestrales", "Porque es una moda pasajera", "Porque no hay otras plantas en el mundo", "Para no hablar con los agricultores"],
          correct: "Porque protege la biodiversidad local y preserva saberes agrícolas ancestrales",
          explanation: "Las plantas nativas preservan riqueza genética y cultural."
        },
        {
          id: "alg_inf_2",
          question: "¿Qué valor tiene que los abuelos transmitan sus conocimientos a los nietos?",
          options: ["Permite que la memoria, valores y tradiciones familiares no se pierdan con el tiempo", "Solo sirve para pasar el rato", "No tiene ningún valor en la vida moderna", "Hace que los niños no lean libros"],
          correct: "Permite que la memoria, valores y tradiciones familiares no se pierdan con el tiempo",
          explanation: "El diálogo intergeneracional mantiene vivas las tradiciones."
        },
        {
          id: "alg_inf_3",
          question: "¿Cómo ayuda el algodón sin tintes químicos al medio ambiente?",
          options: ["Evita contaminar el agua y el suelo con sustancias tóxicas", "Hace que llueva menos", "Seca los ríos", "No produce ningún beneficio"],
          correct: "Evita contaminar el agua y el suelo con sustancias tóxicas",
          explanation: "Sin colorantes industriales se reduce drásticamente la huella hídrica y tóxica."
        },
        {
          id: "alg_inf_4",
          question: "¿Qué emoción sintió Ximena al trabajar junto a su abuela?",
          options: ["Alegría, curiosidad y orgullo por su cultura", "Aburrimiento y ganas de irse", "Enojo con las plantas", "Miedo al algodón"],
          correct: "Alegría, curiosidad y orgullo por su cultura",
          explanation: "La narración describe una experiencia tierna y formativa."
        },
        {
          id: "alg_inf_5",
          question: "¿Qué podemos deducir sobre la civilización mochica a partir de sus tejidos?",
          options: ["Que poseían amplios conocimientos botánicos, textiles y artísticos", "Que no conocían el algodón", "Que solo sabían hacer vasijas de barro", "Que no tenían ropa"],
          correct: "Que poseían amplios conocimientos botánicos, textiles y artísticos",
          explanation: "El dominio del algodón nativo demuestra una ciencia textil refinada."
        }
      ],
      critical: [
        {
          id: "alg_crit_1",
          question: "¿Crees que los productos elaborados a mano con técnicas tradicionales tienen más valor que los hechos en masa? ¿Por qué?",
          options: ["Sí, porque encierran identidad cultural, dedicación y respeto al medio ambiente.", "No, todo lo que no sea de plástico no sirve.", "Solo si son muy baratos.", "Da igual."],
          correct: "Sí, porque encierran identidad cultural, dedicación y respeto al medio ambiente.",
          explanation: "La artesanía tradicional encierra historia y valor humano."
        },
        {
          id: "alg_crit_2",
          question: "¿Cómo podemos valorar las tradiciones de nuestros abuelos en nuestra propia familia?",
          options: ["Escuchando sus historias con atención y aprendiendo sus recetas o costumbres.", "Burlándonos de lo que nos cuenten.", "Pidiéndoles que no hablen.", "Ignorando su experiencia."],
          correct: "Escuchando sus historias con atención y aprendiendo sus recetas o costumbres.",
          explanation: "El respeto y la escucha activa fortalecen los lazos familiares."
        },
        {
          id: "alg_crit_3",
          question: "¿Por qué el Perú debe proteger su riqueza agrícola nativa frente a productos importados?",
          options: ["Porque garantiza nuestra seguridad alimentaria y protege nuestro patrimonio genético único.", "Porque debemos aislarnos del resto del mundo.", "No es necesario proteger nada.", "Solo para vender caro."],
          correct: "Porque garantiza nuestra seguridad alimentaria y protege nuestro patrimonio genético único.",
          explanation: "Las variedades nativas son un tesoro agronómico irremplazable."
        },
        {
          id: "alg_crit_4",
          question: "¿Qué opinas de la actitud de Ximena al querer aprender a hilar?",
          options: ["Muy positiva, demuestra respeto por sus raíces y ganas de aprender cosas nuevas.", "Inútil en la era de los celulares.", "Una pérdida de tiempo.", "Solo debió jugar videojuegos."],
          correct: "Muy positiva, demuestra respeto por sus raíces y ganas de aprender cosas nuevas.",
          explanation: "Aprender saberes ancestrales amplía la mente y el afecto cultural."
        },
        {
          id: "alg_crit_5",
          isWrittenOpen: true,
          question: "Escribe tu reflexión abierta: ¿Qué tradición o costumbre de tu familia o de tu región del Perú te gusta más y por qué te parece importante cuidarla?",
          rubricKeywords: ["familia", "comida", "costumbre", "fiesta", "región", "cuidar", "tradición", "importante"],
          minWords: 6,
          sampleAnswer: "Me gusta cuando en mi familia preparamos pachamanca o ceviche juntos, porque nos une como familia y mantiene vivas nuestras ricas costumbres peruanas.",
          explanation: "Leo evaluará tu redacción tomando en cuenta la expresión de tus ideas y tu valoración personal."
        }
      ]
    }
  }
];

if (typeof module !== 'undefined') {
  module.exports = { READING_CATEGORIES, INITIAL_READINGS, PENDING_AI_READINGS };
}
