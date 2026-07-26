export function formatTelefono(telefono: string): string {
  const digits = telefono.replace(/\D/g, "");
  if (!digits) return telefono;
  return `+${digits}`;
}

export function formatUsd(valor: number): string {
  return new Intl.NumberFormat("es-DO", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: valor < 1 ? 4 : 2,
  }).format(valor);
}

export function formatNumero(valor: number): string {
  return new Intl.NumberFormat("es-DO").format(valor);
}

export function formatTokens(valor: number): string {
  if (valor >= 1_000_000) return `${(valor / 1_000_000).toFixed(1)}M`;
  if (valor >= 1_000) return `${(valor / 1_000).toFixed(1)}k`;
  return String(valor);
}

export function iniciales(nombre: string): string {
  return nombre
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}
