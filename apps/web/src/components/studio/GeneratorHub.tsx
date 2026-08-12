import { type Layer, type Project, api } from "@/lib/api";
import {
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Cpu,
  Film,
  Play,
  Shuffle,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

interface GeneratorHubProps {
  projectId: string;
  onStartRun: (jobId: string) => void;
}

export function GeneratorHub({ projectId, onStartRun }: GeneratorHubProps) {
  const [totalEditions, setTotalEditions] = useState<number>(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Project Details State for Preview Summary
  const [project, setProject] = useState<Project | null>(null);
  const [projectLayers, setProjectLayers] = useState<Layer[]>([]);

  // Advanced Collection Reel GIF Options State
  const [showAdvanced, setShowAdvanced] = useState(true);
  const [gifExport, setGifExport] = useState(true);
  const [gifDelay, setGifDelay] = useState(500);
  const [gifQuality, setGifQuality] = useState(100);
  const [gifImageCount, setGifImageCount] = useState(10);
  const [numberOfGifs, setNumberOfGifs] = useState(1);
  const [shuffleOrder, setShuffleOrder] = useState(false);

  // Fetch project details for summary preview
  useEffect(() => {
    if (!projectId) return;
    Promise.all([
      api.get<Project>(`/projects/${projectId}`),
      api.get<Layer[]>(`/layers/project/${projectId}`),
    ])
      .then(([p, l]) => {
        setProject(p);
        setProjectLayers(l);
      })
      .catch(() => {});
  }, [projectId]);

  // Handle start generation
  const handleStartGeneration = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await api.post<{ jobId: string; status: string }>(
        `/generation/start/${projectId}`,
        {
          totalEditions: Number(totalEditions),
          gifExport,
          gifDelay: Number(gifDelay),
          gifQuality: Number(gifQuality),
          gifImageCount: Number(gifImageCount),
          numberOfGifs: Number(numberOfGifs),
          shuffleOrder,
        },
      );

      onStartRun(res.jobId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to start generation");
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Header Info */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm tracking-tight">
            Generation Engine Setup
          </h3>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 font-semibold border border-emerald-200 dark:border-emerald-800/80 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Ready to Run
        </span>
      </div>

      {/* Run Configuration Preview Summary Card */}
      <div className="p-3.5 bg-slate-50 dark:bg-[#0c0919] border border-slate-200 dark:border-slate-800/80 rounded-xl space-y-2.5">
        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
          <span>Run Config Preview</span>
          <span className="font-mono text-indigo-500 font-extrabold">{project?.name}</span>
        </div>

        <div className="grid grid-cols-2 gap-2.5 text-xs font-mono">
          <div className="bg-white dark:bg-[#140f29] p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
            <span className="text-[10px] text-slate-400 block font-sans">Target Standard</span>
            <span className="font-bold text-indigo-600 dark:text-indigo-400 uppercase">
              {project?.network === "sol" ? "Solana (Metaplex)" : "Ethereum (ERC-721)"}
            </span>
          </div>

          <div className="bg-white dark:bg-[#140f29] p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
            <span className="text-[10px] text-slate-400 block font-sans">Resolution</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">
              {project?.canvasWidth ?? 512} x {project?.canvasHeight ?? 512} px
            </span>
          </div>

          <div className="bg-white dark:bg-[#140f29] p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
            <span className="text-[10px] text-slate-400 block font-sans">Layer Stack</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">
              {projectLayers.length} Layers Configured
            </span>
          </div>

          <div className="bg-white dark:bg-[#140f29] p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
            <span className="text-[10px] text-slate-400 block font-sans">Collection Reel GIF</span>
            <span className={`font-bold ${gifExport ? "text-emerald-500" : "text-slate-400"}`}>
              {gifExport ? `Enabled (${gifImageCount} images/reel)` : "Disabled"}
            </span>
          </div>
        </div>
      </div>

      <form onSubmit={handleStartGeneration} className="space-y-4">
        {/* Batch Edition Count Input */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Batch Edition Count
          </label>
          <input
            type="number"
            min="1"
            max="10000"
            value={totalEditions}
            onChange={(e) => setTotalEditions(Number.parseInt(e.target.value, 10) || 1)}
            className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 font-mono text-sm focus:outline-none focus:border-indigo-500 font-bold"
          />
        </div>

        {/* Advanced Generation Options Toggle */}
        <div className="pt-2 border-t border-slate-200 dark:border-slate-800/80">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center justify-between w-full text-left text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 py-1 transition-colors"
          >
            <span className="flex items-center gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-500" />
              Collection Preview Reels & Output Controls
            </span>
            {showAdvanced ? (
              <ChevronUp className="w-4 h-4 text-slate-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-400" />
            )}
          </button>

          {showAdvanced && (
            <div className="mt-3 p-3.5 bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800/80 rounded-xl space-y-3.5 animate-in fade-in duration-150">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Film className="w-4 h-4 text-indigo-500" />
                  Collection Preview Reel GIF Export
                </span>
                <input
                  type="checkbox"
                  checked={gifExport}
                  onChange={(e) => setGifExport(e.target.checked)}
                  className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
                />
              </div>

              {gifExport && (
                <div className="space-y-2.5 pl-3 border-l-2 border-indigo-500/40">
                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[10px] font-medium text-slate-500 mb-1">
                        Images Per Reel
                      </label>
                      <input
                        type="number"
                        min="2"
                        max="100"
                        value={gifImageCount}
                        onChange={(e) => setGifImageCount(Number(e.target.value))}
                        className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 font-mono text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-medium text-slate-500 mb-1">
                        Number of Reels
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={numberOfGifs}
                        onChange={(e) => setNumberOfGifs(Number(e.target.value))}
                        className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 font-mono text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[10px] font-medium text-slate-500 mb-1">
                        Frame Delay (ms)
                      </label>
                      <input
                        type="number"
                        min="50"
                        max="2000"
                        value={gifDelay}
                        onChange={(e) => setGifDelay(Number(e.target.value))}
                        className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 font-mono text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-medium text-slate-500 mb-1">
                        Quality (1-100)
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="100"
                        value={gifQuality}
                        onChange={(e) => setGifQuality(Number(e.target.value))}
                        className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 font-mono text-xs"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 dark:border-slate-800/60">
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Shuffle className="w-3.5 h-3.5 text-indigo-500" />
                  Shuffle Output Order
                </span>
                <input
                  type="checkbox"
                  checked={shuffleOrder}
                  onChange={(e) => setShuffleOrder(e.target.checked)}
                  className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
                />
              </div>
            </div>
          )}
        </div>

        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800/80 rounded-xl text-red-600 dark:text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
            <span>{error}</span>
          </div>
        )}

        {/* Primary CTA Button at the Bottom */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 sleek-button rounded-xl text-sm font-bold uppercase flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>{loading ? "Queuing Job..." : "Approve & Start Run"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}

interface GeneratorHubModalProps {
  isOpen: boolean;
  projectId: string;
  onClose: () => void;
  onStartRun: (jobId: string) => void;
}

export function GeneratorHubModal({
  isOpen,
  projectId,
  onClose,
  onStartRun,
}: GeneratorHubModalProps) {
  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-[#130f26] border border-slate-200 dark:border-slate-800 rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden relative"
      >
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40">
          <h2 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-indigo-500" />
            Generation Engine & Collection Reel Controls
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-5">
          <GeneratorHub
            projectId={projectId}
            onStartRun={(jobId) => {
              onStartRun(jobId);
              onClose();
            }}
          />
        </div>
      </div>
    </div>
  );
}
