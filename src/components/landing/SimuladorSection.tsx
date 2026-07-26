"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { NEGOCIOS } from "./negocios-data";
import { useLandingPrefill } from "./LandingProvider";

const CHAOS_DURATION_MS = 9000;
const CHAOS_TICK_MS = 240;
const MANUAL_DISABLE_AT_MS = 4400;
const CASCADE_STAGGER_MS = 220;

type Fase = "selector" | "caos" | "switch" | "cascade" | "resultado";

interface Popup {
  id: number;
  text: string;
  left: string;
  top: string;
}

let feedIdCounter = 0;

export function SimuladorSection() {
  const { setPrefill } = useLandingPrefill();

  const [fase, setFase] = useState<Fase>("selector");
  const [negocioId, setNegocioId] = useState<string | null>(null);
  const [tareaPendientes, setTareaPendientes] = useState<number[]>([]);
  const [tareaResuelta, setTareaResuelta] = useState<boolean[]>([]);
  const [mensajesSinResponder, setMensajesSinResponder] = useState(0);
  const [popups, setPopups] = useState<Popup[]>([]);
  const [popupsClosing, setPopupsClosing] = useState(false);
  const [manualDisabled, setManualDisabled] = useState(false);

  const timersRef = useRef<Array<ReturnType<typeof setTimeout>>>([]);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((t) => {
      clearTimeout(t);
      clearInterval(t);
    });
    timersRef.current = [];
  }, []);

  useEffect(() => clearTimers, [clearTimers]);

  const negocioActivo = NEGOCIOS.find((n) => n.id === negocioId) ?? null;

  function seleccionarNegocio(id: string) {
    clearTimers();
    const neg = NEGOCIOS.find((n) => n.id === id);
    if (!neg) return;

    setFase("caos");
    setNegocioId(id);
    setTareaPendientes(neg.tareas.map(() => 0));
    setTareaResuelta(neg.tareas.map(() => false));
    setMensajesSinResponder(0);
    setPopups([]);
    setPopupsClosing(false);
    setManualDisabled(false);

    const interval = setInterval(() => {
      setTareaPendientes((prev) => {
        const bump = 1 + Math.floor(Math.random() * 3);
        const idx = Math.floor(Math.random() * prev.length);
        const next = prev.slice();
        next[idx] = next[idx] + bump;
        setMensajesSinResponder((m) => m + bump);
        return next;
      });

      const spawnCount = 1 + Math.floor(Math.random() * 2);
      const newPopups: Popup[] = [];
      for (let i = 0; i < spawnCount; i += 1) {
        const msg = neg.mensajes[Math.floor(Math.random() * neg.mensajes.length)];
        feedIdCounter += 1;
        newPopups.push({
          id: feedIdCounter,
          text: msg,
          left: `${5 + Math.random() * 80}%`,
          top: `${8 + Math.random() * 74}%`,
        });
      }
      setPopups((prev) => prev.concat(newPopups).slice(-22));
    }, CHAOS_TICK_MS);
    timersRef.current.push(interval);

    const disable = setTimeout(() => setManualDisabled(true), MANUAL_DISABLE_AT_MS);
    timersRef.current.push(disable);

    const toSwitch = setTimeout(() => {
      clearInterval(interval);
      setFase("switch");
    }, CHAOS_DURATION_MS);
    timersRef.current.push(toSwitch);
  }

  function resolverManual(idx: number) {
    if (fase !== "caos" || manualDisabled) return;
    setTareaPendientes((prev) => {
      const next = prev.slice();
      next[idx] = 0;
      return next;
    });
  }

  function activarTaran() {
    clearTimers();
    setFase("cascade");
    setPopupsClosing(true);

    const clearPopups = setTimeout(() => {
      setPopups([]);
      setPopupsClosing(false);
    }, 450);
    timersRef.current.push(clearPopups);

    const neg = negocioActivo;
    if (!neg) return;

    neg.tareas.forEach((_, idx) => {
      const t = setTimeout(() => {
        setTareaResuelta((prev) => {
          const next = prev.slice();
          next[idx] = true;
          return next;
        });
      }, idx * CASCADE_STAGGER_MS);
      timersRef.current.push(t);
    });

    const finish = setTimeout(() => {
      setFase("resultado");
    }, neg.tareas.length * CASCADE_STAGGER_MS + 500);
    timersRef.current.push(finish);
  }

  function irAlFormulario() {
    if (!negocioActivo) return;
    setPrefill({
      negocio: negocioActivo.label,
      tareas:
        "Lo que más tiempo me quita: " +
        negocioActivo.tareas.map((t) => t.tarea.toLowerCase()).join("; ") +
        ".",
    });
  }

  function reiniciarSimulador() {
    clearTimers();
    setFase("selector");
    setNegocioId(null);
    setTareaPendientes([]);
    setTareaResuelta([]);
    setMensajesSinResponder(0);
    setPopups([]);
    setPopupsClosing(false);
  }

  const horasSemana = negocioActivo ? negocioActivo.tareas.reduce((sum, t) => sum + t.horas, 0) : 0;
  const horasMes = horasSemana * 4;
  const caosSubtitulo = manualDisabled
    ? "Los mensajes siguen llegando. Ya no das abasto."
    : "Así se siente tu lunes, ¿no? Toca las tarjetas si puedes con ellas.";

  return (
    <section
      id="simulador"
      style={{
        borderTop: "1px solid rgba(255,255,255,.07)",
        padding: "clamp(90px,12vw,140px) clamp(20px,5vw,64px)",
        position: "relative",
        background: "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(198,255,52,.08), transparent 65%)",
      }}
    >
      {popups.length > 0 && (
        <div style={{ position: "fixed", inset: 0, zIndex: 250, pointerEvents: "none" }}>
          {popups.map((p) => (
            <div
              key={p.id}
              style={{
                position: "fixed",
                left: p.left,
                top: p.top,
                maxWidth: 230,
                background: "#141414",
                border: "1px solid rgba(255,90,90,.4)",
                borderRadius: 14,
                padding: "12px 16px",
                boxShadow: "0 14px 34px rgba(0,0,0,.55)",
                display: "flex",
                alignItems: "center",
                gap: 10,
                animation: popupsClosing
                  ? "trn-popup-out .4s ease-in forwards"
                  : "trn-popup-in .35s cubic-bezier(.34,1.56,.64,1) both",
              }}
            >
              <svg viewBox="0 0 24 24" style={{ width: 18, height: 18, color: "#ff8080", flex: "none" }}>
                <use href="#icon-chat" />
              </svg>
              <span style={{ fontSize: 13, color: "#f2f2f0", lineHeight: 1.3 }}>{p.text}</span>
              <span
                style={{
                  position: "absolute",
                  top: -5,
                  right: -5,
                  width: 10,
                  height: 10,
                  background: "#ff5a5a",
                  borderRadius: "50%",
                  animation: "trn-glow .7s ease-in-out infinite",
                }}
              />
            </div>
          ))}
        </div>
      )}

      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        <div data-reveal style={{ textAlign: "center", marginBottom: 56 }}>
          <div style={{ fontFamily: "termina,sans-serif", fontSize: 13, letterSpacing: ".2em", color: "#c6ff34", marginBottom: 18 }}>
            EL SIMULADOR
          </div>
          <h2 style={{ fontFamily: "termina,sans-serif", fontWeight: 700, fontSize: "clamp(28px,3.6vw,48px)", lineHeight: 1.2, margin: "0 0 20px" }}>
            Simula tu propia automatización
          </h2>
          <p style={{ fontSize: 18, lineHeight: 1.7, color: "rgba(242,242,240,.65)", maxWidth: 560, margin: "0 auto" }}>
            Elige tu negocio. Vive la simulación. Mira cuántas horas recuperas. Sin registrarte, sin pagar, sin trucos.
          </p>
        </div>

        <div
          style={{
            border: "1px solid rgba(198,255,52,.2)",
            borderRadius: 24,
            background: "#0b0b0b",
            padding: "clamp(28px,4vw,52px)",
            minHeight: 420,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            boxShadow: "0 30px 90px rgba(0,0,0,.5)",
          }}
        >
          {fase === "selector" && (
            <div>
              <div style={{ fontFamily: "termina,sans-serif", fontSize: 13, letterSpacing: ".14em", color: "rgba(242,242,240,.5)", marginBottom: 24, textAlign: "center" }}>
                PASO 1 · ¿A QUÉ TE DEDICAS?
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 14 }}>
                {NEGOCIOS.map((neg) => (
                  <button
                    key={neg.id}
                    className="trn-negocio-btn"
                    onClick={() => seleccionarNegocio(neg.id)}
                    style={{
                      cursor: "pointer",
                      background: "#141414",
                      border: "1px solid rgba(255,255,255,.1)",
                      borderRadius: 16,
                      padding: "24px 14px",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 12,
                      color: "#f2f2f0",
                      fontFamily: "proxima-nova,sans-serif",
                      transition: "border-color .25s,transform .2s,background .25s",
                    }}
                  >
                    <svg viewBox="0 0 24 24" style={{ width: 28, height: 28, color: "#c6ff34" }}>
                      <use href={`#icon-${neg.icono}`} />
                    </svg>
                    <span style={{ fontSize: 14, fontWeight: 600 }}>{neg.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {fase === "caos" && negocioActivo && (
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18, flexWrap: "wrap", gap: 12 }}>
                <div style={{ fontFamily: "termina,sans-serif", fontSize: 13, letterSpacing: ".14em", color: "rgba(242,242,240,.5)" }}>
                  PASO 2 · ASÍ SE VE HOY
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, background: "rgba(255,90,90,.1)", border: "1px solid rgba(255,90,90,.3)", borderRadius: 999, padding: "8px 16px" }}>
                  <span style={{ width: 8, height: 8, background: "#ff5a5a", borderRadius: "50%", animation: "trn-glow .7s ease-in-out infinite" }} />
                  <span style={{ fontSize: 14, fontWeight: 700, color: "#ff8080" }}>{mensajesSinResponder} mensajes sin responder</span>
                </div>
              </div>
              <p style={{ textAlign: "center", fontSize: 16, color: "rgba(242,242,240,.5)", margin: "0 0 8px" }}>{caosSubtitulo}</p>
              {manualDisabled ? (
                <div style={{ textAlign: "center", fontFamily: "termina,sans-serif", fontSize: 13, fontWeight: 700, letterSpacing: ".08em", color: "#ff8080", marginBottom: 18 }}>
                  YA NO ALCANZAS. ASÍ SE SIENTE SIN TORÚN.
                </div>
              ) : (
                <div style={{ marginBottom: 18 }} />
              )}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
                  gap: 14,
                  opacity: manualDisabled ? 0.45 : 1,
                  pointerEvents: manualDisabled ? "none" : "auto",
                  transition: "opacity .4s",
                }}
              >
                {negocioActivo.tareas.map((t, idx) => {
                  const pendientes = tareaPendientes[idx] || 0;
                  return (
                    <button
                      key={t.tarea}
                      onClick={() => resolverManual(idx)}
                      style={{
                        cursor: "pointer",
                        position: "relative",
                        textAlign: "left",
                        background: "#141414",
                        border: "1px solid rgba(255,90,90,.25)",
                        borderRadius: 14,
                        padding: 18,
                        color: "#f2f2f0",
                        fontFamily: "proxima-nova,sans-serif",
                        animation: pendientes > 0 ? "trn-shake .4s ease-in-out" : "none",
                      }}
                    >
                      <svg viewBox="0 0 24 24" style={{ width: 22, height: 22, color: "rgba(242,242,240,.6)", display: "block", marginBottom: 8 }}>
                        <use href={`#icon-${t.icono}`} />
                      </svg>
                      <span style={{ fontSize: 14, lineHeight: 1.4, color: "rgba(242,242,240,.75)", display: "block" }}>{t.tarea}</span>
                      {pendientes > 0 && (
                        <span
                          style={{
                            position: "absolute",
                            top: -8,
                            right: -8,
                            minWidth: 24,
                            height: 24,
                            padding: "0 6px",
                            background: "#ff5a5a",
                            borderRadius: 999,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 12,
                            fontWeight: 700,
                            color: "#fff",
                            animation: "trn-badgepop .3s ease-out",
                          }}
                        >
                          {pendientes}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {fase === "switch" && (
            <div style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "termina,sans-serif", fontSize: 13, letterSpacing: ".14em", color: "rgba(242,242,240,.5)", marginBottom: 30 }}>
                PASO 3 · ENCIENDE LA AUTOMATIZACIÓN
              </div>
              <button
                className="trn-switch-btn"
                onClick={activarTaran}
                style={{
                  cursor: "pointer",
                  background: "transparent",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 18,
                  padding: "18px 30px",
                  borderRadius: 999,
                  border: "2px solid rgba(198,255,52,.4)",
                }}
              >
                <span style={{ fontFamily: "termina,sans-serif", fontSize: 15, fontWeight: 700, letterSpacing: ".1em", color: "rgba(242,242,240,.5)" }}>
                  OFF
                </span>
                <span style={{ width: 70, height: 36, borderRadius: 999, background: "#222", position: "relative", display: "inline-block" }}>
                  <span style={{ position: "absolute", top: 3, left: 3, width: 30, height: 30, borderRadius: "50%", background: "#666" }} />
                </span>
                <span style={{ fontFamily: "termina,sans-serif", fontSize: 15, fontWeight: 700, letterSpacing: ".1em", color: "#c6ff34" }}>
                  TORÚN
                </span>
              </button>
              <p style={{ fontSize: 15, color: "rgba(242,242,240,.4)", margin: "22px 0 0" }}>Toca el interruptor</p>
            </div>
          )}

          {fase === "cascade" && negocioActivo && (
            <div>
              <div style={{ textAlign: "center", marginBottom: 26 }}>
                <div
                  style={{
                    fontFamily: "termina,sans-serif",
                    fontSize: 15,
                    fontWeight: 700,
                    letterSpacing: ".1em",
                    color: "#c6ff34",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 14,
                    padding: "14px 28px",
                    border: "1px solid rgba(198,255,52,.4)",
                    borderRadius: 999,
                    background: "rgba(198,255,52,.08)",
                  }}
                >
                  <span style={{ width: 8, height: 8, background: "#c6ff34", borderRadius: "50%", animation: "trn-glow .6s ease-in-out infinite" }} />
                  ON
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 14 }}>
                {negocioActivo.tareas.map((t, idx) => {
                  const resuelta = !!tareaResuelta[idx];
                  return (
                    <div
                      key={t.tarea}
                      style={{
                        position: "relative",
                        textAlign: "left",
                        background: resuelta ? "rgba(198,255,52,.08)" : "#141414",
                        border: `1px solid ${resuelta ? "rgba(198,255,52,.4)" : "rgba(255,255,255,.1)"}`,
                        borderRadius: 14,
                        padding: "18px 18px",
                        transition: "background .4s,border-color .4s",
                      }}
                    >
                      <svg viewBox="0 0 24 24" style={{ width: 22, height: 22, color: "rgba(242,242,240,.6)", display: "block", marginBottom: 8 }}>
                        <use href={`#icon-${t.icono}`} />
                      </svg>
                      <span style={{ fontSize: 14, lineHeight: 1.4, color: "rgba(242,242,240,.75)", display: "block" }}>{t.tarea}</span>
                      {resuelta && (
                        <span
                          style={{
                            position: "absolute",
                            top: -8,
                            right: -8,
                            width: 26,
                            height: 26,
                            background: "#c6ff34",
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            animation: "trn-checkpop .35s ease-out",
                          }}
                        >
                          <svg viewBox="0 0 24 24" style={{ width: 15, height: 15, color: "#050505" }}>
                            <use href="#icon-check" />
                          </svg>
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {fase === "resultado" && (
            <div style={{ textAlign: "center" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 18 }}>
                <svg viewBox="0 0 24 24" style={{ width: 18, height: 18, color: "#c6ff34" }}>
                  <use href="#icon-spark" />
                </svg>
                <span style={{ fontSize: 15, fontWeight: 700, letterSpacing: ".1em", color: "#c6ff34" }}>TARÁN</span>
              </div>
              <p style={{ fontSize: 18, color: "rgba(242,242,240,.7)", margin: "0 0 6px" }}>Tu equipo acaba de recuperar</p>
              <div
                style={{
                  fontFamily: "termina,sans-serif",
                  fontWeight: 700,
                  fontSize: "clamp(48px,7vw,84px)",
                  color: "#c6ff34",
                  lineHeight: 1,
                  margin: "6px 0",
                  textShadow: "0 0 50px rgba(198,255,52,.45)",
                }}
              >
                ~{horasSemana} hrs
              </div>
              <p style={{ fontSize: 16, color: "rgba(242,242,240,.5)", margin: "0 0 6px" }}>
                a la semana. Eso son <strong style={{ color: "#f2f2f0" }}>{horasMes} horas al mes</strong>.
              </p>
              <p style={{ fontSize: 19, color: "#f2f2f0", fontWeight: 600, margin: "22px 0 40px" }}>Eso es el tarán.</p>
              <p style={{ fontSize: 15, color: "rgba(242,242,240,.45)", maxWidth: 420, margin: "0 auto 24px" }}>
                Esto fue una simulación. Lo tuyo puede ser real.
              </p>
              <a
                href="#formulario"
                onClick={irAlFormulario}
                className="trn-cta-primary"
                style={{
                  position: "relative",
                  overflow: "hidden",
                  display: "inline-block",
                  fontFamily: "termina,sans-serif",
                  fontSize: 13,
                  fontWeight: 700,
                  letterSpacing: ".08em",
                  color: "#050505",
                  background: "#c6ff34",
                  padding: "18px 34px",
                  borderRadius: 999,
                  textDecoration: "none",
                  transition: "box-shadow .25s,transform .25s",
                }}
              >
                RECUPERAR MI TIEMPO
                <span
                  style={{
                    position: "absolute",
                    top: 0,
                    bottom: 0,
                    left: 0,
                    width: "38%",
                    background: "linear-gradient(90deg,transparent,rgba(255,255,255,.65),transparent)",
                    animation: "trn-shine 3.4s ease-in-out infinite",
                    pointerEvents: "none",
                  }}
                />
              </a>
              <div style={{ marginTop: 24 }}>
                <button
                  className="trn-hover-lime"
                  onClick={reiniciarSimulador}
                  style={{ cursor: "pointer", background: "transparent", border: "none", color: "rgba(242,242,240,.4)", fontSize: 14, textDecoration: "underline" }}
                >
                  Simular con otro negocio
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
