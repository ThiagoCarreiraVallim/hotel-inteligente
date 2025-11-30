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
import { Megaphone, Plus, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { getCampaigns } from "@/services/api";
import { getMockedCampaigns } from "@/services/mockedApi";

interface Campaign {
  id: string;
  nome_da_campanha: string;
  motivo_da_campanha: string;
  data_criacao: string;
  campaign_items?: {
    telefone: String;
    nome_cliente: String;
    mensagem_personalizada: String;
  }[];
}

export default function CampaignsPage() {
  const [loading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [campaign, setCampaign] = useState<{
    success: boolean;
    campaigns: Campaign[];
  } | null>(null);

  useEffect(() => {
    async function fetchProfiles() {
      try {
        setIsLoading(true);
        const data: {
          success: boolean;
          campaigns: Campaign[];
        } = await getMockedCampaigns();
        if (data.success) {
          setCampaign(data);
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

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-8 w-64 animate-pulse rounded bg-slate-200" />
            <div className="h-4 w-96 animate-pulse rounded bg-slate-200" />
          </div>
          <div className="h-10 w-40 animate-pulse rounded bg-slate-200" />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
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

          <Card>
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
        </div>

        <Card>
          <CardHeader>
            <div className="h-6 w-48 animate-pulse rounded bg-slate-200" />
            <div className="mt-2 h-4 w-64 animate-pulse rounded bg-slate-200" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-lg border border-slate-200 p-4">
                  <div className="space-y-2">
                    <div className="h-5 w-48 animate-pulse rounded bg-slate-200" />
                    <div className="h-4 w-full animate-pulse rounded bg-slate-200" />
                    <div className="h-3 w-32 animate-pulse rounded bg-slate-200" />
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
            Gestão de Campanhas
          </h1>
          <p className="mt-2 text-slate-600">
            Crie e gerencie campanhas de marketing
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/campaigns/new">
            <Plus className="mr-2 h-4 w-4" />
            Nova Campanha
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">
                  Total de Campanhas
                </p>
                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {campaign?.campaigns.length || 0}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                <Megaphone className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">
                  Total de Contatos
                </p>
                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {campaign?.campaigns.reduce(
                    (acc, c) => acc + (c.campaign_items?.length || 0),
                    0
                  ) || 0}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                <Users className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Todas as Campanhas</CardTitle>
          <CardDescription>
            Gerencie suas campanhas de marketing
          </CardDescription>
        </CardHeader>
        <CardContent>
          {campaign && campaign?.campaigns.length > 0 ? (
            <div className="space-y-4">
              {campaign.campaigns.map((campaign) => (
                <Link
                  key={campaign.id}
                  href={`/dashboard/campaigns/${campaign.id}`}
                  className="block"
                >
                  <div className="flex items-center justify-between rounded-lg border border-slate-200 p-4 transition-colors hover:bg-slate-50">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <p className="font-semibold text-slate-900">
                          {campaign.nome_da_campanha}
                        </p>
                        <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">
                          {campaign.campaign_items?.length || 0} contatos
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-slate-500">
                        {campaign.motivo_da_campanha}
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        Criada em:{" "}
                        {new Date(campaign.data_criacao).toLocaleDateString(
                          "pt-BR"
                        )}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Megaphone className="h-16 w-16 text-slate-300" />
              <p className="mt-4 text-sm font-medium text-slate-600">
                Nenhuma campanha criada
              </p>
              <p className="mt-2 text-sm text-slate-500">
                As campanhas serao geradas automaticamente com os dados
                importados.
              </p>
              <Button className="mt-6" asChild>
                <Link href="/dashboard/imports/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Importar Contatos
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
