export function BannerFooter() {
  return (
    <>
      <div style={{ borderTop: "1px solid rgba(255,255,255,.07)", padding: "clamp(70px,9vw,110px) clamp(20px,5vw,64px)", textAlign: "center", background: "#080808" }}>
        <h2 style={{ fontFamily: "termina,sans-serif", fontWeight: 700, fontSize: "clamp(28px,4vw,52px)", lineHeight: 1.25, maxWidth: 820, margin: "0 auto" }}>
          TORÚN. <span style={{ color: "#c6ff34" }}>HECHO POR DOS PERSONAS</span>
          <br />
          QUE ODIAN HACER LO MISMO DOS VECES.
        </h2>
      </div>

      <footer style={{ borderTop: "1px solid rgba(255,255,255,.07)", padding: "40px clamp(20px,5vw,64px)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 20 }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/torun-logo.svg" alt="Torún" style={{ height: 28, width: "auto", filter: "invert(1) brightness(1.3)" }} />
        </div>
        <div style={{ fontSize: 14, color: "rgba(242,242,240,.4)" }}>© 2026 Torún. Todos los derechos reservados.</div>
      </footer>
    </>
  );
}
