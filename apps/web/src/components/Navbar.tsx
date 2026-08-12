import { Button } from "@/components/ui/button";
import { signOut, useSession } from "@/lib/auth-client";
import { useTheme } from "@/lib/theme";
import { cn } from "@/lib/utils";
import { LayoutDashboard, LogOut, Moon, Sun, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
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
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isDashboardActive =
    location.pathname.startsWith("/dashboard") || location.pathname.startsWith("/projects");

  const avatarInitial =
    session?.user?.name?.[0]?.toUpperCase() ||
    session?.user?.email?.[0]?.toUpperCase() ||
    "M";

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 dark:border-slate-800/80 bg-white/95 dark:bg-[#0b0819]/95 backdrop-blur-xl transition-colors duration-200 h-14 shrink-0">
      <div className="w-full px-4 h-full flex items-center justify-between gap-4">
        {/* Left Section */}
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
                      : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200",
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

        {/* Right Section: Actions + Avatar Dropdown */}
        <div className="flex items-center gap-3 shrink-0">
          {rightControls}

          {session?.user ? (
            <div className="relative" ref={menuRef}>
              {/* Avatar Only Button */}
              <button
                type="button"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold text-xs flex items-center justify-center cursor-pointer shadow-md transition-all border-2 border-indigo-400/50 hover:scale-105"
                title="User Profile Menu"
              >
                {avatarInitial}
              </button>

              {/* Avatar Dropdown Popover */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-[#140f29] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150 space-y-1">
                  {/* User Profile Header */}
                  <div className="p-2.5 border-b border-slate-100 dark:border-slate-800/80 mb-1">
                    <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                      {session.user.name || "Studio Creator"}
                    </p>
                    <p className="text-[10px] text-slate-400 truncate font-mono">
                      {session.user.email}
                    </p>
                  </div>

                  {/* Dark mode switch */}
                  <button
                    type="button"
                    onClick={toggleTheme}
                    className="w-full px-2.5 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 rounded-xl flex items-center justify-between transition-colors cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      {theme === "dark" ? (
                        <Moon className="w-3.5 h-3.5 text-indigo-400" />
                      ) : (
                        <Sun className="w-3.5 h-3.5 text-amber-500" />
                      )}
                      <span>Dark Mode</span>
                    </span>
                    <span
                      className={cn(
                        "w-7 h-4 rounded-full p-0.5 transition-colors relative flex items-center",
                        theme === "dark" ? "bg-indigo-600" : "bg-slate-300",
                      )}
                    >
                      <span
                        className={cn(
                          "w-3 h-3 rounded-full bg-white transition-transform shadow-xs",
                          theme === "dark" ? "translate-x-3" : "translate-x-0",
                        )}
                      />
                    </span>
                  </button>

                  {/* Sign out */}
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="w-full px-2.5 py-2 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-xl flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5 text-red-500" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
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
