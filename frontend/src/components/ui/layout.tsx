import { Outlet } from "react-router-dom"
import { AppSidebar } from "@/components/ui/app-sidebar"

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

export function Layout() {
  return (
    <SidebarProvider>
      <AppSidebar />

      <SidebarInset>
        <header className="flex h-16 items-center gap-3 border-b px-4">
          <SidebarTrigger />
          <div>
            <p className="text-sm font-medium">Строительный объект</p>
            <p className="text-xs text-muted-foreground">Журнал выполненных работ</p>
          </div>
        </header>

        <main className="p-4 sm:p-6">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
