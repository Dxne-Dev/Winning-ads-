import { signOutAction } from "@/app/auth/actions";
import { Button } from "@/components/ui/button";
import { AppSidebar } from "@/components/app-sidebar";
import { IconLogOut } from "@/components/icons";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-border/40 bg-background/70 px-6 shadow-sm shadow-primary/5 backdrop-blur-xl md:justify-end">
          <span className="font-semibold md:hidden">Winning Ads AI</span>
          <form action={signOutAction}>
            <Button
              type="submit"
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground"
            >
              <IconLogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Sign out</span>
            </Button>
          </form>
        </header>
        <main className="mx-auto w-full max-w-7xl flex-1 p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
