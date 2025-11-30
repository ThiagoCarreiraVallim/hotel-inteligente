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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft,
  Download,
  Edit2,
  Save,
  X,
  Users,
  Calendar,
  MessageSquare,
  Phone,
} from "lucide-react";
import Link from "next/link";
import { getCampaign } from "@/services/api";
import { getMockedCampaign } from "@/services/mockedApi";

interface CampaignItem {
  id: string;
  telefone: string;
  nome_cliente: string;
  mensagem_personalizada: string;
}

interface Campaign {
  id: string;
  nome_da_campanha: string;
  motivo_da_campanha: string;
  data_criacao: string;
  campaign_items: CampaignItem[];
}

export default function CampaignDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<CampaignItem | null>(null);

  useEffect(() => {
    async function fetchCampaign() {
      try {
        setLoading(true);
        const data = await getMockedCampaign(params.id as string);
        if (data.success) {
          setCampaign(data.campaign);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Erro ao carregar campanha"
        );
      } finally {
        setLoading(false);
      }
    }
    fetchCampaign();
  }, [params.id]);

  const handleEditClick = (item: CampaignItem) => {
    setEditingItemId(item.id);
    setEditForm({ ...item });
  };

  const handleCancelEdit = () => {
    setEditingItemId(null);
    setEditForm(null);
  };

  const handleSaveEdit = async () => {
    if (!editForm || !campaign) return;

    // TODO: Implementar chamada à API para salvar
    // await updateCampaignItem(editForm);

    // Atualiza localmente
    const updatedItems = campaign.campaign_items.map((item) =>
      item.id === editForm.id ? editForm : item
    );
    setCampaign({ ...campaign, campaign_items: updatedItems });
    setEditingItemId(null);
    setEditForm(null);
  };

  const handleExportExcel = () => {

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

        <div className="grid gap-6 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
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
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-lg border p-4">
                  <div className="h-24 animate-pulse rounded bg-slate-200" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !campaign) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button asChild variant="ghost" size="icon">
            <Link href="/dashboard/campaigns">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Erro</h1>
          </div>
        </div>
        <Card>
          <CardContent className="p-6">
            <p className="text-red-600">{error || "Campanha não encontrada"}</p>
          </CardContent>
        </Card>
      </div>
    );
  }



  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button asChild variant="ghost" size="icon">
            <Link href="/dashboard/campaigns">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              {campaign.nome_da_campanha}
            </h1>
            <p className="mt-2 text-slate-600">{campaign.motivo_da_campanha}</p>
          </div>
        </div>
        <Button onClick={handleExportExcel} className="gap-2">
          <Download className="h-4 w-4" />
          Exportar Excel
        </Button>
      </div>

      {/* Cards de estatísticas */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">
                  Total de Contatos
                </p>
                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {campaign.campaign_items?.length || 0}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">
                  Data de Criação
                </p>
                <p className="mt-2 text-xl font-bold text-slate-900">
                  {new Date(campaign.data_criacao).toLocaleDateString("pt-BR")}
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
                <p className="text-sm font-medium text-slate-600">Motivo</p>
                <p className="mt-2 text-lg font-medium text-slate-900 truncate max-w-[200px]">
                  {campaign.motivo_da_campanha}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
                <MessageSquare className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Contatos */}
      <Card>
        <CardHeader>
          <CardTitle>Contatos da Campanha</CardTitle>
          <CardDescription>
            Lista de contatos com mensagens personalizadas para WhatsApp
          </CardDescription>
        </CardHeader>
        <CardContent>
          {campaign.campaign_items && campaign.campaign_items.length > 0 ? (
            <div className="space-y-4">
              {campaign.campaign_items.map((item) => (
                <div
                  key={item.id}
                  className="rounded-lg border border-slate-200 p-4 transition-colors hover:bg-slate-50"
                >
                  {editingItemId === item.id && editForm ? (
                    // Modo de edição
                    <div className="space-y-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor={`telefone-${item.id}`}>
                            Telefone
                          </Label>
                          <Input
                            id={`telefone-${item.id}`}
                            value={editForm.telefone}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                telefone: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`nome-${item.id}`}>
                            Nome do Cliente
                          </Label>
                          <Input
                            id={`nome-${item.id}`}
                            value={editForm.nome_cliente}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                nome_cliente: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`mensagem-${item.id}`}>
                          Mensagem Personalizada
                        </Label>
                        <Textarea
                          id={`mensagem-${item.id}`}
                          value={editForm.mensagem_personalizada}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              mensagem_personalizada: e.target.value,
                            })
                          }
                          rows={4}
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={handleSaveEdit}>
                          <Save className="mr-2 h-4 w-4" />
                          Salvar
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleCancelEdit}
                        >
                          <X className="mr-2 h-4 w-4" />
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  ) : (
                    // Modo de visualização
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-slate-500" />
                            <span className="font-medium text-slate-900">
                              {item.telefone}
                            </span>
                          </div>
                          <span className="text-slate-300">|</span>
                          <span className="text-slate-700">
                            {item.nome_cliente}
                          </span>
                        </div>
                        <div className="rounded-lg bg-green-50 border border-green-200 p-3">
                          <div className="flex items-start gap-2">
                            <MessageSquare className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-slate-700 whitespace-pre-wrap">
                              {item.mensagem_personalizada}
                            </p>
                          </div>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEditClick(item)}
                        className="ml-4"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Users className="h-16 w-16 text-slate-300" />
              <p className="mt-4 text-sm font-medium text-slate-600">
                Nenhum contato cadastrado nesta campanha
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
