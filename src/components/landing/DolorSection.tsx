const DOLORES = [
  {
    titulo: '"Respondes los mismos mensajes todos los días."',
    texto: "Cotizaciones, horarios, disponibilidad. Tu equipo copiando y pegando mientras los clientes esperan.",
  },
  {
    titulo: '"La información vive en diez lugares distintos."',
    texto: "Excel, WhatsApp, correo, la cabeza de alguien. Y cuando la necesitas, nadie la encuentra.",
  },
  {
    titulo: '"Creces, pero el caos crece contigo."',
    texto: "Más clientes debería ser buena noticia. Hoy significa más noches largas.",
  },
];

export function DolorSection() {
  return (
    <section style={{ borderTop: "1px solid rgba(255,255,255,.07)", background: "#080808", padding: "clamp(90px,12vw,140px) clamp(20px,5vw,64px)" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <h2 data-reveal style={{ fontFamily: "termina,sans-serif", fontWeight: 700, fontSize: "clamp(26px,3.2vw,42px)", lineHeight: 1.25, margin: "0 0 56px", textAlign: "center" }}>
          Te suena, <span style={{ color: "#c6ff34" }}>¿cierto?</span>
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 20 }}>
          {DOLORES.map((d) => (
            <div
              key={d.titulo}
              data-reveal
              className="trn-card"
              style={{
                border: "1px solid rgba(255,255,255,.09)",
                borderRadius: 18,
                padding: "36px 32px",
                background: "linear-gradient(160deg,rgba(255,255,255,.03),transparent)",
                transition: "border-color .3s,transform .3s",
              }}
            >
              <h3 style={{ fontFamily: "termina,sans-serif", fontSize: 18, fontWeight: 700, lineHeight: 1.4, margin: "0 0 16px", color: "#f2f2f0" }}>{d.titulo}</h3>
              <p style={{ fontSize: 16, lineHeight: 1.65, color: "rgba(242,242,240,.6)", margin: 0 }}>{d.texto}</p>
            </div>
          ))}
        </div>

        <p data-reveal style={{ textAlign: "center", fontSize: 19, lineHeight: 1.7, color: "rgba(242,242,240,.65)", maxWidth: 560, margin: "56px auto 0" }}>
          Nada de esto es culpa tuya. Es que nadie te ha mostrado <em style={{ fontStyle: "italic", color: "#c6ff34" }}>el tarán</em>. Míralo tú mismo ↓
        </p>
      </div>
    </section>
  );
}
