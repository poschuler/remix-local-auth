import { Link, NavLink } from "@remix-run/react";
import clsx from "clsx";
import { Menu, Package2, Search } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "~/components/ui/sheet";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
          <NavLink
            to="/sign-in"
            className={({ isActive }) =>
              clsx(
                "transition-colors",
                isActive
                  ? "text-foreground hover:text-muted-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )
            }
          >
            Sign in
          </NavLink>
          <NavLink
            to="/sign-up"
            className={({ isActive }) =>
              clsx(
                "transition-colors",
                isActive
                  ? "text-foreground hover:text-muted-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )
            }
          >
            Sign up
          </NavLink>
          <NavLink
            to="/protected"
            className={({ isActive }) =>
              clsx(
                "transition-colors",
                isActive
                  ? "text-foreground hover:text-muted-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )
            }
          >
            Protected route
          </NavLink>
        </nav>
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="shrink-0 md:hidden"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <nav className="grid gap-6 text-lg font-medium">
              <NavLink
                to="/sign-in"
                className={({ isActive }) =>
                  clsx(
                    "transition-colors",
                    isActive
                      ? "text-foreground hover:text-muted-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )
                }
              >
                Sign in
              </NavLink>
              <NavLink
                to="/sign-up"
                className={({ isActive }) =>
                  clsx(
                    "transition-colors",
                    isActive
                      ? "text-foreground hover:text-muted-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )
                }
              >
                Sign up
              </NavLink>
              <NavLink
                to="/protected"
                className={({ isActive }) =>
                  clsx(
                    "transition-colors",
                    isActive
                      ? "text-foreground hover:text-muted-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )
                }
              >
                Protected route
              </NavLink>
            </nav>
          </SheetContent>
        </Sheet>
      </header>
      <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
        {children}
      </main>
    </div>
  );
}
