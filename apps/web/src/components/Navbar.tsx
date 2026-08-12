import { Button } from "@/components/ui/button";
import { signOut, useSession } from "@/lib/auth-client";
import { useTheme } from "@/lib/theme";
import { cn } from "@/lib/utils";
import { LayoutDashboard, LogOut, Moon, Sparkles, Sun } from "lucide-react";
import { Link, useLocation } from "react-router";

interface NavbarProps {
  leftControls?: React.ReactNode;
  centerControls?: React.ReactNode;
  rightControls?: React.ReactNode;
  children?: React.ReactNode;
}

export function Navbar({
  leftControls,
  centerControls,
  rightControls,
  children,
}: NavbarProps) {
  const location = useLocation();
  const { data: session } = useSession();
  const { theme, toggleTheme } = useTheme();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch {
      // ignore
    }
  };

  const isDashboardActive = location.pathname.startsWith("/dashboard") || location.pathname.startsWith("/projects");

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 dark:border-slate-800/80 bg-white/90 dark:bg-[#0b0819]/90 backdrop-blur-xl transition-colors duration-200 h-14 shrink-0">
      <div className="w-full px-4 h-full flex items-center justify-between gap-4">
        {/* Left Section: Custom Left Controls OR Default Brand Logo */}
        <div className="flex items-center gap-3 shrink-0 min-w-0">
          {leftControls ? (
            leftControls
          ) : (
            <div className="flex items-center gap-4">
              <Link to="/" className="flex items-center gap-2 group">
                <span className="font-heading font-extrabold text-base tracking-wider uppercase text-slate-900 dark:text-white">
                  Mintrix
                </span>
              </Link>

              <nav className="flex items-center gap-2">
                <Link
                  to="/dashboard"
                  className={cn(
                    "px-2.5 py-1 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5",
                    isDashboardActive
                      ? "bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/80"
                      : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                  )}
                >
                  <LayoutDashboard className="w-3.5 h-3.5 text-indigo-500" />
                  <span className="hidden sm:inline">Studio Workspace</span>
                </Link>
              </nav>
            </div>
          )}
        </div>

        {/* Center Section */}
        {(centerControls || children) && (
          <div className="flex items-center justify-center gap-3 flex-1 min-w-0">
            {centerControls || children}
          </div>
        )}

        {/* Right Section: Custom Right Controls + Theme Toggle & User Auth */}
        <div className="flex items-center gap-2 shrink-0">
          {rightControls}

          <Button
            variant="outline"
            size="icon-sm"
            onClick={toggleTheme}
            title={`Switch to ${theme === "light" ? "Dark" : "Light"} mode`}
          >
            {theme === "light" ? (
              <Moon className="w-3.5 h-3.5 text-slate-700" />
            ) : (
              <Sun className="w-3.5 h-3.5 text-amber-400" />
            )}
          </Button>

          {session?.user ? (
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800/80">
              <div className="flex items-center gap-1.5">
                <div className="w-6.5 h-6.5 rounded-full bg-indigo-600 text-white font-bold text-[11px] flex items-center justify-center shadow-xs">
                  {session.user.name?.[0]?.toUpperCase() ||
                    session.user.email?.[0]?.toUpperCase() ||
                    "U"}
                </div>
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 hidden xl:inline max-w-[100px] truncate">
                  {session.user.name || session.user.email}
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={handleSignOut}
                title="Sign out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </Button>
            </div>
          ) : (
            <Link to="/auth">
              <Button variant="sleek" size="sm">
                Sign In
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}


