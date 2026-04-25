import { useState, useEffect, useRef } from "react";
import { supabase } from "./supabase.js";

const SECTIONS = [
  { id: 1, title: "Perfil del Atleta", icon: "🏋️" },
  { id: 2, title: "Uso de Tecnología", icon: "📱" },
  { id: 3, title: "Datos y Métricas", icon: "📊" },
  { id: 4, title: "Comunidad", icon: "🤝" },
  { id: 5, title: "Experiencia", icon: "⚡" },
  { id: 6, title: "Modelo", icon: "💰" },
  { id: 7, title: "Feedback", icon: "💬" },
];

const QUESTIONS = [
  { id: 1, section: 1, type: "single", text: "¿Hace cuánto tiempo entrenás CrossFit?", options: ["Menos de 6 meses", "6 meses a 1 año", "1 a 3 años", "Más de 3 años"] },
  { id: 2, section: 1, type: "single", text: "¿Cuántas veces por semana entrenás?", options: ["1-2 veces", "3-4 veces", "5-6 veces", "Todos los días"] },
  { id: 3, section: 1, type: "multi", text: "¿Cuál es tu objetivo principal?", hint: "Podés marcar más de una", options: ["Ganar fuerza", "Mejorar técnica / skill", "Bajar de peso / recomposición corporal", "Salud general / bienestar", "Competir"] },
  { id: 4, section: 2, type: "single", text: "¿Usás alguna app para registrar tus entrenamientos?", options: ["Sí, uso una app", "No, uso cuaderno / papel", "No, uso notas del celular", "No registro nada"] },
  { id: 5, section: 2, type: "open", text: "Si usás o usaste alguna app, ¿cuál es el nombre?" },
  { id: 7, section: 2, type: "multi", text: "¿Por qué dejaste de usar una app de entrenamiento?", hint: "Si aplica. Podés marcar más de una.", options: ["Era muy complicada", "No tenía los ejercicios que hago", "Era paga / muy cara", "Me llevaba mucho tiempo cargar datos", "No me aportaba valor real", "Nunca dejé de usarla / No aplica"] },
  { id: 8, section: 3, type: "multi", text: "¿Qué datos te parece importante registrar de cada entrenamiento?", hint: "Marcá todas las que apliquen", options: ["Peso utilizado (kg/lb)", "Repeticiones y series", "RM (repetición máxima)", "Porcentajes del RM (80%, 70%...)", "Tiempo del WOD / AMRAP / EMOM", "Rondas completadas", "Músculos trabajados", "Tipo de equipamiento (KB, DB, wallball, barbell)", "Sensación / RPE (esfuerzo percibido)", "Notas personales"] },
  { id: 9, section: 3, type: "multi", text: "¿Qué ejercicios son los más importantes para vos trackear?", options: ["Back Squat / Front Squat", "Deadlift", "Clean & Jerk / Snatch", "Press / Push Press / Push Jerk", "Bench Press", "Kettlebell Swings / Turkish Get Up", "Wallball Shots", "Dumbbell movements", "Gimnasia (pull-ups, muscle-ups, HSPU)", "Cardio (row, bike, run, ski)"] },
  { id: 10, section: 3, type: "single", text: "¿Te resultaría útil que la app calcule automáticamente los porcentajes de tu RM?", hint: "Ej: ingresás tu RM de Back Squat y la app te muestra el 80%, 70%, etc.", options: ["Sí, sería muy útil", "Estaría bueno pero no es esencial", "No lo necesito"] },
  { id: 11, section: 3, type: "single", text: "¿Te gustaría ver qué músculos trabajaste en la semana?", options: ["Sí, me ayudaría a equilibrar", "Me es indiferente", "No me interesa"] },
  { id: 12, section: 4, type: "single", text: "¿Te gustaría compartir tus avances con compañeros del box?", options: ["Sí, me motiva que vean mi progreso", "Solo con algunos amigos cercanos", "Prefiero que sea privado"] },
  { id: 13, section: 4, type: "multi", text: "¿Qué te gustaría compartir o ver de otros?", hint: "Podés marcar más de una", options: ["PRs / Records personales", "Resultados de WODs", "Evolución de fuerza (gráficos)", "Rachas de asistencia (streaks)", "Ranking / leaderboard del box", "Fotos o videos de logros", "Nada, prefiero no compartir"] },
  { id: 14, section: 4, type: "multi", text: "¿Usás redes sociales para compartir tu entrenamiento?", options: ["Sí, Instagram stories", "Sí, grupos de WhatsApp del box", "Sí, otra red", "No comparto nada"] },
  { id: 15, section: 4, type: "single", text: "¿Te motivaría un sistema de logros o desafíos?", hint: 'Ej: "10 WODs seguidos", "Nuevo PR en Deadlift", desafíos semanales.', options: ["Sí, me encantaría", "Puede estar pero no es prioridad", "No me interesa"] },
  { id: 16, section: 5, type: "single", text: "¿Cuánto tiempo máximo le dedicarías a cargar un entrenamiento?", options: ["Menos de 1 minuto", "1 a 3 minutos", "3 a 5 minutos", "Lo que sea necesario si es útil"] },
  { id: 17, section: 5, type: "single", text: "¿En qué momento cargarías los datos?", options: ["Durante el entrenamiento (entre series)", "Apenas termino de entrenar", "Al llegar a casa", "Cuando me acuerdo / a veces"] },
  { id: 18, section: 5, type: "scale", text: "¿Qué tan importante es cada funcionalidad?", hint: "1 = Nada importante / 5 = Imprescindible", items: ["Calculadora de RM y %", "Historial de pesos por ejercicio", "Gráficos de progreso", "Mapa muscular semanal", "Timer para WODs / EMOMs", "Compartir PRs con el box", "Leaderboard / ranking", "Registro rápido (pocos clics)", "Funcionar offline", "Exportar datos (PDF/Excel)"] },
  { id: 19, section: 6, type: "single", text: "¿Pagarías por una app de tracking de CrossFit?", options: ["Sí, si es realmente buena", "Solo si tiene versión gratuita con lo básico", "No, solo usaría una app gratis"] },
  { id: 20, section: 6, type: "single", text: "¿Cuánto pagarías por mes por una app premium?", options: ["Hasta $2.000 ARS / mes", "$2.000 - $5.000 ARS / mes", "Más de $5.000 ARS / mes si lo vale", "Prefiero pago único"] },
  { id: 21, section: 7, type: "open", text: "¿Qué funcionalidad soñás para una app de CrossFit que no existe hoy?" },
  { id: 22, section: 7, type: "open", text: "¿Hay algo que te frustre de cómo trackeás tus entrenamientos hoy?" },
  { id: 23, section: 7, type: "beta", text: "¿Te gustaría participar en una prueba beta de la app?", options: ["¡Sí!", "No, gracias"] },
];

// ─── RESULTS PASSWORD (cambiá esto por tu contraseña) ───
const ADMIN_PASSWORD = "xx";

export default function App() {
  const [view, setView] = useState("form");
  const [currentSection, setCurrentSection] = useState(1);
  const [answers, setAnswers] = useState({});
  const [betaContact, setBetaContact] = useState("");
  const [allResponses, setAllResponses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [adminPass, setAdminPass] = useState("");
  const [authError, setAuthError] = useState(false);
  const contentRef = useRef(null);

  useEffect(() => {
    if (contentRef.current) contentRef.current.scrollTop = 0;
  }, [currentSection]);

  // Check URL for admin route
  useEffect(() => {
    if (window.location.hash === "#resultados") {
      setView("login");
    }
  }, []);

  const setAnswer = (qId, value) => setAnswers(prev => ({ ...prev, [qId]: value }));

  const toggleMulti = (qId, option) => {
    setAnswers(prev => {
      const current = prev[qId] || [];
      return { ...prev, [qId]: current.includes(option) ? current.filter(o => o !== option) : [...current, option] };
    });
  };

  const setScale = (qId, item, value) => {
    setAnswers(prev => ({ ...prev, [qId]: { ...(prev[qId] || {}), [item]: value } }));
  };

  const sectionQuestions = QUESTIONS.filter(q => q.section === currentSection);
  const totalSections = SECTIONS.length;

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const { error } = await supabase.from("responses").insert({
        answers: answers,
        beta_contact: betaContact || null,
      });
      if (error) throw error;
      setView("thanks");
    } catch (err) {
      console.error("Error guardando respuesta:", err);
      alert("Hubo un error al enviar. Intentá de nuevo.");
    }
    setSubmitting(false);
  };

  const loadResults = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("responses")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      setAllResponses(data || []);
    } catch (err) {
      console.error("Error cargando resultados:", err);
      setAllResponses([]);
    }
    setLoading(false);
    setView("results");
  };

  const handleLogin = () => {
    if (adminPass === ADMIN_PASSWORD) {
      setAuthError(false);
      loadResults();
    } else {
      setAuthError(true);
    }
  };

  // ─── LOGIN VIEW ───
  if (view === "login") {
    return (
      <div style={{ minHeight: "100vh", background: "#0a0a0f", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", padding: 40, maxWidth: 360 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🔒</div>
          <h2 style={{ fontFamily: "Outfit", fontSize: 24, color: "#ff3a5c", marginBottom: 8 }}>Acceso a resultados</h2>
          <p style={{ color: "#666", fontSize: 14, marginBottom: 24 }}>Ingresá la contraseña de administrador</p>
          <input
            type="password"
            value={adminPass}
            onChange={e => { setAdminPass(e.target.value); setAuthError(false); }}
            onKeyDown={e => e.key === "Enter" && handleLogin()}
            placeholder="Contraseña..."
            style={{ width: "100%", padding: 14, borderRadius: 10, border: authError ? "1.5px solid #ff3a5c" : "1.5px solid #1f1f2e", background: "#12121a", color: "#ddd", fontSize: 15, fontFamily: "inherit", marginBottom: 12, outline: "none", boxSizing: "border-box" }}
          />
          {authError && <p style={{ color: "#ff3a5c", fontSize: 13, marginBottom: 12 }}>Contraseña incorrecta</p>}
          <button onClick={handleLogin} style={{ width: "100%", padding: 14, borderRadius: 10, background: "#ff3a5c", color: "#fff", border: "none", fontSize: 15, fontWeight: 700, cursor: "pointer" }}>Entrar</button>
          <button onClick={() => { setView("form"); window.location.hash = ""; }} style={{ display: "block", margin: "16px auto 0", background: "none", border: "none", color: "#555", fontSize: 13, cursor: "pointer", textDecoration: "underline" }}>Volver al formulario</button>
        </div>
      </div>
    );
  }

  // ─── RESULTS VIEW ───
  if (view === "results") {
    if (loading) {
      return (
        <div style={{ minHeight: "100vh", background: "#0a0a0f", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <p style={{ color: "#666", fontSize: 16 }}>Cargando resultados...</p>
        </div>
      );
    }

    const total = allResponses.length;
    const countSingle = (qId) => {
      const q = QUESTIONS.find(x => x.id === qId);
      const counts = {};
      (q.options || []).forEach(o => counts[o] = 0);
      allResponses.forEach(r => { if (r.answers[qId]) counts[r.answers[qId]] = (counts[r.answers[qId]] || 0) + 1; });
      return counts;
    };
    const countMulti = (qId) => {
      const q = QUESTIONS.find(x => x.id === qId);
      const counts = {};
      (q.options || []).forEach(o => counts[o] = 0);
      allResponses.forEach(r => { (r.answers[qId] || []).forEach(o => counts[o] = (counts[o] || 0) + 1); });
      return counts;
    };
    const avgScale = (qId, item) => {
      const vals = allResponses.map(r => r.answers[qId]?.[item]).filter(Boolean);
      return vals.length ? (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1) : "—";
    };
    const openAnswers = (qId) => allResponses.map(r => r.answers[qId]).filter(Boolean);
    const betaList = allResponses.filter(r => r.answers[23] === "¡Sí!" && r.beta_contact).map(r => r.beta_contact);

    return (
      <div style={{ minHeight: "100vh", background: "#0a0a0f", color: "#e0e0e0" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", padding: "24px 16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32, flexWrap: "wrap", gap: 12 }}>
            <div>
              <h1 style={{ fontFamily: "Outfit", fontSize: 28, color: "#ff3a5c", margin: 0 }}>Resultados</h1>
              <p style={{ color: "#888", margin: "4px 0 0", fontSize: 14 }}>{total} respuesta{total !== 1 ? "s" : ""}</p>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={loadResults} style={{ padding: "8px 16px", background: "#1a1a2e", color: "#aaa", border: "1px solid #1f1f2e", borderRadius: 8, cursor: "pointer", fontSize: 13 }}>🔄 Refrescar</button>
              <button onClick={() => { setView("form"); setAnswers({}); setCurrentSection(1); setBetaContact(""); window.location.hash = ""; }} style={{ padding: "8px 16px", background: "#ff3a5c", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 600 }}>Volver al form</button>
            </div>
          </div>

          {total === 0 ? (
            <div style={{ textAlign: "center", padding: 60, color: "#666" }}>
              <p style={{ fontSize: 48, margin: 0 }}>📭</p>
              <p style={{ marginTop: 12 }}>Todavía no hay respuestas.</p>
            </div>
          ) : (
            QUESTIONS.map(q => {
              if (q.type === "single") {
                const counts = countSingle(q.id);
                const max = Math.max(...Object.values(counts), 1);
                return (
                  <div key={q.id} style={{ background: "#12121a", borderRadius: 12, padding: 20, marginBottom: 16, border: "1px solid #1f1f2e" }}>
                    <p style={{ fontWeight: 600, marginBottom: 12, fontSize: 14, color: "#ccc" }}>{q.id}. {q.text}</p>
                    {Object.entries(counts).map(([opt, count]) => (
                      <div key={opt} style={{ marginBottom: 8 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 3 }}>
                          <span style={{ color: "#aaa" }}>{opt}</span>
                          <span style={{ color: "#ff3a5c", fontWeight: 600 }}>{count} ({total > 0 ? Math.round(count / total * 100) : 0}%)</span>
                        </div>
                        <div style={{ height: 6, background: "#1a1a2e", borderRadius: 3, overflow: "hidden" }}>
                          <div style={{ width: `${(count / max) * 100}%`, height: "100%", background: "linear-gradient(90deg, #ff3a5c, #ff6b81)", borderRadius: 3, transition: "width 0.5s" }} />
                        </div>
                      </div>
                    ))}
                  </div>
                );
              }
              if (q.type === "multi") {
                const counts = countMulti(q.id);
                const max = Math.max(...Object.values(counts), 1);
                return (
                  <div key={q.id} style={{ background: "#12121a", borderRadius: 12, padding: 20, marginBottom: 16, border: "1px solid #1f1f2e" }}>
                    <p style={{ fontWeight: 600, marginBottom: 12, fontSize: 14, color: "#ccc" }}>{q.id}. {q.text}</p>
                    {Object.entries(counts).sort((a, b) => b[1] - a[1]).map(([opt, count]) => (
                      <div key={opt} style={{ marginBottom: 8 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 3 }}>
                          <span style={{ color: "#aaa" }}>{opt}</span>
                          <span style={{ color: "#ff3a5c", fontWeight: 600 }}>{count}</span>
                        </div>
                        <div style={{ height: 6, background: "#1a1a2e", borderRadius: 3, overflow: "hidden" }}>
                          <div style={{ width: `${(count / max) * 100}%`, height: "100%", background: "linear-gradient(90deg, #ff3a5c, #ff6b81)", borderRadius: 3 }} />
                        </div>
                      </div>
                    ))}
                  </div>
                );
              }
              if (q.type === "scale") {
                const sorted = [...q.items].sort((a, b) => {
                  const va = parseFloat(avgScale(q.id, a)) || 0;
                  const vb = parseFloat(avgScale(q.id, b)) || 0;
                  return vb - va;
                });
                return (
                  <div key={q.id} style={{ background: "#12121a", borderRadius: 12, padding: 20, marginBottom: 16, border: "1px solid #1f1f2e" }}>
                    <p style={{ fontWeight: 600, marginBottom: 4, fontSize: 14, color: "#ccc" }}>{q.id}. {q.text}</p>
                    <p style={{ fontSize: 12, color: "#666", marginBottom: 12 }}>Ranking por promedio (mayor a menor)</p>
                    {sorted.map((item, idx) => {
                      const avg = avgScale(q.id, item);
                      const pct = avg !== "—" ? (parseFloat(avg) / 5) * 100 : 0;
                      return (
                        <div key={item} style={{ marginBottom: 10 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 3 }}>
                            <span style={{ color: "#aaa" }}>{idx + 1}. {item}</span>
                            <span style={{ color: "#ffb347", fontWeight: 700, fontSize: 15 }}>{avg}</span>
                          </div>
                          <div style={{ height: 6, background: "#1a1a2e", borderRadius: 3, overflow: "hidden" }}>
                            <div style={{ width: `${pct}%`, height: "100%", background: "linear-gradient(90deg, #ffb347, #ff3a5c)", borderRadius: 3 }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              }
              if (q.type === "open") {
                const ans = openAnswers(q.id);
                return (
                  <div key={q.id} style={{ background: "#12121a", borderRadius: 12, padding: 20, marginBottom: 16, border: "1px solid #1f1f2e" }}>
                    <p style={{ fontWeight: 600, marginBottom: 12, fontSize: 14, color: "#ccc" }}>{q.id}. {q.text}</p>
                    {ans.length === 0 ? <p style={{ color: "#555", fontSize: 13, fontStyle: "italic" }}>Sin respuestas</p> : ans.map((a, i) => (
                      <div key={i} style={{ padding: "8px 12px", background: "#0a0a0f", borderRadius: 8, marginBottom: 6, fontSize: 13, color: "#bbb", borderLeft: "3px solid #ff3a5c33" }}>"{a}"</div>
                    ))}
                  </div>
                );
              }
              if (q.type === "beta") {
                return (
                  <div key={q.id} style={{ background: "#12121a", borderRadius: 12, padding: 20, marginBottom: 16, border: "1px solid #1f1f2e" }}>
                    <p style={{ fontWeight: 600, marginBottom: 12, fontSize: 14, color: "#ccc" }}>{q.id}. Beta Testers</p>
                    {betaList.length === 0 ? <p style={{ color: "#555", fontSize: 13 }}>Nadie se anotó todavía</p> : betaList.map((c, i) => (
                      <div key={i} style={{ padding: "6px 12px", background: "#0a0a0f", borderRadius: 8, marginBottom: 4, fontSize: 13, color: "#bbb" }}>📩 {c}</div>
                    ))}
                  </div>
                );
              }
              return null;
            })
          )}
        </div>
      </div>
    );
  }

  // ─── THANKS VIEW ───
  if (view === "thanks") {
    return (
      <div style={{ minHeight: "100vh", background: "#0a0a0f", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", padding: 40, maxWidth: 420 }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>💪</div>
          <h1 style={{ fontFamily: "Outfit", fontSize: 32, color: "#ff3a5c", marginBottom: 8 }}>¡Gracias!</h1>
          <p style={{ color: "#999", fontSize: 16, lineHeight: 1.6, marginBottom: 32 }}>Tu feedback es clave para construir una app que realmente sirva en el box.</p>
          <button onClick={() => { setView("form"); setAnswers({}); setCurrentSection(1); setBetaContact(""); }} style={{ padding: "12px 24px", background: "#1a1a2e", color: "#ff3a5c", border: "1px solid #ff3a5c44", borderRadius: 10, cursor: "pointer", fontWeight: 600, fontSize: 14 }}>Enviar otra respuesta</button>
        </div>
      </div>
    );
  }

  // ─── FORM VIEW ───
  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0f" }}>
      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #12121a 0%, #1a1a2e 100%)", borderBottom: "1px solid #1f1f2e", padding: "20px 16px 16px" }}>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <h1 style={{ fontFamily: "Outfit", fontSize: 22, color: "#ff3a5c", margin: 0, letterSpacing: "-0.5px" }}>Encuesta CrossFit</h1>
          <p style={{ color: "#666", fontSize: 13, margin: "4px 0 12px" }}>App de Tracking — Investigación de usuarios</p>

          {/* Progress */}
          <div style={{ display: "flex", gap: 4, marginBottom: 8 }}>
            {SECTIONS.map(s => (
              <div key={s.id} style={{ flex: 1, height: 4, borderRadius: 2, background: s.id <= currentSection ? "#ff3a5c" : "#1f1f2e", transition: "background 0.3s" }} />
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 12, color: "#555" }}>Sección {currentSection} de {totalSections}</span>
            <span style={{ fontSize: 12, color: "#ff3a5c", fontWeight: 600 }}>{SECTIONS[currentSection - 1]?.icon} {SECTIONS[currentSection - 1]?.title}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div ref={contentRef} style={{ maxWidth: 600, margin: "0 auto", padding: "24px 16px 120px" }}>
        {sectionQuestions.map(q => (
          <div key={q.id} style={{ background: "#12121a", borderRadius: 14, padding: 20, marginBottom: 16, border: "1px solid #1f1f2e" }}>
            <p style={{ fontSize: 15, fontWeight: 600, color: "#e0e0e0", marginBottom: 4, lineHeight: 1.4 }}>{q.text}</p>
            {q.hint && <p style={{ fontSize: 12, color: "#666", marginBottom: 12, fontStyle: "italic" }}>{q.hint}</p>}

            {q.type === "single" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 8 }}>
                {q.options.map(opt => (
                  <button key={opt} onClick={() => setAnswer(q.id, opt)} style={{
                    padding: "12px 16px", borderRadius: 10, border: answers[q.id] === opt ? "1.5px solid #ff3a5c" : "1.5px solid #1f1f2e",
                    background: answers[q.id] === opt ? "#ff3a5c11" : "#0a0a0f", color: answers[q.id] === opt ? "#ff6b81" : "#aaa",
                    fontSize: 14, textAlign: "left", cursor: "pointer", transition: "all 0.2s", fontWeight: answers[q.id] === opt ? 600 : 400,
                  }}>
                    <span style={{ display: "inline-block", width: 18, height: 18, borderRadius: "50%", border: answers[q.id] === opt ? "5px solid #ff3a5c" : "2px solid #333", marginRight: 10, verticalAlign: "middle", background: answers[q.id] === opt ? "#0a0a0f" : "transparent", transition: "all 0.2s", boxSizing: "border-box" }} />
                    {opt}
                  </button>
                ))}
              </div>
            )}

            {q.type === "multi" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 8 }}>
                {q.options.map(opt => {
                  const selected = (answers[q.id] || []).includes(opt);
                  return (
                    <button key={opt} onClick={() => toggleMulti(q.id, opt)} style={{
                      padding: "12px 16px", borderRadius: 10, border: selected ? "1.5px solid #ff3a5c" : "1.5px solid #1f1f2e",
                      background: selected ? "#ff3a5c11" : "#0a0a0f", color: selected ? "#ff6b81" : "#aaa",
                      fontSize: 14, textAlign: "left", cursor: "pointer", transition: "all 0.2s", fontWeight: selected ? 600 : 400,
                    }}>
                      <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 18, height: 18, borderRadius: 4, border: selected ? "none" : "2px solid #333", marginRight: 10, verticalAlign: "middle", background: selected ? "#ff3a5c" : "transparent", fontSize: 11, color: "#fff", transition: "all 0.2s", boxSizing: "border-box" }}>
                        {selected ? "✓" : ""}
                      </span>
                      {opt}
                    </button>
                  );
                })}
              </div>
            )}

            {q.type === "open" && (
              <textarea value={answers[q.id] || ""} onChange={e => setAnswer(q.id, e.target.value)} placeholder="Escribí tu respuesta acá..." rows={3} style={{
                width: "100%", padding: 14, borderRadius: 10, border: "1.5px solid #1f1f2e", background: "#0a0a0f", color: "#ddd", fontSize: 14, resize: "vertical", fontFamily: "inherit", marginTop: 8, boxSizing: "border-box", outline: "none",
              }} onFocus={e => e.target.style.borderColor = "#ff3a5c55"} onBlur={e => e.target.style.borderColor = "#1f1f2e"} />
            )}

            {q.type === "scale" && (
              <div style={{ marginTop: 8 }}>
                {q.items.map(item => (
                  <div key={item} style={{ marginBottom: 14 }}>
                    <p style={{ fontSize: 13, color: "#aaa", marginBottom: 6 }}>{item}</p>
                    <div style={{ display: "flex", gap: 6 }}>
                      {[1, 2, 3, 4, 5].map(n => (
                        <button key={n} onClick={() => setScale(q.id, item, n)} style={{
                          flex: 1, padding: "8px 0", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 0.2s",
                          border: answers[q.id]?.[item] === n ? "1.5px solid #ff3a5c" : "1.5px solid #1f1f2e",
                          background: answers[q.id]?.[item] === n ? "#ff3a5c" : "#0a0a0f",
                          color: answers[q.id]?.[item] === n ? "#fff" : "#666",
                        }}>{n}</button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {q.type === "beta" && (
              <div style={{ marginTop: 8 }}>
                <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                  {q.options.map(opt => (
                    <button key={opt} onClick={() => setAnswer(q.id, opt)} style={{
                      flex: 1, padding: 12, borderRadius: 10, border: answers[q.id] === opt ? "1.5px solid #ff3a5c" : "1.5px solid #1f1f2e",
                      background: answers[q.id] === opt ? "#ff3a5c11" : "#0a0a0f", color: answers[q.id] === opt ? "#ff3a5c" : "#aaa",
                      fontSize: 14, cursor: "pointer", fontWeight: answers[q.id] === opt ? 700 : 400, transition: "all 0.2s",
                    }}>{opt}</button>
                  ))}
                </div>
                {answers[q.id] === "¡Sí!" && (
                  <input value={betaContact} onChange={e => setBetaContact(e.target.value)} placeholder="Tu Instagram o WhatsApp..." style={{
                    width: "100%", padding: 14, borderRadius: 10, border: "1.5px solid #1f1f2e", background: "#0a0a0f", color: "#ddd", fontSize: 14, fontFamily: "inherit", boxSizing: "border-box", outline: "none",
                  }} onFocus={e => e.target.style.borderColor = "#ff3a5c55"} onBlur={e => e.target.style.borderColor = "#1f1f2e"} />
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Bottom Navigation */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "linear-gradient(transparent, #0a0a0f 20%)", padding: "40px 16px 20px" }}>
        <div style={{ maxWidth: 600, margin: "0 auto", display: "flex", gap: 12 }}>
          {currentSection > 1 && (
            <button onClick={() => setCurrentSection(s => s - 1)} style={{
              flex: 1, padding: 14, borderRadius: 12, background: "#1a1a2e", color: "#aaa", border: "1px solid #1f1f2e", fontSize: 15, fontWeight: 600, cursor: "pointer",
            }}>← Anterior</button>
          )}
          {currentSection < totalSections ? (
            <button onClick={() => setCurrentSection(s => s + 1)} style={{
              flex: 2, padding: 14, borderRadius: 12, background: "#ff3a5c", color: "#fff", border: "none", fontSize: 15, fontWeight: 700, cursor: "pointer",
            }}>Siguiente →</button>
          ) : (
            <button onClick={handleSubmit} disabled={submitting} style={{
              flex: 2, padding: 14, borderRadius: 12, background: submitting ? "#555" : "linear-gradient(135deg, #ff3a5c, #e92040)", color: "#fff", border: "none", fontSize: 15, fontWeight: 700, cursor: submitting ? "default" : "pointer",
            }}>{submitting ? "Enviando..." : "Enviar respuestas 🚀"}</button>
          )}
        </div>
      </div>
    </div>
  );
}
