"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ModeToggle } from "@/components/mode-toggle";
import { Home, Users, Briefcase, PieChart } from "lucide-react";

export function MainNav() {
  const pathname = usePathname();

  const routes = [
    {
      href: "/",
      label: "Dashboard",
      icon: Home,
      active: pathname === "/"
    },
    {
      href: "/clients",
      label: "Clients",
      icon: Users,
      active: pathname.startsWith("/clients")
    },
    {
      href: "/assets",
      label: "Assets",
      icon: Briefcase,
      active: pathname.startsWith("/assets")
    },
    {
      href: "/allocations",
      label: "Allocations",
      icon: PieChart,
      active: pathname.startsWith("/allocations")
    }
  ];

  return (
    <header className="w-full flex justify-center border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center gap-20">
        <div className=" flex items-center">
          <Link href="/" className="flex items-center space-x-2">
            <Briefcase className="h-6 w-6" />
            <span className="font-bold">InvestOffice</span>
          </Link>
        </div>
        <nav className="flex items-center space-x-4 lg:space-x-6 gap-5">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "flex items-center text-sm font-medium transition-colors hover:text-primary",
                route.active ? "text-primary" : "text-muted-foreground"
              )}
            >
              <route.icon className="h-4 w-4 mr-2" />
              <span className="hidden md:block">{route.label}</span>
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center space-x-4">
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}