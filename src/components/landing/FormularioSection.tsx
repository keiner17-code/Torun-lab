"use client";

import { useEffect, useState } from "react";
import { NEGOCIOS } from "./negocios-data";
import { useLandingPrefill } from "./LandingProvider";

export function FormularioSection() {
  const { prefill } = useLandingPrefill();
  const [submitted, setSubmitted] = useState(false);
  const [negocio, setNegocio] = useState("");
  const [tareas, setTareas] = useState("");

  useEffect(() => {
    if (prefill) {
      setNegocio(prefill.negocio);
      setTareas(prefill.tareas);
    }
  }, [prefill]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <section
      id="formulario"
      style={{
        position: "relative",
        borderTop: "1px solid rgba(255,255,255,.07)",
        padding: "clamp(90px,12vw,150px) clamp(20px,5vw,64px)",
        background: "radial-gradient(ellipse 70% 80% at 50% 110%, rgba(198,255,52,.12), transparent 65%)",
      }}
    >
      <div style={{ maxWidth: 560, margin: "0 auto" }}>
        <div data-reveal style={{ textAlign: "center", marginBottom: 44 }}>
          <h2 style={{ fontFamily: "termina,sans-serif", fontWeight: 700, fontSize: "clamp(28px,3.6vw,42px)", lineHeight: 1.2, margin: "0 0 16px" }}>
            Cuéntanos <span style={{ color: "#c6ff34" }}>dónde te duele</span>.
          </h2>
          <p style={{ fontSize: 16, lineHeight: 1.6, color: "rgba(242,242,240,.6)", margin: 0 }}>
            Te respondemos en menos de 24 horas. Persona real, no bot.{" "}
            <em style={{ fontStyle: "italic", color: "rgba(242,242,240,.4)" }}>(La ironía no se nos escapa.)</em>
          </p>
        </div>

        <div
          data-reveal
          style={{
            border: "1px solid rgba(198,255,52,.2)",
            borderRadius: 22,
            background: "#0b0b0b",
            padding: "clamp(28px,4vw,40px)",
          }}
        >
          {submitted ? (
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <svg viewBox="0 0 24 24" style={{ width: 36, height: 36, margin: "0 auto 16px", color: "#c6ff34", display: "block" }}>
                <use href="#icon-spark" />
              </svg>
              <h3 style={{ fontFamily: "termina,sans-serif", fontWeight: 700, fontSize: 21, color: "#f2f2f0", margin: "0 0 10px" }}>
                Listo. Mensaje recibido.
              </h3>
              <p style={{ fontSize: 15, lineHeight: 1.6, color: "rgba(242,242,240,.6)", margin: 0 }}>
                Prepárate — te escribimos hoy mismo.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <input
                type="text"
                name="honeypot"
                tabIndex={-1}
                autoComplete="off"
                style={{ position: "absolute", left: -9999, width: 1, height: 1, opacity: 0 }}
              />
              <label style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: "rgba(242,242,240,.7)" }}>Nombre</span>
                <input
                  required
                  type="text"
                  name="name"
                  placeholder="Tu nombre"
                  className="trn-input"
                  style={{
                    background: "#141414",
                    border: "1px solid rgba(255,255,255,.12)",
                    borderRadius: 10,
                    padding: "13px 15px",
                    color: "#f2f2f0",
                    fontSize: 15,
                    fontFamily: "proxima-nova,sans-serif",
                  }}
                />
              </label>
              <label style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: "rgba(242,242,240,.7)" }}>Empresa / negocio</span>
                <input
                  type="text"
                  name="company"
                  placeholder="Nombre de tu negocio"
                  className="trn-input"
                  style={{
                    background: "#141414",
                    border: "1px solid rgba(255,255,255,.12)",
                    borderRadius: 10,
                    padding: "13px 15px",
                    color: "#f2f2f0",
                    fontSize: 15,
                    fontFamily: "proxima-nova,sans-serif",
                  }}
                />
              </label>
              <label style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: "rgba(242,242,240,.7)" }}>WhatsApp o correo</span>
                <input
                  required
                  type="text"
                  name="contact"
                  placeholder="Como prefieras que te contactemos"
                  className="trn-input"
                  style={{
                    background: "#141414",
                    border: "1px solid rgba(255,255,255,.12)",
                    borderRadius: 10,
                    padding: "13px 15px",
                    color: "#f2f2f0",
                    fontSize: 15,
                    fontFamily: "proxima-nova,sans-serif",
                  }}
                />
              </label>
              <label style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: "rgba(242,242,240,.7)" }}>Tipo de negocio</span>
                <select
                  name="businessType"
                  value={negocio}
                  onChange={(e) => setNegocio(e.target.value)}
                  className="trn-input"
                  style={{
                    background: "#141414",
                    border: "1px solid rgba(255,255,255,.12)",
                    borderRadius: 10,
                    padding: "13px 15px",
                    color: "#f2f2f0",
                    fontSize: 15,
                    fontFamily: "proxima-nova,sans-serif",
                  }}
                >
                  <option value="">Selecciona...</option>
                  {NEGOCIOS.map((op) => (
                    <option key={op.id} value={op.label}>
                      {op.label}
                    </option>
                  ))}
                </select>
              </label>
              <label style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: "rgba(242,242,240,.7)" }}>
                  ¿Qué te está robando más tiempo hoy?
                </span>
                <textarea
                  name="message"
                  rows={3}
                  value={tareas}
                  onChange={(e) => setTareas(e.target.value)}
                  placeholder="Cuéntanos brevemente (opcional)"
                  className="trn-input"
                  style={{
                    background: "#141414",
                    border: "1px solid rgba(255,255,255,.12)",
                    borderRadius: 10,
                    padding: "13px 15px",
                    color: "#f2f2f0",
                    fontSize: 15,
                    fontFamily: "proxima-nova,sans-serif",
                    resize: "vertical",
                  }}
                />
              </label>
              <button
                type="submit"
                className="trn-cta-submit"
                style={{
                  marginTop: 8,
                  fontFamily: "termina,sans-serif",
                  fontSize: 13,
                  fontWeight: 700,
                  letterSpacing: ".08em",
                  color: "#050505",
                  background: "#c6ff34",
                  padding: 16,
                  border: "none",
                  borderRadius: 999,
                  cursor: "pointer",
                  transition: "box-shadow .25s,transform .25s",
                }}
              >
                RECUPERAR MI TIEMPO
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
