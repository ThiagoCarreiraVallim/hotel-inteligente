import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Bell, CheckCircle, AlertCircle, Info, Zap } from "lucide-react"

export default async function NotificationsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: notifications } = await supabase
    .from("notifications")
    .select("*, events(name), campaigns(name)")
    .eq("user_id", user?.id)
    .order("created_at", { ascending: false })

  const unreadCount = notifications?.filter((n) => !n.is_read).length || 0

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Notificações</h1>
          <p className="mt-2 text-slate-600">
            {unreadCount > 0
              ? `Você tem ${unreadCount} notificação${unreadCount > 1 ? "ões" : ""} não lida${unreadCount > 1 ? "s" : ""}`
              : "Todas as notificações foram lidas"}
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total</p>
                <p className="mt-2 text-3xl font-bold text-slate-900">{notifications?.length || 0}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                <Bell className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Não Lidas</p>
                <p className="mt-2 text-3xl font-bold text-slate-900">{unreadCount}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-yellow-100">
                <AlertCircle className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Sugestões</p>
                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {notifications?.filter((n) => n.notification_type === "campaign_suggestion").length || 0}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                <Zap className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Lidas</p>
                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {notifications?.filter((n) => n.is_read).length || 0}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-100">
                <CheckCircle className="h-6 w-6 text-slate-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Todas as Notificações</CardTitle>
          <CardDescription>Acompanhe alertas e sugestões</CardDescription>
        </CardHeader>
        <CardContent>
          {notifications && notifications.length > 0 ? (
            <div className="space-y-3">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`flex items-start gap-4 rounded-lg border p-4 transition-colors ${
                    !notification.is_read ? "border-blue-200 bg-blue-50" : "border-slate-200 bg-white"
                  }`}
                >
                  <div
                    className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg ${
                      notification.notification_type === "campaign_suggestion"
                        ? "bg-green-100"
                        : notification.notification_type === "event_reminder"
                          ? "bg-blue-100"
                          : notification.notification_type === "data_alert"
                            ? "bg-yellow-100"
                            : "bg-slate-100"
                    }`}
                  >
                    {notification.notification_type === "campaign_suggestion" ? (
                      <Zap className="h-5 w-5 text-green-600" />
                    ) : notification.notification_type === "event_reminder" ? (
                      <Bell className="h-5 w-5 text-blue-600" />
                    ) : notification.notification_type === "data_alert" ? (
                      <AlertCircle className="h-5 w-5 text-yellow-600" />
                    ) : (
                      <Info className="h-5 w-5 text-slate-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold text-slate-900">{notification.title}</p>
                        <p className="mt-1 text-sm text-slate-600">{notification.message}</p>
                        <p className="mt-2 text-xs text-slate-500">
                          {new Date(notification.created_at).toLocaleString("pt-BR")}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`rounded-full px-2 py-1 text-xs font-medium ${
                            notification.priority === "urgent"
                              ? "bg-red-100 text-red-700"
                              : notification.priority === "high"
                                ? "bg-orange-100 text-orange-700"
                                : notification.priority === "medium"
                                  ? "bg-blue-100 text-blue-700"
                                  : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {notification.priority === "urgent"
                            ? "Urgente"
                            : notification.priority === "high"
                              ? "Alta"
                              : notification.priority === "medium"
                                ? "Média"
                                : "Baixa"}
                        </span>
                        {!notification.is_read && <span className="h-2 w-2 rounded-full bg-blue-600" />}
                      </div>
                    </div>
                    {notification.action_url && (
                      <Button asChild size="sm" className="mt-3">
                        <a href={notification.action_url}>Ver Detalhes</a>
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Bell className="h-16 w-16 text-slate-300" />
              <p className="mt-4 text-sm font-medium text-slate-600">Nenhuma notificação</p>
              <p className="mt-1 text-sm text-slate-500">Você receberá notificações aqui quando houver novidades</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
