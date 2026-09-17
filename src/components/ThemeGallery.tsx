import React from 'react';
import { FASHION_THEMES } from '../data/themes';
import { soundManager } from '../utils/audio';
import { ArrowLeft, Trophy } from 'lucide-react';
import { FashionTheme } from '../types';

interface ThemeGalleryProps {
  highScores: Record<string, number>;
  onBack: () => void;
}

function renderThemeIcon(icon: string): string {
  const map: Record<string, string> = {
    Crown: '👑',
    ShieldAlert: '🛡️',
    Sparkles: '✨',
    Heart: '💖',
    Sun: '☀️',
    Flame: '🔥',
    Skull: '💀',
    Zap: '⚡',
    Flower2: '🌸',
    Coins: '🪙',
    Compass: '🧭',
    Snowflake: '❄️',
    Palette: '🎨',
    Waves: '🌊',
    Shirt: '👗',
    TreePine: '🌲',
    Glasses: '🕶️',
    Camera: '📸',
  };
  return map[icon] || icon || '✨';
}

function getThemeDifficulty(theme: FashionTheme, index: number): 'easy' | 'medium' | 'hard' | 'expert' {
  if (theme.difficulty) return theme.difficulty;
  if (index < 4) return 'easy';
  if (index < 10) return 'medium';
  if (index < 15) return 'hard';
  return 'expert';
}

function getThemeMultiplier(difficulty: string): number {
  switch (difficulty) {
    case 'easy': return 1.0;
    case 'medium': return 1.5;
    case 'hard': return 2.0;
    case 'expert': return 2.5;
    default: return 1.5;
  }
}

export const ThemeGallery: React.FC<ThemeGalleryProps> = ({ highScores, onBack }) => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-stone-950 via-neutral-900 to-black text-amber-50 p-4 sm:p-8 flex flex-col font-sans">
      {/* Top Bar */}
      <div className="w-full max-w-6xl mx-auto flex items-center justify-between pb-4 border-b border-neutral-800">
        <button
          id="btn-themes-back"
          onClick={() => {
            soundManager.playClick();
            onBack();
          }}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 text-xs text-neutral-300 transition-all"
        >
          <ArrowLeft className="w-4 h-4" /> Menu Utama
        </button>

        <div className="text-center">
          <h2 className="text-xl font-serif font-bold text-amber-100 flex items-center justify-center gap-2">
            <Trophy className="w-5 h-5 text-rose-400" />
            18 TEMA CATWALK HAUTE COUTURE
          </h2>
          <p className="text-xs text-neutral-400">Jelajahi Konsep, Palet Warna, & Rekor Skor Panggung</p>
        </div>

        <div className="w-20" />
      </div>

      {/* Grid */}
      <div className="w-full max-w-6xl mx-auto flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 py-6 overflow-y-auto">
        {FASHION_THEMES.map((theme, idx) => {
          const score = highScores[theme.id];
          const diff = getThemeDifficulty(theme, idx);
          const mult = getThemeMultiplier(diff);
          const palette = theme.paletteColors || theme.primaryColors || ['#F472B6', '#FDE047', '#E0E7FF'];

          return (
            <div
              key={theme.id}
              className="bg-neutral-950/80 border border-neutral-800 hover:border-amber-500/30 rounded-3xl p-5 flex flex-col justify-between shadow-xl transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-3xl">{renderThemeIcon(theme.icon)}</span>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${
                        diff === 'easy'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                          : diff === 'medium'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                          : diff === 'hard'
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                          : 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                      }`}
                    >
                      {diff}
                    </span>
                    {score !== undefined && (
                      <span className="text-xs font-bold text-amber-300 bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20">
                        🏆 {score}
                      </span>
                    )}
                  </div>
                </div>

                <h3 className="text-base font-serif font-bold text-amber-100">{theme.name}</h3>
                <span className="text-xs text-amber-400/80 italic block mb-2 font-serif">"{theme.vibe}"</span>
                <p className="text-xs text-neutral-400 leading-relaxed">{theme.description}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-neutral-800/80 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1">
                  {palette.map((col, i) => (
                    <span
                      key={i}
                      className="w-3.5 h-3.5 rounded-full border border-neutral-700"
                      style={{ backgroundColor: col }}
                    />
                  ))}
                </div>
                <span className="text-[11px] font-semibold text-neutral-400">
                  x{mult} Poin Reward
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
