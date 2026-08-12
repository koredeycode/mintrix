import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { Input } from "@/components/ui/input";
import { type Project, api } from "@/lib/api";
import { cn } from "@/lib/utils";
import {
  AlertCircle,
  CheckCircle2,
  Globe,
  Palette,
  Save,
  Settings,
  Sliders,
  X,
} from "lucide-react";
import { useState } from "react";

interface ProjectSettingsModalProps {
  isOpen: boolean;
  project: Project;
  onClose: () => void;
  onSaved?: (updatedProject: Project) => void;
}

type TabType = "general" | "canvas" | "background";

export function ProjectSettingsModal({
  isOpen,
  project,
  onClose,
  onSaved,
}: ProjectSettingsModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>("general");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState(project.name || "");
  const [network, setNetwork] = useState<"eth" | "sol">(project.network || "eth");
  const [namePrefix, setNamePrefix] = useState(project.namePrefix || "");
  const [description, setDescription] = useState(project.description || "");
  const [baseUri, setBaseUri] = useState(project.baseUri || "ipfs://NewUriToReplace");
  const [canvasWidth, setCanvasWidth] = useState(project.canvasWidth || 512);
  const [canvasHeight, setCanvasHeight] = useState(project.canvasHeight || 512);
  const [smoothing, setSmoothing] = useState(project.smoothing ?? true);
  const [rarityDelim, setRarityDelim] = useState(project.rarityDelim || "#");
  const [dnaTolerance, setDnaTolerance] = useState(project.dnaTolerance || 10000);
  const [bgGenerate, setBgGenerate] = useState(project.bgGenerate ?? false);
  const [bgBrightness, setBgBrightness] = useState(project.bgBrightness || "100%");
  const [bgStatic, setBgStatic] = useState(project.bgStatic ?? false);
  const [bgDefault, setBgDefault] = useState(project.bgDefault || "#ffffff");
  const [shuffleOrder, setShuffleOrder] = useState(project.shuffleOrder ?? false);

  if (!isOpen) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const payload = {
        name,
        network,
        namePrefix,
        description,
        baseUri,
        canvasWidth: Number(canvasWidth),
        canvasHeight: Number(canvasHeight),
        smoothing,
        rarityDelim,
        dnaTolerance: Number(dnaTolerance),
        bgGenerate,
        bgBrightness,
        bgStatic,
        bgDefault,
        shuffleOrder,
      };

      const updated = await api.patch<Project>(`/projects/${project.id}`, payload);
      setSuccess(true);
      if (onSaved) onSaved(updated);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update project settings");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-[#130f26] border border-slate-200 dark:border-slate-800/80 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800/80 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/40">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-200 dark:border-indigo-800/80">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 dark:text-slate-100 text-base tracking-tight flex items-center gap-2">
                Project Settings
                <Badge variant="outline" className="text-[10px] uppercase font-mono">
                  {network}
                </Badge>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Configure collection standards, canvas rendering, and generation engine settings.
              </p>
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 px-6 bg-slate-100/40 dark:bg-slate-950/30">
          <button
            type="button"
            onClick={() => setActiveTab("general")}
            className={cn(
              "px-4 py-3 text-xs font-semibold flex items-center gap-2 border-b-2 transition-colors",
              activeTab === "general"
                ? "border-indigo-600 dark:border-indigo-400 text-indigo-600 dark:text-indigo-400"
                : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200",
            )}
          >
            <Globe className="w-3.5 h-3.5" />
            General Metadata
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("canvas")}
            className={cn(
              "px-4 py-3 text-xs font-semibold flex items-center gap-2 border-b-2 transition-colors",
              activeTab === "canvas"
                ? "border-indigo-600 dark:border-indigo-400 text-indigo-600 dark:text-indigo-400"
                : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200",
            )}
          >
            <Sliders className="w-3.5 h-3.5" />
            Canvas & Rarity
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("background")}
            className={cn(
              "px-4 py-3 text-xs font-semibold flex items-center gap-2 border-b-2 transition-colors",
              activeTab === "background"
                ? "border-indigo-600 dark:border-indigo-400 text-indigo-600 dark:text-indigo-400"
                : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200",
            )}
          >
            <Palette className="w-3.5 h-3.5" />
            Background & Options
          </button>
        </div>

        {/* Modal Form Content */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 rounded-xl text-emerald-600 dark:text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
              <span>Project settings saved successfully!</span>
            </div>
          )}

          {/* TAB 1: General Metadata */}
          {activeTab === "general" && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Collection / Project Name
                </label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Cyberpunks #1"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Blockchain Metadata Standard
                  </label>
                  <CustomSelect
                    value={network}
                    options={[
                      { value: "eth", label: "Ethereum (ERC-721 Standard)", sublabel: "EVM NFT metadata" },
                      { value: "sol", label: "Solana (Metaplex Standard)", sublabel: "Solana NFT metadata" },
                    ]}
                    onChange={(val) => setNetwork(val as "eth" | "sol")}
                    fullWidthPopover
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Item Name Prefix
                  </label>
                  <Input
                    value={namePrefix}
                    onChange={(e) => setNamePrefix(e.target.value)}
                    placeholder="Cyberpunk #"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Collection Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  placeholder="Enter detailed description for your collection metadata..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:border-indigo-500 resize-none font-sans"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Base URI (IPFS / Arweave Base Path)
                </label>
                <Input
                  value={baseUri}
                  onChange={(e) => setBaseUri(e.target.value)}
                  placeholder="ipfs://QmXyz123..."
                  className="font-mono text-xs"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  This base URI will be prepended to edition filenames in output metadata.
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: Canvas & Rarity */}
          {activeTab === "canvas" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Canvas Width (px)
                  </label>
                  <Input
                    type="number"
                    min="64"
                    max="4096"
                    value={canvasWidth}
                    onChange={(e) => setCanvasWidth(Number(e.target.value))}
                    className="font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Canvas Height (px)
                  </label>
                  <Input
                    type="number"
                    min="64"
                    max="4096"
                    value={canvasHeight}
                    onChange={(e) => setCanvasHeight(Number(e.target.value))}
                    className="font-mono"
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block">
                    Image Smoothing
                  </span>
                  <span className="text-[11px] text-slate-500 block">
                    Enable anti-aliased image scaling during composition.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={smoothing}
                  onChange={(e) => setSmoothing(e.target.checked)}
                  className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Rarity Filename Delimiter
                  </label>
                  <Input
                    value={rarityDelim}
                    maxLength={1}
                    onChange={(e) => setRarityDelim(e.target.value || "#")}
                    className="font-mono text-center"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">Default: `#` (e.g. `Red#50.png`)</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    DNA Unique Retry Limit
                  </label>
                  <Input
                    type="number"
                    min="100"
                    max="100000"
                    value={dnaTolerance}
                    onChange={(e) => setDnaTolerance(Number(e.target.value))}
                    className="font-mono"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">Max duplicate retries before aborting.</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Background & Extra Options */}
          {activeTab === "background" && (
            <div className="space-y-4">
              <div className="p-3 bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block">
                    Generate Background Layer
                  </span>
                  <span className="text-[11px] text-slate-500 block">
                    Fill canvas background with custom solid or generated color.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={bgGenerate}
                  onChange={(e) => setBgGenerate(e.target.checked)}
                  className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
                />
              </div>

              {bgGenerate && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Default Background Hex Code
                    </label>
                    <div className="flex gap-2 items-center">
                      <input
                        type="color"
                        value={bgDefault}
                        onChange={(e) => setBgDefault(e.target.value)}
                        className="w-8 h-8 rounded border border-slate-300 cursor-pointer"
                      />
                      <Input
                        value={bgDefault}
                        onChange={(e) => setBgDefault(e.target.value)}
                        className="font-mono text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Background Brightness
                    </label>
                    <Input
                      value={bgBrightness}
                      onChange={(e) => setBgBrightness(e.target.value)}
                      placeholder="100%"
                      className="font-mono text-xs"
                    />
                  </div>
                </div>
              )}

              <div className="p-3 bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block">
                    Shuffle Edition Output Order
                  </span>
                  <span className="text-[11px] text-slate-500 block">
                    Randomize item indexes in generated collection files.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={shuffleOrder}
                  onChange={(e) => setShuffleOrder(e.target.checked)}
                  className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
                />
              </div>
            </div>
          )}

          {/* Modal Footer Actions */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="sleek-button flex items-center gap-1.5 px-5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{loading ? "Saving..." : "Save Settings"}</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
