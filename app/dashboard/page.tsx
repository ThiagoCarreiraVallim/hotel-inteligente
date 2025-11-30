import { StatCard } from "@/components/dashboard/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Megaphone, TrendingUp, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function DashboardPage() {
  // Mock data
  const eventsCount = 3;
  const campaignsCount = 2;
  const totalEventsCount = 8;
  const totalCampaignsCount = 5;

  const upcomingEvents = [
    {
      id: "1",
      name: "Conferência de Tecnologia 2024",
      start_date: "2024-03-15",
      end_date: "2024-03-17",
      status: "planned" as const,
    },
    {
      id: "2",
      name: "Workshop de Marketing Digital",
      start_date: "2024-03-20",
      end_date: "2024-03-20",
      status: "planned" as const,
    },
    {
      id: "3",
      name: "Feira de Negócios",
      start_date: "2024-03-25",
      end_date: "2024-03-28",
      status: "active" as const,
    },
  ];

  const recentCampaigns = [
    {
      id: "1",
      name: "Promoção Primavera",
      campaign_type: "pre_event" as const,
      status: "active" as const,
    },
    {
      id: "2",
      name: "Newsletter Semanal",
      campaign_type: "during_event" as const,
      status: "scheduled" as const,
    },
    {
      id: "3",
      name: "Follow-up Evento",
      campaign_type: "post_event" as const,
      status: "draft" as const,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="mt-2 text-slate-600">
          Visão geral das suas campanhas e eventos
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Eventos Planejados"
          value={eventsCount || 0}
          icon={Calendar}
          description="Eventos agendados"
        />
        <StatCard
          title="Campanhas Ativas"
          value={campaignsCount || 0}
          icon={Megaphone}
          description="Campanhas em execução"
        />
        <StatCard
          title="Total de Eventos"
          value={totalEventsCount || 0}
          icon={TrendingUp}
          description="Todos os eventos"
        />
        <StatCard
          title="Total de Campanhas"
          value={totalCampaignsCount || 0}
          icon={Users}
          description="Todas as campanhas"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Próximos Eventos</CardTitle>
            <Button asChild size="sm" variant="outline">
              <Link href="/dashboard/events">Ver todos</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {upcomingEvents && upcomingEvents.length > 0 ? (
              <div className="space-y-4">
                {upcomingEvents.map((event) => (
                  <div
                    key={event.id}
                    className="flex items-center justify-between rounded-lg border border-slate-200 p-4"
                  >
                    <div>
                      <p className="font-medium text-slate-900">{event.name}</p>
                      <p className="text-sm text-slate-500">
                        {new Date(event.start_date).toLocaleDateString("pt-BR")}{" "}
                        - {new Date(event.end_date).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        event.status === "planned"
                          ? "bg-blue-100 text-blue-700"
                          : event.status === "active"
                          ? "bg-green-100 text-green-700"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {event.status === "planned" ? "Planejado" : "Ativo"}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Calendar className="h-12 w-12 text-slate-300" />
                <p className="mt-4 text-sm text-slate-500">
                  Nenhum evento agendado
                </p>
                <Button asChild className="mt-4" size="sm">
                  <Link href="/dashboard/events">Criar Evento</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Campanhas Recentes</CardTitle>
            <Button asChild size="sm" variant="outline">
              <Link href="/dashboard/campaigns">Ver todas</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {recentCampaigns && recentCampaigns.length > 0 ? (
              <div className="space-y-4">
                {recentCampaigns.map((campaign) => (
                  <div
                    key={campaign.id}
                    className="flex items-center justify-between rounded-lg border border-slate-200 p-4"
                  >
                    <div>
                      <p className="font-medium text-slate-900">
                        {campaign.name}
                      </p>
                      <p className="text-sm text-slate-500">
                        {campaign.campaign_type === "pre_event"
                          ? "Pré-Evento"
                          : campaign.campaign_type === "during_event"
                          ? "Durante Evento"
                          : campaign.campaign_type === "post_event"
                          ? "Pós-Evento"
                          : "Geral"}
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        campaign.status === "active"
                          ? "bg-green-100 text-green-700"
                          : campaign.status === "scheduled"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {campaign.status === "active"
                        ? "Ativa"
                        : campaign.status === "scheduled"
                        ? "Agendada"
                        : "Rascunho"}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Megaphone className="h-12 w-12 text-slate-300" />
                <p className="mt-4 text-sm text-slate-500">
                  Nenhuma campanha criada
                </p>
                <Button asChild className="mt-4" size="sm">
                  <Link href="/dashboard/campaigns">Criar Campanha</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
