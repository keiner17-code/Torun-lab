import { CASOS } from "./negocios-data";

export function AutomatizamosSection() {
  return (
    <section id="automatizamos" style={{ borderTop: "1px solid rgba(255,255,255,.07)", padding: "clamp(90px,12vw,140px) clamp(20px,5vw,64px)" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <h2 data-reveal style={{ fontFamily: "termina,sans-serif", fontWeight: 700, fontSize: "clamp(26px,3.2vw,42px)", lineHeight: 1.25, margin: "0 0 56px", textAlign: "center" }}>
          Si se repite, <span style={{ color: "#c6ff34" }}>se puede automatizar.</span>
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))", gap: 16 }}>
          {CASOS.map((c) => (
            <div
              key={c.antes}
              data-reveal
              style={{ display: "flex", alignItems: "center", gap: 16, border: "1px solid rgba(255,255,255,.09)", borderRadius: 14, padding: "22px 24px", background: "#0b0b0b" }}
            >
              <span style={{ fontSize: 14, color: "rgba(242,242,240,.45)", flex: 1, textDecoration: "line-through", textDecorationColor: "rgba(255,90,90,.5)" }}>{c.antes}</span>
              <span style={{ color: "#c6ff34", fontSize: 16 }}>→</span>
              <span style={{ fontSize: 14, color: "#f2f2f0", flex: 1, fontWeight: 600 }}>{c.despues}</span>
            </div>
          ))}
        </div>
        <p data-reveal style={{ textAlign: "center", fontSize: 17, color: "rgba(242,242,240,.5)", margin: "44px 0 0" }}>
          ¿Tu caso no está aquí? Mejor. Nos encantan los retos raros.
        </p>
      </div>
    </section>
  );
}
