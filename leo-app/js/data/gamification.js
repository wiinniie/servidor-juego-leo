/**
 * LEO – Lectura, Escritura y Oralidad
 * Módulo de Gamificación, Logros, Retos y Avatar Personalizable
 */

const ACHIEVEMENTS_CATALOG = [
  {
    id: "ach_first_read",
    title: "Primeros Pasos",
    icon: "📖",
    description: "Completa tu primera lectura en Leo.",
    criteria: (stats) => (stats.completedReadings || 0) >= 1,
    pointsReward: 30
  },
  {
    id: "ach_five_reads",
    title: "Lector Constante",
    icon: "📚",
    description: "Completa 5 lecturas en tu aventura.",
    criteria: (stats) => (stats.completedReadings || 0) >= 5,
    pointsReward: 60
  },
  {
    id: "ach_word_detective",
    title: "Detective de Palabras",
    icon: "🔍",
    description: "Acierta 10 preguntas de nivel literal.",
    criteria: (stats) => (stats.correctLiteral || 0) >= 10,
    pointsReward: 40
  },
  {
    id: "ach_inference_master",
    title: "Maestro de Inferencias",
    icon: "🧠",
    description: "Acierta 10 preguntas de nivel inferencial.",
    criteria: (stats) => (stats.correctInferential || 0) >= 10,
    pointsReward: 50
  },
  {
    id: "ach_critical_thinker",
    title: "Pensador Crítico",
    icon: "✍️",
    description: "Escribe 2 respuestas reflexivas en preguntas abiertas.",
    criteria: (stats) => (stats.writtenCritiqueCount || 0) >= 2,
    pointsReward: 60
  },
  {
    id: "ach_peru_heroes",
    title: "Guardián de la Historia",
    icon: "🇵🇪",
    description: "Lee 2 historias sobre héroes y personajes ilustres del Perú.",
    criteria: (stats) => (stats.historyReadingsCount || 0) >= 2,
    pointsReward: 50
  },
  {
    id: "ach_nature_friend",
    title: "Amigo de la Naturaleza",
    icon: "🌿",
    description: "Lee sobre la fauna y biodiversidad del Perú.",
    criteria: (stats) => (stats.natureReadingsCount || 0) >= 1,
    pointsReward: 35
  },
  {
    id: "ach_reading_streak",
    title: "Fuego Lector",
    icon: "🔥",
    description: "Alcanza una racha de 3 días consecutivos de lectura.",
    criteria: (stats) => (stats.streak || 0) >= 3,
    pointsReward: 50
  },
  {
    id: "ach_no_comodin",
    title: "Gran Autonomía",
    icon: "⭐",
    description: "Completa una lectura sin utilizar el comodín.",
    criteria: (stats) => (stats.cleanRunsWithoutComodin || 0) >= 1,
    pointsReward: 40
  }
];

const DAILY_CHALLENGES = [
  {
    id: "chl_daily_read",
    title: "Aventura del día",
    description: "Completa 1 lectura o actividad hoy.",
    points: 25,
    progressKey: "readToday",
    target: 1,
    icon: "🎯"
  },
  {
    id: "chl_literal_star",
    title: "Ojo de águila",
    description: "Responde correctamente 3 preguntas literales hoy.",
    points: 20,
    progressKey: "literalToday",
    target: 3,
    icon: "👀"
  },
  {
    id: "chl_comodin_free",
    title: "Reto valiente",
    description: "Completa una lectura sin pedir pistas del comodín.",
    points: 30,
    progressKey: "savedComodinToday",
    target: 1,
    icon: "💡"
  },
  {
    id: "chl_open_writer",
    title: "Voz de autor",
    description: "Escribe tu propia opinión en una pregunta crítica.",
    points: 25,
    progressKey: "wroteOpenToday",
    target: 1,
    icon: "✍️"
  }
];

const AVATAR_CATALOG = {
  headwear: [
    { id: "head_chullo_basic", name: "Chullo Andino Clásico", icon: "🧢", cost: 0, unlocked: true, previewText: "Chullo de lana multicolor" },
    { id: "head_sombrero_norte", name: "Sombrero de Chalán Norteño", icon: "👒", cost: 80, unlocked: false, previewText: "Elegante sombrero de paja" },
    { id: "head_gorra_deportiva", name: "Gorra Deportiva Perú", icon: "🧢", cost: 100, unlocked: false, previewText: "Gorra roja y blanca" },
    { id: "head_corona_selva", name: "Corona de Plumas Nativas", icon: "🪶", cost: 140, unlocked: false, previewText: "Corona tradicional amazónica" }
  ],
  outfit: [
    { id: "out_polo_blanco", name: "Camiseta de Algodón", icon: "👕", cost: 0, unlocked: true, previewText: "Camiseta cómoda de algodón" },
    { id: "out_poncho_cusco", name: "Poncho Cusqueño de Lana", icon: "🧶", cost: 120, unlocked: false, previewText: "Cálido poncho andino" },
    { id: "out_camiseta_peru", name: "Camiseta de la Selección", icon: "⚽", cost: 150, unlocked: false, previewText: "Bicolor con franja roja" },
    { id: "out_chaleco_selva", name: "Chaleco de Guardaparques", icon: "🦺", cost: 180, unlocked: false, previewText: "Chaleco de expedición" }
  ],
  accessory: [
    { id: "acc_ninguno", name: "Sin accesorio", icon: "❌", cost: 0, unlocked: true, previewText: "Estilo natural" },
    { id: "acc_lentes_detective", name: "Lentes de Lector Curioso", icon: "👓", cost: 90, unlocked: false, previewText: "Lentes redondos dorados" },
    { id: "acc_mochila_andina", name: "Mochila con Diseños Incas", icon: "🎒", cost: 130, unlocked: false, previewText: "Mochila para libros" },
    { id: "acc_lupa_misterio", name: "Lupa de Palabras", icon: "🔍", cost: 110, unlocked: false, previewText: "Lupa de explorador" }
  ],
  background: [
    { id: "bg_aula_alegre", name: "Salón de Clase Escolar", icon: "🏫", cost: 0, unlocked: true, previewText: "Aula iluminada con pizarrón" },
    { id: "bg_machu_picchu", name: "Amanecer en Machu Picchu", icon: "🏔️", cost: 180, unlocked: false, previewText: "Vista a la maravilla del mundo" },
    { id: "bg_selva_amazonia", name: "Riberas de la Amazonía", icon: "🌴", cost: 200, unlocked: false, previewText: "Río frondoso y árboles verdes" },
    { id: "bg_mar_chorrillos", name: "Bahía de Pescadores Chorrillos", icon: "🌊", cost: 160, unlocked: false, previewText: "Atardecer en la costa marina" }
  ]
};

if (typeof module !== 'undefined') {
  module.exports = { ACHIEVEMENTS_CATALOG, DAILY_CHALLENGES, AVATAR_CATALOG };
}
