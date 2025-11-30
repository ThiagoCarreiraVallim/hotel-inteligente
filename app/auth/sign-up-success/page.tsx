import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Mail } from "lucide-react"

export default function SignUpSuccessPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <Mail className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl">Conta Criada com Sucesso!</CardTitle>
            <CardDescription>Verifique seu email para confirmar sua conta</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-center text-sm text-slate-600">
              Enviamos um link de confirmação para seu email. Clique no link para ativar sua conta e fazer login.
            </p>
            <Button asChild className="w-full">
              <Link href="/auth/login">Voltar para Login</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
