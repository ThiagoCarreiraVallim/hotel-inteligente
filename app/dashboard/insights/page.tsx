"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BarChart3, TrendingUp, Users, Target, Sparkles, Brain, MapPin, Calendar, Mail, Briefcase } from "lucide-react"
import { getProfiles } from "@/services/api"

interface Profile {
  id: string
  perfil: {
    nome: string
    profissao: string
    datas: {
      data: string
      tipo: string
      recorrencia: string
      periodo: string
    }[]
    localizacao: {
      estado: string
      pais: string
      cidade: string
      ddd: string
    }
    vinculo: string[]
    origem_de_costume: string
    quartos_e_hospedagem: string[]
    email: string
  }
  historico: {
    total_hospedagens: number
    primeira_hospedagem: string
    ultima_hospedagem: string
    hospedagens: string[]
    valor_total_gasto: number
    valor_medio_diaria: number
  }
  metadata: {
    criado_em: string
    atualizado_em: string
    uploads_processados: number
    qualidade_dados: string
  }
}

interface ProfilesResponse {
  success: boolean
  total: number
  limit: number
  offset: number
  profiles: Profile[]
}

export default function InsightsPage() {
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [total, setTotal] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchProfiles() {
      try {
        setIsLoading(true)
        const sessionId = localStorage.getItem("sessionId") || ""
        const data: ProfilesResponse = await getProfiles(sessionId)
        if (data.success) {
          setProfiles(data.profiles)
          setTotal(data.total)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro ao carregar perfis")
      } finally {
        setIsLoading(false)
      }
    }
    fetchProfiles()
  }, [])

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "-"
    return new Date(dateStr).toLocaleDateString("pt-BR")
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value)
  }

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case "alta":
        return "bg-green-100 text-green-700"
      case "media":
        return "bg-yellow-100 text-yellow-700"
      case "baixa":
        return "bg-red-100 text-red-700"
      default:
        return "bg-slate-100 text-slate-700"
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Perfis Inteligentes</h1>
        <p className="mt-2 text-slate-600">Análises e insights gerados por IA sobre seus dados</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total de Perfis</p>
                <p className="mt-2 text-3xl font-bold text-slate-900">{total}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
                <Brain className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Perfis Carregados</p>
                <p className="mt-2 text-3xl font-bold text-slate-900">{profiles.length}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                <Target className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Hospedagens Totais</p>
                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {profiles.reduce((acc, p) => acc + p.historico.total_hospedagens, 0)}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                <Sparkles className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-blue-900">Análise de IA</CardTitle>
              <CardDescription className="text-blue-700">
                Insights gerados automaticamente com inteligência artificial
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border border-blue-200 bg-white p-4">
              <div className="flex items-center gap-2 text-blue-900">
                <TrendingUp className="h-5 w-5" />
                <h4 className="font-semibold">Tendências Identificadas</h4>
              </div>
              <p className="mt-2 text-sm text-slate-600">
                IA analisa padrões de reservas e identifica os melhores momentos para campanhas
              </p>
            </div>

            <div className="rounded-lg border border-blue-200 bg-white p-4">
              <div className="flex items-center gap-2 text-blue-900">
                <Users className="h-5 w-5" />
                <h4 className="font-semibold">Segmentação Inteligente</h4>
              </div>
              <p className="mt-2 text-sm text-slate-600">
                Agrupa hóspedes por comportamento e preferências para campanhas direcionadas
              </p>
            </div>

            <div className="rounded-lg border border-blue-200 bg-white p-4">
              <div className="flex items-center gap-2 text-blue-900">
                <BarChart3 className="h-5 w-5" />
                <h4 className="font-semibold">Previsão de Demanda</h4>
              </div>
              <p className="mt-2 text-sm text-slate-600">
                Prevê períodos de alta e baixa ocupação para otimizar preços e campanhas
              </p>
            </div>

            <div className="rounded-lg border border-blue-200 bg-white p-4">
              <div className="flex items-center gap-2 text-blue-900">
                <Target className="h-5 w-5" />
                <h4 className="font-semibold">Recomendações Personalizadas</h4>
              </div>
              <p className="mt-2 text-sm text-slate-600">
                Sugere campanhas específicas baseadas em dados históricos e eventos futuros
              </p>
            </div>
          </div>

          <div className="rounded-lg border border-blue-200 bg-white p-4">
            <p className="text-sm text-slate-600">
              Para gerar novos insights, importe dados atualizados do seu sistema hoteleiro. A IA processará
              automaticamente os dados e criará análises personalizadas.
            </p>
            <div className="mt-4 flex gap-3">
              <Button asChild>
                <a href="/dashboard/imports/new">Importar Dados</a>
              </Button>
              <Button variant="outline">Ver Documentação</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {isLoading && (
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-slate-600">Carregando perfis...</p>
          </CardContent>
        </Card>
      )}

      {error && (
        <Card className="border-red-200">
          <CardContent className="p-6">
            <p className="text-center text-red-600">{error}</p>
          </CardContent>
        </Card>
      )}

      {!isLoading && profiles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Perfis de Hóspedes</CardTitle>
            <CardDescription>Dados detalhados dos perfis gerados pela IA</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {profiles.map((profile) => (
                <div key={profile.id} className="rounded-lg border border-slate-200 p-4 hover:bg-slate-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h4 className="font-semibold text-slate-900">{profile.perfil.nome}</h4>
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${getQualityColor(profile.metadata.qualidade_dados)}`}>
                          {profile.metadata.qualidade_dados}
                        </span>
                      </div>

                      <div className="mt-2 flex flex-wrap gap-4 text-sm text-slate-600">
                        {profile.perfil.email && (
                          <div className="flex items-center gap-1">
                            <Mail className="h-4 w-4" />
                            <span>{profile.perfil.email}</span>
                          </div>
                        )}
                        {profile.perfil.profissao && (
                          <div className="flex items-center gap-1">
                            <Briefcase className="h-4 w-4" />
                            <span>{profile.perfil.profissao}</span>
                          </div>
                        )}
                        {(profile.perfil.localizacao.cidade || profile.perfil.localizacao.estado || profile.perfil.localizacao.pais) && (
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            <span>
                              {[profile.perfil.localizacao.cidade, profile.perfil.localizacao.estado, profile.perfil.localizacao.pais]
                                .filter(Boolean)
                                .join(", ")}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-slate-500">Hospedagens:</span>
                          <span className="ml-1 font-medium">{profile.historico.total_hospedagens}</span>
                        </div>
                        <div>
                          <span className="text-slate-500">Primeira:</span>
                          <span className="ml-1 font-medium">{formatDate(profile.historico.primeira_hospedagem)}</span>
                        </div>
                        <div>
                          <span className="text-slate-500">Última:</span>
                          <span className="ml-1 font-medium">{formatDate(profile.historico.ultima_hospedagem)}</span>
                        </div>
                        <div>
                          <span className="text-slate-500">Total gasto:</span>
                          <span className="ml-1 font-medium">{formatCurrency(profile.historico.valor_total_gasto)}</span>
                        </div>
                      </div>

                      {profile.perfil.datas && profile.perfil.datas.length > 0 && (
                        <div className="mt-3">
                          <span className="text-sm text-slate-500">Datas importantes:</span>
                          <div className="mt-1 flex flex-wrap gap-2">
                            {profile.perfil.datas.map((data, idx) => (
                              <span key={idx} className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-1 text-xs text-blue-700">
                                <Calendar className="h-3 w-3" />
                                {data.data} ({data.tipo})
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {!isLoading && profiles.length === 0 && !error && (
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Users className="h-16 w-16 text-slate-300" />
              <p className="mt-4 text-sm font-medium text-slate-600">Nenhum perfil encontrado</p>
              <p className="mt-1 text-sm text-slate-500">Importe dados para gerar perfis inteligentes</p>
              <Button asChild className="mt-4">
                <a href="/dashboard/imports/new">Importar Dados</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
