import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Character, FashionTheme, StylingState } from '../types';
import { calculateStylingScore, ScoreResult } from '../utils/scoring';
import { PlayerProgress, addRewardsToProgress } from '../utils/playerProgress';
import { soundManager } from '../utils/audio';
import { Star, Sparkles, Trophy, Camera, RotateCcw, ShoppingBag, CheckCircle, ChevronRight } from 'lucide-react';

interface JudgingScreenProps {
  character: Character;
  theme: FashionTheme;
  styling: StylingState;
  progress: PlayerProgress;
  onUpdateProgress: (newProgress: PlayerProgress) => void;
  onGotoPhotoStudio: () => void;
  onPlayAgain: () => void;
  onOpenShop: () => void;
}

export const JudgingScreen: React.FC<JudgingScreenProps> = ({
  character,
  theme,
  styling,
  progress,
  onUpdateProgress,
  onGotoPhotoStudio,
  onPlayAgain,
  onOpenShop,
}) => {
  const [scoreResult, setScoreResult] = useState<ScoreResult | null>(null);
  const [leveledUp, setLeveledUp] = useState<boolean>(false);
  const [aiJudgeCritiques, setAiJudgeCritiques] = useState<{
    judgeMiranda: { score: number; comment: string };
    judgeLeo: { score: number; comment: string };
    judgeChloe: { score: number; comment: string };
  } | null>(null);

  useEffect(() => {
    soundManager.playRewardFanfare();
    const result = calculateStylingScore(styling, theme);
    setScoreResult(result);

    // Save reward to progress
    const { updated, leveledUp: lvlUp } = addRewardsToProgress(
      progress,
      result.coins,
      result.stars,
      result.expEarned,
      theme.id,
      result.totalScore
    );
    onUpdateProgress(updated);
    setLeveledUp(lvlUp);

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.5 },
      });
    } catch {}

    // Fetch dynamic AI judge critique from Gemini API
    const fetchCritique = async () => {
      try {
        const res = await fetch('/api/judge-critique', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            theme,
            character,
            scoreResult: result,
          }),
        });
        const data = await res.json();
        if (data.success && data.critique) {
          setAiJudgeCritiques(data.critique);
        }
      } catch (err) {
        console.warn('AI Judge Critique fetch error:', err);
      }
    };
    fetchCritique();
  }, []);

  if (!scoreResult) return null;

  const mirandaComment = aiJudgeCritiques?.judgeMiranda?.comment || scoreResult.judges[0].comment;
  const leoComment = aiJudgeCritiques?.judgeLeo?.comment || scoreResult.judges[1].comment;
  const chloeComment = aiJudgeCritiques?.judgeChloe?.comment || scoreResult.judges[2].comment;

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-stone-950 via-neutral-900 to-black text-amber-50 p-4 sm:p-8 flex flex-col items-center justify-center font-sans">
      <div className="w-full max-w-4xl bg-neutral-950/80 border border-amber-500/20 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden backdrop-blur-md">
        {/* Glow ambient */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Level Up Announcement Banner */}
        {leveledUp && (
          <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 text-stone-950 font-black text-center shadow-lg animate-bounce">
            🎉 LEVEL UP! SELAMAT, RANK STYLIST ANDA NAIK KE LEVEL {progress.level + 1}! (+200 Koin & +2 Bintang)
          </div>
        )}

        {/* Header: Score & Stars */}
        <div className="flex flex-col items-center text-center">
          <span className="px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-bold uppercase tracking-widest mb-2">
            Hasil Penilaian Catwalk: {theme.name}
          </span>
          <h1 className="text-6xl sm:text-7xl font-serif font-black bg-gradient-to-r from-amber-100 via-amber-300 to-rose-300 bg-clip-text text-transparent">
            {scoreResult.totalScore}
            <span className="text-2xl font-sans text-neutral-400">/100</span>
          </h1>

          {/* 5-Star Rating */}
          <div className="flex items-center gap-1.5 my-3">
            {[1, 2, 3, 4, 5].map((starIndex) => (
              <Star
                key={starIndex}
                className={`w-7 h-7 transition-all ${
                  starIndex <= scoreResult.stars
                    ? 'fill-amber-400 text-amber-400 scale-110 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]'
                    : 'text-neutral-700'
                }`}
              />
            ))}
          </div>

          <p className="text-sm sm:text-base font-serif italic text-amber-200/90 max-w-lg">
            "{scoreResult.generalCritique}"
          </p>
        </div>

        {/* 4 Scoring Criterion Breakdown */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-6">
          <div className="bg-neutral-900/80 p-3 rounded-2xl border border-neutral-800 text-center">
            <span className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">Kecocokan Tema</span>
            <div className="text-lg font-bold text-amber-300">{scoreResult.breakdown.themeMatch}%</div>
            <div className="w-full bg-neutral-800 h-1.5 rounded-full overflow-hidden mt-1.5">
              <div className="bg-amber-400 h-full" style={{ width: `${scoreResult.breakdown.themeMatch}%` }} />
            </div>
          </div>

          <div className="bg-neutral-900/80 p-3 rounded-2xl border border-neutral-800 text-center">
            <span className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">Harmoni Riasan</span>
            <div className="text-lg font-bold text-rose-300">{scoreResult.breakdown.makeupHarmony}%</div>
            <div className="w-full bg-neutral-800 h-1.5 rounded-full overflow-hidden mt-1.5">
              <div className="bg-rose-400 h-full" style={{ width: `${scoreResult.breakdown.makeupHarmony}%` }} />
            </div>
          </div>

          <div className="bg-neutral-900/80 p-3 rounded-2xl border border-neutral-800 text-center">
            <span className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">Outfit Balance</span>
            <div className="text-lg font-bold text-sky-300">{scoreResult.breakdown.outfitBalance}%</div>
            <div className="w-full bg-neutral-800 h-1.5 rounded-full overflow-hidden mt-1.5">
              <div className="bg-sky-400 h-full" style={{ width: `${scoreResult.breakdown.outfitBalance}%` }} />
            </div>
          </div>

          <div className="bg-neutral-900/80 p-3 rounded-2xl border border-neutral-800 text-center">
            <span className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">Kelengkapan Accs</span>
            <div className="text-lg font-bold text-purple-300">{scoreResult.breakdown.accessoriesCompleteness}%</div>
            <div className="w-full bg-neutral-800 h-1.5 rounded-full overflow-hidden mt-1.5">
              <div className="bg-purple-400 h-full" style={{ width: `${scoreResult.breakdown.accessoriesCompleteness}%` }} />
            </div>
          </div>
        </div>

        {/* 3 Judges Panel */}
        <div className="space-y-3 mb-6">
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-400 block">
            Komentar Dewan Juri Selebritas:
          </span>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Miranda */}
            <div className="bg-neutral-900/70 border border-neutral-800 p-3.5 rounded-2xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">👠</span>
                    <div>
                      <h4 className="text-xs font-bold text-amber-200">Miranda</h4>
                      <span className="text-[9px] text-neutral-400 uppercase">Senior Fashion Editor</span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-amber-300">{scoreResult.judges[0].score}/100</span>
                </div>
                <p className="text-xs text-neutral-300 italic mt-2 leading-relaxed font-serif">
                  "{mirandaComment}"
                </p>
              </div>
            </div>

            {/* Leo */}
            <div className="bg-neutral-900/70 border border-neutral-800 p-3.5 rounded-2xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🕶️</span>
                    <div>
                      <h4 className="text-xs font-bold text-amber-200">Leo</h4>
                      <span className="text-[9px] text-neutral-400 uppercase">Streetwear Designer</span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-amber-300">{scoreResult.judges[1].score}/100</span>
                </div>
                <p className="text-xs text-neutral-300 italic mt-2 leading-relaxed font-serif">
                  "{leoComment}"
                </p>
              </div>
            </div>

            {/* Chloe */}
            <div className="bg-neutral-900/70 border border-neutral-800 p-3.5 rounded-2xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">✨</span>
                    <div>
                      <h4 className="text-xs font-bold text-amber-200">Chloe</h4>
                      <span className="text-[9px] text-neutral-400 uppercase">Celebrity Stylist</span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-amber-300">{scoreResult.judges[2].score}/100</span>
                </div>
                <p className="text-xs text-neutral-300 italic mt-2 leading-relaxed font-serif">
                  "{chloeComment}"
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Rewards Earned Box */}
        <div className="bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-purple-500/10 border border-amber-500/30 rounded-2xl p-4 flex items-center justify-around text-center mb-6">
          <div>
            <span className="text-[10px] uppercase font-bold text-neutral-400 block">Koin Diperoleh</span>
            <span className="text-lg font-bold text-amber-400">+{scoreResult.coins} ¢</span>
          </div>
          <div className="h-8 w-px bg-neutral-800" />
          <div>
            <span className="text-[10px] uppercase font-bold text-neutral-400 block">Bintang</span>
            <span className="text-lg font-bold text-amber-300">+{scoreResult.stars} ★</span>
          </div>
          <div className="h-8 w-px bg-neutral-800" />
          <div>
            <span className="text-[10px] uppercase font-bold text-neutral-400 block">EXP Stylist</span>
            <span className="text-lg font-bold text-purple-300">+{scoreResult.expEarned} EXP</span>
          </div>
        </div>

        {/* Navigation Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            id="btn-goto-photostudio"
            onClick={() => {
              soundManager.playClick();
              onGotoPhotoStudio();
            }}
            className="py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-rose-400 text-stone-950 font-bold text-xs sm:text-sm tracking-wide shadow-lg shadow-amber-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer sm:col-span-1"
          >
            <Camera className="w-4 h-4 stroke-[2.5]" />
            COVER MAJALAH & FOTO
          </button>

          <button
            id="btn-judging-boutique"
            onClick={() => {
              soundManager.playClick();
              onOpenShop();
            }}
            className="py-3.5 px-4 rounded-2xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-200 font-semibold text-xs sm:text-sm transition-all flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-4 h-4 text-amber-400" />
            Beli Item Baru
          </button>

          <button
            id="btn-judging-playagain"
            onClick={() => {
              soundManager.playClick();
              onPlayAgain();
            }}
            className="py-3.5 px-4 rounded-2xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-200 font-semibold text-xs sm:text-sm transition-all flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Main Lagi (Pilih Tema)
          </button>
        </div>
      </div>
    </div>
  );
};
