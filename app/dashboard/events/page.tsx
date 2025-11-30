"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Calendar, Plus, Users, TrendingUp, Upload } from "lucide-react";
import { getEvents } from "@/services/api";
import { useEffect, useState } from "react";

export type EventType = {
  success: boolean;
  events: Array<{
    id: string;
    nome: string;
    data_inicio: string;
    data_fim: string;
    salao: string | null;
    numero_hospedes: number | null;
    possiveis_hospedes: string[] | null;
  }>;
  total: number;
  upcomingEvents: number;
};

export default function EventsPage() {
  const [loading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [events, setEvents] = useState<EventType | null>(null);

  useEffect(() => {
    async function fetchProfiles() {
      try {
        setIsLoading(true);
        const data: EventType = await getEvents();
        if (data) {
          setEvents(data);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Erro ao carregar perfis"
        );
      } finally {
        setIsLoading(false);
      }
    }
    fetchProfiles();
  }, []);

  console.log(events);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-9 w-64 animate-pulse rounded-lg bg-slate-200" />
            <div className="h-5 w-96 animate-pulse rounded-lg bg-slate-200" />
          </div>
          <div className="h-10 w-32 animate-pulse rounded-lg bg-slate-200" />
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="h-4 w-32 animate-pulse rounded bg-slate-200" />
                    <div className="h-8 w-16 animate-pulse rounded bg-slate-200" />
                  </div>
                  <div className="h-12 w-12 animate-pulse rounded-lg bg-slate-200" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <div className="h-6 w-48 animate-pulse rounded bg-slate-200" />
            <div className="h-4 w-64 animate-pulse rounded bg-slate-200" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="rounded-lg border border-slate-200 bg-white p-6"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex gap-4">
                      <div className="h-16 w-16 animate-pulse rounded-lg bg-slate-200" />
                      <div className="flex-1 space-y-2">
                        <div className="h-6 w-48 animate-pulse rounded bg-slate-200" />
                        <div className="h-4 w-64 animate-pulse rounded bg-slate-200" />
                        <div className="h-4 w-32 animate-pulse rounded bg-slate-200" />
                      </div>
                    </div>
                    <div className="h-9 w-28 animate-pulse rounded bg-slate-200" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Gestão de Eventos
          </h1>
          <p className="mt-2 text-slate-600">
            Cadastre e gerencie eventos do hotel
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href="/dashboard/events/import">
              <Upload className="mr-2 h-4 w-4" />
              Importar
            </Link>
          </Button>
          <Button asChild>
            <Link href="/dashboard/events/new">
              <Plus className="mr-2 h-4 w-4" />
              Novo Evento
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">
                  Total de Eventos
                </p>
                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {events?.total || 0}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">
                  Próximos para o próximo mês
                </p>
                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {events?.upcomingEvents || 0}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">
                  Total Participantes no período
                </p>
                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {events?.events.reduce(
                    (acc, e) =>
                      acc +
                      (e.numero_hospedes || 0) +
                      (e.possiveis_hospedes?.length || 0),
                    0
                  ) || 0}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Próximos Eventos</CardTitle>
          <CardDescription>Eventos agendados para o futuro</CardDescription>
        </CardHeader>
        <CardContent>
          {events && events.events.length > 0 ? (
            <div className="space-y-4">
              {events.events.map((event) => (
                <div
                  key={event.id}
                  className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex gap-4">
                      <div className="flex h-16 w-16 flex-col items-center justify-center rounded-lg bg-blue-600 text-white">
                        <span className="text-xs font-medium uppercase">
                          {new Date(event.data_inicio).toLocaleDateString(
                            "pt-BR",
                            {
                              month: "short",
                            }
                          )}
                        </span>
                        <span className="text-2xl font-bold">
                          {new Date(event.data_inicio).getDate()}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-slate-900">
                          {event.nome}
                        </h3>
                        <p className="mt-1 text-sm text-slate-600">
                          {new Date(event.data_inicio).toLocaleDateString(
                            "pt-BR"
                          )}{" "}
                          até{" "}
                          {new Date(event.data_fim).toLocaleDateString("pt-BR")}
                        </p>
                        {event.salao && (
                          <p className="mt-2 text-sm text-slate-500">
                            <Calendar className="mr-1 inline h-4 w-4" />
                            Sala: {event.salao}
                          </p>
                        )}
                        {event.numero_hospedes && (
                          <p className="mt-1 text-sm text-slate-500">
                            <Users className="mr-1 inline h-4 w-4" />
                            {event.numero_hospedes} participantes esperados
                          </p>
                        )}
                      </div>
                    </div>
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/dashboard/events/${event.id}`}>
                        Ver Detalhes
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Calendar className="h-16 w-16 text-slate-300" />
              <p className="mt-4 text-sm font-medium text-slate-600">
                Nenhum evento futuro agendado
              </p>
              <Button asChild className="mt-4">
                <Link href="/dashboard/events/new">Criar Primeiro Evento</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
