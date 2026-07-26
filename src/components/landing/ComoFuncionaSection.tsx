const PASOS = [
  {
    numero: "1",
    titulo: "ESCUCHAMOS",
    texto: "Nos cuentas cómo trabaja tu equipo hoy. Sin formularios eternos, una conversación.",
    activo: false,
  },
  {
    numero: "2",
    titulo: "CONSTRUIMOS",
    texto: "Diseñamos la automatización a la medida de tu negocio. Tú apruebas, nosotros ejecutamos.",
    activo: false,
  },
  {
    numero: "3",
    titulo: "RESULTADO",
    texto: "Lo que era manual, ahora pasa solo. Y nos quedamos contigo para que siga mejorando.",
    activo: true,
  },
];

export function ComoFuncionaSection() {
  return (
    <section id="como-funciona" style={{ borderTop: "1px solid rgba(255,255,255,.07)", background: "#080808", padding: "clamp(90px,12vw,140px) clamp(20px,5vw,64px)" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <h2 data-reveal style={{ fontFamily: "termina,sans-serif", fontWeight: 700, fontSize: "clamp(26px,3.2vw,42px)", lineHeight: 1.25, margin: "0 0 56px", textAlign: "center" }}>
          No es magia. <span style={{ color: "#c6ff34" }}>Bueno, casi.</span>
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 0, border: "1px solid rgba(255,255,255,.09)", borderRadius: 20, overflow: "hidden" }}>
          {PASOS.map((p, i) => (
            <div
              key={p.numero}
              data-reveal
              className={p.activo ? "trn-step-card-active" : "trn-step-card"}
              style={{
                padding: "48px 36px",
                borderRight: i < PASOS.length - 1 ? "1px solid rgba(255,255,255,.09)" : undefined,
                background: p.activo ? "rgba(198,255,52,.06)" : undefined,
                transition: "background .3s",
              }}
            >
              <div
                style={{
                  fontFamily: "termina,sans-serif",
                  fontSize: "clamp(40px,4vw,56px)",
                  fontWeight: 700,
                  color: p.activo ? "#c6ff34" : "rgba(198,255,52,.25)",
                  lineHeight: 1,
                  marginBottom: 24,
                  textShadow: p.activo ? "0 0 30px rgba(198,255,52,.5)" : undefined,
                }}
              >
                {p.numero}
              </div>
              <h3 style={{ fontFamily: "termina,sans-serif", fontSize: 17, fontWeight: 700, letterSpacing: ".04em", margin: "0 0 14px", color: p.activo ? "#c6ff34" : "#f2f2f0" }}>{p.titulo}</h3>
              <p style={{ fontSize: 16, lineHeight: 1.65, color: p.activo ? "rgba(242,242,240,.7)" : "rgba(242,242,240,.6)", margin: 0 }}>{p.texto}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
