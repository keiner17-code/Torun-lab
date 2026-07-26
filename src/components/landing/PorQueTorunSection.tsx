import Image from "next/image";

const DIFERENCIADORES = [
  {
    titulo: "NOS QUEDAMOS",
    texto: "Una agencia entrega y desaparece. Nosotros seguimos ahí cuando tu negocio cambia — porque va a cambiar.",
  },
  {
    titulo: "HABLAMOS TU IDIOMA",
    texto: "Nada de presentaciones de 80 slides. Te decimos qué vamos a automatizar, cuánto tiempo te ahorra y cuándo está listo.",
  },
  {
    titulo: "EMPEZAMOS PEQUEÑO",
    texto: "Primera automatización funcionando en días, no en meses. El resultado se demuestra, no se promete.",
  },
];

const FUNDADORES = [
  {
    nombre: "KEINER TORRES",
    rol: "Co-fundador · Arquitecto técnico",
    bio: "Diseña el sistema exacto que se adapta a tu negocio — no una plantilla genérica.",
    bioLead: "El técnico detrás de cada sistema.",
    foto: "/founders/keiner-torres.jpg",
    objectPosition: "center 12%",
  },
  {
    nombre: "ELÍAS NUMA",
    rol: "Co-fundador · Estrategia y personas",
    bio: "Traduce cómo trabaja realmente tu equipo en automatizaciones que la gente adopta sin resistencia.",
    bioLead: "El que lee lo que los datos no dicen.",
    foto: "/founders/elias-numa.jpg",
    objectPosition: "center 30%",
  },
];

export function PorQueTorunSection() {
  return (
    <section style={{ borderTop: "1px solid rgba(255,255,255,.07)", background: "#080808", padding: "clamp(90px,12vw,140px) clamp(20px,5vw,64px)" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <h2 data-reveal style={{ fontFamily: "termina,sans-serif", fontWeight: 700, fontSize: "clamp(26px,3.2vw,42px)", lineHeight: 1.25, margin: "0 0 56px", textAlign: "center" }}>
          No somos una agencia.
          <br />
          Somos tu <span style={{ color: "#c6ff34" }}>socio de IA</span>.
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 20 }}>
          {DIFERENCIADORES.map((d) => (
            <div
              key={d.titulo}
              data-reveal
              style={{ border: "1px solid rgba(255,255,255,.09)", borderRadius: 18, padding: "36px 32px", background: "linear-gradient(160deg,rgba(255,255,255,.03),transparent)" }}
            >
              <h3 style={{ fontFamily: "termina,sans-serif", fontSize: 16, fontWeight: 700, letterSpacing: ".04em", margin: "0 0 14px", color: "#c6ff34" }}>{d.titulo}</h3>
              <p style={{ fontSize: 16, lineHeight: 1.65, color: "rgba(242,242,240,.65)", margin: 0 }}>{d.texto}</p>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 64 }}>
          <div data-reveal style={{ fontFamily: "termina,sans-serif", fontSize: 13, letterSpacing: ".2em", color: "rgba(242,242,240,.5)", marginBottom: 20 }}>
            LAS DOS PERSONAS DETRÁS
          </div>
          <p data-reveal style={{ fontSize: 17, lineHeight: 1.7, color: "rgba(242,242,240,.65)", maxWidth: 680, margin: "0 0 32px" }}>
            La combinación exacta que necesita una automatización que funcione: uno que entiende a las personas y hace
            más humanos los sistemas, y otro que domina la técnica para adaptar cada sistema a tu negocio.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))", gap: 20 }}>
            {FUNDADORES.map((f) => (
              <div
                key={f.nombre}
                data-reveal
                className="trn-card"
                style={{
                  display: "flex",
                  gap: 24,
                  alignItems: "center",
                  border: "1px solid rgba(255,255,255,.09)",
                  borderRadius: 18,
                  padding: 28,
                  background: "linear-gradient(160deg,rgba(255,255,255,.03),transparent)",
                  transition: "border-color .3s,transform .3s",
                }}
              >
                <div style={{ position: "relative", width: 112, height: 112, borderRadius: "50%", overflow: "hidden", flex: "none" }}>
                  <Image
                    src={f.foto}
                    alt={f.nombre}
                    fill
                    sizes="112px"
                    style={{ objectFit: "cover", objectPosition: f.objectPosition, filter: "grayscale(1) contrast(1.2) brightness(.92)" }}
                  />
                  <div style={{ position: "absolute", inset: 0, borderRadius: "50%", boxShadow: "inset 0 0 0 1px rgba(198,255,52,.3)" }} />
                </div>
                <div>
                  <div style={{ fontFamily: "termina,sans-serif", fontSize: 16, fontWeight: 700, letterSpacing: ".04em", color: "#f2f2f0" }}>{f.nombre}</div>
                  <div style={{ fontSize: 13, letterSpacing: ".06em", color: "#c6ff34", margin: "6px 0 10px", textTransform: "uppercase" }}>{f.rol}</div>
                  <p style={{ fontSize: 14, lineHeight: 1.6, color: "rgba(242,242,240,.6)", margin: 0 }}>
                    <strong style={{ fontWeight: 700, color: "#f2f2f0" }}>{f.bioLead}</strong> {f.bio}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
