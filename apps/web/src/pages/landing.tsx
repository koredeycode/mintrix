import { useSession } from "@/lib/auth-client";
import { useTheme } from "@/lib/theme";
import {
  ArrowRight,
  Boxes,
  CheckCircle2,
  ChevronRight,
  Cpu,
  Database,
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

// Animated GIF-like Edition Switcher Component
function AnimatedEditionCard({
  images,
  title,
  network,
}: {
  images: string[];
  title: string;
  network?: string;
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 1600);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="relative rounded-xl overflow-hidden aspect-square border border-slate-200 dark:border-slate-800/80 bg-slate-950 group/card shadow-inner">
      {images.map((img, i) => (
        <img
          key={img}
          src={img}
          alt={`${title} Edition #${i + 1}`}
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-in-out group-hover/card:scale-105 ${
            i === index ? "opacity-100 scale-100 z-10" : "opacity-0 scale-95 z-0"
          }`}
        />
      ))}

      {/* Network Badge Top Left */}
      {network && (
        <div className="absolute top-3 left-3 z-20 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-800 text-[10px] font-mono font-bold text-slate-300 flex items-center gap-1.5 shadow-sm">
          <span className={`w-1.5 h-1.5 rounded-full ${network.includes("Solana") ? "bg-cyan-400" : "bg-indigo-400"}`} />
          <span>{network}</span>
        </div>
      )}

      {/* Live Animated Edition Badge Top Right */}
      <div className="absolute top-3 right-3 z-20 bg-slate-950/85 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-800 text-cyan-400 text-[10px] font-mono font-bold flex items-center gap-1.5 shadow-md">
        <RefreshCw className="w-3 h-3 animate-spin text-indigo-400" style={{ animationDuration: "3s" }} />
        <span>Edition #0{index + 1}</span>
      </div>

      {/* Pagination Dots at Bottom */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 bg-slate-950/75 backdrop-blur-sm px-2 py-1 rounded-full border border-slate-800/80">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={(e) => {
              e.stopPropagation();
              setIndex(i);
            }}
            className={`w-1.5 h-1.5 rounded-full transition-all ${
              i === index ? "w-4 bg-indigo-400" : "bg-slate-600 hover:bg-slate-400"
            }`}
            title={`Preview Edition #${i + 1}`}
          />
        ))}
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

  // EXACTLY 5 requested collections: Hashlips Demo, Cyberpunk Pixel Avatar, Galactic Space Explorer, Pixel Crypto Pet, Pixel Fantasy Quest
  const seedCollections = [
    {
      id: "col-hashlips",
      title: "Hashlips Demo",
      network: "Ethereum ERC-721",
      layers: "7 Layers",
      elements: "100 Traits",
      uniqueness: "100%",
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
      uniqueness: "100%",
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
      uniqueness: "100%",
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
      uniqueness: "100%",
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
      uniqueness: "99.9%",
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
    <div className="min-h-screen bg-slate-50 dark:bg-[#0c0919] text-slate-900 dark:text-slate-100 flex flex-col font-sans selection:bg-indigo-500/20 relative overflow-hidden transition-colors duration-200">
      {/* Header / Navbar */}
      <header className="sticky top-0 z-50 border-b border-slate-200 dark:border-slate-800/80 bg-white/90 dark:bg-[#0c0919]/90 backdrop-blur-md transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <img src="/logo.png" alt="Mintrix Logo" className="w-8 h-8 rounded-xl object-cover shadow-xs group-hover:scale-105 transition-transform" />
            <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white">
              Mintrix Studio
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
            <a href="#hero" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              Studio
            </a>
            <a href="#features" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              Capabilities
            </a>
            <a href="#showcase" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              Collections
            </a>
            <a href="#how-it-works" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              Workflow
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 hover:border-indigo-500 transition-colors"
              title={`Switch to ${theme === "light" ? "Dark" : "Light"} mode`}
            >
              {theme === "light" ? <Moon className="w-4 h-4 text-slate-700" /> : <Sun className="w-4 h-4 text-amber-400" />}
            </button>

            {session?.user ? (
              <Link
                to="/dashboard"
                className="sleek-button px-4 py-2 text-xs font-bold uppercase rounded-xl flex items-center gap-1.5 shadow-xs whitespace-nowrap"
              >
                <span>Studio Workspace</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <Link
                to="/auth"
                className="sleek-button px-4 py-2 text-xs font-bold uppercase rounded-xl flex items-center gap-1.5 shadow-xs whitespace-nowrap"
              >
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section with Animated Live Render Stage */}
      <section id="hero" className="relative pt-12 pb-16 md:pt-20 md:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/80 text-indigo-600 dark:text-indigo-400 text-xs font-bold mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Mintrix Engine v2.0 • Dual ETH & Solana Metadata Export</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-4xl leading-[1.08]">
          Generate <span className="text-indigo-600 dark:text-indigo-400">10,000+ NFT Collections</span> with Precision
        </h1>

        <p className="mt-5 text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
          The high-performance studio for digital artists and NFT creators. Assemble layer trait stacks, configure custom rarity rules, preview DNA uniqueness live, and export production assets.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-md">
          <button
            onClick={handleLaunchStudio}
            className="sleek-button w-full sm:w-auto px-6 py-3 text-xs font-bold uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 shadow-xs whitespace-nowrap"
          >
            <span>Launch Mintrix Studio</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <a
            href="#how-it-works"
            className="secondary-button w-full sm:w-auto px-6 py-3 text-xs font-bold uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>How It Works</span>
          </a>
        </div>

        {/* Feature Checkmarks */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs font-semibold text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>Zero Duplicates Guarantee</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-indigo-500" />
            <span>ETH ERC-721 & Solana Metaplex</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-purple-500" />
            <span>Layer Blend Modes & GIF Encoder</span>
          </div>
        </div>

        {/* Studio Canvas UI Mockup with Cycling Edition Render Animation */}
        <div className="mt-12 w-full p-3 sm:p-4 rounded-2xl bg-white dark:bg-[#130f26] border border-slate-200 dark:border-slate-800 shadow-2xl relative text-left">
          <div className="px-4 py-2.5 bg-slate-100 dark:bg-[#0c0919] rounded-xl border border-slate-200 dark:border-slate-800 mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-500" />
              <div className="w-3 h-3 rounded-full bg-amber-500" />
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="ml-2 text-xs font-mono text-slate-500 dark:text-slate-400 hidden sm:inline">Mintrix Studio Workspace v2.0</span>
            </div>
            <div className="flex items-center gap-3 text-[11px] font-mono text-slate-500 dark:text-slate-400">
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-bold">
                ● Live Engine
              </span>
              <span>10,000 / 10,000 Editions</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Left: Configured Layers List */}
            <div className="lg:col-span-4 bg-slate-50 dark:bg-[#0f0b21] p-4 rounded-xl border border-slate-200 dark:border-slate-800/80 space-y-2.5">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                <span>Configured Trait Stack</span>
                <span className="text-indigo-600 dark:text-indigo-400 font-mono">6 Layers</span>
              </div>
              {[
                { name: "Backgrounds", count: "12 traits", active: false },
                { name: "Base Avatar Body", count: "8 traits", active: false },
                { name: "Visors & Helmets", count: "15 traits", active: true },
                { name: "Mouth Accessories", count: "10 traits", active: false },
                { name: "Headwear & Crowns", count: "14 traits", active: false },
                { name: "Aura Effects", count: "6 traits", active: false },
              ].map((layer) => (
                <div
                  key={layer.name}
                  className={`p-2.5 rounded-lg border text-xs flex items-center justify-between transition-colors ${
                    layer.active
                      ? "bg-indigo-50 dark:bg-indigo-950/60 border-indigo-300 dark:border-indigo-800 text-indigo-900 dark:text-white font-bold"
                      : "bg-white dark:bg-[#15102a] border-slate-200 dark:border-slate-800/80 text-slate-600 dark:text-slate-400"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Layers className={`w-3.5 h-3.5 ${layer.active ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400"}`} />
                    <span>{layer.name}</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">{layer.count}</span>
                </div>
              ))}
            </div>

            {/* Middle: Live Animated Canvas Stage showing Cycling Composited Editions */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-[#0f0b21] rounded-xl border border-slate-200 dark:border-slate-800/80 relative overflow-hidden min-h-[280px]">
              <div className="w-52 h-52 sm:w-60 sm:h-60 rounded-2xl bg-slate-950 border border-indigo-500/30 relative overflow-hidden shadow-xl">
                {heroImages.map((img, i) => (
                  <img
                    key={img}
                    src={img}
                    alt={`Hero Render Edition #${i + 1}`}
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out ${
                      i === heroEditionIndex ? "opacity-100 scale-100 z-10" : "opacity-0 scale-95 z-0"
                    }`}
                  />
                ))}

                <div className="absolute top-3 right-3 z-20 bg-slate-950/85 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-800 text-cyan-400 text-[10px] font-mono font-bold flex items-center gap-1.5 shadow-md">
                  <RefreshCw className="w-3 h-3 animate-spin text-indigo-400" style={{ animationDuration: "3s" }} />
                  <span>Edition #0{heroEditionIndex + 1}</span>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-3">
                <span className="px-2.5 py-1 bg-white dark:bg-[#181235] border border-slate-200 dark:border-slate-800 text-indigo-600 dark:text-indigo-400 rounded-md text-[11px] font-mono font-bold">
                  DNA: 8a4f91b2...
                </span>
                <span className="px-2.5 py-1 bg-white dark:bg-[#181235] border border-slate-200 dark:border-slate-800 text-emerald-600 dark:text-emerald-400 rounded-md text-[11px] font-mono font-bold">
                  ● 100% Unique
                </span>
              </div>
            </div>

            {/* Right: Live Rarity Matrix Breakdown */}
            <div className="lg:col-span-3 bg-slate-50 dark:bg-[#0f0b21] p-4 rounded-xl border border-slate-200 dark:border-slate-800/80 flex flex-col justify-between space-y-4">
              <div>
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-3">Live Rarity Matrix</div>
                <div className="space-y-3 text-xs">
                  <div>
                    <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400 mb-1">
                      <span>Laser Visor Cyan</span>
                      <span className="text-indigo-600 dark:text-indigo-400 font-mono font-bold">4.2%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className="w-[20%] h-full bg-indigo-600 rounded-full animate-pulse" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400 mb-1">
                      <span>Cyber City Night</span>
                      <span className="text-purple-600 dark:text-purple-400 font-mono font-bold">12.5%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className="w-[45%] h-full bg-purple-600 rounded-full animate-pulse" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400 mb-1">
                      <span>Bionic Mohawk</span>
                      <span className="text-cyan-600 dark:text-cyan-400 font-mono font-bold">1.8%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className="w-[10%] h-full bg-cyan-500 rounded-full animate-pulse" />
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={handleLaunchStudio}
                className="w-full px-3 py-2.5 sleek-button text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 whitespace-nowrap overflow-hidden"
              >
                <Zap className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">Launch Studio</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Ecosystem Ticker Strip */}
      <section className="py-6 border-y border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#0a0717]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center sm:justify-between gap-6 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-indigo-500" />
              <span>Ethereum ERC-721</span>
            </div>
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-cyan-500" />
              <span>Solana Metaplex</span>
            </div>
            <div className="flex items-center gap-2">
              <Boxes className="w-4 h-4 text-purple-500" />
              <span>Polygon Standards</span>
            </div>
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-emerald-500" />
              <span>IPFS & Arweave Metadata</span>
            </div>
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-500" />
              <span>HTML5 Canvas Compositor</span>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Capabilities Grid (Bento Style with Interactive UI Widgets) */}
      <section id="features" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 text-xs font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Built For Creators & Developers</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Engineered for Generative Perfection
          </h2>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Everything you need to craft high-value NFT collections without writing custom scripts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Feature 1: Layer Compositor */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#130e28] border border-slate-200 dark:border-slate-800/90 shadow-xs hover:border-indigo-500/80 hover:shadow-[0_0_30px_-5px_rgba(99,102,241,0.25)] transition-all flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
                  <Layers className="w-5 h-5" />
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 text-[10px] font-mono font-bold">
                  HTML5 Canvas
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                Layer Compositor
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-5">
                Drag-and-drop layer reordering, per-layer blend mode controls (Multiply, Screen, Overlay), and real-time canvas rendering.
              </p>

              {/* Mini UI Widget: Layer Stack Preview */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#0c0919] border border-slate-200 dark:border-slate-800/80 space-y-2 mb-4 font-mono text-[11px]">
                <div className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-[#161130] border border-slate-200 dark:border-slate-800/80 shadow-2xs">
                  <span className="text-slate-700 dark:text-slate-300 font-semibold">04. Outfit Trait</span>
                  <span className="px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-400 text-[10px]">Screen</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-[#161130] border border-slate-200 dark:border-slate-800/80 shadow-2xs">
                  <span className="text-slate-700 dark:text-slate-300 font-semibold">03. Eyewear & Visor</span>
                  <span className="px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-400 text-[10px]">Multiply</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-[#161130] border border-slate-200 dark:border-slate-800/80 shadow-2xs">
                  <span className="text-slate-700 dark:text-slate-300 font-semibold">02. Character Body</span>
                  <span className="px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400 text-[10px]">Normal</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 flex-wrap text-[10px] font-mono text-slate-500 dark:text-slate-400 pt-3 border-t border-slate-100 dark:border-slate-800/60">
              <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800/80">Drag & Drop</span>
              <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800/80">Z-Index Stack</span>
            </div>
          </div>

          {/* Feature 2: DNA Uniqueness Engine */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#130e28] border border-slate-200 dark:border-slate-800/90 shadow-xs hover:border-purple-500/80 hover:shadow-[0_0_30px_-5px_rgba(168,85,247,0.25)] transition-all flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/80 border border-purple-200 dark:border-purple-800 flex items-center justify-center text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 text-[10px] font-mono font-bold">
                  SHA-256 Hash
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                DNA Uniqueness Engine
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-5">
                Automated DNA hashing prevents duplicate trait combinations across 10,000+ generated editions with configurable tolerance limits.
              </p>

              {/* Mini UI Widget: Live DNA Hash Box */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#0c0919] border border-slate-200 dark:border-slate-800/80 space-y-2 mb-4 font-mono text-[11px]">
                <div className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-[#161130] border border-slate-200 dark:border-slate-800/80">
                  <span className="text-slate-500 dark:text-slate-400">DNA Hash:</span>
                  <span className="text-purple-600 dark:text-purple-400 font-bold truncate max-w-[130px]">0x9f8c4b12a8</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                  <span className="flex items-center gap-1.5 font-bold text-[10px]">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>0 Duplicates Detected</span>
                  </span>
                  <span className="font-bold text-[10px]">100% Unique</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 flex-wrap text-[10px] font-mono text-slate-500 dark:text-slate-400 pt-3 border-t border-slate-100 dark:border-slate-800/60">
              <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800/80">Zero Collision</span>
              <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800/80">Auto Retry</span>
            </div>
          </div>

          {/* Feature 3: Dual-Chain Exporter */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#130e28] border border-slate-200 dark:border-slate-800/90 shadow-xs hover:border-cyan-500/80 hover:shadow-[0_0_30px_-5px_rgba(6,182,212,0.25)] transition-all flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-cyan-50 dark:bg-cyan-950/80 border border-cyan-200 dark:border-cyan-800 flex items-center justify-center text-cyan-600 dark:text-cyan-400 group-hover:scale-110 transition-transform">
                  <Boxes className="w-5 h-5" />
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 text-[10px] font-mono font-bold">
                  Multi-Chain
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                Dual-Chain Exporter
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-5">
                Generate ready-to-deploy metadata standards for both Ethereum (ERC-721/1155) and Solana (Metaplex format) simultaneously.
              </p>

              {/* Mini UI Widget: Dual Chain JSON Code Preview */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#0c0919] border border-slate-200 dark:border-slate-800/80 space-y-2 mb-4 font-mono text-[10px]">
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-400 font-bold">ERC-721</span>
                  <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 font-bold">Metaplex</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-900 text-slate-300 border border-slate-800 leading-tight">
                  <span className="text-indigo-400">"name"</span>: <span className="text-emerald-400">"Edition #01"</span>,<br />
                  <span className="text-indigo-400">"attributes"</span>: [<span className="text-slate-400">&#123;"trait_type": "Body"&#125;</span>]
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 flex-wrap text-[10px] font-mono text-slate-500 dark:text-slate-400 pt-3 border-t border-slate-100 dark:border-slate-800/60">
              <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800/80">OpenSea Ready</span>
              <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800/80">MagicEden Ready</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Seed Collection Showcase (Exactly 5 Collections) */}
      <section id="showcase" className="py-20 border-t border-slate-200 dark:border-slate-800/80 bg-white/50 dark:bg-[#0a0717]/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-50 dark:bg-cyan-950/60 border border-cyan-200 dark:border-cyan-800 text-cyan-600 dark:text-cyan-400 text-xs font-bold mb-3">
                <Boxes className="w-3.5 h-3.5" />
                <span>Pre-Loaded Starter Templates</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Featured Seed Collections
              </h2>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                Live animated preview of composited editions generated from actual seed layer traits.
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2">
              {[
                { id: "all", label: "All Collections" },
                { id: "hashlips", label: "Hashlips" },
                { id: "cyberpunk", label: "Cyberpunk" },
                { id: "space", label: "Space" },
                { id: "pets", label: "Pets" },
                { id: "fantasy", label: "Fantasy" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveCategory(tab.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    activeCategory === tab.id
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20 scale-105"
                      : "bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCollections.map((col) => (
              <div
                key={col.id}
                className="p-4 rounded-2xl bg-white dark:bg-[#130e28] border border-slate-200 dark:border-slate-800/90 shadow-xs group hover:border-indigo-500/80 hover:shadow-[0_0_30px_-5px_rgba(99,102,241,0.25)] transition-all cursor-pointer flex flex-col justify-between"
                onClick={handleLaunchStudio}
              >
                <div>
                  <div className="mb-4">
                    <AnimatedEditionCard images={col.images} title={col.title} network={col.network} />
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400 mb-2">
                    <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800/80 font-bold">{col.layers}</span>
                    <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800/80 font-bold">{col.elements}</span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {col.title}
                  </h3>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-mono font-bold text-[10px]">
                    ● Uniqueness {col.uniqueness}
                  </span>
                  <span className="text-indigo-600 dark:text-indigo-400 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform text-xs">
                    <span>Open Studio</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How Mintrix Works Workflow (Connected Pipeline Design) */}
      <section id="how-it-works" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 text-purple-600 dark:text-purple-400 text-xs font-bold mb-3">
            <Zap className="w-3.5 h-3.5" />
            <span>3-Step Seamless Process</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            How Mintrix Workflow Works
          </h2>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Three simple steps from trait artwork uploads to 10,000+ generated NFT editions ready for minting.
          </p>
        </div>

        <div className="relative">
          {/* Connector Line for Desktop */}
          <div className="hidden md:block absolute top-1/2 left-10 right-10 h-0.5 bg-gradient-to-r from-indigo-500/30 via-purple-500/40 to-cyan-500/30 -z-0" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
            {/* Step 1: Upload & Order Trait Layers */}
            <div className="p-6 rounded-2xl bg-white dark:bg-[#130e28] border border-slate-200 dark:border-slate-800/90 shadow-xs hover:border-indigo-500/80 hover:shadow-[0_0_30px_-5px_rgba(99,102,241,0.25)] transition-all flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
                    <Layers className="w-6 h-6" />
                  </div>
                  <span className="w-8 h-8 rounded-full bg-indigo-600 text-white font-mono font-bold text-xs flex items-center justify-center shadow-md shadow-indigo-500/30">
                    01
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  1. Upload & Order Trait Layers
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                  Organize background, character body, clothing, and accessories. Set per-layer blend modes and stack ordering.
                </p>

                {/* Step 1 Visual Graphic */}
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#0c0919] border border-slate-200 dark:border-slate-800/80 space-y-2 font-mono text-[10px]">
                  <div className="p-2 rounded bg-white dark:bg-[#161130] border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-indigo-600 dark:text-indigo-400 font-bold">Layer 1: Background</span>
                    <span className="text-slate-400">#12 pngs</span>
                  </div>
                  <div className="p-2 rounded bg-white dark:bg-[#161130] border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-indigo-600 dark:text-indigo-400 font-bold">Layer 2: Base Body</span>
                    <span className="text-slate-400">#8 pngs</span>
                  </div>
                  <div className="p-2 rounded bg-white dark:bg-[#161130] border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-indigo-600 dark:text-indigo-400 font-bold">Layer 3: Visor/Eyes</span>
                    <span className="text-slate-400">#15 pngs</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/60 text-[11px] font-mono text-slate-500 dark:text-slate-400">
                Drag-and-Drop Stacking
              </div>
            </div>

            {/* Step 2: Configure Weighted Rarities */}
            <div className="p-6 rounded-2xl bg-white dark:bg-[#130e28] border border-slate-200 dark:border-slate-800/90 shadow-xs hover:border-purple-500/80 hover:shadow-[0_0_30px_-5px_rgba(168,85,247,0.25)] transition-all flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/80 border border-purple-200 dark:border-purple-800 flex items-center justify-center text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform">
                    <Wand2 className="w-6 h-6" />
                  </div>
                  <span className="w-8 h-8 rounded-full bg-purple-600 text-white font-mono font-bold text-xs flex items-center justify-center shadow-md shadow-purple-500/30">
                    02
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                  2. Configure Weighted Rarities
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                  Configure rarity weights using filename syntax (e.g. <code className="font-mono text-indigo-600 dark:text-indigo-400">Visor#10.png</code>) or visual sliders.
                </p>

                {/* Step 2 Visual Graphic */}
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#0c0919] border border-slate-200 dark:border-slate-800/80 space-y-2.5 font-mono text-[10px]">
                  <div>
                    <div className="flex justify-between text-slate-600 dark:text-slate-400 mb-1">
                      <span>LaserVisor#10.png</span>
                      <span className="text-purple-600 dark:text-purple-400 font-bold">10% Weight</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className="w-[10%] h-full bg-purple-500 rounded-full" />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-slate-600 dark:text-slate-400 mb-1">
                      <span>ClassicCap#50.png</span>
                      <span className="text-indigo-600 dark:text-indigo-400 font-bold">50% Weight</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className="w-[50%] h-full bg-indigo-500 rounded-full" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/60 text-[11px] font-mono text-slate-500 dark:text-slate-400">
                Visual Slider & Syntax Weighting
              </div>
            </div>

            {/* Step 3: Batch Generate & Export */}
            <div className="p-6 rounded-2xl bg-white dark:bg-[#130e28] border border-slate-200 dark:border-slate-800/90 shadow-xs hover:border-cyan-500/80 hover:shadow-[0_0_30px_-5px_rgba(6,182,212,0.25)] transition-all flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-cyan-50 dark:bg-cyan-950/80 border border-cyan-200 dark:border-cyan-800 flex items-center justify-center text-cyan-600 dark:text-cyan-400 group-hover:scale-110 transition-transform">
                    <Zap className="w-6 h-6" />
                  </div>
                  <span className="w-8 h-8 rounded-full bg-cyan-600 text-white font-mono font-bold text-xs flex items-center justify-center shadow-md shadow-cyan-500/30">
                    03
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                  3. Batch Generate & Export
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                  Run the engine to generate artwork zip files and metadata JSONs ready for OpenSea, MagicEden, and launchpads.
                </p>

                {/* Step 3 Visual Graphic */}
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#0c0919] border border-slate-200 dark:border-slate-800/80 space-y-2 font-mono text-[10px]">
                  <div className="flex items-center justify-between text-cyan-600 dark:text-cyan-400 font-bold mb-1">
                    <span>Batch Generation</span>
                    <span>10,000 / 10,000</span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="w-full h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 rounded-full animate-pulse" />
                  </div>
                  <div className="flex items-center gap-1.5 pt-1">
                    <span className="px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400 font-bold">images.zip</span>
                    <span className="px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-400 font-bold">ETH JSON</span>
                    <span className="px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-400 font-bold">Solana JSON</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/60 text-[11px] font-mono text-slate-500 dark:text-slate-400">
                Zip Assets & JSON Export
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Bottom Banner */}
      <section className="py-16 border-t border-slate-200 dark:border-slate-800/80 bg-slate-100 dark:bg-[#090616]">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Start Generating Your NFT Collection Today
          </h2>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
            Sign in to your Mintrix Studio workspace to build from scratch or test pre-loaded collections.
          </p>

          <div className="mt-8 flex justify-center">
            <button
              onClick={handleLaunchStudio}
              className="sleek-button px-8 py-3.5 text-xs font-bold uppercase tracking-wider rounded-xl flex items-center gap-2 shadow-xs whitespace-nowrap"
            >
              <span>Launch Studio Workspace</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#070512] text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="Mintrix Logo" className="w-5 h-5 rounded object-cover" />
            <span className="font-bold text-slate-900 dark:text-white">Mintrix Studio</span>
          </div>
          <div>© {new Date().getFullYear()} Mintrix Engine. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}
