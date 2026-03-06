import { Activity, Map, Users, ChevronDown } from "lucide-react";

/**
 * A highly modern, cinematic centered Hero Section.
 * Completely symmetrical, featuring a massive typography stack, 
 * subtle top-illumination, and a sleek floating glassmorphic stat bar.
 */
const HeroSection = () => {
  return (
    <div className="relative overflow-hidden min-h-[500px] flex flex-col items-center justify-center border-b border-border/50 bg-background pt-24 pb-16">

      {/* Background Ambience */}
      <div className="absolute inset-0 z-0">
        {/* Subtle radial top glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] sm:w-[800px] sm:h-[400px] bg-primary/10 rounded-full blur-[100px] opacity-70 pointer-events-none" />

        {/* Very subtle grid pattern fading out linearly downwards */}
        <div
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)`,
            backgroundSize: "3rem 3rem",
            maskImage: "linear-gradient(to bottom, black 10%, transparent 80%)",
            WebkitMaskImage: "linear-gradient(to bottom, black 10%, transparent 80%)",
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 flex flex-col items-center text-center">

        {/* Live Badge */}
        <div className="inline-flex items-center gap-2.5 bg-card/40 backdrop-blur-md border border-border/60 rounded-full px-4 py-1.5 mb-8 hover:bg-card/60 transition-colors shadow-sm cursor-default">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full w-2 h-2 bg-red-500"></span>
          </span>
          <span className="text-foreground text-[11px] sm:text-xs font-semibold tracking-widest uppercase">
            Live Election Counting
          </span>
        </div>

        {/* Title */}
        <h1 className="text-5xl sm:text-7xl lg:text-[5rem] font-heading font-black text-foreground tracking-tighter leading-[1.05] mb-6 max-w-4xl mx-auto">
          House of Representatives <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
            Elections 2082
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl text-muted-foreground font-medium max-w-2xl mx-auto mb-14 leading-relaxed">
          The official real-time dashboard for tracking nationwide democratic outcomes, detailed constituency mapping, and parliamentary composition.
        </p>

        {/* Stats Bar (Floating Pill) */}
        <div className="flex flex-col sm:flex-row items-center gap-8 sm:gap-12 bg-card/50 backdrop-blur-xl border border-border/60 rounded-3xl sm:rounded-full px-8 sm:px-14 py-6 sm:py-5 shadow-2xl shadow-black/5 hover:border-primary/20 transition-colors duration-500">

          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500/10 text-blue-500 rounded-full">
              <Activity className="w-5 h-5" />
            </div>
            <div className="text-left">
              <p className="text-2xl font-black font-heading text-foreground leading-none">7</p>
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mt-1">Provinces</p>
            </div>
          </div>

          <div className="hidden sm:block w-px h-10 bg-border/60" />

          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-full">
              <Map className="w-5 h-5" />
            </div>
            <div className="text-left">
              <p className="text-2xl font-black font-heading text-foreground leading-none">77</p>
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mt-1">Districts</p>
            </div>
          </div>

          <div className="hidden sm:block w-px h-10 bg-border/60" />

          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 text-primary rounded-full ring-2 ring-primary/20 ring-offset-2 ring-offset-background/50">
              <Users className="w-5 h-5" />
            </div>
            <div className="text-left">
              <p className="text-2xl font-black font-heading text-foreground leading-none">165</p>
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mt-1">Total Seats</p>
            </div>
          </div>

        </div>

        {/* Scroll Indicator */}
        <button
          onClick={() => window.scrollTo({ top: document.getElementById("counting-progress")?.offsetTop || 800, behavior: "smooth" })}
          className="mt-16 text-muted-foreground hover:text-foreground transition-colors group flex flex-col items-center gap-2"
        >
          <span className="text-[10px] uppercase font-bold tracking-widest opacity-70 group-hover:opacity-100 transition-opacity">Scroll to Results</span>
          <ChevronDown className="w-4 h-4 animate-bounce opacity-70 group-hover:opacity-100 transition-opacity" />
        </button>

      </div>
    </div>
  );
};

export default HeroSection;
