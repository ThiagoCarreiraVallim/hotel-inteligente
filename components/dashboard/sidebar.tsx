"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Calendar,
  Megaphone,
  Upload,
  Building2,
  Bell,
  Settings,
  BarChart3,
  FileText,
} from "lucide-react";
import Logo from "./../../public/Logo-HT-preto.svg";
import Image from "next/image";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Eventos", href: "/dashboard/events", icon: Calendar },
  { name: "Campanhas", href: "/dashboard/campaigns", icon: Megaphone },
  { name: "Importação de Dados", href: "/dashboard/imports", icon: Upload },
  { name: "Perfis Inteligentes", href: "/dashboard/insights", icon: BarChart3 },
  { name: "Templates", href: "/dashboard/templates", icon: FileText },
  { name: "Hotéis", href: "/dashboard/hotels", icon: Building2 },
  { name: "Notificações", href: "/dashboard/notifications", icon: Bell },
  { name: "Configurações", href: "/dashboard/settings", icon: Settings },
];

export function SidebarContent() {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center border-b border-slate-200 px-6">
        <Image src={Logo} alt="Hotel Inteligente" className="h-20 w-auto" />
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-slate-900 text-white"
                  : "text-slate-700 hover:bg-slate-100"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

export function Sidebar() {
  // desktop sidebar only; hidden on small screens
  return (
    <div className="hidden md:flex h-full w-64 flex-col border-r border-slate-200 bg-white">
      <SidebarContent />
    </div>
  );
}
