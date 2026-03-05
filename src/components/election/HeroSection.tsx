const HeroSection = () => {
  return (
    <div className="relative overflow-hidden min-h-[320px] sm:min-h-[380px] flex items-center">
      {/* Animated gradient background */}
      <div className="absolute inset-0 gradient-nepal-animated" />

      {/* Pattern overlay */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, white 1px, transparent 1px),
                            radial-gradient(circle at 75% 75%, white 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Glow orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-float" />
        <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-white/8 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-12 sm:py-16 text-center">
        {/* Live badge */}
        <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/25 rounded-full px-4 py-1.5 mb-6">
          <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
          <span className="text-white text-xs sm:text-sm font-semibold tracking-wide">
            🇳🇵 Election 2082
          </span>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-heading font-bold text-white mb-3 tracking-tight leading-tight">
          <span className="text-gradient-shimmer">Nepal Election Results</span>
        </h1>
        <p className="text-base sm:text-xl text-white/80 font-medium mb-2">
          Nepal Election Results Portal 2082
        </p>
        <p className="text-xs sm:text-sm text-white/60 max-w-xl mx-auto">
          Real-time updates and analysis of the 2082 House of Representatives counting progress.
        </p>

        {/* Quick stats row */}
        <div className="flex flex-wrap justify-center gap-4 sm:gap-8 mt-8">
          {[
            { en: "Provinces", value: "7" },
            { en: "Districts", value: "77" },
            { en: "Constituencies", value: "165" },
          ].map((s) => (
            <div key={s.en} className="text-center">
              <p className="text-2xl sm:text-3xl font-heading font-bold text-white">{s.value}</p>
              <p className="text-white/70 text-xs sm:text-sm">{s.en}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent" />
    </div>
  );
};

export default HeroSection;
