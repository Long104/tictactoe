"use client";
import { useCallback, useRef } from "react";

export function useSound() {
    const ctxRef = useRef<AudioContext | null>(null);

    function getCtx(): AudioContext {
        if (!ctxRef.current) {
            ctxRef.current = new (window.AudioContext ||
                (window as any).webkitAudioContext)();
        }
        return ctxRef.current;
    }

    function playTone(
        frequency: number,
        duration: number,
        type: OscillatorType = "sine",
        gain = 0.18,
        delay = 0,
    ) {
        try {
            const ctx = getCtx();
            const osc = ctx.createOscillator();
            const gainNode = ctx.createGain();

            osc.connect(gainNode);
            gainNode.connect(ctx.destination);

            osc.type = type;
            osc.frequency.setValueAtTime(frequency, ctx.currentTime + delay);

            gainNode.gain.setValueAtTime(0, ctx.currentTime + delay);
            gainNode.gain.linearRampToValueAtTime(gain, ctx.currentTime + delay + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(
                0.001,
                ctx.currentTime + delay + duration,
            );

            osc.start(ctx.currentTime + delay);
            osc.stop(ctx.currentTime + delay + duration);
        } catch {
            // AudioContext may be unavailable in some environments
        }
    }

    const playMove = useCallback(() => {
        playTone(440, 0.08, "sine", 0.15);
    }, []);

    const playOpponentMove = useCallback(() => {
        playTone(330, 0.08, "sine", 0.12);
    }, []);

    const playWin = useCallback(() => {
        // Ascending arpeggio: C5 → E5 → G5
        playTone(523.25, 0.15, "sine", 0.2, 0);
        playTone(659.25, 0.15, "sine", 0.2, 0.12);
        playTone(783.99, 0.25, "sine", 0.25, 0.24);
    }, []);

    const playDraw = useCallback(() => {
        // Descending neutral: 400Hz → 300Hz
        try {
            const ctx = getCtx();
            const osc = ctx.createOscillator();
            const gainNode = ctx.createGain();
            osc.connect(gainNode);
            gainNode.connect(ctx.destination);

            osc.type = "sine";
            osc.frequency.setValueAtTime(400, ctx.currentTime);
            osc.frequency.linearRampToValueAtTime(300, ctx.currentTime + 0.35);

            gainNode.gain.setValueAtTime(0.18, ctx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);

            osc.start(ctx.currentTime);
            osc.stop(ctx.currentTime + 0.4);
        } catch {
            // noop
        }
    }, []);

    return { playMove, playOpponentMove, playWin, playDraw };
}
