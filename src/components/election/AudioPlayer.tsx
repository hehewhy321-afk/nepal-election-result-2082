import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const AudioPlayer = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [hasInteracted, setHasInteracted] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Attempt autoplay logic
    useEffect(() => {
        const attemptPlay = () => {
            if (audioRef.current && !isPlaying) {
                audioRef.current.play()
                    .then(() => setIsPlaying(true))
                    .catch(() => console.log("Autoplay waiting for user interaction..."));
            }
        };

        // Try immediately on mount
        attemptPlay();

        // Also listen for any first interaction 
        const handleFirstInteraction = () => {
            attemptPlay();
            window.removeEventListener('click', handleFirstInteraction);
            window.removeEventListener('scroll', handleFirstInteraction);
            window.removeEventListener('touchstart', handleFirstInteraction);
        };

        window.addEventListener('click', handleFirstInteraction);
        window.addEventListener('scroll', handleFirstInteraction);
        window.addEventListener('touchstart', handleFirstInteraction);

        return () => {
            window.removeEventListener('click', handleFirstInteraction);
            window.removeEventListener('scroll', handleFirstInteraction);
            window.removeEventListener('touchstart', handleFirstInteraction);
        };
    }, [isPlaying]);

    const togglePlay = () => {
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    return (
        <div className="flex items-center">
            <audio
                ref={audioRef}
                src="/song.mp3"
                loop
                autoPlay
                preload="auto"
            />
            <button
                onClick={togglePlay}
                className={cn(
                    "relative flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-300",
                    isPlaying
                        ? "bg-primary/10 text-primary shadow-sm"
                        : "text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
                title={isPlaying ? "Mute Background Music" : "Play Background Music"}
            >
                <AnimatePresence mode="wait">
                    <motion.div
                        key={isPlaying ? "playing" : "paused"}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.2 }}
                    >
                        {isPlaying ? (
                            <div className="relative">
                                <Volume2 className="w-5 h-5 relative z-10" />
                                <motion.span
                                    className="absolute inset-0 bg-primary/20 rounded-full"
                                    animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                />
                            </div>
                        ) : (
                            <VolumeX className="w-5 h-5" />
                        )}
                    </motion.div>
                </AnimatePresence>
            </button>
        </div>
    );
};

export default AudioPlayer;
