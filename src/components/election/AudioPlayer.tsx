import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const AudioPlayer = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Initial autoplay attempt and interaction listeners
    useEffect(() => {
        const attemptPlay = () => {
            if (audioRef.current && !isPlaying) {
                audioRef.current.play()
                    .then(() => setIsPlaying(true))
                    .catch(() => {
                        // Keep state as false if blocked
                        setIsPlaying(false);
                    });
            }
        };

        // Try immediately
        attemptPlay();

        // Listen for first interaction to unlock audio
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
    }, []); // Empty dependency array: only run on mount

    const togglePlay = () => {
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
        } else {
            audioRef.current.play()
                .then(() => setIsPlaying(true))
                .catch(err => console.error("Playback failed:", err));
        }
    };

    return (
        <div className="flex items-center">
            <audio
                ref={audioRef}
                src="/song.mp3"
                loop
                preload="auto"
            />
            <button
                onClick={togglePlay}
                className={cn(
                    "relative flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-300",
                    isPlaying
                        ? "bg-primary/10 text-primary shadow-sm"
                        : "bg-accent/50 text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
                title={isPlaying ? "Pause Background Music" : "Play Background Music"}
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
                                <Pause className="w-5 h-5 relative z-10" />
                                <motion.span
                                    className="absolute inset-0 bg-primary/20 rounded-full"
                                    animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                />
                            </div>
                        ) : (
                            <Play className="w-5 h-5 ml-0.5" />
                        )}
                    </motion.div>
                </AnimatePresence>
            </button>
        </div>
    );
};

export default AudioPlayer;
