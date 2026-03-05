import { useState, useEffect } from "react";
import { RefreshCw } from "lucide-react";

interface Props {
  isRefreshing: boolean;
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
  intervalSeconds: number;
}

const AutoRefreshTimer = ({ isRefreshing, enabled, onToggle, intervalSeconds }: Props) => {
  const [countdown, setCountdown] = useState(intervalSeconds);

  useEffect(() => {
    if (!enabled) {
      setCountdown(intervalSeconds);
      return;
    }
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) return intervalSeconds;
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [enabled, intervalSeconds]);

  return (
    <div className="flex items-center gap-3 bg-card rounded-xl px-4 py-3 shadow-sm border border-border">
      <button
        onClick={() => onToggle(!enabled)}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${enabled
          ? "gradient-nepal text-primary-foreground"
          : "bg-muted text-muted-foreground hover:bg-muted/80"
          }`}
      >
        <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
        {enabled ? "Auto-Refresh ON" : "Auto-Refresh OFF"}
      </button>
      {enabled && (
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground mr-1">Refreshing in</span>
          <div className="w-8 h-8 rounded-full border-2 border-primary flex items-center justify-center">
            <span className="text-xs font-heading font-bold text-primary">{countdown}s</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AutoRefreshTimer;
