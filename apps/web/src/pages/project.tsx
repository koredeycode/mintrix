import { Navbar } from "@/components/Navbar";
import { AICopilot } from "@/components/studio/AICopilot";
import { ElementManager } from "@/components/studio/ElementManager";
import { GalleryInspector } from "@/components/studio/GalleryInspector";
import { LayerTree } from "@/components/studio/LayerTree";
import { NFTCompositor } from "@/components/studio/NFTCompositor";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { type GenerationJob, type Layer, type Project, api } from "@/lib/api";
import { cn } from "@/lib/utils";
import { ArrowLeft, Grid, Play, RefreshCw, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, type LoaderFunctionArgs, redirect, useLoaderData, useRevalidator } from "react-router";


export async function loader({ params }: LoaderFunctionArgs) {
  try {
    const projectId = params.id as string;
    const [project, projectLayers, jobs] = await Promise.all([
      api.get<Project>(`/projects/${projectId}`),
      api.get<Layer[]>(`/layers/project/${projectId}`),
      api.get<GenerationJob[]>(`/generation/jobs/${projectId}`),
    ]);
    return { project, layers: projectLayers, jobs };
  } catch {
    return redirect("/auth") as never;
  }
}

export function ProjectPage() {
  const {
    project,
    layers: initialLayers,
    jobs,
  } = useLoaderData() as Awaited<ReturnType<typeof loader>>;
  const revalidator = useRevalidator();

  const [layers, setLayers] = useState<Layer[]>(initialLayers);
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(
    initialLayers.length > 0 ? initialLayers[0]!.id : null,
  );

  // Active trait map (layerId -> elementId)
  const [activeTraitsMap, setActiveTraitsMap] = useState<Record<string, string>>({});
  const [selectedElementForPreview, setSelectedElementForPreview] = useState<{
    layerId: string;
    elementId: string;
  } | null>(null);

  // Top Nav Generation Engine State
  const [totalEditions, setTotalEditions] = useState<number>(10);
  const latestJob = jobs.length > 0 ? jobs[jobs.length - 1] : null;
  const [activeJob, setActiveJob] = useState<GenerationJob | null>(latestJob || null);
  const [generating, setGenerating] = useState(false);
  const [genError, setGenError] = useState<string | null>(null);

  // Panels Toggle State
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isCopilotOpen, setIsCopilotOpen] = useState(true);
  const [isElementPanelOpen, setIsElementPanelOpen] = useState(true);

  // Resizable Column Widths State (Left Double-Column & Right Copilot Panel)
  const [leftWidth, setLeftWidth] = useState(540);
  const [rightWidth, setRightWidth] = useState(340);

  const isResizingLeft = useRef(false);
  const isResizingRight = useRef(false);

  useEffect(() => {
    setLayers(initialLayers);
    if (
      initialLayers.length > 0 &&
      (!selectedLayerId || !initialLayers.some((l) => l.id === selectedLayerId))
    ) {
      setSelectedLayerId(initialLayers[0]!.id);
    }
  }, [initialLayers]);

  // Poll active generation job if running
  useEffect(() => {
    if (!activeJob || (activeJob.status !== "queued" && activeJob.status !== "running")) {
      return;
    }

    const interval = setInterval(async () => {
      try {
        const job = await api.get<GenerationJob>(`/generation/status/${activeJob.id}`);
        setActiveJob(job);
        if (job.status === "completed") {
          setIsGalleryOpen(true);
          revalidator.revalidate();
        }
      } catch {
        // ignore
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [activeJob?.id, activeJob?.status]);

  // Handle Resizable Splitters
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isResizingLeft.current) {
        const newW = Math.max(380, Math.min(800, e.clientX));
        setLeftWidth(newW);
      } else if (isResizingRight.current) {
        const newW = Math.max(260, Math.min(600, window.innerWidth - e.clientX));
        setRightWidth(newW);
      }
    };

    const handleMouseUp = () => {
      isResizingLeft.current = false;
      isResizingRight.current = false;
      document.body.style.cursor = "default";
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  const startLeftResize = () => {
    isResizingLeft.current = true;
    document.body.style.cursor = "col-resize";
  };

  const startRightResize = () => {
    isResizingRight.current = true;
    document.body.style.cursor = "col-resize";
  };

  const selectedLayer = layers.find((l) => l.id === selectedLayerId) || null;

  const handleRefresh = async () => {
    try {
      const updatedLayers = await api.get<Layer[]>(`/layers/project/${project.id}`);
      setLayers(updatedLayers);
      if (
        updatedLayers.length > 0 &&
        (!selectedLayerId || !updatedLayers.some((l) => l.id === selectedLayerId))
      ) {
        setSelectedLayerId(updatedLayers[0]!.id);
      }
    } catch {
      // ignore
    }
  };

  const handleLayerAdded = (newLayer: Layer) => {
    setLayers((prev) => [...prev, newLayer]);
    setSelectedLayerId(newLayer.id);
    setIsElementPanelOpen(true);
  };

  const handleLayerDeleted = (deletedId: string) => {
    const remaining = layers.filter((l) => l.id !== deletedId);
    setLayers(remaining);
    if (selectedLayerId === deletedId) {
      setSelectedLayerId(remaining.length > 0 ? remaining[0]!.id : null);
    }
  };

  const handleSelectElementForPreview = (elementId: string) => {
    if (!selectedLayerId) return;
    setSelectedElementForPreview({ layerId: selectedLayerId, elementId });
    setActiveTraitsMap((prev) => ({ ...prev, [selectedLayerId]: elementId }));
  };

  const handleStartGeneration = async (e: React.FormEvent) => {
    e.preventDefault();
    setGenError(null);
    setGenerating(true);

    try {
      const res = await api.post<{ jobId: string; status: string }>(
        `/generation/start/${project.id}`,
        { totalEditions: Number(totalEditions) },
      );

      const jobStatus = await api.get<GenerationJob>(`/generation/status/${res.jobId}`);
      setActiveJob(jobStatus);
    } catch (err) {
      setGenError(err instanceof Error ? err.message : "Generation failed");
    } finally {
      setGenerating(false);
    }
  };

  const handleTraitsRandomized = (randomMap: Record<string, string>) => {
    setActiveTraitsMap(randomMap);
  };

  return (
    <div className="h-screen w-screen bg-slate-50 dark:bg-[#080612] text-slate-800 dark:text-slate-100 flex flex-col overflow-hidden select-none font-sans">
      {/* Top Navbar */}
      {/* Top Studio Navbar */}
      <Navbar
        leftControls={
          <div className="flex items-center gap-2.5">
            <Link
              to="/dashboard"
              className="p-1.5 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-lg bg-slate-100 dark:bg-[#140f29] border border-slate-200 dark:border-slate-800 transition-colors"
              title="Back to Dashboard"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
            </Link>

            <Link to="/" className="font-heading font-extrabold text-sm tracking-wider uppercase text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors shrink-0">
              Mintrix
            </Link>

            <span className="text-slate-300 dark:text-slate-700">/</span>

            <span className="font-heading font-bold text-xs text-slate-900 dark:text-slate-200 truncate max-w-[130px]" title={project.name}>
              {project.name}
            </span>

            <span className="text-[10px] font-mono text-indigo-600 dark:text-indigo-400 font-bold bg-indigo-50 dark:bg-indigo-950/80 px-1.5 py-0.5 rounded border border-indigo-200 dark:border-indigo-800/80 shrink-0">
              {project.canvasWidth}x{project.canvasHeight}
            </span>
          </div>
        }
        centerControls={
          <form onSubmit={handleStartGeneration} className="flex items-center gap-2">
            <div className="flex items-center bg-slate-100 dark:bg-[#090616] border border-slate-200 dark:border-slate-800/80 rounded-xl px-2 py-1">
              <span className="text-[11px] font-mono text-slate-500 mr-1.5 hidden sm:inline">
                Editions:
              </span>
              <input
                type="number"
                min="1"
                max="10000"
                value={totalEditions}
                onChange={(e) => setTotalEditions(Number.parseInt(e.target.value, 10) || 1)}
                className="w-14 bg-transparent font-mono text-xs text-slate-900 dark:text-slate-100 focus:outline-none text-center font-bold"
              />
            </div>

            <button
              type="submit"
              disabled={generating || activeJob?.status === "running"}
              className="px-3.5 py-1.5 sleek-button text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Play className="w-3 h-3 fill-white" />
              <span>
                {generating
                  ? "Starting..."
                  : activeJob?.status === "running"
                    ? `${activeJob.progress}%`
                    : "Generate"}
              </span>
            </button>

            {activeJob && activeJob.status === "running" && (
              <div className="flex items-center gap-1.5 text-xs text-indigo-600 dark:text-indigo-400 font-mono font-bold pl-1">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span className="hidden md:inline">
                  {activeJob.currentEdition}/{activeJob.totalEditions}
                </span>
              </div>
            )}
          </form>
        }
        rightControls={
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsCopilotOpen(!isCopilotOpen)}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-colors cursor-pointer ${
                isCopilotOpen
                  ? "bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border-amber-300 dark:border-amber-800"
                  : "bg-slate-100 dark:bg-[#15102c] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800/80 hover:text-slate-900 dark:hover:text-white"
              }`}
              title="Toggle AI Architect Copilot"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span className="hidden md:inline">Copilot</span>
            </button>

            <button
              onClick={() => setIsGalleryOpen(true)}
              className="px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-[#15102c] border border-slate-200 dark:border-slate-800/80 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Grid className="w-3.5 h-3.5 text-indigo-500" />
              <span className="hidden md:inline">Outputs</span>
            </button>
          </div>
        }
      />

      {/* Main Studio - 3 Column Layout */}
      <main className="flex-1 flex w-full h-[calc(100vh-56px)] overflow-hidden relative bg-slate-50 dark:bg-[#0c0919]">
        {/* LEFT DOUBLE-COLUMN: Layers List (Column 1) + Optional Layer Details & Elements (Column 2) */}
        <div
          style={{ width: isElementPanelOpen ? `${leftWidth}px` : "220px" }}
          className="h-full shrink-0 flex flex-row border-r border-slate-200 dark:border-slate-800/80 overflow-hidden transition-all duration-200"
        >
          {/* Column 1: Layers List */}
          <div className="w-[220px] h-full shrink-0 flex flex-col">
            <LayerTree
              projectId={project.id}
              layers={layers}
              selectedLayerId={selectedLayerId}
              isElementPanelOpen={isElementPanelOpen}
              onToggleElementPanel={() => setIsElementPanelOpen(!isElementPanelOpen)}
              onSelectLayer={(id) => {
                setSelectedLayerId(id);
                setIsElementPanelOpen(true);
              }}
              onLayerAdded={handleLayerAdded}
              onRefresh={handleRefresh}
            />
          </div>

          {/* Column 2: Layer Details & Traits Manager (Collapsible) */}
          {isElementPanelOpen && (
            <div className="flex-1 h-full min-w-0 flex flex-col">
              <ElementManager
                layer={selectedLayer}
                layers={layers}
                activeElementId={selectedLayerId ? activeTraitsMap[selectedLayerId] : null}
                onSelectElementForPreview={handleSelectElementForPreview}
                onLayerDeleted={handleLayerDeleted}
                onRefresh={handleRefresh}
              />
            </div>
          )}
        </div>

        {/* LEFT RESIZER DIVIDER */}
        {isElementPanelOpen && (
          <div
            onMouseDown={startLeftResize}
            className="w-1.5 h-full bg-slate-200 dark:bg-slate-800/80 hover:bg-indigo-500/80 cursor-col-resize shrink-0 transition-colors z-10 flex items-center justify-center group"
            title="Drag to resize Left Double-Column panel"
          >
            <div className="w-0.5 h-8 bg-slate-400 dark:bg-slate-600 group-hover:bg-white rounded-full" />
          </div>
        )}

        {/* CENTER COLUMN: Canvas Viewport with Clear Canvas Control */}
        <div className="flex-1 h-full min-w-0 flex flex-col bg-slate-200/50 dark:bg-[#0c0919] relative overflow-hidden">
          <NFTCompositor
            layers={layers}
            selectedElementForPreview={selectedElementForPreview}
            onTraitsRandomized={handleTraitsRandomized}
          />
        </div>

        {/* RIGHT RESIZER DIVIDER (When Copilot is open) */}
        {isCopilotOpen && (
          <div
            onMouseDown={startRightResize}
            className="w-1.5 h-full bg-slate-200 dark:bg-slate-800/80 hover:bg-indigo-500/80 cursor-col-resize shrink-0 transition-colors z-10 flex items-center justify-center group"
            title="Drag to resize Copilot panel"
          >
            <div className="w-0.5 h-8 bg-slate-400 dark:bg-slate-600 group-hover:bg-white rounded-full" />
          </div>
        )}

        {/* RIGHT COLUMN: AI Architect Copilot Panel */}
        {isCopilotOpen && (
          <div
            style={{ width: `${rightWidth}px` }}
            className="h-full shrink-0 flex flex-col min-w-[260px] max-w-[600px]"
          >
            <AICopilot
              projectName={project.name}
              onClose={() => setIsCopilotOpen(false)}
            />
          </div>
        )}
      </main>

      {/* Right Slide-over Side Panel Output Gallery Drawer */}
      <GalleryInspector
        jobId={activeJob?.id || null}
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
      />
    </div>
  );
}

