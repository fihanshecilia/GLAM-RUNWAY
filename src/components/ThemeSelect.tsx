import React, { useState } from 'react';
import { FASHION_THEMES } from '../data/themes';
import { FashionTheme } from '../types';
import { soundManager } from '../utils/audio';
import { ArrowLeft, Check, Sparkles, Trophy } from 'lucide-react';

interface ThemeSelectProps {
  highScores: Record<string, number>;
  onSelectTheme: (theme: FashionTheme) => void;
  onBack: () => void;
}

// Map difficulty based on theme index or tag for rich variety
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

// Emoji or symbol helper for icons
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

export const ThemeSelect: React.FC<ThemeSelectProps> = ({
  highScores,
  onSelectTheme,
  onBack,
}) => {
  const [selectedThemeId, setSelectedThemeId] = useState<string>(FASHION_THEMES[0].id);
  const [filterDifficulty, setFilterDifficulty] = useState<'all' | 'easy' | 'medium' | 'hard' | 'expert'>('all');

  const selectedTheme = FASHION_THEMES.find((t) => t.id === selectedThemeId) || FASHION_THEMES[0];
  const selectedIndex = FASHION_THEMES.findIndex((t) => t.id === selectedTheme.id);
  const selectedDiff = getThemeDifficulty(selectedTheme, selectedIndex);
  const selectedMult = getThemeMultiplier(selectedDiff);

  const filteredThemes = FASHION_THEMES.filter((theme, idx) => {
    if (filterDifficulty === 'all') return true;
    const diff = getThemeDifficulty(theme, idx);
    return diff === filterDifficulty;
  });

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-stone-950 via-neutral-900 to-black text-amber-50 p-4 sm:p-8 flex flex-col font-sans">
      {/* Top Bar */}
      <div className="w-full max-w-6xl mx-auto flex items-center justify-between pb-4 border-b border-neutral-800">
        <button
          id="btn-theme-back"
          onClick={() => {
            soundManager.playClick();
            onBack();
          }}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 text-sm text-neutral-300 hover:text-white transition-all"
        >
          <ArrowLeft className="w-4 h-4" /> Ganti Model
        </button>

        <div className="text-center">
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-amber-100">PILIH TEMA RUNWAY</h2>
          <p className="text-xs text-neutral-400">18 Tema Panggung Haute Couture & Kompetisi</p>
        </div>

        <div className="w-20" />
      </div>

      {/* Difficulty Filter Tabs */}
      <div className="w-full max-w-6xl mx-auto flex items-center justify-center gap-2 my-4 overflow-x-auto py-1">
        {(['all', 'easy', 'medium', 'hard', 'expert'] as const).map((diff) => (
          <button
            key={diff}
            onClick={() => {
              soundManager.playClick();
              setFilterDifficulty(diff);
            }}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold capitalize transition-all ${
              filterDifficulty === diff
                ? 'bg-amber-400 text-stone-950 shadow-md shadow-amber-400/20'
                : 'bg-neutral-900/80 text-neutral-400 hover:text-neutral-200 border border-neutral-800'
            }`}
          >
            {diff === 'all' ? 'Semua Tema (18)' : diff}
          </button>
        ))}
      </div>

      {/* Main Grid + Details Sidebar */}
      <div className="w-full max-w-6xl mx-auto flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start py-2">
        {/* Left: Themes Grid */}
        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {filteredThemes.map((theme, idx) => {
            const isSelected = theme.id === selectedThemeId;
            const highScore = highScores[theme.id];
            const diff = getThemeDifficulty(theme, idx);
            const palette = theme.paletteColors || theme.primaryColors || ['#F472B6', '#FDE047', '#E0E7FF'];

            return (
              <div
                key={theme.id}
                id={`card-theme-${theme.id}`}
                onClick={() => {
                  soundManager.playClick();
                  setSelectedThemeId(theme.id);
                }}
                className={`flex flex-col p-4 rounded-2xl cursor-pointer transition-all border relative overflow-hidden ${
                  isSelected
                    ? 'bg-neutral-800/90 border-amber-400 shadow-xl shadow-amber-500/10 scale-[1.02]'
                    : 'bg-neutral-900/60 border-neutral-800 hover:border-neutral-700 hover:bg-neutral-900/90'
                }`}
              >
                {/* Theme icon header */}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">{renderThemeIcon(theme.icon)}</span>
                  <div className="flex items-center gap-1.5">
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
                    {highScore !== undefined && (
                      <span className="flex items-center gap-0.5 text-[10px] font-bold text-amber-300 bg-amber-400/10 px-1.5 py-0.5 rounded-full border border-amber-400/20">
                        <Trophy className="w-2.5 h-2.5" /> {highScore}
                      </span>
                    )}
                  </div>
                </div>

                <h3 className="text-sm font-bold text-neutral-100">{theme.name}</h3>
                <p className="text-xs text-neutral-400 mt-1 line-clamp-2">{theme.description}</p>

                {/* Color swatches */}
                <div className="flex items-center gap-1.5 mt-3">
                  <span className="text-[10px] text-neutral-400">Palet:</span>
                  <div className="flex items-center gap-1">
                    {palette.map((color, i) => (
                      <span
                        key={i}
                        className="w-3 h-3 rounded-full border border-neutral-700"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Selected Theme Deep Dive & Proceed Button */}
        <div className="lg:col-span-4 bg-neutral-950/80 border border-amber-500/20 rounded-3xl p-6 flex flex-col shadow-2xl sticky top-6">
          <div className="text-center pb-4 border-b border-neutral-800">
            <span className="text-4xl">{renderThemeIcon(selectedTheme.icon)}</span>
            <h3 className="text-xl font-serif font-bold text-amber-200 mt-2">{selectedTheme.name}</h3>
            <span className="text-xs text-amber-400/80 italic font-serif">"{selectedTheme.vibe}"</span>
          </div>

          <div className="space-y-4 my-5 text-xs text-neutral-300">
            <div>
              <span className="font-semibold text-neutral-400 block mb-1">Deskripsi Panggung:</span>
              <p className="text-neutral-300 leading-relaxed">{selectedTheme.description}</p>
            </div>

            <div>
              <span className="font-semibold text-neutral-400 block mb-1">Rekomendasi Warna Busana:</span>
              <div className="flex flex-wrap gap-1.5">
                {(selectedTheme.recommendedColors || selectedTheme.primaryColors || []).map((col, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded-md bg-neutral-900 border border-neutral-800 text-neutral-200 text-[11px] flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: col }} />
                    {col}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <span className="font-semibold text-neutral-400 block mb-1">Reward Multiplier:</span>
              <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
                <Sparkles className="w-4 h-4" />
                <span>x{selectedMult} Poin & Koin Runway</span>
              </div>
            </div>

            {highScores[selectedTheme.id] && (
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 flex items-center justify-between">
                <span className="text-neutral-400">Skor Tertinggi Anda:</span>
                <span className="text-amber-300 font-bold text-base">{highScores[selectedTheme.id]} / 100</span>
              </div>
            )}
          </div>

          <button
            id="btn-confirm-theme"
            onClick={() => {
              soundManager.playClick();
              onSelectTheme({
                ...selectedTheme,
                difficulty: selectedDiff,
                rewardMultiplier: selectedMult,
                recommendedColors: selectedTheme.recommendedColors || selectedTheme.primaryColors,
                paletteColors: selectedTheme.paletteColors || selectedTheme.primaryColors,
              });
            }}
            className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-rose-400 text-stone-950 font-bold text-sm tracking-wide shadow-lg hover:shadow-amber-500/30 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer mt-auto"
          >
            <Check className="w-4 h-4 stroke-[3]" />
            PILIH TEMA INI & KE STUDIO STYLING
          </button>
        </div>
      </div>
    </div>
  );
};
