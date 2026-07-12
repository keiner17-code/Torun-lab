export function BadgeEstado({ activo }: { activo: boolean }) {
  return (
    <span
      className={`chip ${
        activo ? "bg-emerald-500/15 text-emerald-400" : "bg-slate-500/15 text-slate-400"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${activo ? "bg-emerald-400" : "bg-slate-500"}`}
      />
      {activo ? "Activo" : "Inactivo"}
    </span>
  );
}
