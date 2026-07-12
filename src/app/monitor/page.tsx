import { TopNav } from "@/components/TopNav";
import { AgentCard } from "@/components/AgentCard";
import { getAgentes, getCardStats } from "@/lib/queries";
import { todayInTz } from "@/lib/dates";
import { syncUsoSiNecesario } from "@/lib/sync";

export const revalidate = 60;

export default async function MonitorDashboard() {
  await syncUsoSiNecesario();

  const agentes = await getAgentes();
  const hoy = todayInTz();
  const stats = await Promise.all(agentes.map((a) => getCardStats(a.id, hoy)));

  return (
    <>
      <TopNav titulo="Torun Monitor" />
      <main className="mx-auto max-w-6xl px-4 pb-16 pt-6 sm:px-6">
        {agentes.length === 0 ? (
          <div className="card p-6 text-sm text-slate-400">
            No hay agentes registrados todavía. Agrega filas en la tabla{" "}
            <code className="text-gold">agentes</code>.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {agentes.map((agente, i) => (
              <AgentCard key={agente.id} agente={agente} stats={stats[i]} />
            ))}
          </div>
        )}
      </main>
    </>
  );
}
