import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { type Element, type Layer, api } from "@/lib/api";
import { cn } from "@/lib/utils";
import {
  Camera,
  ChevronDown,
  ChevronUp,
  Download,
  Eraser,
  Grid,
  Layers,
  Lock,
  Maximize2,
  Minimize2,
  RefreshCw,
  RotateCcw,
  Shuffle,
  Sparkles,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";


interface NFTCompositorProps {
  layers: Layer[];
  selectedElementForPreview?: { layerId: string; elementId: string } | null;
  onTraitsRandomized?: (map: Record<string, string>) => void;
}

interface SelectedTrait {
  layerId: string;
  layerName: string;
  blendMode: string;
  elementId: string;
  filename: string;
}

type CanvasBgMode = "checkerboard" | "dark" | "black" | "white";

// Simple fast string hash for live DNA calculation display
function calculateDnaHash(traits: SelectedTrait[]): string {
  if (traits.length === 0) return "0x0000000000000000";
  const str = traits.map((t) => `${t.layerId}:${t.elementId}`).join("|");
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  const hex = Math.abs(hash).toString(16).padStart(8, "0");
  return `0x${hex}f91b2c${str.length.toString(16)}`;
}

export function NFTCompositor({
  layers,
  selectedElementForPreview,
  onTraitsRandomized,
}: NFTCompositorProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [selectedTraits, setSelectedTraits] = useState<SelectedTrait[]>([]);
  const [rendering, setRendering] = useState(false);
  const [isStackOpen, setIsStackOpen] = useState(true);

  // Graphics Suite Viewport Controls State
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [bgMode, setBgMode] = useState<CanvasBgMode>("checkerboard");
  const [isPanning, setIsPanning] = useState(false);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const panStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const activeDna = calculateDnaHash(selectedTraits);

  // Fetch elements for each layer and pick random element
  const randomizeCombination = async () => {
    setRendering(true);
    try {
      const traits: SelectedTrait[] = [];
      const map: Record<string, string> = {};

      for (const layer of layers) {
        const layerElements = await api.get<Element[]>(`/layers/${layer.id}/elements`);
        if (layerElements.length > 0) {
          const totalWeight = layerElements.reduce((acc, el) => acc + (el.weight || 1), 0);
          let random = Math.random() * totalWeight;
          let chosen = layerElements[0]!;

          for (const el of layerElements) {
            if (random < (el.weight || 1)) {
              chosen = el;
              break;
            }
            random -= el.weight || 1;
          }

          traits.push({
            layerId: layer.id,
            layerName: layer.name,
            blendMode: layer.blendMode || "source-over",
            elementId: chosen.id,
            filename: chosen.filename,
          });

          map[layer.id] = chosen.id;
        }
      }
      setSelectedTraits(traits);
      onTraitsRandomized?.(map);
    } catch {
      // ignore error
    } finally {
      setRendering(false);
    }
  };

  const clearCanvas = () => {
    setSelectedTraits([]);
    setPanOffset({ x: 0, y: 0 });
    setZoomLevel(100);
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
  };

  const removeTrait = (layerId: string) => {
    setSelectedTraits((prev) => prev.filter((t) => t.layerId !== layerId));
  };

  const exportCanvasSnapshot = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `mintrix-snapshot-${Date.now()}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  // Zoom handlers
  const handleZoomIn = () => setZoomLevel((z) => Math.min(300, z + 25));
  const handleZoomOut = () => setZoomLevel((z) => Math.max(50, z - 25));
  const resetZoomPan = () => {
    setZoomLevel(100);
    setPanOffset({ x: 0, y: 0 });
  };

  // Pan Mouse Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoomLevel > 100) {
      setIsPanning(true);
      panStartRef.current = { x: e.clientX - panOffset.x, y: e.clientY - panOffset.y };
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      setPanOffset({
        x: e.clientX - panStartRef.current.x,
        y: e.clientY - panStartRef.current.y,
      });
    }
  };

  const handleMouseUp = () => setIsPanning(false);

  // Sync traits with layer list updates
  useEffect(() => {
    if (layers.length === 0) {
      setSelectedTraits([]);
      return;
    }

    setSelectedTraits((prev) => {
      if (prev.length === 0) return prev;
      const newTraits: SelectedTrait[] = [];
      for (const layer of layers) {
        const existing = prev.find((t) => t.layerId === layer.id);
        if (existing) {
          newTraits.push({
            ...existing,
            layerName: layer.name,
            blendMode: layer.blendMode || "source-over",
          });
        }
      }
      return newTraits;
    });
  }, [layers]);

  // Real-time trait element selection override
  useEffect(() => {
    if (!selectedElementForPreview) return;
    const { layerId, elementId } = selectedElementForPreview;
    const targetLayer = layers.find((l) => l.id === layerId);
    if (!targetLayer) return;

    api.get<Element[]>(`/layers/${layerId}/elements`).then((elements) => {
      const match = elements.find((el) => el.id === elementId);
      if (!match) return;

      setSelectedTraits((prev) => {
        const updated = [...prev];
        const idx = updated.findIndex((t) => t.layerId === layerId);
        const newTrait: SelectedTrait = {
          layerId: targetLayer.id,
          layerName: targetLayer.name,
          blendMode: targetLayer.blendMode || "source-over",
          elementId: match.id,
          filename: match.filename,
        };

        if (idx !== -1) {
          updated[idx] = newTrait;
        } else {
          updated.push(newTrait);
        }
        return updated;
      });
    });
  }, [selectedElementForPreview]);

  // Render composite canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (selectedTraits.length === 0) {
      ctx.fillStyle = "rgba(148, 163, 184, 0.1)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#94a3b8";
      ctx.font = "bold 14px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("Blank Canvas Viewport", canvas.width / 2, canvas.height / 2 - 10);
      ctx.font = "12px sans-serif";
      ctx.fillText("Select a trait element or click Randomize Traits", canvas.width / 2, canvas.height / 2 + 15);
      return;
    }

    let loadedCount = 0;
    const images: { img: HTMLImageElement; blendMode: string }[] = [];

    selectedTraits.forEach((trait, i) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = api.getElementImageUrl(trait.elementId);

      img.onload = () => {
        loadedCount++;
        images[i] = { img, blendMode: trait.blendMode };

        if (loadedCount === selectedTraits.length) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          images.forEach((item) => {
            if (item?.img) {
              ctx.globalCompositeOperation = (item.blendMode ||
                "source-over") as GlobalCompositeOperation;
              ctx.drawImage(item.img, 0, 0, canvas.width, canvas.height);
            }
          });
        }
      };
    });
  }, [selectedTraits]);

  // Background style helper
  const getStageBgStyle = () => {
    switch (bgMode) {
      case "checkerboard":
        return "bg-checkerboard";
      case "dark":
        return "bg-[#090616]";
      case "black":
        return "bg-black";
      case "white":
        return "bg-white";
      default:
        return "bg-checkerboard";
    }
  };

  return (
    <div className="studio-panel p-4 flex flex-col h-full items-center justify-between border-none select-none bg-slate-50/50 dark:bg-[#0c0919]">
      {/* Top Professional Graphics Toolbar */}
      <div className="w-full flex flex-wrap items-center justify-between gap-2 mb-3 pb-3 border-b border-slate-200 dark:border-slate-800/80 shrink-0">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-500" />
          <h3 className="font-extrabold text-slate-900 dark:text-slate-100 text-xs tracking-tight">
            Viewport Compositor
          </h3>
          <span className="px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 text-[10px] font-mono font-bold border border-indigo-200 dark:border-indigo-800/80 flex items-center gap-1">
            <Lock className="w-2.5 h-2.5" />
            512x512 • 1:1
          </span>
        </div>

        {/* Viewport Toolbar Controls */}
        <div className="flex items-center gap-2">
          {/* Background Toggle Buttons */}
          <div className="flex items-center p-0.5 bg-slate-200/80 dark:bg-[#15102c] border border-slate-200 dark:border-slate-800 rounded-lg text-xs">
            <button
              onClick={() => setBgMode("checkerboard")}
              className={`p-1 rounded transition-colors ${
                bgMode === "checkerboard"
                  ? "bg-white dark:bg-slate-800 text-indigo-500 shadow-2xs"
                  : "text-slate-400 hover:text-slate-200"
              }`}
              title="Checkerboard Transparency background"
            >
              <Grid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setBgMode("dark")}
              className={`p-1 rounded transition-colors ${
                bgMode === "dark"
                  ? "bg-white dark:bg-slate-800 text-indigo-500 shadow-2xs"
                  : "text-slate-400 hover:text-slate-200"
              }`}
              title="Studio Void background"
            >
              <div className="w-3.5 h-3.5 rounded bg-[#090616] border border-slate-700" />
            </button>
            <button
              onClick={() => setBgMode("black")}
              className={`p-1 rounded transition-colors ${
                bgMode === "black"
                  ? "bg-white dark:bg-slate-800 text-indigo-500 shadow-2xs"
                  : "text-slate-400 hover:text-slate-200"
              }`}
              title="Solid Black background"
            >
              <div className="w-3.5 h-3.5 rounded bg-black" />
            </button>
            <button
              onClick={() => setBgMode("white")}
              className={`p-1 rounded transition-colors ${
                bgMode === "white"
                  ? "bg-white dark:bg-slate-800 text-indigo-500 shadow-2xs"
                  : "text-slate-400 hover:text-slate-200"
              }`}
              title="Solid White background"
            >
              <div className="w-3.5 h-3.5 rounded bg-white border border-slate-300" />
            </button>
          </div>

          {/* Zoom Controls */}
          <div className="flex items-center gap-1 bg-slate-200/80 dark:bg-[#15102c] border border-slate-200 dark:border-slate-800 rounded-lg p-0.5">
            <button
              onClick={handleZoomOut}
              disabled={zoomLevel <= 50}
              className="p-1 rounded text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white disabled:opacity-30 transition-colors"
              title="Zoom out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span
              onClick={resetZoomPan}
              className="px-1.5 text-[10px] font-mono font-bold text-slate-700 dark:text-slate-300 cursor-pointer hover:text-indigo-500 transition-colors"
              title="Reset Zoom to 100%"
            >
              {zoomLevel}%
            </span>
            <button
              onClick={handleZoomIn}
              disabled={zoomLevel >= 300}
              className="p-1 rounded text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white disabled:opacity-30 transition-colors"
              title="Zoom in"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            {zoomLevel !== 100 && (
              <button
                onClick={resetZoomPan}
                className="p-1 rounded text-indigo-500 hover:text-indigo-400 transition-colors"
                title="Reset Pan & Zoom"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Action Buttons: Snapshot Export, Clear & Randomize */}
          <button
            onClick={exportCanvasSnapshot}
            disabled={selectedTraits.length === 0}
            className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#15102c] text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 transition-colors flex items-center gap-1 text-xs font-semibold"
            title="Download PNG snapshot of current canvas"
          >
            <Camera className="w-3.5 h-3.5 text-indigo-500" />
            <span className="hidden sm:inline">Snapshot</span>
          </button>

          <button
            onClick={clearCanvas}
            disabled={selectedTraits.length === 0}
            className="px-2.5 py-1 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#15102c] text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 text-xs font-semibold flex items-center gap-1 transition-colors"
            title="Clear canvas"
          >
            <Eraser className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Clear</span>
          </button>

          <button
            onClick={randomizeCombination}
            disabled={rendering || layers.length === 0}
            className="sleek-button px-3 py-1 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs"
          >
            <Shuffle className={`w-3.5 h-3.5 ${rendering ? "animate-spin" : ""}`} />
            <span>Randomize</span>
          </button>
        </div>
      </div>

      {/* Artboard Stage Center */}
      <div className="studio-canvas-stage w-full aspect-square max-w-[380px] p-3 flex flex-col items-center justify-center my-auto relative shadow-sm shrink-0 rounded-2xl overflow-hidden">
        <div
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className={`relative w-full h-full max-w-[340px] max-h-[340px] ${getStageBgStyle()} shadow-2xl border border-slate-200 dark:border-slate-800/90 p-2 flex items-center justify-center overflow-hidden rounded-2xl transition-all ${
            zoomLevel > 100 ? "cursor-grab active:cursor-grabbing" : ""
          }`}
        >
          <div
            style={{
              transform: `scale(${zoomLevel / 100}) translate(${panOffset.x}px, ${panOffset.y}px)`,
              transformOrigin: "center center",
              transition: isPanning ? "none" : "transform 0.15s ease-out",
            }}
            className="w-full h-full flex items-center justify-center"
          >
            <canvas
              ref={canvasRef}
              width={512}
              height={512}
              className="w-full h-full object-contain rounded-xl drop-shadow-lg"
            />
          </div>

          {rendering && (
            <div className="absolute inset-0 bg-white/70 dark:bg-slate-950/70 backdrop-blur-xs flex items-center justify-center rounded-2xl z-20">
              <RefreshCw className="w-8 h-8 text-indigo-500 animate-spin" />
            </div>
          )}

          {/* DNA Hash Footer Badge */}
          {selectedTraits.length > 0 && (
            <div className="absolute bottom-2.5 left-2.5 right-2.5 z-10 bg-slate-950/80 backdrop-blur-md border border-slate-800 rounded-xl px-2.5 py-1 flex items-center justify-between text-[10px] font-mono">
              <span className="text-slate-400 truncate">DNA:</span>
              <span className="text-indigo-400 font-bold truncate max-w-[180px]">
                {activeDna}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Collapsible & Redesigned Active Composition Trait Stack */}
      <div className="w-full mt-3 pt-2 border-t border-slate-200 dark:border-slate-800/80 shrink-0">
        {/* Toggle Header */}
        <div
          onClick={() => setIsStackOpen(!isStackOpen)}
          className="flex items-center justify-between cursor-pointer py-1 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider">
            <Layers className="w-3.5 h-3.5 text-indigo-500" />
            <span>Active Trait Stack</span>
            <span className="px-1.5 py-0.2 rounded-md bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 text-[10px] font-mono font-bold border border-indigo-200 dark:border-indigo-800/80">
              {selectedTraits.length}
            </span>
          </div>
          <button className="p-0.5 rounded text-slate-400">
            {isStackOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>

        {/* Collapsible Trait Cards Grid */}
        {isStackOpen && (
          <div className="mt-2 flex flex-wrap gap-2 max-h-24 overflow-y-auto pr-28 sm:pr-32">
            {selectedTraits.length === 0 ? (
              <span className="text-xs text-slate-400 italic py-1">Canvas is blank</span>
            ) : (
              selectedTraits.map((t) => {
                const cleanName = t.filename.replace(/^.*?_/, "").replace(/\.[^/.]+$/, "");
                return (
                  <div
                    key={t.layerId}
                    className="p-1.5 bg-white dark:bg-[#15102c] border border-slate-200 dark:border-slate-800/90 rounded-xl shadow-xs flex items-center gap-2 max-w-[220px] transition-all hover:border-indigo-500/80"
                  >
                    {/* Thumbnail Preview */}
                    <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-[#090616] border border-slate-200 dark:border-slate-800 overflow-hidden flex items-center justify-center shrink-0">
                      <img
                        src={api.getElementImageUrl(t.elementId)}
                        alt={cleanName}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1 text-[9px] text-slate-500 font-semibold truncate">
                        <span className="text-indigo-600 dark:text-indigo-400 font-bold truncate">
                          {t.layerName}
                        </span>
                        <span>•</span>
                        <span className="font-mono text-[8px] text-slate-400 truncate">
                          {t.blendMode}
                        </span>
                      </div>
                      <h6 className="font-bold text-[11px] text-slate-800 dark:text-slate-200 truncate">
                        {cleanName}
                      </h6>
                    </div>

                    {/* Quick Remove Button */}
                    <button
                      onClick={() => removeTrait(t.layerId)}
                      className="p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/60 rounded-lg transition-colors shrink-0"
                      title="Remove trait from canvas"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
}

