import type { CSSProperties } from "react";

// Paleta categórica validada (dataviz skill, columna "dark") — orden fijo, nunca
// se cicla. Superficie del panel se sustituye por el navy de marca (más oscuro
// que el gris neutro por defecto, lo que solo mejora el contraste).
export const CAT = {
  blue: "#3987e5",
  aqua: "#199e70",
  gold: "#c98500",
  green: "#008300",
  violet: "#9085e9",
  red: "#e66767",
} as const;

export const CHART_SURFACE = "#0f1830"; // navy-850
export const CHART_GRID = "rgba(255,255,255,0.08)";
export const CHART_AXIS = "rgba(255,255,255,0.35)";
export const CHART_TEXT_MUTED = "#8b93a7";

export const tooltipStyle: CSSProperties = {
  background: "#0b1220",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 10,
  fontSize: 12,
  padding: "8px 12px",
  color: "#e2e8f0",
};
