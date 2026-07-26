export function LandingHero() {
  return (
    <header
      id="top"
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        padding: "140px clamp(20px,5vw,64px) 80px",
        background: "radial-gradient(ellipse 80% 55% at 50% -10%, rgba(198,255,52,.13), transparent 60%)",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.035) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.035) 1px,transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage: "radial-gradient(ellipse 70% 60% at 50% 40%,black,transparent 75%)",
          WebkitMaskImage: "radial-gradient(ellipse 70% 60% at 50% 40%,black,transparent 75%)",
          pointerEvents: "none",
          animation: "trn-gridpan 6s linear infinite",
        }}
      />
      <div
        id="trn-glow"
        style={{
          position: "absolute",
          left: "50%",
          top: "36%",
          width: 560,
          height: 560,
          borderRadius: "50%",
          background: "radial-gradient(circle,rgba(198,255,52,.13),transparent 62%)",
          transform: "translate(-50%,-50%)",
          filter: "blur(8px)",
          pointerEvents: "none",
          transition: "left .4s ease-out,top .4s ease-out",
        }}
      />
      <div style={{ position: "absolute", top: "18%", left: "12%", width: 6, height: 6, background: "#c6ff34", borderRadius: "50%", animation: "trn-pulse 3.2s ease-in-out infinite", pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: "32%", right: "14%", width: 4, height: 4, background: "#c6ff34", borderRadius: "50%", animation: "trn-pulse 2.6s ease-in-out .8s infinite", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "26%", left: "20%", width: 4, height: 4, background: "#c6ff34", borderRadius: "50%", animation: "trn-pulse 3.8s ease-in-out 1.4s infinite", pointerEvents: "none" }} />

      <div
        style={{
          position: "relative",
          display: "inline-flex",
          alignItems: "center",
          gap: 10,
          border: "1px solid rgba(198,255,52,.35)",
          borderRadius: 999,
          padding: "9px 20px",
          fontSize: 14,
          fontWeight: 500,
          color: "rgba(242,242,240,.8)",
          marginBottom: 36,
          background: "rgba(198,255,52,.05)",
          opacity: 0,
          animation: "trn-fadeup .8s cubic-bezier(.16,1,.3,1) .1s both",
        }}
      >
        <span style={{ width: 7, height: 7, background: "#c6ff34", borderRadius: "50%", animation: "trn-glow 2s ease-in-out infinite" }} />
        El AI Partner de tu negocio
      </div>

      <h1
        style={{
          position: "relative",
          fontFamily: "termina,sans-serif",
          fontWeight: 700,
          fontSize: "clamp(32px,5.2vw,70px)",
          lineHeight: 1.18,
          letterSpacing: ".01em",
          margin: 0,
          maxWidth: 1150,
        }}
      >
        <span style={{ display: "block", overflow: "hidden", paddingBottom: ".1em" }}>
          <span style={{ display: "inline-block", animation: "trn-rise 1s cubic-bezier(.16,1,.3,1) .25s both" }}>
            Lo que hoy le cuesta{" "}
            <span style={{ position: "relative", display: "inline-block", color: "rgba(242,242,240,.4)" }}>
              horas
              <span
                style={{
                  position: "absolute",
                  left: 0,
                  top: "50%",
                  height: 3,
                  background: "#c6ff34",
                  width: "100%",
                  animation: "trn-strike .5s ease-out 1.3s both",
                  transformOrigin: "left",
                }}
              />
            </span>{" "}
            a tu equipo,
          </span>
        </span>
        <span style={{ display: "block", overflow: "hidden", paddingBottom: ".1em" }}>
          <span style={{ display: "inline-block", animation: "trn-rise 1s cubic-bezier(.16,1,.3,1) .45s both" }}>
            mañana pasa{" "}
            <span style={{ color: "#c6ff34", textShadow: "0 0 42px rgba(198,255,52,.45)" }}>solo</span>.
          </span>
        </span>
      </h1>

      <p
        style={{
          position: "relative",
          fontSize: "clamp(18px,2vw,22px)",
          lineHeight: 1.6,
          color: "rgba(242,242,240,.65)",
          maxWidth: 620,
          margin: "32px 0 0",
          opacity: 0,
          animation: "trn-fadeup .8s cubic-bezier(.16,1,.3,1) .6s both",
        }}
      >
        Torun automatiza los procesos que te roban tiempo.{" "}
        <strong style={{ fontWeight: 700, color: "#f2f2f0" }}>Tú diriges el negocio</strong>, nosotros hacemos{" "}
        <em style={{ fontStyle: "italic", color: "#c6ff34" }}>el trabajo repetitivo tarán</em>.
      </p>

      <div
        style={{
          position: "relative",
          display: "flex",
          gap: 16,
          marginTop: 44,
          flexWrap: "wrap",
          justifyContent: "center",
          opacity: 0,
          animation: "trn-fadeup .8s cubic-bezier(.16,1,.3,1) .8s both",
        }}
      >
        <a
          href="#formulario"
          className="trn-cta-primary"
          style={{
            position: "relative",
            overflow: "hidden",
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
              animation: "trn-shine 3.4s ease-in-out 1.2s infinite",
              pointerEvents: "none",
            }}
          />
        </a>
        <a
          href="#simulador"
          className="trn-cta-secondary"
          style={{
            fontFamily: "termina,sans-serif",
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: ".08em",
            color: "#f2f2f0",
            border: "1px solid rgba(255,255,255,.22)",
            padding: "18px 34px",
            borderRadius: 999,
            textDecoration: "none",
            transition: "border-color .25s,background .25s",
          }}
        >
          MIRA CÓMO FUNCIONA ↓
        </a>
      </div>

      <div
        style={{
          position: "relative",
          marginTop: "auto",
          paddingTop: 70,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 10,
          color: "rgba(242,242,240,.35)",
          fontSize: 13,
          letterSpacing: ".18em",
          textTransform: "uppercase",
        }}
      >
        Desliza
        <span style={{ display: "block", width: 1, height: 42, background: "linear-gradient(to bottom,#c6ff34,transparent)" }} />
      </div>
    </header>
  );
}
