"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  ArrowLeft,
  Calendar,
  Users,
  MapPin,
  Edit2,
  Trash2,
  Save,
  X,
} from "lucide-react";
import Link from "next/link";
import { getEventById, updateEvent, deleteEvent } from "@/services/api";

interface Event {
  id: string;
  nome: string;
  data_inicio: string;
  data_fim: string;
  salao: string | null;
  numero_hospedes: number | null;
  possiveis_hospedes: string[] | null;
}

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [event, setEvent] = useState<Event | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editForm, setEditForm] = useState({
    nome: "",
    data_inicio: "",
    data_fim: "",
    salao: "",
    numero_hospedes: "",
  });

  useEffect(() => {
    async function fetchEvent() {
      try {
        setLoading(true);
        const data = await getEventById(params.id as string);
        if (data) {
          setEvent(data);
          // Formatar datas para o input datetime-local
          const formatDateForInput = (dateStr: string) => {
            const date = new Date(dateStr);
            return date.toISOString().slice(0, 16);
          };
          setEditForm({
            nome: data.nome,
            data_inicio: formatDateForInput(data.data_inicio),
            data_fim: formatDateForInput(data.data_fim),
            salao: data.salao || "",
            numero_hospedes: data.numero_hospedes?.toString() || "",
          });
        } else {
          setError("Evento não encontrado");
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Erro ao carregar evento"
        );
      } finally {
        setLoading(false);
      }
    }
    fetchEvent();
  }, [params.id]);

  const handleSave = async () => {
    if (!event) return;

    setIsSaving(true);
    setError(null);

    try {
      const eventData = {
        nome: editForm.nome,
        data_inicio: new Date(editForm.data_inicio).toISOString(),
        data_fim: new Date(editForm.data_fim).toISOString(),
        salao: editForm.salao || null,
        numero_hospedes: editForm.numero_hospedes
          ? parseInt(editForm.numero_hospedes)
          : null,
      };

      const result = await updateEvent(event.id, eventData as any);

      if (result.success) {
        setEvent({ ...event, ...eventData });
        setIsEditing(false);
      } else {
        setError(result.message || "Erro ao atualizar evento");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao atualizar evento"
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!event) return;

    setIsDeleting(true);
    setError(null);

    try {
      const result = await deleteEvent(event.id);

      if (result.success) {
        router.push("/dashboard/events");
      } else {
        setError(result.message || "Erro ao excluir evento");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao excluir evento");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelEdit = () => {
    if (event) {
      const formatDateForInput = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toISOString().slice(0, 16);
      };
      setEditForm({
        nome: event.nome,
        data_inicio: formatDateForInput(event.data_inicio),
        data_fim: formatDateForInput(event.data_fim),
        salao: event.salao || "",
        numero_hospedes: event.numero_hospedes?.toString() || "",
      });
    }
    setIsEditing(false);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 animate-pulse rounded bg-slate-200" />
          <div className="space-y-2">
            <div className="h-8 w-64 animate-pulse rounded bg-slate-200" />
            <div className="h-4 w-96 animate-pulse rounded bg-slate-200" />
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="h-20 animate-pulse rounded bg-slate-200" />
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <div className="h-6 w-48 animate-pulse rounded bg-slate-200" />
          </CardHeader>
          <CardContent>
            <div className="h-40 animate-pulse rounded bg-slate-200" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error && !event) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button asChild variant="ghost" size="icon">
            <Link href="/dashboard/events">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Erro</h1>
          </div>
        </div>
        <Card>
          <CardContent className="p-6">
            <p className="text-red-600">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!event) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button asChild variant="ghost" size="icon">
            <Link href="/dashboard/events">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">{event.nome}</h1>
            <p className="mt-2 text-slate-600">Detalhes do evento</p>
          </div>
        </div>
        <div className="flex gap-2">
          {!isEditing ? (
            <>
              <Button variant="outline" onClick={() => setIsEditing(true)}>
                <Edit2 className="mr-2 h-4 w-4" />
                Editar
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Excluir
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                    <AlertDialogDescription>
                      Tem certeza que deseja excluir o evento &quot;{event.nome}
                      &quot;? Esta ação não pode ser desfeita.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDelete}
                      className="bg-red-600 hover:bg-red-700"
                      disabled={isDeleting}
                    >
                      {isDeleting ? "Excluindo..." : "Excluir"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          ) : (
            <>
              <Button onClick={handleSave} disabled={isSaving}>
                <Save className="mr-2 h-4 w-4" />
                {isSaving ? "Salvando..." : "Salvar"}
              </Button>
              <Button variant="outline" onClick={handleCancelEdit}>
                <X className="mr-2 h-4 w-4" />
                Cancelar
              </Button>
            </>
          )}
        </div>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-800">
          {error}
        </div>
      )}

      {/* Cards de estatísticas */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Início</p>
                <p className="mt-2 text-lg font-bold text-slate-900">
                  {formatDate(event.data_inicio)}
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
                <p className="text-sm font-medium text-slate-600">Término</p>
                <p className="mt-2 text-lg font-bold text-slate-900">
                  {formatDate(event.data_fim)}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                <Calendar className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Hóspedes</p>
                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {event.numero_hospedes || 0}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Salão</p>
                <p className="mt-2 text-lg font-bold text-slate-900 truncate max-w-[150px]">
                  {event.salao || "Não definido"}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100">
                <MapPin className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Formulário de edição ou detalhes */}
      <Card>
        <CardHeader>
          <CardTitle>
            {isEditing ? "Editar Evento" : "Informações do Evento"}
          </CardTitle>
          <CardDescription>
            {isEditing
              ? "Altere as informações do evento"
              : "Dados cadastrados do evento"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome do Evento</Label>
                <Input
                  id="nome"
                  required
                  value={editForm.nome}
                  onChange={(e) =>
                    setEditForm({ ...editForm, nome: e.target.value })
                  }
                  placeholder="Ex: Congresso Nacional de Tecnologia"
                />
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="data_inicio">Data de Início</Label>
                  <Input
                    id="data_inicio"
                    type="datetime-local"
                    required
                    value={editForm.data_inicio}
                    onChange={(e) =>
                      setEditForm({ ...editForm, data_inicio: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="data_fim">Data de Término</Label>
                  <Input
                    id="data_fim"
                    type="datetime-local"
                    required
                    value={editForm.data_fim}
                    onChange={(e) =>
                      setEditForm({ ...editForm, data_fim: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="salao">Salão (Opcional)</Label>
                  <Input
                    id="salao"
                    value={editForm.salao}
                    onChange={(e) =>
                      setEditForm({ ...editForm, salao: e.target.value })
                    }
                    placeholder="Ex: Salão Principal, Auditório A"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="numero_hospedes">Número de Hóspedes</Label>
                  <Input
                    id="numero_hospedes"
                    type="number"
                    min="1"
                    value={editForm.numero_hospedes}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        numero_hospedes: e.target.value,
                      })
                    }
                    placeholder="Ex: 100"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Nome do Evento
                </p>
                <p className="mt-1 text-lg text-slate-900">{event.nome}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Salão</p>
                <p className="mt-1 text-lg text-slate-900">
                  {event.salao || "Não definido"}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Data de Início
                </p>
                <p className="mt-1 text-lg text-slate-900">
                  {formatDate(event.data_inicio)}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Data de Término
                </p>
                <p className="mt-1 text-lg text-slate-900">
                  {formatDate(event.data_fim)}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Número de Hóspedes
                </p>
                <p className="mt-1 text-lg text-slate-900">
                  {event.numero_hospedes || "Não definido"}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Lista de possíveis hóspedes */}
      {event.possiveis_hospedes && event.possiveis_hospedes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Possíveis Hóspedes</CardTitle>
            <CardDescription>
              Lista de hóspedes associados a este evento
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {event.possiveis_hospedes.map((hospede, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 rounded-lg border border-slate-200 p-3"
                >
                  <Users className="h-4 w-4 text-slate-500" />
                  <span className="text-sm text-slate-700">{hospede}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
