import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useSession } from "@/lib/auth-client";
import { useTheme } from "@/lib/theme";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  Bot,
  Boxes,
  CheckCircle2,
  ChevronRight,
  Cpu,
  Database,
  FileCode2,
  Flame,
  Globe,
  Layers,
  Moon,
  Play,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Sun,
  Wand2,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";

// Animated Edition Switcher Card Component for Seed Collections
function AnimatedEditionCard({
  images,
  title,
  network,
  layers,
  elements,
  category,
}: {
  images: string[];
  title: string;
  network: string;
  layers: string;
  elements: string;
  category: string;
}) {
  const [index, setIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 1700);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="group/card rounded-2xl bg-white dark:bg-[#140f29] border border-slate-200 dark:border-slate-800/90 overflow-hidden shadow-xs hover:shadow-xl hover:border-indigo-500/80 transition-all duration-300 flex flex-col">
      {/* Artwork Stage */}
      <div className="relative aspect-square w-full bg-slate-950 overflow-hidden">
        {images.map((img, i) => (
          <img
            key={img}
            src={img}
            alt={`${title} Edition #${i + 1}`}
            className={cn(
              "absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-in-out group-hover/card:scale-105",
              i === index ? "opacity-100 scale-100 z-10" : "opacity-0 scale-95 z-0"
            )}
          />
        ))}

        {/* Live Animated Edition Badge Top Right */}
        <div className="absolute top-2.5 right-2.5 z-20 bg-slate-950/85 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-800 text-cyan-400 text-[10px] font-mono font-bold flex items-center gap-1.5 shadow-md">
          <RefreshCw className="w-3 h-3 animate-spin text-indigo-400" style={{ animationDuration: "3s" }} />
          <span>Edition #0{index + 1}</span>
        </div>

        {/* Edition Pagination Dots */}
        <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 bg-slate-950/80 backdrop-blur-sm px-2.5 py-1 rounded-full border border-slate-800">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={(e) => {
                e.stopPropagation();
                setIndex(i);
              }}
              className={cn(
                "h-1.5 rounded-full transition-all cursor-pointer",
                i === index ? "w-4 bg-indigo-400" : "w-1.5 bg-slate-600 hover:bg-slate-400"
              )}
              title={`Preview Edition #${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Card Content Details */}
      <div className="p-3.5 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-2">
          {/* Network & Rarity Tags */}
          <div className="flex items-center justify-between gap-1.5">
            <Badge variant={network.includes("Solana") ? "solana" : "ethereum"} className="text-[10px] py-0 px-2">
              {network.includes("Solana") ? "Solana" : "Ethereum"}
            </Badge>
            <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 shrink-0">
              100% Unique
            </span>
          </div>

          {/* Full Title (No Clipping) */}
          <h3 className="font-heading font-extrabold text-sm text-slate-900 dark:text-white leading-snug line-clamp-2">
            {title}
          </h3>

          <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-2 font-mono">
            <span>{layers}</span>
            <span>•</span>
            <span>{elements}</span>
          </p>
        </div>

        <Button
          variant="secondary"
          size="sm"
          className="w-full justify-between group/btn hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all text-xs"
          onClick={() => navigate("/auth")}
        >
          <span>Explore Seed Stack</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
        </Button>
      </div>
    </div>
  );
}

export function LandingPage() {
  const { data: session } = useSession();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [activeCategory, setActiveCategory] = useState("all");
  const [heroEditionIndex, setHeroEditionIndex] = useState(0);
  const [activeBlendMode, setActiveBlendMode] = useState("source-over");
  const [activeLayerIndex, setActiveLayerIndex] = useState(2);

  const heroImages = [
    "/samples/cyberpunk_ed1.png",
    "/samples/cyberpunk_ed2.png",
    "/samples/cyberpunk_ed3.png",
    "/samples/cyberpunk_ed4.png",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setHeroEditionIndex((prev) => (prev + 1) % heroImages.length);
    }, 1800);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  const handleLaunchStudio = () => {
    if (session?.user) {
      navigate("/dashboard");
    } else {
      navigate("/auth");
    }
  };

  const seedCollections = [
    {
      id: "col-hashlips",
      title: "Hashlips Demo Stack",
      network: "Ethereum ERC-721",
      layers: "7 Layers",
      elements: "100 Traits",
      images: [
        "/samples/hashlips_ed1.png",
        "/samples/hashlips_ed2.png",
        "/samples/hashlips_ed3.png",
        "/samples/hashlips_ed4.png",
      ],
      category: "hashlips",
    },
    {
      id: "col-cyberpunk",
      title: "Cyberpunk Pixel Avatar",
      network: "Solana Metaplex",
      layers: "6 Layers",
      elements: "72 Traits",
      images: [
        "/samples/cyberpunk_ed1.png",
        "/samples/cyberpunk_ed2.png",
        "/samples/cyberpunk_ed3.png",
        "/samples/cyberpunk_ed4.png",
      ],
      category: "cyberpunk",
    },
    {
      id: "col-space",
      title: "Galactic Space Explorer",
      network: "Ethereum ERC-721",
      layers: "6 Layers",
      elements: "68 Traits",
      images: [
        "/samples/space_ed1.png",
        "/samples/space_ed2.png",
        "/samples/space_ed3.png",
        "/samples/space_ed4.png",
      ],
      category: "space",
    },
    {
      id: "col-pets",
      title: "Pixel Crypto Pet",
      network: "Ethereum ERC-721",
      layers: "6 Layers",
      elements: "60 Traits",
      images: [
        "/samples/pets_ed1.png",
        "/samples/pets_ed2.png",
        "/samples/pets_ed3.png",
        "/samples/pets_ed4.png",
      ],
      category: "pets",
    },
    {
      id: "col-fantasy",
      title: "Pixel Fantasy Quest",
      network: "Solana Metaplex",
      layers: "6 Layers",
      elements: "64 Traits",
      images: [
        "/samples/fantasy_ed1.png",
        "/samples/fantasy_ed2.png",
        "/samples/fantasy_ed3.png",
        "/samples/fantasy_ed4.png",
      ],
      category: "fantasy",
    },
  ];

  const filteredCollections =
    activeCategory === "all"
      ? seedCollections
      : seedCollections.filter((c) => c.category === activeCategory);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#080612] text-slate-900 dark:text-slate-100 flex flex-col font-sans selection:bg-indigo-500/20 relative overflow-hidden transition-colors duration-200">
      {/* Background Ambient Glow Accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-tr from-indigo-600/20 via-purple-600/15 to-transparent blur-3xl pointer-events-none rounded-full" />

      {/* Header / Navbar */}
      <header className="sticky top-0 z-50 border-b border-slate-200 dark:border-slate-800/80 bg-white/80 dark:bg-[#080612]/80 backdrop-blur-xl transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <span className="font-heading font-extrabold text-xl tracking-wider uppercase text-slate-900 dark:text-white">
              Mintrix Studio
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
            <a href="#hero" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              Studio
            </a>
            <a href="#capabilities" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              Capabilities
            </a>
            <a href="#showcase" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              Seed Collections
            </a>
            <a href="#workflow" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              Workflow
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon-sm"
              onClick={toggleTheme}
              title={`Switch to ${theme === "light" ? "Dark" : "Light"} mode`}
            >
              {theme === "light" ? <Moon className="w-4 h-4 text-slate-700" /> : <Sun className="w-4 h-4 text-amber-400" />}
            </Button>

            {session?.user ? (
              <Button variant="sleek" onClick={() => navigate("/dashboard")}>
                <span>Studio Workspace</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button variant="sleek" onClick={() => navigate("/auth")}>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="hero" className="relative pt-12 pb-20 md:pt-20 md:pb-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center flex flex-col items-center">
        {/* Main Heading */}
        <h1 className="font-heading text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-slate-900 dark:text-white max-w-5xl leading-[1.06]">
          Architect & Export <span className="text-indigo-600 dark:text-indigo-400">10,000+ Generative Collections</span>
        </h1>

        <p className="mt-6 text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed font-medium">
          The professional multi-threaded canvas Compositor & Trait Rarity Studio built for digital artists, Web3 projects, and generative creators.
        </p>

        {/* Action CTAs */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md">
          <Button
            variant="sleek"
            size="lg"
            className="w-full sm:w-auto h-12 px-8 uppercase tracking-wider text-xs font-extrabold shadow-sm hover:shadow active:scale-95 transition-all cursor-pointer"
            onClick={handleLaunchStudio}
          >
            <span>Launch Mintrix Studio</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
          <a href="#showcase" className="w-full sm:w-auto">
            <Button
              variant="outline"
              size="lg"
              className="w-full h-12 px-6 uppercase tracking-wider text-xs font-bold border-slate-300 dark:border-slate-700 bg-white/80 dark:bg-[#140f29]/80 backdrop-blur-md hover:border-indigo-500 transition-all cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current text-indigo-500" />
              <span>Explore Seed Stacks</span>
            </Button>
          </a>
        </div>

        {/* Hero Stats Counters Bar */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl p-4 rounded-2xl bg-white/60 dark:bg-[#0f0b1f]/80 border border-slate-200 dark:border-slate-800/90 backdrop-blur-md shadow-lg">
          <div className="p-3 text-center border-r border-slate-200 dark:border-slate-800/80 last:border-r-0">
            <div className="font-heading font-black text-2xl sm:text-3xl text-indigo-600 dark:text-indigo-400">10,000+</div>
            <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold mt-0.5">Editions per Batch</div>
          </div>
          <div className="p-3 text-center border-r border-slate-200 dark:border-slate-800/80 last:border-r-0">
            <div className="font-heading font-black text-2xl sm:text-3xl text-emerald-600 dark:text-emerald-400">100%</div>
            <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold mt-0.5">SHA-256 Unique</div>
          </div>
          <div className="p-3 text-center border-r border-slate-200 dark:border-slate-800/80 last:border-r-0">
            <div className="font-heading font-black text-2xl sm:text-3xl text-purple-600 dark:text-purple-400">Dual</div>
            <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold mt-0.5">ETH & Solana JSONs</div>
          </div>
          <div className="p-3 text-center">
            <div className="font-heading font-black text-2xl sm:text-3xl text-cyan-600 dark:text-cyan-400">&lt; 45s</div>
            <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold mt-0.5">Generation Speed</div>
          </div>
        </div>

        {/* Feature Checkmarks Strip */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs font-semibold text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Zero Duplicates Guarantee</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-indigo-500 shrink-0" />
            <span>ETH ERC-721 & Solana Metaplex</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-purple-500 shrink-0" />
            <span>Layer Blend Modes & GIF Encoder</span>
          </div>
        </div>

        {/* macOS Studio Mockup Preview Box */}
        <div className="mt-12 w-full p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#0f0b1f] border border-slate-200 dark:border-slate-800/90 shadow-2xl relative text-left overflow-hidden">
          {/* macOS Top Bar */}
          <div className="px-4 py-3 bg-slate-100 dark:bg-[#080612] rounded-2xl border border-slate-200 dark:border-slate-800 mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-500" />
              <div className="w-3 h-3 rounded-full bg-amber-500" />
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="ml-3 text-xs font-mono font-bold text-slate-500 dark:text-slate-400 hidden sm:inline">
                Mintrix Engine Studio Workstation — Cyberpunk Pixel Avatar Stack
              </span>
            </div>
            <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400">
              <Badge variant="legendary">● Engine Online</Badge>
              <span>10,000 / 10,000 Editions</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Left: Layer Tree Navigation Box */}
            <div className="lg:col-span-4 bg-slate-50 dark:bg-[#140f29] p-4 rounded-2xl border border-slate-200 dark:border-slate-800/80 space-y-2.5">
              <div className="flex items-center justify-between text-xs font-heading font-extrabold text-slate-900 dark:text-white mb-2">
                <span>Trait Layer Stack</span>
                <Badge variant="default" className="font-mono">6 Layers</Badge>
              </div>

              {[
                { name: "Backgrounds", count: "12 traits", active: false },
                { name: "Base Avatar Body", count: "8 traits", active: false },
                { name: "Visors & Helmets", count: "15 traits", active: true },
                { name: "Mouth Accessories", count: "10 traits", active: false },
                { name: "Headwear & Crowns", count: "14 traits", active: false },
                { name: "Aura Effects", count: "6 traits", active: false },
              ].map((layer, i) => (
                <button
                  key={layer.name}
                  type="button"
                  onClick={() => setActiveLayerIndex(i)}
                  className={cn(
                    "w-full p-2.5 rounded-xl border text-xs flex items-center justify-between transition-all cursor-pointer text-left",
                    i === activeLayerIndex
                      ? "bg-indigo-50 dark:bg-indigo-950/80 border-indigo-300 dark:border-indigo-800 text-indigo-900 dark:text-indigo-300 font-bold shadow-xs"
                      : "bg-white dark:bg-[#0b0818] border-slate-200 dark:border-slate-800/80 text-slate-600 dark:text-slate-400 hover:border-slate-400"
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <Layers className={cn("w-3.5 h-3.5", i === activeLayerIndex ? "text-indigo-500" : "text-slate-400")} />
                    <span>{layer.name}</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">{layer.count}</span>
                </button>
              ))}
            </div>

            {/* Middle: Canvas Viewport */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-[#140f29] rounded-2xl border border-slate-200 dark:border-slate-800/80 relative overflow-hidden min-h-[300px]">
              <div className="w-56 h-56 sm:w-64 sm:h-64 rounded-2xl bg-slate-950 border border-indigo-500/30 relative overflow-hidden shadow-2xl">
                {heroImages.map((img, i) => (
                  <img
                    key={img}
                    src={img}
                    alt={`Hero Render Edition #${i + 1}`}
                    className={cn(
                      "absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-in-out",
                      i === heroEditionIndex ? "opacity-100 scale-100 z-10" : "opacity-0 scale-95 z-0"
                    )}
                  />
                ))}

                <div className="absolute top-3 right-3 z-20 bg-slate-950/85 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-800 text-cyan-400 text-[10px] font-mono font-bold flex items-center gap-1.5 shadow-md">
                  <RefreshCw className="w-3 h-3 animate-spin text-indigo-400" style={{ animationDuration: "3s" }} />
                  <span>Edition #0{heroEditionIndex + 1}</span>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2.5">
                <span className="px-2.5 py-1 bg-white dark:bg-[#0b0818] border border-slate-200 dark:border-slate-800 text-indigo-600 dark:text-indigo-400 rounded-lg text-[11px] font-mono font-bold">
                  SHA-256: 8a4f91b2...
                </span>
                <span className="px-2.5 py-1 bg-white dark:bg-[#0b0818] border border-slate-200 dark:border-slate-800 text-emerald-600 dark:text-emerald-400 rounded-lg text-[11px] font-mono font-bold">
                  ● 100% Unique
                </span>
              </div>
            </div>

            {/* Right: Live Rarity Breakdown */}
            <div className="lg:col-span-3 bg-slate-50 dark:bg-[#140f29] p-4 rounded-2xl border border-slate-200 dark:border-slate-800/80 flex flex-col justify-between space-y-4">
              <div>
                <div className="text-xs font-heading font-extrabold text-slate-900 dark:text-white mb-3">
                  Live Rarity Probability
                </div>
                <div className="space-y-3.5 text-xs">
                  <div>
                    <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400 mb-1 font-mono">
                      <span>Laser Visor Cyan</span>
                      <span className="text-indigo-400 font-bold">4.2%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className="w-[20%] h-full bg-indigo-500 rounded-full animate-pulse" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400 mb-1 font-mono">
                      <span>Cyber City Night</span>
                      <span className="text-purple-400 font-bold">12.5%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className="w-[45%] h-full bg-purple-500 rounded-full animate-pulse" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400 mb-1 font-mono">
                      <span>Bionic Mohawk</span>
                      <span className="text-cyan-400 font-bold">1.8%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className="w-[10%] h-full bg-cyan-400 rounded-full animate-pulse" />
                    </div>
                  </div>
                </div>
              </div>

              <Button variant="sleek" className="w-full font-bold" onClick={handleLaunchStudio}>
                <Zap className="w-4 h-4 shrink-0" />
                <span>Launch Studio Workspace</span>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Capabilities Bento Grid */}
      <section id="capabilities" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <Badge variant="default" className="font-mono">Mintrix Engine Core</Badge>
          <h2 className="font-heading text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            High-Performance Digital Creation Suite
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
            Everything digital artists, Web3 project teams, and generative creators need to produce production-grade collection assets.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1: Canvas Blend Modes */}
          <Card className="bg-white dark:bg-[#140f29] border-slate-200 dark:border-slate-800/90 shadow-sm hover:border-indigo-500/80 transition-all">
            <CardHeader>
              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-200 dark:border-indigo-800/80 mb-2">
                <Layers className="w-5 h-5" />
              </div>
              <CardTitle className="font-heading text-lg">Canvas Blend Modes</CardTitle>
              <CardDescription>
                Compositor engine supporting <code className="text-indigo-400">multiply</code>, <code className="text-indigo-400">screen</code>, <code className="text-indigo-400">overlay</code>, <code className="text-indigo-400">color-dodge</code>.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-3 bg-slate-50 dark:bg-[#0b0818] rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="text-[11px] font-mono text-slate-400">Interactive Blend Mode Selector:</div>
                <div className="flex flex-wrap gap-1.5">
                  {["source-over", "multiply", "screen", "overlay"].map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setActiveBlendMode(mode)}
                      className={cn(
                        "px-2 py-0.5 rounded text-[10px] font-mono font-bold transition-all cursor-pointer",
                        activeBlendMode === mode
                          ? "bg-indigo-600 text-white"
                          : "bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                      )}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card 2: SHA-256 Uniqueness Protection */}
          <Card className="bg-white dark:bg-[#140f29] border-slate-200 dark:border-slate-800/90 shadow-sm hover:border-indigo-500/80 transition-all">
            <CardHeader>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-200 dark:border-emerald-800/80 mb-2">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <CardTitle className="font-heading text-lg">SHA-256 Collision Check</CardTitle>
              <CardDescription>
                Guarantees zero duplicate editions across 10,000+ item generative batches.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-3 bg-slate-50 dark:bg-[#0b0818] rounded-xl border border-slate-200 dark:border-slate-800 font-mono text-[11px] space-y-1 text-slate-400">
                <div className="text-emerald-400 font-bold">✔ Hash Collision Evaluator: PASSED</div>
                <div className="truncate">Hash: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855</div>
              </div>
            </CardContent>
          </Card>

          {/* Card 3: Dual Metadata Standards */}
          <Card className="bg-white dark:bg-[#140f29] border-slate-200 dark:border-slate-800/90 shadow-sm hover:border-indigo-500/80 transition-all">
            <CardHeader>
              <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400 flex items-center justify-center border border-purple-200 dark:border-purple-800/80 mb-2">
                <FileCode2 className="w-5 h-5" />
              </div>
              <CardTitle className="font-heading text-lg">Dual Metadata Export</CardTitle>
              <CardDescription>
                Export Ethereum ERC-721 standard & Solana Metaplex standards simultaneously.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Badge variant="ethereum">Ethereum ERC-721</Badge>
                <Badge variant="solana">Solana Metaplex</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Card 4: Animated GIF Encoder */}
          <Card className="bg-white dark:bg-[#140f29] border-slate-200 dark:border-slate-800/90 shadow-sm hover:border-indigo-500/80 transition-all">
            <CardHeader>
              <div className="w-10 h-10 rounded-xl bg-cyan-50 dark:bg-cyan-950/80 text-cyan-600 dark:text-cyan-400 flex items-center justify-center border border-cyan-200 dark:border-cyan-800/80 mb-2">
                <Flame className="w-5 h-5" />
              </div>
              <CardTitle className="font-heading text-lg">Animated GIF Encoder</CardTitle>
              <CardDescription>
                Composite multi-frame animated GIF artwork with custom frame delay controls.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                Frame Rate: 30 FPS • Loop: Infinite
              </div>
            </CardContent>
          </Card>

          {/* Card 5: AI Prompt Copilot */}
          <Card className="bg-white dark:bg-[#140f29] border-slate-200 dark:border-slate-800/90 shadow-sm hover:border-indigo-500/80 transition-all">
            <CardHeader>
              <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-200 dark:border-amber-800/80 mb-2">
                <Bot className="w-5 h-5" />
              </div>
              <CardTitle className="font-heading text-lg">AI Architect Copilot</CardTitle>
              <CardDescription>
                AI prompt assistant for trait naming, rarity distributions, and layer ordering.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-amber-500 font-mono font-bold">
                Supported: GPT-4o, DeepSeek-R1, Gemini 2.5
              </div>
            </CardContent>
          </Card>

          {/* Card 6: BullMQ Multi-threaded Queue */}
          <Card className="bg-white dark:bg-[#140f29] border-slate-200 dark:border-slate-800/90 shadow-sm hover:border-indigo-500/80 transition-all">
            <CardHeader>
              <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 flex items-center justify-center border border-rose-200 dark:border-rose-800/80 mb-2">
                <Cpu className="w-5 h-5" />
              </div>
              <CardTitle className="font-heading text-lg">Multi-threaded Worker Engine</CardTitle>
              <CardDescription>
                BullMQ worker queue with real-time WebSocket progress updates.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-emerald-500 font-mono font-bold">
                ● 10,000 Items Rendered in &lt; 45 sec
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Seed Collections Showcase Section */}
      <section id="showcase" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <Badge variant="default" className="font-mono mb-2">Pre-loaded Stacks</Badge>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Pre-loaded Seed Collections
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
              Explore 5 pre-configured generative stacks built for instant live previewing in Mintrix Studio.
            </p>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-200/80 dark:bg-[#140f29] rounded-xl border border-slate-200 dark:border-slate-800 overflow-x-auto">
            {[
              { id: "all", label: "All Stacks" },
              { id: "hashlips", label: "Hashlips" },
              { id: "cyberpunk", label: "Cyberpunk" },
              { id: "space", label: "Space" },
              { id: "pets", label: "Pets" },
              { id: "fantasy", label: "Fantasy" },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap",
                  activeCategory === cat.id
                    ? "bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {filteredCollections.map((col) => (
            <AnimatedEditionCard
              key={col.id}
              title={col.title}
              network={col.network}
              layers={col.layers}
              elements={col.elements}
              images={col.images}
              category={col.category}
            />
          ))}
        </div>
      </section>

      {/* 3-Step Workflow Pipeline */}
      <section id="workflow" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <Badge variant="default" className="font-mono">Seamless Pipeline</Badge>
          <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            How Mintrix Studio Works
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm">
            From raw PNG trait layers to production metadata bundles in 3 simple steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {[
            {
              step: "01",
              title: "Organize Trait Stack",
              desc: "Drag and drop PNG folders into z-index order (Backgrounds, Bodies, Eyes, Helmets, Auras).",
              icon: Layers,
            },
            {
              step: "02",
              title: "Tune Rarity Weights",
              desc: "Adjust trait weight sliders from 1% to 100% with live DNA uniqueness validation.",
              icon: Wand2,
            },
            {
              step: "03",
              title: "Batch Export Assets",
              desc: "One-click batch generation of 10,000 high-res images + ETH (ERC-721) / Solana (Metaplex) JSONs.",
              icon: Zap,
            },
          ].map((item) => {
            const IconComponent = item.icon;
            return (
              <div
                key={item.step}
                className="p-6 rounded-3xl bg-white dark:bg-[#140f29] border border-slate-200 dark:border-slate-800/90 shadow-sm relative space-y-4"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-extrabold text-3xl text-indigo-500">{item.step}</span>
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-200 dark:border-indigo-800/80">
                    <IconComponent className="w-5 h-5" />
                  </div>
                </div>
                <h3 className="font-heading font-extrabold text-lg text-slate-900 dark:text-white">{item.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed font-medium">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Bottom Launch Studio CTA Banner */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full mb-10">
        <div className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-[#140f29] border border-slate-200 dark:border-slate-800 shadow-xl relative overflow-hidden text-center space-y-6">
          <Badge variant="default" className="font-mono">Production Ready</Badge>
          <h2 className="font-heading text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight max-w-2xl mx-auto">
            Ready to Build Your Generative Art Collection?
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm max-w-xl mx-auto">
            Launch Mintrix Studio today. Start creating, compositing, and exporting production-ready NFT collections in seconds.
          </p>
          <Button variant="sleek" size="lg" className="uppercase font-extrabold tracking-wider" onClick={handleLaunchStudio}>
            <span>Launch Mintrix Studio Workspace</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800/80 py-8 bg-white dark:bg-[#080612] text-slate-600 dark:text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-heading font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
              Mintrix Studio
            </span>
            <span>© 2026 Mintrix. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-4 font-mono text-[11px]">
            <span className="text-emerald-500 font-bold">● Studio Engine Operational</span>
            <span>ETH (ERC-721) / Solana (Metaplex)</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
