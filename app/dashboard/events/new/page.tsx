"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { createEvent } from "@/services/api";

export default function NewEventPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    nome: "",
    data_inicio: "",
    data_fim: "",
    salao: "",
    numero_hospedes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const eventData = {
        nome: formData.nome,
        data_inicio: new Date(formData.data_inicio).toISOString(),
        data_fim: new Date(formData.data_fim).toISOString(),
        salao: formData.salao || null,
        numero_hospedes: formData.numero_hospedes
          ? parseInt(formData.numero_hospedes)
          : null,
      };

      const result = await createEvent(eventData as any);

      if (result.id) {
        router.push("/dashboard/events");
      } else {
        setError(result.message || "Erro ao criar evento");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao criar evento");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="icon">
          <Link href="/dashboard/events">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Novo Evento</h1>
          <p className="mt-2 text-slate-600">
            Cadastre um novo evento do hotel
          </p>
        </div>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Informações do Evento</CardTitle>
          <CardDescription>Preencha os dados básicos do evento</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome do Evento</Label>
              <Input
                id="nome"
                required
                value={formData.nome}
                onChange={(e) =>
                  setFormData({ ...formData, nome: e.target.value })
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
                  value={formData.data_inicio}
                  onChange={(e) =>
                    setFormData({ ...formData, data_inicio: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="data_fim">Data de Término</Label>
                <Input
                  id="data_fim"
                  type="datetime-local"
                  required
                  value={formData.data_fim}
                  onChange={(e) =>
                    setFormData({ ...formData, data_fim: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="salao">Salão (Opcional)</Label>
              <Input
                id="salao"
                value={formData.salao}
                onChange={(e) =>
                  setFormData({ ...formData, salao: e.target.value })
                }
                placeholder="Ex: Salão Principal, Auditório A"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="numero_hospedes">Número de Hóspedes</Label>
              <Input
                id="numero_hospedes"
                type="number"
                required
                min="1"
                value={formData.numero_hospedes}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    numero_hospedes: e.target.value,
                  })
                }
                placeholder="Ex: 100"
              />
            </div>

            {error && (
              <div className="rounded-md bg-red-50 p-3 text-sm text-red-800">
                {error}
              </div>
            )}

            <div className="flex gap-3">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Criando..." : "Criar Evento"}
              </Button>
              <Button asChild variant="outline">
                <Link href="/dashboard/events">Cancelar</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
