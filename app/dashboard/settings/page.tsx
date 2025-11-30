"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { User, Building2, Bell } from "lucide-react"

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [profile, setProfile] = useState<any>(null)
  const [hotels, setHotels] = useState<any[]>([])
  const [formData, setFormData] = useState({
    full_name: "",
    role: "",
    hotel_id: "",
    phone: "",
  })

  useEffect(() => {
    loadProfile()
    loadHotels()
  }, [])

  const loadProfile = async () => {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (user) {
      const { data } = await supabase.from("profiles").select("*, hotels(name)").eq("id", user.id).single()

      if (data) {
        setProfile(data)
        setFormData({
          full_name: data.full_name || "",
          role: data.role || "",
          hotel_id: data.hotel_id || "",
          phone: data.phone || "",
        })
      }
    }
  }

  const loadHotels = async () => {
    const supabase = createClient()
    const { data } = await supabase.from("hotels").select("*").eq("active", true).order("name")

    setHotels(data || [])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(null)
    const supabase = createClient()

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("Usuário não autenticado")

      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          full_name: formData.full_name,
          role: formData.role,
          hotel_id: formData.hotel_id || null,
          phone: formData.phone,
        })
        .eq("id", user.id)

      if (updateError) throw updateError

      setSuccess("Perfil atualizado com sucesso!")
      await loadProfile()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao atualizar perfil")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Configurações</h1>
        <p className="mt-2 text-slate-600">Gerencie suas preferências e informações</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                  <User className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <CardTitle>Perfil do Usuário</CardTitle>
                  <CardDescription>Atualize suas informações pessoais</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="full_name">Nome Completo</Label>
                  <Input
                    id="full_name"
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    placeholder="Seu nome completo"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="(00) 00000-0000"
                  />
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="role">Função</Label>
                    <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="marketing">Marketing</SelectItem>
                        <SelectItem value="sales">Vendas</SelectItem>
                        <SelectItem value="manager">Gerente</SelectItem>
                        <SelectItem value="admin">Administrador</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="hotel">Hotel</Label>
                    <Select
                      value={formData.hotel_id}
                      onValueChange={(value) => setFormData({ ...formData, hotel_id: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Nenhum</SelectItem>
                        {hotels.map((hotel) => (
                          <SelectItem key={hotel.id} value={hotel.id}>
                            {hotel.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {error && <div className="rounded-md bg-red-50 p-3 text-sm text-red-800">{error}</div>}

                {success && <div className="rounded-md bg-green-50 p-3 text-sm text-green-800">{success}</div>}

                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Salvando..." : "Salvar Alterações"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                  <Bell className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <CardTitle>Preferências de Notificações</CardTitle>
                  <CardDescription>Configure como deseja receber notificações</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border border-slate-200 p-4">
                <div>
                  <p className="font-medium text-slate-900">Sugestões de Campanhas</p>
                  <p className="text-sm text-slate-500">Receba sugestões automáticas de campanhas</p>
                </div>
                <input type="checkbox" className="h-5 w-5 rounded border-slate-300" defaultChecked />
              </div>

              <div className="flex items-center justify-between rounded-lg border border-slate-200 p-4">
                <div>
                  <p className="font-medium text-slate-900">Lembretes de Eventos</p>
                  <p className="text-sm text-slate-500">Alertas sobre eventos próximos</p>
                </div>
                <input type="checkbox" className="h-5 w-5 rounded border-slate-300" defaultChecked />
              </div>

              <div className="flex items-center justify-between rounded-lg border border-slate-200 p-4">
                <div>
                  <p className="font-medium text-slate-900">Alertas de Dados</p>
                  <p className="text-sm text-slate-500">Notificações sobre importações e análises</p>
                </div>
                <input type="checkbox" className="h-5 w-5 rounded border-slate-300" defaultChecked />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
                  <Building2 className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <CardTitle>Informações da Conta</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {profile && (
                <>
                  <div>
                    <p className="text-sm text-slate-500">Email</p>
                    <p className="font-medium text-slate-900">{profile.id ? "Configurado" : "Não configurado"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Hotel Atual</p>
                    <p className="font-medium text-slate-900">{profile.hotels?.name || "Nenhum hotel selecionado"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Função</p>
                    <p className="font-medium text-slate-900">
                      {profile.role === "admin"
                        ? "Administrador"
                        : profile.role === "manager"
                          ? "Gerente"
                          : profile.role === "sales"
                            ? "Vendas"
                            : "Marketing"}
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="text-red-900">Zona de Perigo</CardTitle>
              <CardDescription className="text-red-700">Ações irreversíveis</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-red-800">
                Desativar ou excluir sua conta removerá todos os seus dados permanentemente.
              </p>
              <Button variant="destructive" className="mt-4" disabled>
                Desativar Conta
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
