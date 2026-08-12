import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { Input } from "@/components/ui/input";
import { AlertModal, ConfirmModal, ElementLightboxModal } from "@/components/ui/Modal";
import { RarityBadge } from "@/components/ui/RarityBadge";
import { type Element, type Layer, api } from "@/lib/api";
import { cn } from "@/lib/utils";
import {
  Check,
  Eye,
  Image as ImageIcon,
  Maximize2,
  RefreshCw,
  Scale,
  Sliders,
  Sparkles,
  Trash2,
  UploadCloud,
} from "lucide-react";
import { useEffect, useState } from "react";


const BLEND_MODE_OPTIONS = [
  { value: "source-over", label: "source-over" },
  { value: "multiply", label: "multiply" },
  { value: "screen", label: "screen" },
  { value: "overlay", label: "overlay" },
  { value: "darken", label: "darken" },
  { value: "lighten", label: "lighten" },
  { value: "color-dodge", label: "color-dodge" },
  { value: "color-burn", label: "color-burn" },
  { value: "hard-light", label: "hard-light" },
  { value: "soft-light", label: "soft-light" },
  { value: "difference", label: "difference" },
  { value: "exclusion", label: "exclusion" },
];

interface ElementManagerProps {
  layer: Layer | null;
  layers?: Layer[];
  activeElementId?: string | null | undefined;
  onSelectElementForPreview?: (elementId: string) => void;
  onLayerDeleted?: (layerId: string) => void;
  onRefresh: () => void;
}

export function ElementManager({
  layer,
  layers = [],
  activeElementId,
  onSelectElementForPreview,
  onLayerDeleted,
  onRefresh,
}: ElementManagerProps) {
  const [elements, setElements] = useState<Element[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [updatingWeights, setUpdatingWeights] = useState(false);

  // Modals state
  const [expandedElement, setExpandedElement] = useState<Element | null>(null);
  const [confirmState, setConfirmState] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });

  const [alertState, setAlertState] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type?: "error" | "success" | "info" | undefined;
  }>({
    isOpen: false,
    title: "",
    message: "",
    type: "error",
  });

  useEffect(() => {
    if (!layer) {
      setElements([]);
      return;
    }
    fetchElements(layer.id);
  }, [layer?.id]);

  const fetchElements = async (layerId: string) => {
    setLoading(true);
    try {
      const data = await api.get<Element[]>(`/layers/${layerId}/elements`);
      setElements(data);
    } catch {
      setElements([]);
    }
    setLoading(false);
  };

  const handleUploadFiles = async (files: FileList | File[]) => {
    if (!layer) return;
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        if (!file.type.startsWith("image/")) continue;
        await api.uploadElement(layer.id, file, 1);
      }
      await fetchElements(layer.id);
      onRefresh();
    } catch (err) {
      setAlertState({
        isOpen: true,
        title: "Upload Failed",
        message: err instanceof Error ? err.message : "Failed to upload element file",
        type: "error",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleWeightChange = async (elementId: string, weight: number) => {
    setElements((prev) => prev.map((el) => (el.id === elementId ? { ...el, weight } : el)));
    if (expandedElement && expandedElement.id === elementId) {
      setExpandedElement((prev) => (prev ? { ...prev, weight } : null));
    }
    try {
      await api.patch(`/layers/elements/${elementId}/weight`, { weight });
      onRefresh();
    } catch {
      // ignore
    }
  };

  const handleEqualizeWeights = async (targetWeight = 10) => {
    if (elements.length === 0) return;
    setUpdatingWeights(true);
    try {
      await Promise.all(
        elements.map((el) => api.patch(`/layers/elements/${el.id}/weight`, { weight: targetWeight }))
      );
      setElements((prev) => prev.map((el) => ({ ...el, weight: targetWeight })));
      onRefresh();
    } catch {
      setAlertState({
        isOpen: true,
        title: "Update Failed",
        message: "Failed to equalize trait weights",
        type: "error",
      });
    } finally {
      setUpdatingWeights(false);
    }
  };

  const handleDeleteElement = async (elementId: string) => {
    setConfirmState({
      isOpen: true,
      title: "Delete Trait Element",
      message: "Are you sure you want to permanently delete this element?",
      onConfirm: async () => {
        setConfirmState((prev) => ({ ...prev, isOpen: false }));
        try {
          await api.delete(`/layers/elements/${elementId}`);
          setElements((prev) => prev.filter((el) => el.id !== elementId));
          if (expandedElement?.id === elementId) setExpandedElement(null);
          onRefresh();
        } catch {
          setAlertState({
            isOpen: true,
            title: "Delete Failed",
            message: "Failed to delete element.",
            type: "error",
          });
        }
      },
    });
  };

  const handleBlendChange = async (blendMode: string) => {
    if (!layer) return;
    try {
      await api.patch(`/layers/${layer.id}`, { blendMode });
      onRefresh();
    } catch {
      setAlertState({
        isOpen: true,
        title: "Update Failed",
        message: "Failed to update layer blend mode.",
        type: "error",
      });
    }
  };

  const handleOrderChange = async (targetOrderIndex: number) => {
    if (!layer || layers.length === 0) return;
    const currentIndex = layers.findIndex((l) => l.id === layer.id);
    if (currentIndex < 0 || currentIndex === targetOrderIndex) return;

    const newLayers = [...layers];
    const [moved] = newLayers.splice(currentIndex, 1);
    if (!moved) return;
    newLayers.splice(targetOrderIndex, 0, moved);

    const reorderPayload = newLayers.map((l, i) => ({ id: l.id, order: i }));
    try {
      await api.patch(`/layers/project/${layer.projectId}/reorder`, {
        layers: reorderPayload,
      });
      onRefresh();
    } catch {
      setAlertState({
        isOpen: true,
        title: "Reorder Failed",
        message: "Failed to reorder layer.",
        type: "error",
      });
    }
  };

  const handleDeleteLayer = async () => {
    if (!layer) return;
    setConfirmState({
      isOpen: true,
      title: `Delete Layer "${layer.name}"`,
      message: `Are you sure you want to delete layer "${layer.name}" and all its elements? This action cannot be undone.`,
      onConfirm: async () => {
        setConfirmState((prev) => ({ ...prev, isOpen: false }));
        try {
          await api.delete(`/layers/${layer.id}`);
          onLayerDeleted?.(layer.id);
          onRefresh();
        } catch {
          setAlertState({
            isOpen: true,
            title: "Delete Failed",
            message: "Failed to delete layer.",
            type: "error",
          });
        }
      },
    });
  };

  if (!layer) {
    return (
      <div className="studio-panel p-6 flex flex-col items-center justify-center h-full text-center border-r border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#110d24]">
        <ImageIcon className="w-8 h-8 text-slate-300 dark:text-slate-700 mb-2" />
        <h3 className="font-bold text-slate-700 dark:text-slate-300 text-xs">
          No Layer Selected
        </h3>
        <p className="text-slate-400 dark:text-slate-500 text-[11px] mt-1 max-w-xs">
          Click a layer in the navigator to view and manage trait weights.
        </p>
      </div>
    );
  }

  const totalWeight = elements.reduce((acc, el) => acc + (el.weight || 1), 0);
  const currentLayerIndex = layers.findIndex((l) => l.id === layer.id);

  const layerOrderOptions = layers.map((l, idx) => ({
    value: idx,
    label: `#${idx + 1} (${l.name})`,
  }));

  return (
    <div className="studio-panel p-4 flex flex-col h-full border-r border-slate-200 dark:border-slate-800/80 select-none bg-white dark:bg-[#110d24]">
      {/* Header & Custom Controls */}
      <div className="mb-3 pb-3 border-b border-slate-200 dark:border-slate-800/80 space-y-3 shrink-0">
        <div className="flex items-center justify-between">
          <div className="min-w-0">
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-slate-100 truncate">
              {layer.name}
            </h3>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
              {elements.length} traits • Total weight: {totalWeight}
            </span>
          </div>

          <button
            onClick={handleDeleteLayer}
            className="p-1.5 rounded-xl bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900 border border-red-200 dark:border-red-800/80 transition-colors"
            title="Delete Layer"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {/* Custom Select Controls: Blend Mode & Layer Position */}
        <div className="p-2.5 bg-slate-50 dark:bg-[#15102c] border border-slate-200 dark:border-slate-800/80 rounded-2xl space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-600 dark:text-slate-400 font-medium text-[11px]">
              Blend Mode
            </span>
            <CustomSelect
              value={layer.blendMode || "source-over"}
              options={BLEND_MODE_OPTIONS}
              onChange={(val) => handleBlendChange(val)}
            />
          </div>

          {layers.length > 1 && (
            <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-200/60 dark:border-slate-800/60">
              <span className="text-slate-600 dark:text-slate-400 font-medium text-[11px]">
                Layer Position
              </span>
              <CustomSelect
                value={currentLayerIndex >= 0 ? currentLayerIndex : 0}
                options={layerOrderOptions}
                onChange={(val) => handleOrderChange(Number.parseInt(val, 10))}
              />
            </div>
          )}
        </div>

        {/* Batch Weight Actions */}
        {elements.length > 1 && (
          <div className="flex items-center justify-between gap-2 pt-1 text-[11px]">
            <span className="text-slate-500 font-medium text-[10px]">Batch Weight:</span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                disabled={updatingWeights}
                onClick={() => handleEqualizeWeights(1)}
                className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-[#161130] text-slate-700 dark:text-slate-300 hover:text-indigo-500 border border-slate-200 dark:border-slate-800 text-[10px] font-mono transition-colors"
                title="Reset all element weights to 1"
              >
                Reset to 1
              </button>
              <button
                type="button"
                disabled={updatingWeights}
                onClick={() => handleEqualizeWeights(10)}
                className="px-2 py-0.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 border border-indigo-200 dark:border-indigo-800/80 text-[10px] font-mono font-bold transition-colors flex items-center gap-1"
                title="Equalize all element weights to 10"
              >
                <Scale className="w-3 h-3" />
                Equalize (10)
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Upload Drag & Drop Zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragActive(false);
          if (e.dataTransfer.files) handleUploadFiles(e.dataTransfer.files);
        }}
        className={`mb-3 p-3 border-2 border-dashed rounded-2xl text-center transition-colors shrink-0 ${
          dragActive
            ? "border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/40"
            : "border-slate-200 dark:border-slate-800/80 hover:border-indigo-400 bg-slate-50/50 dark:bg-[#15102c]"
        }`}
      >
        <UploadCloud className="w-5 h-5 text-indigo-500 mx-auto mb-1" />
        <label className="cursor-pointer text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
          <span>{uploading ? "Uploading Traits..." : "Upload PNG Traits"}</span>
          <input
            type="file"
            multiple
            accept="image/*"
            disabled={uploading}
            onChange={(e) => e.target.files && handleUploadFiles(e.target.files)}
            className="hidden"
          />
        </label>
        <p className="text-[10px] text-slate-400 mt-0.5">Drag & drop files or click to browse</p>
      </div>

      {/* Elements List */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1">
        {loading ? (
          <div className="text-center py-8 text-xs text-slate-400 font-mono">Loading elements...</div>
        ) : elements.length === 0 ? (
          <div className="text-center py-8 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
            <p className="text-slate-400 text-xs font-medium">No elements in this layer</p>
          </div>
        ) : (
          elements.map((el) => {
            const isSelectedForPreview = activeElementId === el.id;
            const weightPercent =
              totalWeight > 0 ? Math.round(((el.weight || 1) / totalWeight) * 100) : 0;
            const cleanName = el.filename.replace(/^.*?-/, "").replace(/\.[^/.]+$/, "");

            return (
              <div
                key={el.id}
                className={`p-2.5 rounded-2xl border transition-all space-y-2 group cursor-pointer ${
                  isSelectedForPreview
                    ? "bg-indigo-50/80 dark:bg-indigo-950/50 border-indigo-500 shadow-xs"
                    : "bg-slate-50/50 dark:bg-[#15102c] border-slate-200 dark:border-slate-800/80 hover:border-indigo-500/80"
                }`}
                onClick={() => setExpandedElement(el)}
              >
                <div className="flex items-center gap-2.5">
                  {/* Thumbnail */}
                  <div className="w-10 h-10 rounded-xl bg-white dark:bg-[#090616] border border-slate-200 dark:border-slate-800 overflow-hidden flex items-center justify-center shrink-0 relative">
                    <img
                      src={api.getElementImageUrl(el.id)}
                      alt={el.filename}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h5 className="font-semibold text-xs text-slate-900 dark:text-slate-100 truncate">
                        {cleanName}
                      </h5>
                    </div>
                    <div className="mt-0.5 flex items-center gap-1.5">
                      <RarityBadge percentage={weightPercent} showIcon={false} />
                    </div>
                  </div>

                  <div
                    className="flex items-center gap-1 shrink-0"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Expand Lightbox Button */}
                    <button
                      onClick={() => setExpandedElement(el)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      title="Expand element lightbox"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                    </button>

                    {/* Preview Toggle Button */}
                    <button
                      onClick={() => onSelectElementForPreview?.(el.id)}
                      className={`p-1.5 rounded-lg border transition-colors ${
                        isSelectedForPreview
                          ? "bg-indigo-600 text-white border-indigo-600"
                          : "bg-white dark:bg-[#161130] text-slate-500 border-slate-200 dark:border-slate-800 hover:text-indigo-600"
                      }`}
                      title="Preview on Canvas"
                    >
                      {isSelectedForPreview ? <Check className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>

                    {/* Delete Button */}
                    <button
                      onClick={() => handleDeleteElement(el.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
                      title="Delete Element"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Weight Input Range */}
                <div
                  className="flex items-center gap-2 pt-1.5 border-t border-slate-200/50 dark:border-slate-800/50"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Sliders className="w-3 h-3 text-slate-400 shrink-0" />
                  <input
                    type="range"
                    min="1"
                    max="100"
                    value={el.weight || 1}
                    onChange={(e) => handleWeightChange(el.id, Number.parseInt(e.target.value, 10))}
                    className="flex-1 accent-indigo-600 cursor-pointer h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg"
                  />
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={el.weight || 1}
                    onChange={(e) =>
                      handleWeightChange(el.id, Math.max(1, Number.parseInt(e.target.value, 10) || 1))
                    }
                    className="w-10 px-1 py-0.5 bg-white dark:bg-[#0c0919] border border-slate-200 dark:border-slate-800 rounded text-[10px] font-mono text-center text-slate-800 dark:text-slate-200 focus:outline-none"
                  />
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Expanded Lightbox Modal */}
      <ElementLightboxModal
        element={expandedElement}
        layerName={layer.name}
        totalWeight={totalWeight}
        isSelectedForPreview={expandedElement ? activeElementId === expandedElement.id : false}
        isOpen={Boolean(expandedElement)}
        onClose={() => setExpandedElement(null)}
        onSelectForPreview={onSelectElementForPreview}
        onWeightChange={handleWeightChange}
        onDelete={handleDeleteElement}
      />

      {/* Custom Confirm Modal */}
      <ConfirmModal
        isOpen={confirmState.isOpen}
        title={confirmState.title}
        message={confirmState.message}
        onConfirm={confirmState.onConfirm}
        onCancel={() => setConfirmState((prev) => ({ ...prev, isOpen: false }))}
      />

      {/* Custom Alert Modal */}
      <AlertModal
        isOpen={alertState.isOpen}
        title={alertState.title}
        message={alertState.message}
        type={alertState.type}
        onClose={() => setAlertState((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}

