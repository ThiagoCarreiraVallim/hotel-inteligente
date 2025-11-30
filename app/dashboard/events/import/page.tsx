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
import { ArrowLeft, Upload, FileSpreadsheet, CheckCircle } from "lucide-react";
import Link from "next/link";
import { uploadEventFile } from "@/services/api";

export default function ImportEventsPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<{
    message: string;
    imported: number;
  } | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) {
      setError("Selecione um arquivo para importar");
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await uploadEventFile(file);

      if (result.success) {
        setSuccess({
          message: result.message || "Eventos importados com sucesso!",
          imported: result.imported || 0,
        });
        setFile(null);
        // Reset file input
        const fileInput = document.getElementById("file") as HTMLInputElement;
        if (fileInput) fileInput.value = "";
      } else {
        setError(result.message || "Erro ao importar eventos");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao importar arquivo"
      );
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
          <h1 className="text-3xl font-bold text-slate-900">
            Importar Eventos
          </h1>
          <p className="mt-2 text-slate-600">
            Importe eventos a partir de uma planilha Excel ou CSV
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Upload de Arquivo</CardTitle>
            <CardDescription>
              Selecione o arquivo Excel ou CSV com os eventos a serem importados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="file">Arquivo</Label>
                <div className="flex items-center gap-4">
                  <Input
                    id="file"
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="flex-1"
                  />
                </div>
                <p className="text-xs text-slate-500">
                  Formatos aceitos: .xlsx, .xls, .csv (máximo 10MB)
                </p>
              </div>

              {file && (
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center gap-3">
                    <FileSpreadsheet className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="text-sm font-medium text-slate-900">
                        {file.name}
                      </p>
                      <p className="text-xs text-slate-500">
                        {(file.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {error && (
                <div className="rounded-md bg-red-50 p-3 text-sm text-red-800">
                  {error}
                </div>
              )}

              {success && (
                <div className="rounded-md bg-green-50 p-4 text-sm text-green-800">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium">{success.message}</p>
                      <p className="text-xs text-green-600">
                        {success.imported} evento(s) importado(s)
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <Button type="submit" disabled={isLoading || !file}>
                  <Upload className="mr-2 h-4 w-4" />
                  {isLoading ? "Importando..." : "Importar Eventos"}
                </Button>
                <Button asChild variant="outline">
                  <Link href="/dashboard/events">Cancelar</Link>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Formato do Arquivo</CardTitle>
            <CardDescription>
              Estrutura esperada para importação de eventos
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-slate-600">
              O arquivo deve conter as seguintes colunas:
            </p>
            <div className="rounded-lg border border-slate-200 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-3 py-2 text-left font-medium text-slate-700">
                      Coluna
                    </th>
                    <th className="px-3 py-2 text-left font-medium text-slate-700">
                      Tipo
                    </th>
                    <th className="px-3 py-2 text-left font-medium text-slate-700">
                      Obrigatório
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr>
                    <td className="px-3 py-2 font-mono text-xs">nome</td>
                    <td className="px-3 py-2 text-slate-600">Texto</td>
                    <td className="px-3 py-2 text-green-600">Sim</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 font-mono text-xs">data_inicio</td>
                    <td className="px-3 py-2 text-slate-600">Data/Hora</td>
                    <td className="px-3 py-2 text-green-600">Sim</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 font-mono text-xs">data_fim</td>
                    <td className="px-3 py-2 text-slate-600">Data/Hora</td>
                    <td className="px-3 py-2 text-green-600">Sim</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 font-mono text-xs">salao</td>
                    <td className="px-3 py-2 text-slate-600">Texto</td>
                    <td className="px-3 py-2 text-slate-400">Não</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 font-mono text-xs">
                      numero_hospedes
                    </td>
                    <td className="px-3 py-2 text-slate-600">Número</td>
                    <td className="px-3 py-2 text-green-600">Sim</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="rounded-lg bg-blue-50 p-3">
              <p className="text-xs text-blue-700">
                <strong>Dica:</strong> Use o formato de data DD/MM/AAAA HH:MM ou
                AAAA-MM-DD HH:MM para melhor compatibilidade.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
