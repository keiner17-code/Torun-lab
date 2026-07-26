export function LandingNav() {
  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 clamp(20px,4vw,56px)",
        height: 72,
        background: "rgba(5,5,5,.72)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(255,255,255,.07)",
      }}
    >
      <a href="#top" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/torun-logo.svg"
          alt="Torún"
          style={{ height: 34, width: "auto", filter: "invert(1) brightness(1.3)" }}
        />
      </a>
      <div style={{ display: "flex", alignItems: "center", gap: "clamp(16px,3vw,36px)" }}>
        <a href="#simulador" className="trn-hover-lime" style={{ color: "rgba(242,242,240,.65)", textDecoration: "none", fontSize: 15, fontWeight: 500 }}>
          Simulador
        </a>
        <a href="#como-funciona" className="trn-hover-lime" style={{ color: "rgba(242,242,240,.65)", textDecoration: "none", fontSize: 15, fontWeight: 500 }}>
          Cómo funciona
        </a>
        <a href="#automatizamos" className="trn-hover-lime" style={{ color: "rgba(242,242,240,.65)", textDecoration: "none", fontSize: 15, fontWeight: 500 }}>
          Automatizamos
        </a>
        <a
          href="#formulario"
          className="trn-nav-cta"
          style={{
            fontFamily: "termina,sans-serif",
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: ".08em",
            color: "#050505",
            background: "#c6ff34",
            padding: "12px 22px",
            borderRadius: 999,
            textDecoration: "none",
            transition: "box-shadow .25s,transform .25s",
          }}
        >
          RECUPERAR MI TIEMPO
        </a>
      </div>
    </nav>
  );
}
