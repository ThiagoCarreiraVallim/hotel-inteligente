import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { FileText, Plus, Copy } from "lucide-react"

export default async function TemplatesPage() {
  const supabase = await createClient()

  const { data: templates } = await supabase
    .from("campaign_templates")
    .select("*")
    .order("created_at", { ascending: false })

  const defaultTemplates = templates?.filter((t) => t.is_default)
  const customTemplates = templates?.filter((t) => !t.is_default)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Templates de Campanhas</h1>
          <p className="mt-2 text-slate-600">Modelos prontos para suas campanhas de marketing</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/templates/new">
            <Plus className="mr-2 h-4 w-4" />
            Novo Template
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total de Templates</p>
                <p className="mt-2 text-3xl font-bold text-slate-900">{templates?.length || 0}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Padrão</p>
                <p className="mt-2 text-3xl font-bold text-slate-900">{defaultTemplates?.length || 0}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                <FileText className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Personalizados</p>
                <p className="mt-2 text-3xl font-bold text-slate-900">{customTemplates?.length || 0}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
                <Copy className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Templates Padrão</CardTitle>
          <CardDescription>Modelos prontos para uso imediato</CardDescription>
        </CardHeader>
        <CardContent>
          {defaultTemplates && defaultTemplates.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {defaultTemplates.map((template) => (
                <div key={template.id} className="rounded-lg border border-slate-200 p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-900">{template.name}</h4>
                      <p className="mt-1 text-sm text-slate-500">{template.description}</p>
                      <div className="mt-3 rounded-md bg-slate-50 p-3">
                        <p className="text-xs text-slate-600">{template.message_template}</p>
                      </div>
                      {template.usage_count > 0 && (
                        <p className="mt-2 text-xs text-slate-500">Usado {template.usage_count} vezes</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-sm text-slate-500">Nenhum template padrão disponível</p>
          )}
        </CardContent>
      </Card>

      {customTemplates && customTemplates.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Templates Personalizados</CardTitle>
            <CardDescription>Modelos criados por você</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {customTemplates.map((template) => (
                <div key={template.id} className="rounded-lg border border-slate-200 p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-900">{template.name}</h4>
                      <p className="mt-1 text-sm text-slate-500">{template.description}</p>
                      <div className="mt-3 rounded-md bg-slate-50 p-3">
                        <p className="text-xs text-slate-600">{template.message_template}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
