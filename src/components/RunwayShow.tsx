import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Character, FashionTheme, StylingState } from '../types';
import { ModelRenderer } from './ModelRenderer';
import { soundManager } from '../utils/audio';
import { Sparkles, Camera, Award, ArrowRight } from 'lucide-react';

interface RunwayShowProps {
  character: Character;
  theme: FashionTheme;
  styling: StylingState;
  onFinishShow: () => void;
}

type PoseType = 'casual' | 'glamour' | 'cute' | 'fierce' | 'elegant' | 'dynamic';

export const RunwayShow: React.FC<RunwayShowProps> = ({
  character,
  theme,
  styling,
  onFinishShow,
}) => {
  const [phase, setPhase] = useState<'walking' | 'posing'>('walking');
  const [walkProgress, setWalkProgress] = useState<number>(0);
  const [currentPose, setCurrentPose] = useState<PoseType>('glamour');
  const [flashes, setFlashes] = useState<{ id: number; x: number; y: number }[]>([]);
  const requestRef = useRef<number | null>(null);

  // Runway walk animation timer
  useEffect(() => {
    soundManager.startRunwayBgm();
    let startTime: number | null = null;
    const duration = 6500; // 6.5s catwalk walk

    const animateWalk = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(1, elapsed / duration);

      setWalkProgress(progress);

      // Random camera flashes
      if (Math.random() < 0.18) {
        soundManager.playCamera();
        setFlashes((prev) => [
          ...prev.slice(-4),
          { id: Math.random(), x: Math.random() * 90 + 5, y: Math.random() * 70 + 15 },
        ]);
      }

      if (progress < 1) {
        requestRef.current = requestAnimationFrame(animateWalk);
      } else {
        // Reached end of runway! Climax pose!
        setPhase('posing');
        soundManager.playApplause();
        triggerConfetti();
      }
    };

    requestRef.current = requestAnimationFrame(animateWalk);

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#FBBF24', '#F472B6', '#38BDF8', '#C084FC', '#FFFFFF'],
      });
    } catch {}
  };

  // Change pose handler
  const handleChangePose = (pose: PoseType) => {
    soundManager.playCamera();
    setCurrentPose(pose);
    triggerConfetti();
  };

  // Dynamic scale from distance 0.5 to 1.15
  const runwayScale = phase === 'walking' ? 0.45 + walkProgress * 0.65 : 1.15;
  const runwayY = phase === 'walking' ? 20 - walkProgress * 20 : 0;

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-b from-stone-950 via-neutral-950 to-black text-amber-50 flex flex-col items-center justify-between overflow-hidden font-sans select-none">
      {/* Dynamic Runway Stage Ambient Lights & Beams */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Overhead Spotlights */}
        <div className="absolute -top-20 left-1/4 w-80 h-[120vh] bg-gradient-to-b from-amber-300/25 via-amber-400/10 to-transparent -rotate-12 blur-xl animate-pulse" />
        <div className="absolute -top-20 right-1/4 w-80 h-[120vh] bg-gradient-to-b from-rose-300/25 via-purple-500/10 to-transparent rotate-12 blur-xl animate-pulse" />

        {/* Runway Stage Perspective Lines */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-80 bg-gradient-to-t from-neutral-900 via-neutral-900/60 to-transparent border-x border-amber-500/30 [clip-path:polygon(30%_0%,70%_0%,100%_100%,0%_100%)] shadow-2xl">
          {/* Glowing runway center stripe */}
          <div className="w-1.5 h-full mx-auto bg-gradient-to-t from-amber-400/80 to-transparent blur-[1px]" />
        </div>

        {/* Camera flash overlays */}
        {flashes.map((f) => (
          <div
            key={f.id}
            className="absolute w-12 h-12 rounded-full bg-white blur-md animate-ping"
            style={{ left: `${f.x}%`, top: `${f.y}%` }}
          />
        ))}
      </div>

      {/* Header: Runway Theme Title */}
      <header className="w-full max-w-4xl flex items-center justify-between p-4 sm:p-6 z-20">
        <div className="flex items-center gap-3 bg-neutral-950/80 border border-amber-500/20 backdrop-blur-md px-4 py-2 rounded-2xl">
          <span className="text-2xl">{theme.icon}</span>
          <div>
            <h2 className="text-sm sm:text-base font-serif font-bold text-amber-200 uppercase tracking-wide">
              {theme.name} Catwalk
            </h2>
            <p className="text-[10px] text-neutral-400">Model: {character.name}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold uppercase tracking-wider animate-pulse flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            LIVE RUNWAY SHOW
          </div>
        </div>
      </header>

      {/* Runway Catwalk Model Stage */}
      <main className="flex-1 w-full max-w-3xl flex items-center justify-center relative z-10 py-6">
        <div
          className="transition-transform duration-100 ease-out flex items-center justify-center"
          style={{
            transform: `scale(${runwayScale}) translateY(${runwayY}px)`,
          }}
        >
          <ModelRenderer
            character={character}
            styling={styling}
            zoomMode="full"
            pose={currentPose}
            isWalking={phase === 'walking'}
            walkCycleProgress={walkProgress * 8}
            showShadow={true}
            className="w-[340px] h-[520px]"
          />
        </div>

        {/* Walking Status Badge */}
        {phase === 'walking' && (
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 bg-black/70 border border-neutral-700 px-4 py-1.5 rounded-full text-xs font-semibold text-neutral-300 backdrop-blur flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
            Menuju Ujung Catwalk...
          </div>
        )}
      </main>

      {/* Bottom Controls: Climax Posing Options & Finish Button */}
      <footer className="w-full max-w-4xl p-4 sm:p-6 z-20 flex flex-col items-center gap-4">
        {phase === 'posing' && (
          <div className="w-full bg-neutral-950/90 border border-amber-500/30 backdrop-blur-md rounded-3xl p-4 flex flex-col items-center gap-3 animate-fadeIn shadow-2xl">
            <div className="flex items-center justify-between w-full">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                <Camera className="w-4 h-4" /> Pilih Pose Catwalk Climax:
              </span>
              <span className="text-[11px] text-neutral-400">Klik untuk berganti pose</span>
            </div>

            {/* 6 Pose buttons */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 w-full">
              {(
                [
                  { id: 'casual', label: '1. Casual' },
                  { id: 'glamour', label: '2. Glamour' },
                  { id: 'cute', label: '3. Cute' },
                  { id: 'fierce', label: '4. Fierce' },
                  { id: 'elegant', label: '5. Elegant' },
                  { id: 'dynamic', label: '6. Dynamic' },
                ] as const
              ).map((p) => (
                <button
                  key={p.id}
                  id={`btn-pose-${p.id}`}
                  onClick={() => handleChangePose(p.id)}
                  className={`py-2 px-2 rounded-xl text-xs font-semibold transition-all border ${
                    currentPose === p.id
                      ? 'bg-amber-400 text-stone-950 border-amber-400 shadow-md shadow-amber-400/20 scale-105'
                      : 'bg-neutral-900/80 text-neutral-300 border-neutral-800 hover:border-neutral-700'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* Next to judging button */}
            <button
              id="btn-goto-judging"
              onClick={() => {
                soundManager.playRewardFanfare();
                onFinishShow();
              }}
              className="w-full mt-2 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-rose-400 text-stone-950 font-bold text-sm tracking-wide shadow-xl shadow-amber-500/20 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Award className="w-4 h-4 stroke-[2.5]" />
              SELESAI SHOW & LIHAT PENILAIAN JURI
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </footer>
    </div>
  );
};
