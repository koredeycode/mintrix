import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RarityBadge } from "@/components/ui/RarityBadge";
import { type Element, api } from "@/lib/api";
import { cn } from "@/lib/utils";
import {
  AlertCircle,
  Check,
  CheckCircle2,
  Eye,
  Sliders,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

// --- CONFIRMATION MODAL ---
interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "info";
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmModal({
  isOpen,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger",
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onCancel();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div
      onClick={onCancel}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-[#130f26] border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border",
                variant === "danger"
                  ? "bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800"
                  : "bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800"
              )}
            >
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">{title}</h3>
              <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">{message}</p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100 dark:border-slate-800/80">
          <Button variant="secondary" onClick={onCancel}>
            {cancelText}
          </Button>
          <Button
            variant={variant === "danger" ? "destructive" : "default"}
            onClick={onConfirm}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}

// --- ALERT MODAL ---
interface AlertModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  type?: "error" | "success" | "info" | undefined;
  onClose: () => void;
}

export function AlertModal({
  isOpen,
  title,
  message,
  type = "error",
  onClose,
}: AlertModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#130f26] border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
        <div className="flex items-start gap-3">
          <div
            className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border",
              type === "error"
                ? "bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800"
                : type === "success"
                  ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800"
                  : "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800"
            )}
          >
            {type === "success" ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">{title}</h3>
            <p className="text-slate-500 dark:text-slate-400 text-xs mt-1 leading-relaxed">{message}</p>
          </div>
        </div>

        <div className="flex justify-end pt-2 border-t border-slate-100 dark:border-slate-800/80">
          <Button variant="sleek" onClick={onClose}>
            OK
          </Button>
        </div>
      </div>
    </div>
  );
}

// --- EXPANDED ELEMENT LIGHTBOX MODAL ---
interface ElementLightboxModalProps {
  element: Element | null;
  layerName?: string;
  totalWeight?: number;
  isSelectedForPreview?: boolean;
  isOpen: boolean;
  onClose: () => void;
  onSelectForPreview?: ((elementId: string) => void) | undefined;
  onWeightChange?: ((elementId: string, weight: number) => void) | undefined;
  onDelete?: ((elementId: string) => void) | undefined;
}

export function ElementLightboxModal({
  element,
  layerName = "Layer",
  totalWeight = 1,
  isSelectedForPreview = false,
  isOpen,
  onClose,
  onSelectForPreview,
  onWeightChange,
  onDelete,
}: ElementLightboxModalProps) {
  const [weight, setWeight] = useState<number>(element?.weight || 1);

  useEffect(() => {
    if (element) setWeight(element.weight || 1);
  }, [element]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !element) return null;

  const weightPercent =
    totalWeight > 0 ? Math.round((weight / totalWeight) * 100) : 0;
  const cleanName = element.filename.replace(/^.*?-/, "").replace(/\.[^/.]+$/, "");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200 select-none">
      <div className="bg-white dark:bg-[#130f26] border border-slate-200 dark:border-slate-800/90 rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-5 overflow-hidden relative">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <Badge variant="default">{layerName}</Badge>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100 truncate max-w-[240px]">
              {cleanName}
            </h3>
            <RarityBadge percentage={weightPercent} />
          </div>
          <Button variant="ghost" size="icon-sm" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Image Preview Box */}
        <div className="w-full aspect-square max-h-[320px] rounded-2xl bg-slate-100 dark:bg-[#090616] border border-slate-200 dark:border-slate-800 flex items-center justify-center overflow-hidden p-4 shadow-inner relative group">
          <img
            src={api.getElementImageUrl(element.id)}
            alt={element.filename}
            className="w-full h-full object-contain filter drop-shadow-md"
          />
        </div>

        {/* Metadata Details & Weight Slider */}
        <div className="p-4 bg-slate-50 dark:bg-[#15102c] border border-slate-200 dark:border-slate-800/80 rounded-2xl space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-indigo-500" />
              Trait Rarity Weight
            </span>
            <span className="font-mono text-indigo-600 dark:text-indigo-400 font-bold">
              {weightPercent}% probability (wt: {weight})
            </span>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="range"
              min="1"
              max="100"
              value={weight}
              onChange={(e) => {
                const w = Number.parseInt(e.target.value, 10);
                setWeight(w);
                onWeightChange?.(element.id, w);
              }}
              className="flex-1 accent-indigo-600 cursor-pointer h-2 bg-slate-200 dark:bg-slate-800 rounded-lg"
            />
            <Input
              type="number"
              min="1"
              max="100"
              value={weight}
              onChange={(e) => {
                const w = Math.max(1, Number.parseInt(e.target.value, 10) || 1);
                setWeight(w);
                onWeightChange?.(element.id, w);
              }}
              className="w-14 font-mono font-bold text-center"
            />
          </div>

          <div className="text-[11px] font-mono text-slate-400 truncate pt-1 border-t border-slate-200/50 dark:border-slate-800/50">
            Filename: {element.filename}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-2">
          <Button
            variant="destructive"
            onClick={() => {
              onDelete?.(element.id);
              onClose();
            }}
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete Trait</span>
          </Button>

          <div className="flex items-center gap-2">
            <Button
              variant={isSelectedForPreview ? "secondary" : "default"}
              onClick={() => {
                onSelectForPreview?.(element.id);
              }}
            >
              {isSelectedForPreview ? (
                <>
                  <Check className="w-4 h-4 text-emerald-500" />
                  <span>Previewing on Canvas</span>
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4" />
                  <span>Preview on Canvas</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}


