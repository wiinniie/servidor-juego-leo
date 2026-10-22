/**
 * LEO – Lectura, Escritura y Oralidad
 * Servicio de Audio y Voz
 * 
 * - Síntesis de Efectos de Sonido con Web Audio API (cero dependencias de archivos externos).
 * - Lectura en voz alta mediante Web Speech API (SpeechSynthesis) en español latinoamericano.
 * - Reconocimiento de voz para oralidad ("Cuéntale a Leo") con Web Speech API (SpeechRecognition).
 */

class AudioService {
  constructor() {
    this.soundEnabled = true;
    this.audioCtx = null;
    this.synth = window.speechSynthesis || null;
    this.currentUtterance = null;
    this.isReadingAloud = false;
    this.speechRecognition = null;
    this.isListeningOrality = false;

    this.initAudioContext();
    this.initSpeechRecognition();
  }

  initAudioContext() {
    try {
      const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
      if (AudioCtxClass) {
        this.audioCtx = new AudioCtxClass();
      }
    } catch (e) {
      console.warn("AudioContext no disponible:", e);
    }
  }

  ensureAudioContext() {
    if (this.audioCtx && this.audioCtx.state === "suspended") {
      this.audioCtx.resume();
    }
  }

  toggleSound() {
    this.soundEnabled = !this.soundEnabled;
    if (!this.soundEnabled) {
      this.stopReading();
    }
    return this.soundEnabled;
  }

  // --- EFECTOS DE SONIDO SINTETIZADOS (Web Audio API) ---

  playBeep(freq, type = "sine", duration = 0.15, gainVal = 0.1) {
    if (!this.soundEnabled || !this.audioCtx) return;
    this.ensureAudioContext();

    try {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);

      gain.gain.setValueAtTime(gainVal, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start();
      osc.stop(this.audioCtx.currentTime + duration);
    } catch (e) {
      // Ignorar silenciosamente si no hay soporte
    }
  }

  playClick() {
    this.playBeep(480, "sine", 0.06, 0.08);
  }

  playSuccess() {
    if (!this.soundEnabled || !this.audioCtx) return;
    this.ensureAudioContext();

    const notes = [523.25, 659.25, 783.99, 1046.50]; // Do, Mi, Sol, Do agudo
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playBeep(freq, "triangle", 0.18, 0.12);
      }, idx * 70);
    });
  }

  playSoftError() {
    if (!this.soundEnabled || !this.audioCtx) return;
    this.ensureAudioContext();

    // Tono suave y cálido que no penaliza al niño
    const notes = [370, 311]; // Fa#, Re#
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playBeep(freq, "sine", 0.22, 0.08);
      }, idx * 120);
    });
  }

  playComodin() {
    if (!this.soundEnabled || !this.audioCtx) return;
    this.ensureAudioContext();

    const notes = [440, 554.37, 659.25, 880];
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playBeep(freq, "sine", 0.2, 0.1);
      }, idx * 60);
    });
  }

  playSpinTick() {
    this.playBeep(600 + Math.random() * 200, "triangle", 0.04, 0.05);
  }

  playFanfare() {
    if (!this.soundEnabled || !this.audioCtx) return;
    this.ensureAudioContext();

    const melody = [
      { f: 523.25, d: 120 },
      { f: 659.25, d: 120 },
      { f: 783.99, d: 140 },
      { f: 1046.5, d: 350 }
    ];
    let time = 0;
    melody.forEach(item => {
      setTimeout(() => {
        this.playBeep(item.f, "triangle", item.d / 1000, 0.15);
      }, time);
      time += item.d + 30;
    });
  }

  // --- LECTURA EN VOZ ALTA (SpeechSynthesis) ---

  speak(text, options = {}) {
    if (!this.synth) {
      console.warn("SpeechSynthesis no soportado.");
      if (options.onEnd) options.onEnd();
      return;
    }

    this.stopReading();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = options.lang || "es-PE";
    utterance.rate = options.rate || 0.88; // Ritmo amigable para estudiantes de primaria
    utterance.pitch = options.pitch || 1.05; // Tono alegre

    // Selección de voz en español preferentemente latinoamericana
    const voices = this.synth.getVoices();
    const esVoice = voices.find(v => v.lang.startsWith("es-PE")) ||
                    voices.find(v => v.lang.startsWith("es-419")) ||
                    voices.find(v => v.lang.startsWith("es-MX")) ||
                    voices.find(v => v.lang.startsWith("es"));
    if (esVoice) {
      utterance.voice = esVoice;
    }

    utterance.onstart = () => {
      this.isReadingAloud = true;
      if (options.onStart) options.onStart();
    };

    utterance.onend = () => {
      this.isReadingAloud = false;
      this.currentUtterance = null;
      if (options.onEnd) options.onEnd();
    };

    utterance.onerror = (e) => {
      this.isReadingAloud = false;
      this.currentUtterance = null;
      if (options.onError) options.onError(e);
    };

    if (options.onBoundary) {
      utterance.onboundary = options.onBoundary;
    }

    this.currentUtterance = utterance;
    this.synth.speak(utterance);
  }

  stopReading() {
    if (this.synth) {
      this.synth.cancel();
      this.isReadingAloud = false;
      this.currentUtterance = null;
    }
  }

  pauseReading() {
    if (this.synth && this.isReadingAloud) {
      this.synth.pause();
    }
  }

  resumeReading() {
    if (this.synth) {
      this.synth.resume();
    }
  }

  // --- ORALIDAD Y RECONOCIMIENTO DE VOZ ("Cuéntale a Leo") ---

  initSpeechRecognition() {
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRec) {
      try {
        this.speechRecognition = new SpeechRec();
        this.speechRecognition.lang = "es-PE";
        this.speechRecognition.continuous = false;
        this.speechRecognition.interimResults = true;
      } catch (e) {
        console.warn("Error iniciando SpeechRecognition:", e);
      }
    }
  }

  startOralRecording(callbacks = {}) {
    if (!this.speechRecognition) {
      // Fallback amigable si el navegador no soporta Web Speech Recognition
      if (callbacks.onUnavailable) {
        callbacks.onUnavailable("Tu navegador no soporta reconocimiento de voz nativo, pero puedes escribir tu respuesta o usar el simulador de micrófono de Leo.");
      }
      return false;
    }

    this.speechRecognition.onstart = () => {
      this.isListeningOrality = true;
      if (callbacks.onStart) callbacks.onStart();
    };

    this.speechRecognition.onresult = (event) => {
      let finalTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }
      if (callbacks.onResult) {
        callbacks.onResult(finalTranscript || event.results[0][0].transcript);
      }
    };

    this.speechRecognition.onerror = (event) => {
      this.isListeningOrality = false;
      if (callbacks.onError) callbacks.onError(event.error);
    };

    this.speechRecognition.onend = () => {
      this.isListeningOrality = false;
      if (callbacks.onEnd) callbacks.onEnd();
    };

    try {
      this.speechRecognition.start();
      return true;
    } catch (e) {
      console.warn("No se pudo iniciar grabación:", e);
      if (callbacks.onError) callbacks.onError(e);
      return false;
    }
  }

  stopOralRecording() {
    if (this.speechRecognition && this.isListeningOrality) {
      this.speechRecognition.stop();
      this.isListeningOrality = false;
    }
  }
}

// Instancia global
window.audioService = new AudioService();
