import { formatHora } from "@/lib/dates";
import type { Mensaje } from "@/lib/queries";

const ICONO_TIPO: Record<string, string> = {
  audio: "🎙️",
  imagen: "🖼️",
};

export function ChatBubble({ mensaje }: { mensaje: Mensaje }) {
  const esCliente = mensaje.direccion === "in";
  const icono = ICONO_TIPO[mensaje.tipo];

  return (
    <div className={`flex ${esCliente ? "justify-start" : "justify-end"}`}>
      <div
        className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-sm shadow-sm sm:max-w-[65%] ${
          esCliente
            ? "rounded-bl-sm bg-slate-700/60 text-slate-100"
            : "rounded-br-sm bg-emerald-800/50 text-emerald-50"
        }`}
      >
        {icono && <span className="mr-1.5">{icono}</span>}
        <span className="whitespace-pre-wrap break-words">{mensaje.contenido}</span>
        <div className={`mt-1 text-right text-[10px] ${esCliente ? "text-slate-400" : "text-emerald-200/70"}`}>
          {formatHora(mensaje.ts)}
        </div>
      </div>
    </div>
  );
}

export function SeparadorDia({ fecha }: { fecha: string }) {
  return (
    <div className="my-3 flex justify-center">
      <span className="rounded-full bg-white/5 px-3 py-1 text-[11px] text-slate-400">{fecha}</span>
    </div>
  );
}
