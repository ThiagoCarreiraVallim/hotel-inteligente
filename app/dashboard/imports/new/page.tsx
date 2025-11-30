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
import { uploadFile } from "@/services/api";
import { setSessionId } from "@/app/actions/cookies";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NewImportPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [importType, setImportType] = useState("manual");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) {
      setError("Selecione um arquivo para importar");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Upload file to backend API
      const result = await uploadFile(file);

      // Salva o session_id nos cookies usando Next.js cookies
      if (result.session_id) {
        await setSessionId(result.session_id);
        return router.push("/dashboard/imports");
      }

      setError("Erro ao importar arquivo");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao importar arquivo");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="relative">
                <div className="h-16 w-16 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />
                <Upload className="absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 text-slate-600" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-slate-900">
                  Importando arquivo...
                </h3>
                <p className="text-sm text-slate-600">
                  Processando seus dados. Isso pode levar até 1 minuto.
                </p>
                <p className="text-xs text-slate-500">
                  Por favor, não feche esta página.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="icon">
          <Link href="/dashboard/imports">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Nova Importação</h1>
          <p className="mt-2 text-slate-600">
            Importe dados do seu sistema hoteleiro
          </p>
        </div>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Upload de Arquivo</CardTitle>
          <CardDescription>
            Selecione o arquivo Excel ou CSV com os dados a serem importados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="importType">Tipo de Importação</Label>
              <Select value={importType} onValueChange={setImportType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="manual">Manual</SelectItem>
                  <SelectItem value="totvs">TOTVS</SelectItem>
                  <SelectItem value="asksuite">AskSuite</SelectItem>
                  <SelectItem value="other">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>

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
                  <Upload className="h-5 w-5 text-slate-600" />
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

            <div className="flex gap-3">
              <Button type="submit" disabled={isLoading || !file}>
                {isLoading ? "Importando..." : "Iniciar Importação"}
              </Button>
              <Button asChild variant="outline">
                <Link href="/dashboard/imports">Cancelar</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Instruções</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-slate-600">
          <p>
            <strong>Formato do arquivo:</strong> O arquivo deve conter colunas
            com dados de reservas, hóspedes ou eventos do hotel.
          </p>
          <p>
            <strong>TOTVS:</strong> Para importações do TOTVS, exporte o
            relatório padrão de reservas ou eventos.
          </p>
          <p>
            <strong>AskSuite:</strong> Exporte os dados de conversas e leads do
            painel do AskSuite.
          </p>
          <p>
            <strong>Manual:</strong> Para importações manuais, certifique-se de
            que o arquivo contenha as colunas necessárias.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
