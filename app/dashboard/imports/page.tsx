import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Upload,
  FileSpreadsheet,
  CheckCircle,
  XCircle,
  Clock,
  Plus,
} from "lucide-react";

export default async function ImportsPage() {
  const imports = [];
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Importação de Dados
          </h1>
          <p className="mt-2 text-slate-600">
            Importe planilhas do sistema do hotel automaticamente
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/imports/new">
            <Plus className="mr-2 h-4 w-4" />
            Nova Importação
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">
                  Total Importações
                </p>
                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {imports?.length || 0}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                <FileSpreadsheet className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Completas</p>
                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {imports?.filter((i) => i.status === "completed").length || 0}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Pendentes</p>
                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {imports?.filter(
                    (i) => i.status === "pending" || i.status === "processing"
                  ).length || 0}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-yellow-100">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Histórico de Importações</CardTitle>
          <CardDescription>
            Acompanhe todas as importações realizadas
          </CardDescription>
        </CardHeader>
        <CardContent>
          {imports && imports.length > 0 ? (
            <div className="space-y-4">
              {imports.map((importItem) => (
                <div
                  key={importItem.id}
                  className="flex items-center justify-between rounded-lg border border-slate-200 p-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
                      <FileSpreadsheet className="h-5 w-5 text-slate-600" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">
                        {importItem.file_name}
                      </p>
                      <p className="text-sm text-slate-500">
                        {importItem.hotels?.name} •{" "}
                        {new Date(importItem.imported_at).toLocaleString(
                          "pt-BR"
                        )}
                      </p>
                      {importItem.total_records && (
                        <p className="text-xs text-slate-500">
                          {importItem.processed_records || 0} /{" "}
                          {importItem.total_records} registros
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${
                        importItem.status === "completed"
                          ? "bg-green-100 text-green-700"
                          : importItem.status === "processing"
                          ? "bg-blue-100 text-blue-700"
                          : importItem.status === "failed"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {importItem.status === "completed" && (
                        <CheckCircle className="h-3 w-3" />
                      )}
                      {importItem.status === "failed" && (
                        <XCircle className="h-3 w-3" />
                      )}
                      {importItem.status === "processing" && (
                        <Clock className="h-3 w-3" />
                      )}
                      {importItem.status === "pending" && (
                        <Clock className="h-3 w-3" />
                      )}
                      {importItem.status === "completed"
                        ? "Completo"
                        : importItem.status === "processing"
                        ? "Processando"
                        : importItem.status === "failed"
                        ? "Falhou"
                        : "Pendente"}
                    </span>
                    <span className="text-sm text-slate-500">
                      {importItem.import_type === "totvs"
                        ? "TOTVS"
                        : importItem.import_type === "manual"
                        ? "Manual"
                        : importItem.import_type === "asksuite"
                        ? "AskSuite"
                        : "Outro"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Upload className="h-16 w-16 text-slate-300" />
              <p className="mt-4 text-sm font-medium text-slate-600">
                Nenhuma importação realizada
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Comece importando seus dados do sistema do hotel
              </p>
              <Button asChild className="mt-4">
                <Link href="/dashboard/imports/new">Nova Importação</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
