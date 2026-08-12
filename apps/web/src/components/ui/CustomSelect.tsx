import { cn } from "@/lib/utils";
import { Check, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export interface CustomSelectOption {
  value: string | number;
  label: string;
  sublabel?: string;
}

interface CustomSelectProps {
  value: string | number;
  options: CustomSelectOption[];
  onChange: (value: any) => void;
  placeholder?: string;
  direction?: "up" | "down";
  align?: "left" | "right";
  className?: string;
}

export function CustomSelect({
  value,
  options,
  onChange,
  placeholder = "Select...",
  direction = "down",
  align = "left",
  className,
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div ref={containerRef} className={cn("relative inline-block text-left", className)}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-2 px-2.5 py-1.5 bg-white dark:bg-[#15102c] border border-slate-200 dark:border-slate-800 hover:border-indigo-500/80 rounded-xl text-xs font-mono font-medium text-slate-800 dark:text-slate-200 shadow-2xs focus-visible:ring-2 focus-visible:ring-indigo-500/50 focus:outline-none transition-all cursor-pointer"
      >
        <span className="truncate">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          className={cn(
            "w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform duration-200",
            isOpen && "rotate-180 text-indigo-500"
          )}
        />
      </button>

      {isOpen && (
        <div
          className={cn(
            "absolute w-52 max-h-56 overflow-y-auto bg-white dark:bg-[#15102c] border border-slate-200 dark:border-slate-800/90 rounded-xl shadow-2xl z-50 p-1 space-y-0.5 animate-in fade-in zoom-in-95 duration-150",
            align === "right" ? "right-0" : "left-0",
            direction === "up" ? "bottom-full mb-1.5" : "top-full mt-1.5"
          )}
        >
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <button
                key={String(opt.value)}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={cn(
                  "w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-mono text-left transition-colors cursor-pointer",
                  isSelected
                    ? "bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 font-bold border border-indigo-200 dark:border-indigo-800/60"
                    : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1b1538]"
                )}
              >
                <div className="min-w-0">
                  <div className="truncate">{opt.label}</div>
                  {opt.sublabel && (
                    <div className="text-[9px] text-slate-400 dark:text-slate-500 font-sans font-normal truncate">
                      {opt.sublabel}
                    </div>
                  )}
                </div>
                {isSelected && <Check className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0 ml-1.5" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}


