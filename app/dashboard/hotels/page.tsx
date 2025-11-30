import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Building2, Plus, MapPin, Bed } from "lucide-react"

export default async function HotelsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user?.id).single()

  const isAdmin = profile?.role === "admin"

  const { data: hotels } = await supabase.from("hotels").select("*").order("name")

  const activeHotels = hotels?.filter((h) => h.active)
  const totalRooms = hotels?.reduce((acc, h) => acc + (h.total_rooms || 0), 0) || 0

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Gestão de Hotéis</h1>
          <p className="mt-2 text-slate-600">Gerencie os hotéis da sua rede</p>
        </div>
        {isAdmin && (
          <Button asChild>
            <Link href="/dashboard/hotels/new">
              <Plus className="mr-2 h-4 w-4" />
              Novo Hotel
            </Link>
          </Button>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total de Hotéis</p>
                <p className="mt-2 text-3xl font-bold text-slate-900">{hotels?.length || 0}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                <Building2 className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Hotéis Ativos</p>
                <p className="mt-2 text-3xl font-bold text-slate-900">{activeHotels?.length || 0}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                <Building2 className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total de Quartos</p>
                <p className="mt-2 text-3xl font-bold text-slate-900">{totalRooms}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
                <Bed className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Todos os Hotéis</CardTitle>
          <CardDescription>Lista completa da rede de hotéis</CardDescription>
        </CardHeader>
        <CardContent>
          {hotels && hotels.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {hotels.map((hotel) => (
                <Link key={hotel.id} href={`/dashboard/hotels/${hotel.id}`} className="block">
                  <div className="group rounded-lg border border-slate-200 p-5 transition-all hover:border-slate-300 hover:shadow-md">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-slate-900 group-hover:text-slate-700">{hotel.name}</h4>
                        <p className="mt-1 flex items-center text-sm text-slate-500">
                          <MapPin className="mr-1 h-3 w-3" />
                          {hotel.location || "Localização não informada"}
                        </p>
                        <div className="mt-3 flex items-center gap-4 text-xs text-slate-600">
                          <span className="flex items-center gap-1">
                            <Bed className="h-3 w-3" />
                            {hotel.total_rooms || 0} quartos
                          </span>
                          <span>Código: {hotel.code}</span>
                        </div>
                      </div>
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-medium ${
                          hotel.active ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {hotel.active ? "Ativo" : "Inativo"}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Building2 className="h-16 w-16 text-slate-300" />
              <p className="mt-4 text-sm font-medium text-slate-600">Nenhum hotel cadastrado</p>
              {isAdmin && (
                <Button asChild className="mt-4">
                  <Link href="/dashboard/hotels/new">Cadastrar Primeiro Hotel</Link>
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
