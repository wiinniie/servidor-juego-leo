/**
 * LEO – Lectura, Escritura y Oralidad
 * Evaluación Diagnóstica Inicial
 * 
 * Determina el nivel de lectura del estudiante de manera objetiva y motivadora.
 * "El grado escolar no determina el nivel de lectura".
 */

const DIAGNOSTIC_TEST = {
  title: "Aventura Diagnóstica con Leo 🦁",
  description: "Vamos a jugar un ratito para conocer cómo lees y descubrir tu mejor punto de partida.",
  stages: [
    {
      id: "diag_syllables",
      category: "Reconocimiento de sílabas",
      instruction: "Escucha o lee la sílaba y elige la opción correcta.",
      items: [
        {
          id: "syl_1",
          type: "listen_choose",
          target: "MA",
          audioText: "Sílaba MA como en mamá",
          options: ["MA", "PA", "SA", "LA"],
          correct: "MA",
          hint: "Es la sílaba de 'mamá' o 'mano'."
        },
        {
          id: "syl_2",
          type: "choose_start",
          question: "¿Con qué sílaba empieza la palabra 'PELOTA'?",
          targetWord: "PELOTA",
          options: ["PA", "PE", "PI", "PO"],
          correct: "PE",
          hint: "Di 'pe-lo-ta' despacio: pe..."
        },
        {
          id: "syl_3",
          type: "match_sound",
          target: "SO",
          audioText: "Sílaba SO como en sol",
          options: ["SO", "TO", "RO", "LO"],
          correct: "SO",
          hint: "Empieza como 'sopa' o 'sol'."
        }
      ]
    },
    {
      id: "diag_words",
      category: "Reconocimiento de palabras",
      instruction: "Lee cada palabra y selecciona la opción correcta.",
      items: [
        {
          id: "wrd_1",
          type: "word_identify",
          question: "¿Qué palabra está escrita aquí?",
          word: "LUNA",
          options: ["LUNA", "LOMA", "LANA", "LIMA"],
          correct: "LUNA",
          hint: "Tiene la 'U' y la 'A': LU - NA."
        },
        {
          id: "wrd_2",
          type: "word_meaning",
          question: "Elige la palabra que nombra al alimento típico del Perú:",
          options: ["PAPA", "PIPA", "PUMA", "POZO"],
          correct: "PAPA",
          hint: "Se cultiva en los Andes y acompaña nuestras comidas."
        },
        {
          id: "wrd_3",
          type: "word_match",
          question: "¿Cuál de estas palabras es un animal de los Andes?",
          options: ["VICUÑA", "VECINA", "VENTANA", "VIOLETA"],
          correct: "VICUÑA",
          hint: "Tiene lana fina y corre libre en las punas peruanas."
        }
      ]
    },
    {
      id: "diag_sentences",
      category: "Lectura de frases",
      instruction: "Lee la frase con atención.",
      items: [
        {
          id: "sent_1",
          type: "sentence_meaning",
          sentence: "El sol brilla sobre las montañas del Cusco.",
          question: "¿Qué brilla sobre las montañas?",
          options: ["El sol", "La luna", "Una estrella", "El río"],
          correct: "El sol",
          hint: "Revisa la primera palabra de la frase."
        },
        {
          id: "sent_2",
          type: "sentence_complete",
          sentence: "El cóndor vuela alto en el _____ azul.",
          question: "¿Qué palabra completa mejor la frase?",
          options: ["cielo", "suelo", "mar", "bosque"],
          correct: "cielo",
          hint: "El cóndor tiene alas grandes y vuela por el aire."
        }
      ]
    },
    {
      id: "diag_text",
      category: "Lectura de texto breve y comprensión básica",
      instruction: "Lee este texto breve sobre un hermoso animal peruano.",
      text: "El gallito de las rocas es el ave nacional del Perú. Vive en los bosques nublados de la selva alta. Su plumaje es de color rojo brillante y tiene una cresta muy vistosa.",
      items: [
        {
          id: "comp_1",
          type: "literal",
          question: "¿De qué color es el plumaje del gallito de las rocas?",
          options: ["Rojo brillante", "Azul oscuro", "Verde selva", "Amarillo oro"],
          correct: "Rojo brillante",
          hint: "En la última oración dice: 'Su plumaje es de color...'."
        },
        {
          id: "comp_2",
          type: "literal",
          question: "¿Dónde vive el gallito de las rocas según el texto?",
          options: [
            "En los bosques nublados de la selva alta",
            "En las playas del mar de Grau",
            "En el desierto de Ica",
            "En la nieve de la montaña"
          ],
          correct: "En los bosques nublados de la selva alta",
          hint: "Mira la segunda oración del texto."
        }
      ]
    }
  ]
};

/**
 * Evalúa los resultados de la prueba diagnóstica y asigna el nivel
 * @param {Object} answers { syl_1: "MA", ... }
 * @returns {Object} Diagnóstico con nivel, porcentaje y retroalimentación pedagógica
 */
function evaluateDiagnostic(answers) {
  let totalItems = 0;
  let correctCount = 0;
  const stageResults = {};

  DIAGNOSTIC_TEST.stages.forEach(stage => {
    let stageTotal = 0;
    let stageCorrect = 0;

    stage.items.forEach(item => {
      totalItems++;
      stageTotal++;
      if (answers[item.id] === item.correct) {
        correctCount++;
        stageCorrect++;
      }
    });

    stageResults[stage.id] = {
      category: stage.category,
      correct: stageCorrect,
      total: stageTotal,
      percentage: Math.round((stageCorrect / stageTotal) * 100)
    };
  });

  const overallPercentage = Math.round((correctCount / totalItems) * 100);

  // Determinación de nivel pedagógico
  let assignedLevel = "INICIO";
  let badgeColor = "🟢";
  let levelTitle = "Nivel Inicio";
  let explanation = "";
  let initialStage = 1;

  if (overallPercentage >= 80) {
    assignedLevel = "AVANZADO";
    badgeColor = "🔴";
    levelTitle = "Nivel Avanzado";
    explanation = "¡Excelente lectura y comprensión! Tienes gran fluidez. Comenzaremos en 🔴 Avanzado para desafiar tu pensamiento crítico y explorar historias fascinantes.";
  } else if (overallPercentage >= 50) {
    assignedLevel = "DESARROLLO";
    badgeColor = "🟡";
    levelTitle = "Nivel Desarrollo";
    explanation = "¡Muy buen trabajo! Ya lees palabras y oraciones completas. Comenzaremos en 🟡 Desarrollo para fortalecer tu comprensión, fluidez y disfrutar de cuentos y biografías del Perú.";
  } else {
    assignedLevel = "INICIO";
    badgeColor = "🟢";
    levelTitle = "Nivel Inicio";
    explanation = "¡Bienvenido a tu aventura! Comenzaremos en 🟢 Inicio. Aquí podrás practicar paso a paso con sílabas y palabras, y avanzar a tu propio ritmo con la ayuda de Leo.";
    
    // Si domina sílabas pero no palabras completas
    if (stageResults["diag_syllables"] && stageResults["diag_syllables"].percentage >= 66) {
      initialStage = 2; // Palabras sencillas
    } else {
      initialStage = 1; // Sílabas
    }
  }

  return {
    assignedLevel,
    badgeColor,
    levelTitle,
    overallPercentage,
    correctCount,
    totalItems,
    stageResults,
    initialStage,
    explanation,
    date: new Date().toISOString()
  };
}

if (typeof module !== 'undefined') {
  module.exports = { DIAGNOSTIC_TEST, evaluateDiagnostic };
}
