import { Button } from "@/components/ui/button"
import Link from "next/link"
import { BarChart3, Calendar, Megaphone, Upload, Zap } from "lucide-react"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-slate-50 to-slate-100">
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <h1 className="text-2xl font-bold text-slate-900">Hotel Inteligente</h1>
          <div className="flex gap-4">
            <Button asChild variant="ghost">
              <Link href="/auth/login">Login</Link>
            </Button>
            <Button asChild>
              <Link href="/auth/sign-up">Começar Agora</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="mx-auto max-w-7xl px-6 py-24 text-center">
          <h2 className="text-balance text-5xl font-bold tracking-tight text-slate-900">
            Plataforma Inteligente de Marketing para Hotéis
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-slate-600">
            Automatize campanhas, otimize eventos e aumente a performance do seu hotel com inteligência artificial e
            análises em tempo real.
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <Button asChild size="lg">
              <Link href="/auth/sign-up">Criar Conta Gratuita</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/auth/login">Ver Demo</Link>
            </Button>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-24">
          <h3 className="mb-12 text-center text-3xl font-bold text-slate-900">Principais Funcionalidades</h3>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-white p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-slate-900">
                <Upload className="h-6 w-6 text-white" />
              </div>
              <h4 className="mb-2 text-xl font-semibold text-slate-900">Importação Automática</h4>
              <p className="text-slate-600">
                Receba e processe automaticamente dados do seu sistema hoteleiro, eliminando trabalho manual.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-slate-900">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <h4 className="mb-2 text-xl font-semibold text-slate-900">Perfis Inteligentes</h4>
              <p className="text-slate-600">
                IA analisa seus dados e identifica oportunidades e padrões de comportamento automaticamente.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-slate-900">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <h4 className="mb-2 text-xl font-semibold text-slate-900">Gestão de Eventos</h4>
              <p className="text-slate-600">
                Cadastre e gerencie eventos com histórico completo e acompanhamento de status.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-slate-900">
                <Megaphone className="h-6 w-6 text-white" />
              </div>
              <h4 className="mb-2 text-xl font-semibold text-slate-900">Campanhas Automatizadas</h4>
              <p className="text-slate-600">
                Crie campanhas com templates prontos, materiais em Excel e mensagens pré-formatadas.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-slate-900">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <h4 className="mb-2 text-xl font-semibold text-slate-900">Notificações Inteligentes</h4>
              <p className="text-slate-600">
                Receba alertas e sugestões automáticas de ações para maximizar resultados.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-slate-900">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <h4 className="mb-2 text-xl font-semibold text-slate-900">Integração Total</h4>
              <p className="text-slate-600">
                Conecte com TOTVS e AskSuite para sincronização completa e zero retrabalho.
              </p>
            </div>
          </div>
        </section>

        <section className="border-t border-slate-200 bg-white py-24">
          <div className="mx-auto max-w-4xl px-6 text-center">
            <h3 className="text-3xl font-bold text-slate-900">Pronto para transformar seu marketing hoteleiro?</h3>
            <p className="mt-4 text-lg text-slate-600">Comece gratuitamente e veja resultados em dias.</p>
            <Button asChild size="lg" className="mt-8">
              <Link href="/auth/sign-up">Criar Conta Agora</Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white py-8">
        <div className="mx-auto max-w-7xl px-6 text-center text-sm text-slate-600">
          © 2025 Hotel Inteligente. Todos os direitos reservados.
        </div>
      </footer>
    </div>
  )
}
